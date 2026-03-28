import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import HowItWorksNew from "@/components/HowItWorksNew";
import ImageGrid from "@/components/ImageGrid";
import CTABanner from "@/components/CTABanner";
import Reviews from "@/components/Reviews";
import ServiceAreas from "@/components/ServiceAreas";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import BlogSection from "@/components/BlogSection";
import Script from "next/script";

export const metadata = {
  title: "Laundry & Dry Cleaning Near Me | High Wycombe, Henley, Beaconsfield",
  description: "Searching for laundry near me? Get professional laundry, ironing, and dry cleaning delivered to your door. Serving High Wycombe, Hazlemere, Henley, Beaconsfield, Maidenhead, Marlow, and surrounding areas. Free collection and delivery.",
  keywords: [
    "laundry High Wycombe", "dry cleaners Hazlemere", "ironing Holmer Green", 
    "laundry Henley-on-Thames", "dry cleaning Beaconsfield", "laundry Maidenhead",
    "stain removal Marlow", "laundry Hazlemere", "laundry Holmer Green", 
    "laundry Hughenden", "laundry Great Kingshill", "laundry Little Kingshill",
    "laundry Naphill", "laundry Prestwood", "laundry Penn", "laundry Tylers Green",
    "laundry Lane End", "laundry Stokenchurch", "laundry Radnage", "laundry Flackwell Heath",
    "laundry Loudwater", "laundry Wooburn Green", "laundry Hyde Heath",
    "commercial laundry Buckinghamshire", "laundry HP12",
    "wash and iron near me", "express laundry service", "bedding laundry service"
  ],
  alternates: {
    canonical: "/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LaundryService",
  "name": "Speedy Laundry",
  "image": "https://www.speedylaundry.co.uk/assets/logo.svg",
  "url": "https://www.speedylaundry.co.uk",
  "telephone": "01494 445291",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Abbey House, Lincoln Road, Cressex Business Park",
    "addressLocality": "High Wycombe",
    "addressRegion": "Buckinghamshire",
    "postalCode": "HP12 3RD",
    "addressCountry": "GB"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 51.6214,
    "longitude": -0.7711
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday"],
      "opens": "06:00",
      "closes": "15:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Friday",
      "opens": "06:00",
      "closes": "14:00"
    }
  ],
  "areaServed": [
    "High Wycombe", "Henley-on-Thames", "Beaconsfield", "Maidenhead", "Marlow", 
    "Hazlemere", "Holmer Green", "Hughenden", "Great Kingshill", "Little Kingshill", 
    "Naphill", "Prestwood", "Penn", "Tylers Green", "Lane End", "Stokenchurch", 
    "Radnage", "Flackwell Heath", "Loudwater", "Wooburn Green", "Hyde Heath",
    "Gerrards Cross", "Amersham", "Chesham", "Chalfont St Giles", "Chalfont St Peter"
  ]
};

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <Hero />
        <Services />
        <HowItWorksNew />
        <ImageGrid />
        <ServiceAreas />
        <CTABanner />
        <Reviews />
        <FAQ />
        <Contact />
        <BlogSection />
      </main>
      <Footer />
    </div>
  );
}
