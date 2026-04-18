"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

export const AuroraBackground = ({
  className,
  children,
  ...props
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "relative flex flex-col w-full items-center justify-center bg-surface-950 text-white transition-bg overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none h-full w-full mask-image:linear-gradient(to_bottom,white,transparent)]">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-600/40 rounded-full mix-blend-screen filter blur-[120px] animate-blob"></div>
          <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-accent-600/40 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-brand-400/30 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-4000"></div>
        </div>
      </div>
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
};
