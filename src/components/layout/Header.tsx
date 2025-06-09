"use client";

import Link from "next/link";
import { Logo } from "@/components/common/Logo";
import { SearchInput } from "@/components/common/SearchInput";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Menu, X, UserCog } from "lucide-react";
import type { NavItem } from "@/types";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/common/ThemeToggle";

const mainNavItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "News", href: "/news" },
  { label: "Analysis", href: "/analysis" },
  { label: "IPOs", href: "/ipos" },
  { label: "Markets", href: "/markets" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Logo />

        <nav className="hidden md:flex items-center space-x-4 ml-6 text-sm font-medium">
          {mainNavItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-foreground/70",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1 flex justify-end items-center space-x-2">
          <div className="hidden md:block">
            <SearchInput />
          </div>
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            asChild
            className="hidden md:inline-flex"
          >
            <Link href="/admin">
              <span className="inline-flex items-center">
                <UserCog className="mr-2 h-4 w-4" />
                Admin Panel
              </span>
            </Link>
          </Button>
        </div>

        <div className="md:hidden flex items-center ml-auto space-x-1">
          <ThemeToggle />
          <Link href="/admin" passHref legacyBehavior={false}>
            {" "}
            {/* Removed legacyBehavior, passHref remains useful if Button were not asChild */}
            <Button
              variant="ghost"
              size="icon"
              className="mr-0"
              aria-label="Admin Panel"
            >
              <UserCog className="h-5 w-5" />
            </Button>
          </Link>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[340px] p-0">
              <div className="flex flex-col h-full">
                <SheetHeader className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Logo />
                      <SheetTitle>Menu</SheetTitle>
                    </div>
                    <SheetClose asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Close menu"
                      >
                        <X className="h-6 w-6" />
                      </Button>
                    </SheetClose>
                  </div>
                </SheetHeader>
                <div className="p-4">
                  <SearchInput className="mb-4" />
                </div>
                <nav className="flex-1 flex flex-col space-y-2 p-4">
                  {mainNavItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn(
                        "block px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                        pathname === item.href
                          ? "bg-accent text-accent-foreground"
                          : "text-foreground",
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link
                    href="/admin"
                    className={cn(
                      "block px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                      pathname.startsWith("/admin")
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground",
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="inline-flex items-center">
                      <UserCog className="inline-block mr-2 h-5 w-5 align-text-bottom" />
                      Admin Panel
                    </span>
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
