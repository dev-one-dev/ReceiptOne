import { createFileRoute } from "@tanstack/react-router";
import { FileBarChart2 } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const Route = createFileRoute("/dashboard/reports")({
  component: () => (
    <ComingSoon
      icon={FileBarChart2}
      title="Reports"
      description="Generate tax-ready expense reports. This page is on the way."
    />
  ),
});
