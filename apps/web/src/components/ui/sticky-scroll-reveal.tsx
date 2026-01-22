"use client";
import React, { useRef } from "react";
import { useScroll, useTransform } from "framer-motion";

export const StickyScrollReveal = ({
  children,
  content,
}: {
  children: React.ReactNode; // Esto será tu Dashboard
  content: React.ReactNode;  // Esto será tu Tech Stack
}) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"], // Empieza cuando el top toca el top
  });

  return (
    <div ref={targetRef} className="relative h-[157.5vh]"> {/* Altura ajustada para scroll óptimo */}
      
      {/* CAPA 1: EL DASHBOARD (Se queda pegado y se desvanece) */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center">
          {children}
        </div>
      </div>

      {/* CAPA 2: EL TECH STACK (Sube y cubre al dashboard) */}
      <div className="relative z-10 bg-gradient-to-b from-transparent via-black/80 to-black -mt-[50vh] pt-[50vh]">
         {/* El margen negativo hace que empiece a cubrir antes de que termine el scroll */}
        {content}
      </div>
    </div>
  );
};
