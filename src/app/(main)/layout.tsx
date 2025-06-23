import type React from "react";
import { categories } from "@/lib/data";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { StickyNav } from "@/components/layout/StickyNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <StickyNav categories={categories} />
      <main className="flex-grow pt-0">{children}</main>
      <Footer />
    </>
  );
}
