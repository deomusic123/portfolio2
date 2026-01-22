'use client';

import { LazyMotion, domAnimation } from 'framer-motion';
import { ReactNode } from 'react';

/**
 * Wrapper global para LazyMotion
 * Reduce bundle size de framer-motion de ~25KB a ~5KB
 * Usar 'm' en lugar de 'motion' en componentes
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
