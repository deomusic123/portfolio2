"use client";
import React, { useRef, useEffect, useState } from "react";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementTop = rect.top;
      const elementHeight = rect.height;
      
      // Calculate scroll progress (0 to 1)
      const scrolled = Math.max(0, Math.min(1, (windowHeight - elementTop) / (windowHeight + elementHeight / 2)));
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate transforms based on scroll
  const rotate = 20 - (scrollProgress * 20);
  const scale = 1.05 - (scrollProgress * 0.05);
  const translateY = -(scrollProgress * 100);

  return (
    <div
      className="min-h-screen flex items-center justify-center relative p-4 md:p-20"
      ref={containerRef}
    >
      <div
        className="py-10 md:py-40 w-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        <div
          style={{
            transform: `translateY(${translateY}px)`,
            transition: 'transform 0.1s ease-out',
          }}
          className="max-w-5xl mx-auto text-center mb-12"
        >
          {titleComponent}
        </div>
        
        <div
          style={{
            transform: `rotateX(${rotate}deg) scale(${scale})`,
            boxShadow: "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
            transition: 'transform 0.1s ease-out',
          }}
          className="max-w-5xl -mt-12 mx-auto h-[30rem] md:h-[40rem] w-full border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl"
        >
          <div className="h-full w-full overflow-hidden rounded-2xl bg-zinc-900 md:rounded-2xl md:p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
