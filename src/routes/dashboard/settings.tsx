import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

function ToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium text-black">{label}</p>
        <p className="text-xs text-black/50">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} className="data-[state=checked]:bg-[#f97316]" />
    </div>
  );
}

function SettingsPage() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(true);
  const [receiptReminders, setReceiptReminders] = useState(false);
  const [currency, setCurrency] = useState("CAD");
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleSave = () => {
    toast.success("Settings saved (demo only — not persisted).");
  };

  const handleDelete = () => {
    setDeleteOpen(false);
    toast.info("Account deletion isn't wired up yet — this is a static mockup.");
  };

  return (
    <div className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-black">Settings</h1>
        <p className="mt-1 text-sm text-black/55">Notification preferences and general account settings.</p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Notifications */}
        <div className="rounded-2xl border border-black/[0.07] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <h2 className="text-sm font-semibold text-black">Notifications</h2>
          <div className="mt-1 divide-y divide-black/[0.05]">
            <ToggleRow
              label="Email notifications"
              description="Get notified about account activity by email."
              checked={emailNotifs}
              onCheckedChange={setEmailNotifs}
            />
            <ToggleRow
              label="Weekly summary"
              description="A weekly digest of receipts and spending."
              checked={weeklySummary}
              onCheckedChange={setWeeklySummary}
            />
            <ToggleRow
              label="Receipt reminders"
              description="Reminders to scan receipts you may have missed."
              checked={receiptReminders}
              onCheckedChange={setReceiptReminders}
            />
          </div>
        </div>

        {/* Preferences */}
        <div className="rounded-2xl border border-black/[0.07] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <h2 className="text-sm font-semibold text-black">Preferences</h2>
          <div className="mt-4 space-y-1.5">
            <label className="block text-xs font-medium text-black/55">Display currency</label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="h-9 w-full rounded-xl border-black/10 bg-white text-sm shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CAD">CAD — Canadian Dollar</SelectItem>
                <SelectItem value="USD">USD — US Dollar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="mt-5 inline-flex items-center justify-center rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Save changes
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="mt-6 rounded-2xl border border-red-200 bg-red-50/40 p-5">
        <div className="flex items-center gap-2">
          <ShieldAlert className="size-4 text-red-600" aria-hidden />
          <h2 className="text-sm font-semibold text-red-700">Danger zone</h2>
        </div>
        <p className="mt-1.5 text-sm text-red-700/70">
          Permanently delete your account and all associated data. This cannot be undone.
        </p>
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="mt-3 inline-flex items-center justify-center rounded-full border border-red-300 bg-white px-4 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100"
            >
              Delete account
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Delete your account?</DialogTitle>
              <DialogDescription>
                This will permanently delete your account and every receipt, report, and mileage record. This cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <button
                type="button"
                onClick={() => setDeleteOpen(false)}
                className="inline-flex items-center justify-center rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-black/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center justify-center rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Delete account
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
