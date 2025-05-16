
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, ShoppingCartIcon, Smile, Zap } from 'lucide-react'; // Using Leaf for Farm-Fresh

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center py-24 md:py-32 px-4 bg-gradient-to-b from-primary/5 via-background to-background text-foreground">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://placehold.co/1920x800.png" 
            alt="Background collage of fresh vegetables"
            fill
            className="object-cover"
            priority
            data-ai-hint="vegetables field harvest"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-primary">
            Freshness Delivered, Joy Guaranteed.
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Discover the vibrant taste of locally-sourced vegetables, brought straight from the farm to your kitchen with VeggieDash.
          </p>
          <Link href="/dashboard" legacyBehavior>
            <Button size="lg" className="text-lg font-semibold px-10 py-7 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full shadow-xl transition-transform hover:scale-105">
              Get Started & Explore
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-foreground mb-16">
            Why You&apos;ll Love <span className="text-primary">VeggieDash</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border-border/50 group p-6">
              <CardHeader className="items-center">
                <div className="p-3 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                  <Leaf className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl font-semibold">Peak Freshness</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Handpicked daily from local farms to ensure every bite is bursting with flavor and nutrients.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border-border/50 group p-6">
              <CardHeader className="items-center">
                 <div className="p-3 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                  <Zap className="h-10 w-10 text-primary" /> {/* Zap for speed */}
                </div>
                <CardTitle className="text-2xl font-semibold">Swift Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Your veggies arrive at your doorstep quickly, preserving their just-picked quality and vitality.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border-border/50 group p-6">
              <CardHeader className="items-center">
                 <div className="p-3 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                  <Smile className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl font-semibold">Healthy & Happy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Nourish your body and delight your taste buds with our wide selection of wholesome vegetables.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 md:py-28 bg-primary/5 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-6">
            Ready to Elevate Your Meals?
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            Join the VeggieDash community and experience the convenience and joy of farm-fresh vegetables delivered.
          </p>
          <Link href="/dashboard" legacyBehavior>
            <Button size="lg" className="text-lg font-semibold px-10 py-7 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full shadow-xl transition-transform hover:scale-105">
              Browse Our Veggies
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
