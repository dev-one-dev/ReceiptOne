import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/us")({
  component: () => <Outlet />,
});
