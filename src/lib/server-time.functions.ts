import { createServerFn } from "@tanstack/react-start";

/**
 * The server's clock as an ISO instant. Landing-page loaders call this so
 * date-dependent markup (the footer's tax deadlines) is decided on the server:
 * during SSR it runs in-process and the value is dehydrated to the client, so
 * hydration renders the same dates; on a client-side navigation TanStack
 * Start turns it into a GET to the server.
 */
export const getServerNow = createServerFn({ method: "GET" }).handler(async (): Promise<string> =>
  new Date().toISOString(),
);
