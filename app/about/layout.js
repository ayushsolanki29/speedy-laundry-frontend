export const metadata = {
  title: "About Speedy Laundry | High Wycombe's Trusted Laundry Specialists",
  description: "Family-owned for over 30 years, Speedy Laundry provides premium eco-friendly laundry care with free delivery. Learn about our story and commitment to quality.",
  keywords: [
    "about speedy laundry", "local laundry specialists", "family owned laundry Buckinghamshire",
    "eco-friendly laundry history", "professional laundry team", "laundry service mission"
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "The Story of Speedy Laundry | Quality & Care Since 1994",
    description: "Discover how we've been serving Buckinghamshire with premium laundry services for over 30 years.",
    images: ["/assets/img-grid/IMG_9081.jpg"]
  }
};

export default function AboutLayout({ children }) {
  return <>{children}</>;
}
