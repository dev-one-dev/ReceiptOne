import type { LucideIcon } from "lucide-react";

export function ComingSoon({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl border border-black/[0.07] bg-white text-black/40 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <Icon className="size-6" aria-hidden />
      </div>
      <div className="space-y-1.5">
        <h1 className="text-lg font-semibold text-black">{title}</h1>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-black/55">{description}</p>
      </div>
      <span className="rounded-full bg-black/[0.05] px-3 py-1 text-xs font-medium text-black/55">
        Coming soon
      </span>
    </div>
  );
}
