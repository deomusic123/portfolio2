'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-2xl'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:shadow-purple-500/80 transition-all">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-white font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              Portfolio2
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-neutral-300 hover:text-white transition-colors text-sm font-medium"
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className="text-neutral-300 hover:text-white transition-colors text-sm font-medium"
            >
              Testimonios
            </Link>
            <Link
              href="/pricing"
              className="text-neutral-300 hover:text-white transition-colors text-sm font-medium"
            >
              Precios
            </Link>
            <Link
              href="/docs"
              className="text-neutral-300 hover:text-white transition-colors text-sm font-medium"
            >
              Docs
            </Link>
          </div>

          {/* CTA Button */}
          <div className="flex items-center gap-3">
            <Link
              href="http://localhost:3001/login"
              className="text-neutral-300 hover:text-white transition-colors text-sm font-medium hidden sm:block"
            >
              Login
            </Link>
            <Link
              href="http://localhost:3001/register"
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:scale-105 transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
            >
              Comenzar Gratis
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
