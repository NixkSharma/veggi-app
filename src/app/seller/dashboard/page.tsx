
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, ShoppingBag, Package, Users } from "lucide-react";

export default function SellerDashboardPage() {
  // Placeholder data - In a real app, this would come from backend/database
  const stats = [
    { title: "Total Revenue", value: "$0.00", icon: DollarSign, change: "Data coming soon" },
    { title: "Total Orders", value: "0", icon: ShoppingBag, change: "Data coming soon" },
    { title: "Active Products", value: "0", icon: Package, change: "Data coming soon" },
    { title: "New Customers", value: "0", icon: Users, change: "Data coming soon" },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Seller Dashboard</h1>
        <p className="text-muted-foreground">Welcome, Admin! Here's an overview of your store.</p>
      </header>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Showing last 5 orders.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Order management functionality coming soon.</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Low Stock Items</CardTitle>
             <CardDescription>Products needing attention.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Low stock alert functionality coming soon.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
