"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Button({
  borderRadius = "1.75rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration,
  className,
  ...otherProps
}: {
  borderRadius?: string;
  children: React.ReactNode;
  as?: any;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
  [key: string]: any;
}) {
  return (
    <Component
      className={cn(
        "bg-transparent relative text-xl p-[1px] overflow-hidden",
        containerClassName
      )}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        {/* @ts-ignore - Framer Motion + React 19 RC type mismatch */}
        <motion.div
          className={cn(
            "h-full w-full absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-75",
            borderClassName
          )}
          style={{
            borderRadius: borderRadius,
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: duration ?? 4,
            ease: "linear",
            repeat: Infinity,
          }}
        />
      </div>

      <div
        className={cn(
          "relative bg-neutral-900 border border-neutral-800 backdrop-blur-xl text-white flex items-center justify-center w-full h-full text-sm antialiased",
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
}
