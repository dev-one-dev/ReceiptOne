import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const Route = createFileRoute("/dashboard/settings")({
  component: () => (
    <ComingSoon
      icon={Settings}
      title="Settings"
      description="Notification preferences, regions, and account settings. This page is on the way."
    />
  ),
});
