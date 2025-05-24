'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, ShoppingBag, BarChart3, UserCircle, LogOut } from 'lucide-react';
import VeggieDashLogo from '@/components/VeggieDashLogo';
import { Button } from '@/components/ui/button';
import { useClerk } from '@clerk/nextjs';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/seller/dashboard', label: 'Dashboard', icon: Home },
  { href: '/seller/inventory', label: 'Inventory', icon: Package },
  { href: '/seller/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/seller/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/seller/profile', label: 'Profile', icon: UserCircle },
];

export default function SellerSidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();

  return (
    <aside className="w-64 bg-card border-r flex flex-col sticky top-0 h-screen">
      <div className="p-6 border-b">
        <Link href="/seller/dashboard">
          <VeggieDashLogo />
        </Link>
      </div>
      <nav className="flex-grow p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/seller/dashboard' && pathname.startsWith(item.href));
          return (
            <Link key={item.label} href={item.href}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  "w-full justify-start",
                  isActive && "font-semibold text-primary"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t">
        <Button variant="outline" className="w-full justify-start" onClick={() => signOut({ redirectUrl: '/' })}>
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
