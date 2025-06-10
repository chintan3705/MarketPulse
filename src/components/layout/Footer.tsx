import Link from "next/link";
import { Logo } from "@/components/common/Logo";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

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
              <Link
                href="#"
                aria-label="Facebook"
                className="text-muted-foreground hover:text-primary transition-colors duration-200 ease-in-out"
              >
                <Facebook size={20} />
              </Link>
              <Link
                href="#"
                aria-label="Twitter"
                className="text-muted-foreground hover:text-primary transition-colors duration-200 ease-in-out"
              >
                <Twitter size={20} />
              </Link>
              <Link
                href="#"
                aria-label="LinkedIn"
                className="text-muted-foreground hover:text-primary transition-colors duration-200 ease-in-out"
              >
                <Linkedin size={20} />
              </Link>
              <Link
                href="#"
                aria-label="Instagram"
                className="text-muted-foreground hover:text-primary transition-colors duration-200 ease-in-out"
              >
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
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 ease-in-out"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 ease-in-out"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/advertise"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 ease-in-out"
                >
                  Advertise
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 ease-in-out"
                >
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
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 ease-in-out"
                >
                  Stocks
                </Link>
              </li>
              <li>
                <Link
                  href="/category/ipos"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 ease-in-out"
                >
                  IPOs
                </Link>
              </li>
              <li>
                <Link
                  href="/category/mutual-funds"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 ease-in-out"
                >
                  Mutual Funds
                </Link>
              </li>
              <li>
                <Link
                  href="/category/economy"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 ease-in-out"
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
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 ease-in-out"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 ease-in-out"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/disclaimer"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 ease-in-out"
                >
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
