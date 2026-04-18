import { cn } from "@/lib/utils";
import React from "react";

export const SciFiPanel = ({
  children,
  className,
  innerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
}) => {
  return (
    <div
      className={cn("relative overflow-hidden group", className)}
      style={{
        clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
      }}
    >
      {/* Outer Glowing Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500 via-brand-600/20 to-accent-500" />
      
      {/* Inner Metallic Surface */}
      <div
        className={cn(
          "absolute inset-[1.5px] bg-surface-900 z-10 flex flex-col transition-all duration-300 group-hover:bg-surface-800",
          innerClassName
        )}
        style={{
          clipPath:
            "polygon(19px 0, 100% 0, 100% calc(100% - 19px), calc(100% - 19px) 100%, 0 100%, 0 19px)",
          boxShadow:
            "inset 0 0 30px rgba(0,224,255,0.05), inset 0 0 5px rgba(0,224,255,0.2)",
        }}
      >
        {/* Subtle Horizontal Scanlines */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ backgroundImage: 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.5) 50%)', backgroundSize: '100% 4px' }} 
        />
        
        {/* Corner Decals */}
        <div className="absolute top-0 left-5 w-4 h-1 bg-brand-500/50" />
        <div className="absolute bottom-0 right-5 w-4 h-1 bg-accent-500/50" />
        
        <div className="relative z-20 w-full h-full p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
