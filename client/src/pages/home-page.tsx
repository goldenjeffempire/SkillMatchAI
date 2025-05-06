import { MainLayout } from "@/components/layouts/main-layout";
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { AIToolsSection } from "@/components/ai-tools-section";
import { LibraryPreviewSection } from "@/components/library-preview-section";
import { CTASection } from "@/components/cta-section";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function HomePage() {
  const [location] = useLocation();
  
  // Handle anchor links smoothly
  useEffect(() => {
    // Check if there's a hash in the URL
    if (location.includes('#')) {
      const id = location.split('#')[1];
      const element = document.getElementById(id);
      if (element) {
        // Add a small delay to ensure the page is fully loaded
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      // If no hash, scroll to top
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <MainLayout>
      <HeroSection />
      <FeaturesSection />
      <AIToolsSection />
      <LibraryPreviewSection />
      <CTASection />
    </MainLayout>
  );
}
