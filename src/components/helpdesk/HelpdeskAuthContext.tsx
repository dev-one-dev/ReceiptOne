import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchHelpdeskOverview,
  type HelpdeskOverview,
} from "@/integrations/supabase/helpdesk.server";
import { errorMessage } from "@/lib/utils";

type AdminStatus = "checking" | "authorized" | "forbidden" | "error";

type HelpdeskAuthContextValue = {
  /** undefined = still resolving the initial session; null = signed out. */
  session: Session | null | undefined;
  adminStatus: AdminStatus;
  adminError: string | null;
  overview: HelpdeskOverview | null;
  overviewLoading: boolean;
  /** Throws if called with no session -- only call this once adminStatus === "authorized". */
  authHeaders: () => HeadersInit;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refetchOverview: () => Promise<void>;
};

const HelpdeskAuthContext = createContext<HelpdeskAuthContextValue | null>(null);

export function useHelpdeskAuth(): HelpdeskAuthContextValue {
  const ctx = useContext(HelpdeskAuthContext);
  if (!ctx) throw new Error("useHelpdeskAuth must be used within HelpdeskAuthProvider");
  return ctx;
}

/** The allowlist middleware's rejection message always starts with this -- see requireHelpdeskAdmin. */
function isForbiddenError(e: unknown): boolean {
  return e instanceof Error && e.message.startsWith("Forbidden");
}

/**
 * Owns the Supabase Auth session for /helpdesk and, once a session
 * exists, verifies real admin access by calling fetchHelpdeskOverview --
 * there is no separate "am I an admin" ping, since that call already
 * exercises requireHelpdeskAdmin exactly like every other server
 * function. Its result is cached here so the Overview page doesn't have
 * to fetch it a second time.
 *
 * This is a UX convenience only: hiding <Outlet/> behind adminStatus
 * keeps a non-admin from seeing the shell, but the real boundary is
 * requireHelpdeskAdmin running server-side on every call, independent
 * of anything this component decides to render.
 */
export function HelpdeskAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const sessionRef = useRef<Session | null>(null);

  const [adminStatus, setAdminStatus] = useState<AdminStatus>("checking");
  const [adminError, setAdminError] = useState<string | null>(null);
  const [overview, setOverview] = useState<HelpdeskOverview | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(false);

  const authHeaders = useCallback((): HeadersInit => {
    if (!sessionRef.current) throw new Error("Not signed in.");
    return { Authorization: `Bearer ${sessionRef.current.access_token}` };
  }, []);

  const runAdminCheck = useCallback(async (activeSession: Session) => {
    setAdminStatus("checking");
    setAdminError(null);
    setOverviewLoading(true);
    try {
      const data = await fetchHelpdeskOverview({
        headers: { Authorization: `Bearer ${activeSession.access_token}` },
      });
      setOverview(data);
      setAdminStatus("authorized");
    } catch (e) {
      setOverview(null);
      setAdminStatus(isForbiddenError(e) ? "forbidden" : "error");
      setAdminError(errorMessage(e, "Couldn't verify helpdesk access."));
    } finally {
      setOverviewLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      sessionRef.current = data.session;
      setSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      sessionRef.current = newSession;
      setSession(newSession);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session) {
      void runAdminCheck(session);
    } else {
      setOverview(null);
      setAdminStatus("checking");
      setAdminError(null);
    }
  }, [session, runAdminCheck]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const refetchOverview = useCallback(async () => {
    if (!sessionRef.current) return;
    await runAdminCheck(sessionRef.current);
  }, [runAdminCheck]);

  return (
    <HelpdeskAuthContext.Provider
      value={{
        session,
        adminStatus,
        adminError,
        overview,
        overviewLoading,
        authHeaders,
        signIn,
        signOut,
        refetchOverview,
      }}
    >
      {children}
    </HelpdeskAuthContext.Provider>
  );
}
