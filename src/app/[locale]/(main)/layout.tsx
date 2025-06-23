import type React from "react";
import { categories } from "@/lib/data";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { StickyNav } from "@/components/layout/StickyNav";

export default function MainLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <>
      <Header locale={locale} />
      <StickyNav categories={categories} locale={locale} />
      <main className="flex-grow pt-0">{children}</main>
      <Footer locale={locale} />
    </>
  );
}
