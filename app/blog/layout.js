export const metadata = {
  title: "Laundry Tips & News Blog | Speedy Laundry",
  description: "Read the latest laundry care tips, dry cleaning advice, and business news from Speedy Laundry, your local experts in Buckinghamshire.",
  keywords: [
    "laundry tips", "dry cleaning advice", "stain removal guide", 
    "Speedy Laundry blog", "Buckinghamshire business news"
  ],
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Speedy Laundry Blog - Expert Care Tips",
    description: "Learn how to care for your favorite clothes with our expert guides.",
    images: ["/assets/img-grid/IMG_9085.jpg"]
  }
};

export default function BlogLayout({ children }) {
  return <>{children}</>;
}
