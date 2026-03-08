import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import "./globals.css";
import { Inter, Pacifico } from "next/font/google";
import localFont from "next/font/local";
import Preloader from "@/components/Preloader";
import ClientLayout from "./ClientLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pacifico',
  display: 'swap',
});

const goudySans = localFont({
  src: [
    {
      path: '../public/assets/fonts/GoudySansStd-Book.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/assets/fonts/GoudySansStd-BookItalic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../public/assets/fonts/GoudySansStd-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/assets/fonts/GoudySansStd-MediumItalic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../public/assets/fonts/GoudySansStd-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/assets/fonts/GoudySansStd-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../public/assets/fonts/GoudySansStd-Black.woff2',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../public/assets/fonts/GoudySansStd-BlackItalic.woff2',
      weight: '900',
      style: 'italic',
    },
  ],
  variable: '--font-display',
  display: 'swap',
});

export const metadata = {
  title: {
    default: "Speedy Laundry - Professional Laundry & Dry Cleaning Service",
    template: "%s | Speedy Laundry"
  },
  description: "Premium laundry, ironing, and dry cleaning service with free pickup and delivery across High Wycombe, Henley, Beaconsfield, and Maidenhead. Quality care for your garments since 2014.",
  keywords: ["laundry service near me", "dry cleaning High Wycombe", "ironing service Henley", "laundry pickup and delivery", "commercial laundry Buckinghamshire", "professional ironing service", "wash dry fold service"],
  authors: [{ name: "Speedy Laundry" }],
  creator: "Speedy Laundry",
  publisher: "Speedy Laundry",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  metadataBase: new URL('https://speedylaundry.co.uk'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Speedy Laundry - Professional Laundry & Dry Cleaning',
    description: 'Free pickup and delivery for all your laundry, ironing, and dry cleaning needs.',
    url: 'https://speedylaundry.co.uk',
    siteName: 'Speedy Laundry',
    images: [
      {
        url: '/assets/logo.svg',
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Speedy Laundry - Professional Laundry Service',
    description: 'Premium laundry and dry cleaning with free pickup and delivery.',
    images: ['/assets/logo.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Speedy Laundry",
  },
  other: {
    "apple-mobile-web-app-title": "Speedy Laundry",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${goudySans.variable} ${pacifico.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ClientLayout>
          <Preloader>
            {children}
          </Preloader>
        </ClientLayout>
      </body>
    </html>
  );
}
