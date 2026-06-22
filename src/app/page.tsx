import { FloatingNavbar } from "@/components/ui/floating-navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FeaturesSection } from "@/components/landing/features-section";
import { PricingTeaser } from "@/components/landing/pricing-teaser";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/layout/footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <FloatingNavbar />
      <HeroSection />
      <HowItWorks />
      <FeaturesSection />
      <PricingTeaser />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
