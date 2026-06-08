"use client";

import dynamic from "next/dynamic";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesSection } from "@/components/home/ServicesSection";

// Lazy load below-the-fold sections for faster initial page load
const AdvantagesSection = dynamic(
  () => import("@/components/home/AdvantagesSection").then((mod) => ({ default: mod.AdvantagesSection })),
  {
    loading: () => <SectionSkeleton />,
  }
);

const CategoriesSection = dynamic(
  () => import("@/components/home/CategoriesSection").then((mod) => ({ default: mod.CategoriesSection })),
  {
    loading: () => <SectionSkeleton />,
  }
);

const ReviewsSection = dynamic(
  () => import("@/components/home/ReviewsSection").then((mod) => ({ default: mod.ReviewsSection })),
  {
    loading: () => <SectionSkeleton />,
  }
);

const BrandsSection = dynamic(
  () => import("@/components/home/BrandsSection").then((mod) => ({ default: mod.BrandsSection })),
  {
    loading: () => <SectionSkeleton />,
  }
);

const BeforeAfterSection = dynamic(
  () => import("@/components/home/BeforeAfterSection").then((mod) => ({ default: mod.BeforeAfterSection })),
  {
    loading: () => <SectionSkeleton />,
  }
);

const FAQSection = dynamic(
  () => import("@/components/home/FAQSection").then((mod) => ({ default: mod.FAQSection })),
  {
    loading: () => <SectionSkeleton />,
  }
);

const ContactSection = dynamic(
  () => import("@/components/home/ContactSection").then((mod) => ({ default: mod.ContactSection })),
  {
    loading: () => <SectionSkeleton />,
  }
);

function SectionSkeleton() {
  return (
    <div className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 flex flex-col items-center gap-4">
          <div className="h-8 w-64 animate-pulse rounded-lg bg-gris-anthracite" />
          <div className="h-4 w-96 max-w-full animate-pulse rounded-lg bg-gris-anthracite" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-gris-anthracite" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <AdvantagesSection />
      <CategoriesSection />
      <ReviewsSection />
      <BrandsSection />
      <BeforeAfterSection />
      <FAQSection />
      <ContactSection />
    </>
  );
}
