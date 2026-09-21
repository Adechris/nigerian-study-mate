import type { Subject } from "@/types";
import { cn } from "@/lib/utils";

export const subjectColor: Record<Subject, { bar: string; chip: string; dot: string }> = {
  Biology: {
    bar: "bg-emerald-500",
    chip: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
  },
  Chemistry: {
    bar: "bg-orange-500",
    chip: "bg-orange-50 text-orange-700 ring-orange-200",
    dot: "bg-orange-500",
  },
  Physics: {
    bar: "bg-blue-500",
    chip: "bg-blue-50 text-blue-700 ring-blue-200",
    dot: "bg-blue-500",
  },
  Mathematics: {
    bar: "bg-violet-500",
    chip: "bg-violet-50 text-violet-700 ring-violet-200",
    dot: "bg-violet-500",
  },
  English: { bar: "bg-red-500", chip: "bg-red-50 text-red-700 ring-red-200", dot: "bg-red-500" },
  Geography: {
    bar: "bg-teal-500",
    chip: "bg-teal-50 text-teal-700 ring-teal-200",
    dot: "bg-teal-500",
  },
  Other: {
    bar: "bg-slate-400",
    chip: "bg-slate-100 text-slate-700 ring-slate-200",
    dot: "bg-slate-400",
  },
};

export function SubjectBadge({ subject, className }: { subject: Subject; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1",
        subjectColor[subject].chip,
        className,
      )}
    >
      {subject}
    </span>
  );
}

export function ScoreBadge({ value }: { value: number }) {
  const tone =
    value >= 75
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : value >= 50
        ? "bg-amber-50 text-amber-700 ring-amber-200"
        : "bg-red-50 text-red-700 ring-red-200";
  return (
    <span
      className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1", tone)}
    >
      {value}%
    </span>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
      <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary-soft text-primary">
        {icon}
      </div>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
