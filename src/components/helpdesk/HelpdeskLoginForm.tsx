import { useState, type FormEvent } from "react";
import { useHelpdeskAuth } from "@/components/helpdesk/HelpdeskAuthContext";

/**
 * Plain Supabase Auth email+password sign-in -- no Google/Apple, no
 * signup link, no password reset. This is a single dedicated admin
 * account, not a customer-facing auth surface.
 */
export function HelpdeskLoginForm() {
  const { signIn } = useHelpdeskAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: signInError } = await signIn(email, password);
    if (signInError) {
      setError(signInError);
      setLoading(false);
    }
    // On success, HelpdeskAuthProvider's onAuthStateChange listener picks
    // up the new session and the layout re-renders past this form.
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f4f0] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-black/[0.07] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <h1 className="text-lg font-semibold tracking-tight text-black">Helpdesk sign-in</h1>
        <p className="mt-1 text-sm text-black/55">
          Internal tool — sign in with your admin account.
        </p>

        <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label htmlFor="helpdesk-email" className="block text-xs font-medium text-black/55">
              Email
            </label>
            <input
              id="helpdesk-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-9 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/25"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="helpdesk-password" className="block text-xs font-medium text-black/55">
              Password
            </label>
            <input
              id="helpdesk-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-9 w-full rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-black/25"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-9 w-full items-center justify-center rounded-full bg-black px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
