import { createFileRoute } from "@tanstack/react-router";
import { CreditCard } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const Route = createFileRoute("/dashboard/billing")({
  component: () => (
    <ComingSoon
      icon={CreditCard}
      title="Profile & Billing"
      description="Manage your account details and subscription. This page is on the way."
    />
  ),
});
