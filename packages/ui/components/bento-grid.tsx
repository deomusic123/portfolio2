import { cn } from "../lib/utils";
import { ReactNode } from "react";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | ReactNode;
  description?: string | ReactNode;
  header?: ReactNode;
  icon?: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "row-span-1 rounded-2xl group/bento transition-all duration-500 p-6 relative overflow-hidden",
        // Glassmorphism base
        "bg-white/5 backdrop-blur-md",
        // Border gradient animado
        "border border-transparent bg-gradient-to-br from-white/10 via-white/5 to-transparent bg-clip-padding",
        "before:absolute before:inset-0 before:rounded-2xl before:p-[1px] before:bg-gradient-to-br before:from-blue-500/50 before:via-purple-500/50 before:to-pink-500/50 before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100 before:-z-10",
        // Hover effects + SHADOW PROFUNDA
        "hover:bg-white/10 hover:scale-[1.02] shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:shadow-[0_20px_60px_rgb(0,0,0,0.8)]",
        // Gradient overlay on hover
        "after:absolute after:inset-0 after:bg-gradient-to-br after:from-white/5 after:to-transparent after:opacity-0 after:transition-opacity after:duration-500 hover:after:opacity-100 after:-z-10",
        "justify-between flex flex-col space-y-4",
        className
      )}
    >
      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />
      
      <div className="relative z-10 h-40 rounded-xl overflow-hidden bg-gradient-to-br from-white/5 to-transparent border border-white/10 group-hover/bento:border-white/20 transition-all duration-500">
        {header}
      </div>
      <div className="relative z-10 group-hover/bento:translate-x-1 transition-all duration-300">
        {icon}
        <div className="font-sans font-black text-white text-xl mb-2 mt-2 group-hover/bento:text-transparent group-hover/bento:bg-clip-text group-hover/bento:bg-gradient-to-r group-hover/bento:from-blue-400 group-hover/bento:to-purple-400 transition-all duration-300">
          {title}
        </div>
        <div className="font-sans font-normal text-neutral-400 text-sm leading-relaxed group-hover/bento:text-neutral-300 transition-colors">
          {description}
        </div>
      </div>
      
      {/* Glow effect en hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover/bento:opacity-20 blur-xl transition-opacity duration-500 -z-20" />
    </div>
  );
};
