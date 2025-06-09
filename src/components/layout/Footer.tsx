import Link from 'next/link';
import { Logo } from '@/components/common/Logo';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='border-t bg-card text-card-foreground mt-auto'>
      <div className='container py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div className='space-y-4'>
            <Logo />
            <p className='text-sm text-muted-foreground'>
              Your daily lens on the share market. Timely updates, financial insights, and stock
              analysis.
            </p>
            <div className='flex space-x-3'>
              <Link
                href='#'
                aria-label='Facebook'
                className='text-muted-foreground hover:text-primary transition-colors'
              >
                <Facebook size={20} />
              </Link>
              <Link
                href='#'
                aria-label='Twitter'
                className='text-muted-foreground hover:text-primary transition-colors'
              >
                <Twitter size={20} />
              </Link>
              <Link
                href='#'
                aria-label='LinkedIn'
                className='text-muted-foreground hover:text-primary transition-colors'
              >
                <Linkedin size={20} />
              </Link>
              <Link
                href='#'
                aria-label='Instagram'
                className='text-muted-foreground hover:text-primary transition-colors'
              >
                <Instagram size={20} />
              </Link>
            </div>
          </div>

          <div>
            <h4 className='font-headline text-lg font-semibold mb-3'>Quick Links</h4>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  href='/about'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href='/contact'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href='/advertise'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  Advertise
                </Link>
              </li>
              <li>
                <Link
                  href='/careers'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className='font-headline text-lg font-semibold mb-3'>Categories</h4>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  href='/category/stocks'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  Stocks
                </Link>
              </li>
              <li>
                <Link
                  href='/category/ipos'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  IPOs
                </Link>
              </li>
              <li>
                <Link
                  href='/category/mutual-funds'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  Mutual Funds
                </Link>
              </li>
              <li>
                <Link
                  href='/category/economy'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  Economy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className='font-headline text-lg font-semibold mb-3'>Legal</h4>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  href='/privacy-policy'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href='/terms-of-service'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href='/disclaimer'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className='mt-10 pt-8 border-t text-center text-sm text-muted-foreground'>
          &copy; {currentYear} MarketPulse. All rights reserved. Built with passion.
        </div>
      </div>
    </footer>
  );
}
