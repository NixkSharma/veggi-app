
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ListOrdered } from "lucide-react";

export default function SellerOrdersPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Order Management</h1>
        <p className="text-muted-foreground">View and manage customer orders.</p>
      </header>
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <ListOrdered className="h-6 w-6 text-primary" />
            <CardTitle>All Orders</CardTitle>
          </div>
          <CardDescription>A list of all customer orders will be displayed here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Order management functionality is coming soon.
          </p>
          {/* Placeholder for order list table or cards */}
        </CardContent>
      </Card>
    </div>
  );
}
