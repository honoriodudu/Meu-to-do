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
        "bg-white/20 dark:bg-slate-900/30 backdrop-blur-md border border-white/30 dark:border-slate-700/50 rounded-xl p-6 shadow-lg",
        className,
      )}
    >
      {children}
    </div>
  );
}
import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function GlassCard({ children, className, onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg",
        "transition-all duration-200",
        onClick && "cursor-pointer hover:bg-white/20 hover:shadow-xl",
        className
      )}
    >
      {children}
    </div>
  );
}