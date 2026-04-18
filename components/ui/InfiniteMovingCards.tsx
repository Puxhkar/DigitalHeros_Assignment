"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useState, useRef } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  className,
}: {
  items: { quote: string; name: string; title: string; rating?: number }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) scrollerRef.current.appendChild(duplicatedItem);
      });
      getDirection();
      getSpeed();
      setStart(true);
    }
  }, []);

  const getDirection = () => {
    if (containerRef.current) {
      containerRef.current.style.setProperty("--animation-direction", direction === "left" ? "forwards" : "reverse");
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      const duration = speed === "fast" ? "30s" : speed === "normal" ? "50s" : "80s";
      containerRef.current.style.setProperty("--animation-duration", duration);
    }
  };

  return (
    <div ref={containerRef} className={cn("scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]", className)}>
      <ul ref={scrollerRef} className={cn("flex min-w-full shrink-0 gap-6 py-4 w-max flex-nowrap", start && "animate-scroll", "hover:[animation-play-state:paused]")}>
        {items.map((item, idx) => (
          <li key={item.name + idx} className="w-[350px] max-w-full relative rounded-3xl border flex-shrink-0 border-white/10 px-8 py-8 md:w-[450px] bg-surface-900/50 backdrop-blur-md shadow-card">
            <blockquote>
              {item.rating && (
                <div className="flex gap-1 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <span key={i} className="text-brand-400">★</span>
                  ))}
                </div>
              )}
              <div className="relative z-20 mt-2 flex flex-row items-center">
                 <span className="flex flex-col gap-3">
                   <span className="text-base leading-[1.6] text-surface-200 font-normal">"{item.quote}"</span>
                   <div className="mt-4 flex flex-col">
                     <span className="text-sm leading-[1.6] text-white font-bold">{item.name}</span>
                     <span className="text-xs leading-[1.6] text-surface-500 font-normal uppercase tracking-wider">{item.title}</span>
                   </div>
                 </span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
