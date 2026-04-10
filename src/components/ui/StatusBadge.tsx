import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Status = 'new' | 'reviewed' | 'archived';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { label: string, classes: string }> = {
  new: {
    label: 'New',
    classes: 'bg-blue-50 text-blue-600 border-blue-100'
  },
  reviewed: {
    label: 'Reviewed',
    classes: 'bg-neutral-50 text-neutral-600 border-neutral-100'
  },
  archived: {
    label: 'Archived',
    classes: 'bg-neutral-100 text-neutral-400 border-neutral-200'
  }
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.new;

  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-xs font-semibold border transition-colors duration-300",
      config.classes,
      className
    )}>
      {config.label}
    </span>
  );
}
