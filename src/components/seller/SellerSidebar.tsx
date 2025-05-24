
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, ShoppingBag, BarChart3, UserCircle, LogOut, Settings } from 'lucide-react';
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
    <aside className="w-60 bg-card border-r flex flex-col sticky top-16 h-[calc(100vh-4rem)]"> {/* Adjust top if header height changes */}
      <div className="p-4 border-b flex items-center justify-between">
        <Link href="/seller/dashboard" className="flex items-center gap-2">
          <Settings className="h-7 w-7 text-primary" />
          <span className="text-xl font-semibold text-foreground">Seller Panel</span>
        </Link>
      </div>
      <nav className="flex-grow p-3 space-y-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/seller/dashboard' && pathname.startsWith(item.href));
          return (
            <Link key={item.label} href={item.href} passHref legacyBehavior>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  "w-full justify-start text-sm h-10",
                  isActive && "font-semibold text-primary bg-primary/10 hover:bg-primary/20"
                )}
                as="a" 
              >
                <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t mt-auto">
        <Button variant="outline" className="w-full justify-start h-10 text-sm" onClick={() => signOut({ redirectUrl: '/' })}>
          <LogOut className="mr-3 h-5 w-5 text-muted-foreground" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
