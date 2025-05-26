
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, ShoppingCart, User, LogOut } from 'lucide-react';
import VeggieDashLogo from '@/components/VeggieDashLogo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { signOut } from 'next-auth/react';

const sidebarNavItems = [
  { href: '/seller/dashboard', label: 'Dashboard', icon: Home },
  { href: '/seller/inventory', label: 'Inventory', icon: Package },
  { href: '/seller/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/seller/profile', label: 'Profile', icon: User },
];

export default function SellerSidebar() {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' }); 
  };

  return (
    <aside className="sticky top-0 h-screen w-64 flex-col border-r bg-card p-4 shadow-lg hidden md:flex">
      <div className="mb-8 flex items-center justify-center">
        <Link href="/seller/dashboard">
          <VeggieDashLogo className="h-10 w-auto" />
        </Link>
      </div>
      <nav className="flex-grow space-y-2">
        {sidebarNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary",
              (pathname === item.href || (item.href !== '/seller/dashboard' && pathname.startsWith(item.href))) ? "bg-primary/10 text-primary font-medium" : ""
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto">
        <Button variant="outline" className="w-full" onClick={handleSignOut}>
          <LogOut className="mr-2 h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
