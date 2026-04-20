import { createFileRoute, redirect } from "@tanstack/react-router";

// index = Canada — redirect "/" to "/ca"
export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/ca" });
  },
});
