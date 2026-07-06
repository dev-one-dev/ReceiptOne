import { createFileRoute } from "@tanstack/react-router";
import { FolderOpen } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export const Route = createFileRoute("/dashboard/file-manager")({
  component: () => (
    <ComingSoon
      icon={FolderOpen}
      title="File Manager"
      description="Organize receipts and documents into folders. This page is on the way."
    />
  ),
});
