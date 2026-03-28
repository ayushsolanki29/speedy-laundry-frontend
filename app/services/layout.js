import { metadata as layoutMetadata } from "../layout";

export const metadata = {
  title: "Professional Laundry & Dry Cleaning Services | Speedy Laundry",
  description: "Explore our range of professional laundry services including Ironing, Wash + Iron, Dry Cleaning, and Wash, Dry & Fold. Free pickup and delivery across Buckinghamshire.",
  keywords: [
    "ironing service", "dry cleaning", "wash and iron", "laundry folding service",
    "professional laundry services", "laundry pickup and delivery", "bedding cleaning",
    "commercial laundry", "Speedy Laundry services"
  ],
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Our Professional Laundry Services | Speedy Laundry",
    description: "Premium laundry care for your everyday and delicate garments. Fast 24-48 hour turnaround.",
    images: ["/assets/our services/ChatGPT Image Feb 6, 2026, 09_58_10 AM.png"]
  }
};

export default function ServicesLayout({ children }) {
  return <>{children}</>;
}
