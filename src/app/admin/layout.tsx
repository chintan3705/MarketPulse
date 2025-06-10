
"use client";

import Link from "next/link";
import { Logo } from "@/components/common/Logo";
import {
  Home,
  Newspaper,
  Settings,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";

interface AdminNavItemProps {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  currentPath: string;
  onClick?: () => void;
}

const AdminNavItem: React.FC<AdminNavItemProps> = ({
  href,
  label,
  icon: Icon,
  currentPath,
  onClick,
}) => {
  const isActive =
    href === "/admin" ? currentPath === href : currentPath.startsWith(href);
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ease-in-out hover:text-primary",
        isActive
          ? "bg-muted text-primary font-medium"
          : "text-muted-foreground",
      )}
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const currentPath = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-0.5">
      <AdminNavItem
        href="/admin"
        label="Dashboard"
        icon={LayoutDashboard}
        currentPath={currentPath}
        onClick={() => setMobileMenuOpen(false)}
      />
      <AdminNavItem
        href="/admin/blogs"
        label="Blogs"
        icon={Newspaper}
        currentPath={currentPath}
        onClick={() => setMobileMenuOpen(false)}
      />
      <AdminNavItem
        href="/admin/settings"
        label="Settings"
        icon={Settings}
        currentPath={currentPath}
        onClick={() => setMobileMenuOpen(false)}
      />
    </nav>
  );

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Logo iconSize="h-6 w-6" textSize="text-lg" />
          </div>
          <div className="flex-1 overflow-y-auto py-2">{navItems}</div>
          <div className="mt-auto p-4 border-t">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200 ease-in-out"
            >
              <Home className="h-4 w-4" /> Go to Main Site
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Header and Content Area */}
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6 lg:h-[60px] md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="flex flex-col p-0 w-[260px] sm:w-[280px]" // Removed overflow-y-auto from here
            >
              <SheetHeader className="flex flex-row items-center justify-between border-b p-4 sticky top-0 bg-background z-10">
                <Logo iconSize="h-6 w-6" textSize="text-lg" />
                <SheetTitle className="sr-only">Admin Navigation Menu</SheetTitle>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" aria-label="Close menu">
                    <X className="h-5 w-5" />
                  </Button>
                </SheetClose>
              </SheetHeader>
              <div className="flex-1 py-2 overflow-y-auto">{navItems}</div> {/* This div handles scrolling for navItems */}
              <div className="mt-auto p-4 border-t sticky bottom-0 bg-background z-10">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200 ease-in-out"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home className="h-4 w-4" /> Go to Main Site
                </Link>
              </div>
            </SheetContent>
          </Sheet>
          <div className="md:hidden">
            {" "}
            {/* Logo for mobile header when menu is closed */}
            <Logo iconSize="h-6 w-6" textSize="text-lg" />
          </div>
        </header>
        <main className="flex-1 flex-col gap-4 p-4 sm:p-6 bg-muted/20 dark:bg-muted/40">
          {children}
        </main>
      </div>
    </div>
  );
}
