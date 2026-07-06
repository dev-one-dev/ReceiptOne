import { createFileRoute } from "@tanstack/react-router";
import { Milestone } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const Route = createFileRoute("/dashboard/roadmap")({
  component: () => (
    <ComingSoon
      icon={Milestone}
      title="Roadmap & Changelog"
      description="See what's shipped and what's next for ReceiptOne. This page is on the way."
    />
  ),
});
