import Navbar from '@/components/Navbar';
import { HeroSection } from '@/components/landing/hero';
import { DashboardShowcase } from '@/components/landing/dashboard-showcase';
import { UseCasesSection } from '@/components/landing/use-cases';
import { FeaturesSection } from '@/components/landing/features';
import { CtaSection } from '@/components/landing/cta';
import { Footer } from '@/components/landing/footer';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black relative">
      <Navbar />
      <HeroSection />
      <DashboardShowcase />
      <UseCasesSection />
      <FeaturesSection />
      <CtaSection />
      <Footer />
    </main>
  );
}