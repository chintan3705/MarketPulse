import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyNav } from "@/components/layout/StickyNav";
import { categories } from "@/lib/data";
import type React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <StickyNav categories={categories} />
      <main className="flex-grow pt-0"> {/* Removed default pt-6 from main, pages will handle their own top padding */}
        {children}
      </main>
      <Footer />
    </>
  );
}
