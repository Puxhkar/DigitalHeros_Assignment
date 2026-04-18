import { cn } from "@/lib/utils";
import React from "react";

export const ScoreBoardDisplay = ({
  value,
  label,
  className,
}: {
  value: string | number;
  label?: string;
  className?: string;
}) => {
  // Convert value to an array of characters to render each in a digital display box
  const characters = String(value).split("");

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className="flex gap-1.5">
        {characters.map((char, i) => (
          <div
            key={i}
            className={cn(
              "w-12 h-16 bg-surface-950 flex items-center justify-center relative overflow-hidden",
              "border-t border-b border-white/5",
              char === " " || char === "$" || char === "£" ? "w-8 bg-transparent border-transparent" : "shadow-[inset_0_5px_15px_rgba(0,0,0,0.8)]"
            )}
          >
            {/* Gloss reflection line */}
            {char !== " " && char !== "$" && char !== "£" && (
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/[0.02]" />
            )}
            <span className="font-mono text-3xl font-black text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
              {char}
            </span>
          </div>
        ))}
      </div>
      {label && (
        <span className="text-xs uppercase tracking-widest text-surface-400 font-bold">
          {label}
        </span>
      )}
    </div>
  );
};
