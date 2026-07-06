import { createFileRoute } from "@tanstack/react-router";
import { Receipt } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const Route = createFileRoute("/dashboard/receipts")({
  component: () => (
    <ComingSoon
      icon={Receipt}
      title="Receipts"
      description="Browse, search, and bulk-upload your receipts. This page is on the way."
    />
  ),
});
