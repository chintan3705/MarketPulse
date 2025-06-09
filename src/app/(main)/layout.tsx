import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StickyNav } from '@/components/layout/StickyNav';
import { categories } from '@/lib/data'; // Mock data for categories

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <StickyNav categories={categories} />
      <main className='flex-grow'>{children}</main>
      <Footer />
    </>
  );
}
