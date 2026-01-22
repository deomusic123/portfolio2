import Link from 'next/link';
import { FOOTER } from '@/lib/constants/landing-data';

export function Footer() {
  return (
    <footer className="relative bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-white font-bold text-xl">{FOOTER.brand.name}</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-md">
              {FOOTER.brand.description}
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Producto</h3>
            <ul className="space-y-3">
              {FOOTER.links.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-zinc-500 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {FOOTER.links.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-zinc-500 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-600 text-sm">{FOOTER.copyright}</p>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            {FOOTER.social.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-white transition-colors"
                aria-label={social.name}
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
