import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function GlassCard({ children, className = "", onClick }: GlassCardProps) {
  const hoverStyles = onClick
    ? "cursor-pointer hover:bg-white/20 hover:shadow-xl"
    : "";

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg transition-all duration-200 ${hoverStyles} ${className}`}
    >
      {children}
    </div>
  );
}