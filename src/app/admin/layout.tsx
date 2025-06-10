"use client"; // Required for usePathname

import Link from "next/link";
import { Logo } from "@/components/common/Logo";
import { Home, Newspaper, Settings, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import type React from "react"; // Import React for types

interface AdminNavItemProps {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>; // More specific type for Lucide icons
  currentPath: string;
}

const AdminNavItem: React.FC<AdminNavItemProps> = ({
  href,
  label,
  icon: Icon,
  currentPath,
}) => {
  const isActive =
    currentPath === href || (href !== "/admin" && currentPath.startsWith(href));
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
        isActive && "bg-muted text-primary",
      )}
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

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Logo />
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <AdminNavItem
                href="/admin"
                label="Dashboard"
                icon={LayoutDashboard}
                currentPath={currentPath}
              />
              <AdminNavItem
                href="/admin/blogs"
                label="Blogs"
                icon={Newspaper}
                currentPath={currentPath}
              />
              <AdminNavItem
                href="/admin/settings"
                label="Settings"
                icon={Settings}
                currentPath={currentPath}
              />
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
            >
              <Home className="h-4 w-4" /> Go to Main Site
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
          <Logo className="text-lg" />
          {/* Add mobile nav trigger here if needed */}
        </header>
        <main className="flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
