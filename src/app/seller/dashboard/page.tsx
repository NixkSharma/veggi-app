
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Package, ShoppingBag, BarChart3, Activity, Users } from "lucide-react";

export default function SellerDashboardPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Seller Dashboard</h1>
        <p className="mt-2 text-lg text-muted-foreground">Welcome back! Here's an overview of your VeggieDash store.</p>
      </header>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-md hover:shadow-lg transition-shadow rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div> {/* Placeholder */}
            <p className="text-xs text-muted-foreground">+0% from last month</p> {/* Placeholder */}
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div> {/* Placeholder */}
            <p className="text-xs text-muted-foreground">+0 this month</p> {/* Placeholder */}
          </CardContent>
        </Card>
         <Card className="shadow-md hover:shadow-lg transition-shadow rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Package className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div> {/* Placeholder */}
            <p className="text-xs text-muted-foreground">Manage your inventory</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
         <Card className="shadow-md hover:shadow-lg transition-shadow rounded-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Quickly navigate to key management areas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link href="/seller/inventory"><Package className="mr-2 h-4 w-4" /> Manage Inventory</Link>
            </Button>
            <Button asChild className="w-full justify-start">
              <Link href="/seller/orders"><ShoppingBag className="mr-2 h-4 w-4" /> View Orders</Link>
            </Button>
             <Button asChild className="w-full justify-start">
              <Link href="/seller/analytics"><BarChart3 className="mr-2 h-4 w-4" /> View Analytics</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-shadow rounded-lg">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle> {/* Placeholder */}
            <CardDescription>No recent activity to display.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Order updates and stock alerts will appear here.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
