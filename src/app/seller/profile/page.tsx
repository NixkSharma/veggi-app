
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCog } from "lucide-react";

export default function SellerProfilePage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Seller Profile</h1>
        <p className="text-muted-foreground">Manage your seller account details.</p>
      </header>
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <UserCog className="h-6 w-6 text-primary" />
            <CardTitle>Your Information</CardTitle>
          </div>
          <CardDescription>Update your contact details and other profile settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Profile management features are coming soon.
          </p>
          {/* Placeholder for profile form */}
        </CardContent>
      </Card>
    </div>
  );
}
