"use client";

import { Header, Footer } from "@/components/shared";
import {
  HeroSection,
  HowItWorksSection,
  FeaturesSection,
  TestimonialsSection,
  PricingSection,
  FAQSection,
  CTASection,
} from "@/components/sections";

export default function Home() {
  return (
    <div className="min-h-screen bg-luxury-black text-white flex flex-col">
      <Header />
      
      <main className="flex-1 pt-16 md:pt-20">
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
}
