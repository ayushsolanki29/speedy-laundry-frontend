export const metadata = {
  title: "Commercial Laundry Services High Wycombe & Buckinghamshire | Speedy Laundry",
  description: "Reliable commercial laundry for hotels, restaurants, gyms, and care homes. Free collection and 24-48hr turnaround across Buckinghamshire. Get a free quote today.",
  keywords: [
    "commercial laundry High Wycombe", "hotel laundry Buckinghamshire", 
    "restaurant linen service", "gym towel service", "care home laundry",
    "workwear cleaning", "bulk laundry service", "B2B laundry solutions"
  ],
  alternates: {
    canonical: "/business",
  },
  openGraph: {
    title: "Commercial Laundry Solutions | Speedy Laundry",
    description: "Partner with Buckinghamshire's trusted commercial laundry. Quality care, reliable delivery, and custom pricing.",
    images: ["/assets/business/business-hero.png"]
  }
};

export default function BusinessLayout({ children }) {
  return <>{children}</>;
}
