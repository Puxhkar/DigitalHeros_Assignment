"use client";
import React from "react";
import { cn } from "@/lib/utils";

export function MovingBorderButton({ children, className, containerClassName, onClick }: any) {
  return (
    <button onClick={onClick} className={cn("relative inline-flex h-14 overflow-hidden rounded-xl p-[1.5px] group focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-surface-950", containerClassName)}>
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#c026d3_0%,#6366f1_50%,#c026d3_100%)] opacity-80 group-hover:opacity-100 transition-opacity" />
      <span className={cn("inline-flex h-full w-full cursor-pointer items-center justify-center rounded-[11px] bg-surface-950/90 px-8 py-2 text-sm font-semibold text-white backdrop-blur-3xl transition-colors group-hover:bg-surface-900/90", className)}>
        {children}
      </span>
    </button>
  );
}
