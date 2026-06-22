"use client";

import { cn as classNames } from "@/lib/utils";

/**
 * Card with a glassmorphism effect using backdrop-filter.
 *
 * @param children - Content to display inside the card.
 * @param className - Additional Tailwind classes.
 */
export default function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={classNames(
        "bg-white/20 dark:bg-slate-900/30 backdrop-blur-md border border-white/30 dark:border-slate-700/50 rounded-xl p-6 shadow-lg",
        className,
      )}
    >
      {children}
    </div>
  );
}