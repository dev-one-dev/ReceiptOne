import { createFileRoute } from "@tanstack/react-router";
import { Car } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const Route = createFileRoute("/dashboard/mileage")({
  component: () => (
    <ComingSoon
      icon={Car}
      title="Mileage"
      description="Log trips and track deductible mileage. This page is on the way."
    />
  ),
});
