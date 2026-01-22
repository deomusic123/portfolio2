"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

export const BackgroundBeams = React.memo(function BackgroundBeams({
  className,
}: {
  className?: string;
}) {
  const [beams, setBeams] = useState<
    Array<{
      id: number;
      x: number;
      duration: number;
      delay: number;
      height: number;
    }>
  >([]);

  useEffect(() => {
    // Generate beams on mount to avoid hydration mismatch
    const generatedBeams = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
      height: Math.random() * 40 + 20,
    }));
    setBeams(generatedBeams);
  }, []);

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none",
        className
      )}
    >
      {beams.map((beam) => (
        // @ts-ignore - Framer Motion + React 19 RC type mismatch
        <motion.div
          key={beam.id}
          className="absolute top-0 w-px bg-gradient-to-b from-transparent via-blue-500/50 to-transparent"
          style={{
            left: `${beam.x}%`,
            height: `${beam.height}%`,
          }}
          initial={{ opacity: 0, y: -100 }}
          animate={{
            opacity: [0, 1, 0],
            y: ["0%", "100%"],
          }}
          transition={{
            duration: beam.duration,
            delay: beam.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
});
