import React from "react";
import { LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 bg-brand-100 rounded-3xl flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-brand-600" />
      </div>
      <h3 className="text-xl font-display font-bold text-almost-black mb-2">
        {title}
      </h3>
      <p className="text-charcoal max-w-md mb-6">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button variant="primary">{actionLabel}</Button>
        </Link>
      )}
    </div>
  );
}
