
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
import React, { useState } from "react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 shadow-sm">
      <div className="container flex h-14 items-center px-4 sm:px-6 lg:px-8">
        <Logo iconSize="h-7 w-7" textSize="text-xl" />

        <nav className="hidden md:flex items-center space-x-3 lg:space-x-4 ml-4 lg:ml-6 text-sm">
          {mainNavItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "transition-colors hover:text-primary px-2 py-1 rounded-md",
                pathname === item.href
                  ? "text-primary font-medium bg-primary/10"
                  : "text-foreground/80 hover:text-primary/90",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1 flex justify-end items-center space-x-1 sm:space-x-2">
          <div className="hidden sm:block">
            <SearchInput />
          </div>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hidden md:inline-flex text-sm"
            aria-label="Admin Panel"
          >
            <Link href="/admin">
              <UserCog className="mr-1.5 h-4 w-4" />
              Admin
            </Link>
          </Button>
        </div>

        <div className="md:hidden flex items-center ml-auto space-x-1">
          {/* Search input for mobile can be triggered by an icon if needed */}
          <Link href="/admin" passHref>
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground/80 hover:text-primary"
              aria-label="Admin Panel"
            >
              <UserCog className="h-5 w-5" />
            </Button>
          </Link>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className="text-foreground/80 hover:text-primary"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full max-w-xs sm:max-w-sm p-0"
            >
              <div className="flex flex-col h-full">
                <SheetHeader className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <Logo textSize="text-lg" iconSize="h-6 w-6" />
                    <SheetTitle className="sr-only">
                      Navigation Menu
                    </SheetTitle>
                    <SheetClose asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Close menu"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </SheetClose>
                  </div>
                </SheetHeader>
                <div className="p-4">
                  <SearchInput className="mb-4 w-full" />
                </div>
                <nav className="flex-1 flex flex-col space-y-1 p-4 pt-0">
                  {mainNavItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn(
                        "block px-3 py-2.5 rounded-md text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
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
                      "block px-3 py-2.5 rounded-md text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                      pathname.startsWith("/admin")
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground",
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <UserCog className="inline-block mr-2 h-5 w-5 align-text-bottom" />
                    Admin Panel
                  </Link>
                </nav>
                <div className="p-4 mt-auto border-t">
                  <ThemeToggle />{" "}
                  <span className="ml-2 text-sm text-muted-foreground">
                    Toggle Theme
                  </span>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
