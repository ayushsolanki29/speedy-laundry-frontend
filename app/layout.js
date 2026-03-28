import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import "./globals.css";
import { Inter, Pacifico } from "next/font/google";
import localFont from "next/font/local";
import Preloader from "@/components/Preloader";
import ClientLayout from "./ClientLayout";
import Script from "next/script";

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
  metadataBase: new URL("https://www.speedylaundry.co.uk"),
  openGraph: {
    title: 'Speedy Laundry - Professional Laundry & Dry Cleaning',
    description: 'Free pickup and delivery for all your laundry, ironing, and dry cleaning needs.',
    url: "https://www.speedylaundry.co.uk",
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
  icons: {
    icon: [
      { url: '/icon0.svg', type: 'image/svg+xml' },
      { url: '/icon1.png', type: 'image/png', sizes: '96x96' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Speeds Laundry",
  },
  other: {
    "apple-mobile-web-app-title": "Speeds Laundry",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${goudySans.variable} ${pacifico.variable}`} suppressHydrationWarning>
      <head>
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-N6757J63');`}
        </Script>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-7YCM9VPLXR"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-7YCM9VPLXR');`}
        </Script>
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N6757J63"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        <ClientLayout>
          <Preloader>
            {children}
          </Preloader>
        </ClientLayout>
      </body>
    </html>
  );
}
