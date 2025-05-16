
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Users, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";


export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          About VeggieDash
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Delivering Farm-Fresh Goodness to Your Table
        </p>
      </header>

      <section className="mb-16">
        <Card className="overflow-hidden shadow-xl">
          <div className="grid md:grid-cols-2 items-center">
            <div className="p-8 md:p-12">
              <h2 className="text-3xl font-semibold text-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                At VeggieDash, our mission is simple: to make fresh, high-quality vegetables accessible to everyone. We believe that healthy eating should be convenient and enjoyable. That's why we partner with local farmers and trusted suppliers to bring you the best produce directly to your doorstep.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We are passionate about supporting sustainable agriculture and promoting a healthy lifestyle within our community. Every vegetable we deliver is carefully selected for its freshness and flavor, ensuring you receive only the best.
              </p>
            </div>
            <div className="relative h-64 md:h-full">
              <Image
                src="https://placehold.co/800x600.png"
                alt="Fresh vegetables display"
                data-ai-hint="vegetables market"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </Card>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-foreground text-center mb-10">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Leaf className="mx-auto h-12 w-12 text-primary mb-4" />
              <CardTitle>Peak Freshness</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">We source our vegetables daily to ensure they arrive at your home at their freshest.</p>
            </CardContent>
          </Card>
          <Card className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Users className="mx-auto h-12 w-12 text-primary mb-4" />
              <CardTitle>Local Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">By choosing us, you're supporting local farmers and sustainable practices.</p>
            </CardContent>
          </Card>
          <Card className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Truck className="mx-auto h-12 w-12 text-primary mb-4" />
              <CardTitle>Convenient Delivery</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Get fresh produce delivered right to your doorstep, saving you time and effort.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="text-center py-10 bg-secondary/10 rounded-lg">
        <h2 className="text-2xl font-semibold text-foreground mb-3">Join the VeggieDash Family</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-6">
          Experience the difference that truly fresh vegetables can make in your meals and your health.
        </p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/dashboard"> 
            Start Shopping Now
          </Link>
        </Button>
      </section>
    </div>
  );
}
