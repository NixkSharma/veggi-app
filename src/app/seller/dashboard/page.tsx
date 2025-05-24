import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Package, ShoppingBag, BarChart3 } from "lucide-react";

export default function SellerDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-primary">Seller Dashboard</h1>
      <p className="mb-8 text-muted-foreground">Welcome to your VeggieDash seller control panel. Manage your products, orders, and view analytics.</p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <Package className="h-8 w-8 text-accent mb-2" />
            <CardTitle>Inventory Management</CardTitle>
            <CardDescription>View, add, edit, and manage your vegetable stock.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/seller/inventory">Go to Inventory</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <ShoppingBag className="h-8 w-8 text-accent mb-2" />
            <CardTitle>Order Management</CardTitle>
            <CardDescription>Track customer orders and update their statuses.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/seller/orders">View Orders</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <BarChart3 className="h-8 w-8 text-accent mb-2" />
            <CardTitle>Sales Analytics</CardTitle>
            <CardDescription>Monitor your sales performance and trends.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/seller/analytics">View Analytics</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
