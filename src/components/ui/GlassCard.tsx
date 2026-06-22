"use client";

import { cn } from "@/lib/utils";

/**
 * Card with a glassmorphism effect using backdrop-filter.
 *
 * @param children - Content to display inside the card.
 * @param className - Additional Tailwind classes.
 *
 * @example
 * <GlassCard className="p-6">
 *   <p>Your content here</p>
 * </GlassCard>
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
      className={cn(
        "bg-white/30 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}