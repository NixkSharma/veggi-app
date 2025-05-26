
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';
import AuthProvider from '@/components/AuthProvider'; // Import AuthProvider

export const metadata: Metadata = {
  title: 'VeggieDash - Fresh Vegetables Delivered',
  description: 'Order fresh vegetables online from VeggieDash and get them delivered to your doorstep.',
  icons: {
    // icon: '/favicon.ico', 
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(GeistSans.variable, GeistMono.variable)}>
      <body 
        className={cn(
          "min-h-screen bg-background font-sans antialiased"
        )}
      >
        <AuthProvider> {/* Wrap with AuthProvider */}
          <CartProvider>
            <div className="relative flex min-h-dvh flex-col bg-background">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
