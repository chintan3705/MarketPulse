
import Link from "next/link";
import { Logo } from "@/components/common/Logo";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const linkClasses =
    "text-muted-foreground hover:text-primary/80 transition-colors duration-200 ease-in-out";

  return (
    <footer className="border-t bg-card text-card-foreground mt-auto">
      <div className="container py-10 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4 sm:col-span-2 md:col-span-1">
            <Logo iconSize="h-8 w-8" textSize="text-2xl" />
            <p className="text-sm text-muted-foreground">
              Your daily lens on the share market. Timely updates, financial
              insights, and stock analysis.
            </p>
            <div className="flex space-x-4">
              <Link href="#" aria-label="Facebook" className={linkClasses}>
                <Facebook size={20} />
              </Link>
              <Link href="#" aria-label="Twitter" className={linkClasses}>
                <Twitter size={20} />
              </Link>
              <Link href="#" aria-label="LinkedIn" className={linkClasses}>
                <Linkedin size={20} />
              </Link>
              <Link href="#" aria-label="Instagram" className={linkClasses}>
                <Instagram size={20} />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-headline text-md font-semibold mb-3">
              Quick Links
            </h4>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link href="/about" className={linkClasses}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className={linkClasses}>
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/advertise" className={linkClasses}>
                  Advertise
                </Link>
              </li>
              <li>
                <Link href="/careers" className={linkClasses}>
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline text-md font-semibold mb-3">
              Categories
            </h4>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link
                  href="/category/stocks"
                  className={linkClasses}
                >
                  Stocks
                </Link>
              </li>
              <li>
                <Link href="/category/ipos" className={linkClasses}>
                  IPOs
                </Link>
              </li>
              <li>
                <Link
                  href="/category/mutual-funds"
                  className={linkClasses}
                >
                  Mutual Funds
                </Link>
              </li>
              <li>
                <Link
                  href="/category/economy"
                  className={linkClasses}
                >
                  Economy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline text-md font-semibold mb-3">Legal</h4>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link
                  href="/privacy-policy"
                  className={linkClasses}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className={linkClasses}
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className={linkClasses}>
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-xs sm:text-sm text-muted-foreground">
          &copy; {currentYear} MarketPulse. All rights reserved. Built with
          passion.
        </div>
      </div>
    </footer>
  );
}
