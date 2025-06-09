import Link from 'next/link';
import { Logo } from '@/components/common/Logo';
import { Home, Newspaper, Settings, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminNavItem = ({ href, label, icon: Icon, currentPath }: { href: string; label: string; icon: React.ElementType; currentPath: string; }) => {
  const isActive = currentPath === href || (href !== "/admin" && currentPath.startsWith(href));
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
        isActive && "bg-muted text-primary"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
};

// This is a simplified way to get currentPath for server component, in real app usePathname hook on client side or pass as prop.
// For this prototype, we'll assume a way to determine currentPath or it will default to non-active for deeper paths.
// As this is a server component, we can't use usePathname directly.
// We'll pass a mock path for styling demonstration. For a real app, middleware or page props would provide this.

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Mock current path for styling example in a server component.
  // In a real app, this would need to be derived differently for server components or handled by client components.
  const mockCurrentPath = "/admin/blogs"; // Example path

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Logo />
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <AdminNavItem href="/admin" label="Dashboard" icon={LayoutDashboard} currentPath={mockCurrentPath} />
              <AdminNavItem href="/admin/blogs" label="Blogs" icon={Newspaper} currentPath={mockCurrentPath} />
              {/* Add more admin navigation items here */}
              <AdminNavItem href="/admin/settings" label="Settings" icon={Settings} currentPath={mockCurrentPath} />
            </nav>
          </div>
          <div className="mt-auto p-4">
            {/* Can add footer content here like logout button */}
            <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                <Home className="h-4 w-4" /> Go to Main Site
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
           {/* Mobile header: Could include a Sheet for nav, and a simpler Logo */}
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
