import { servicesData } from "@/data/services";

export async function generateMetadata({ params }) {
  const { id } = params;
  const service = servicesData.find(s => s.id === id);

  if (!service) {
    return {
      title: "Service Not Found | Speedy Laundry",
    };
  }

  return {
    title: `${service.title} - Professional Service | Speedy Laundry`,
    description: service.description,
    keywords: [
      service.title, 
      ...service.items, 
      "professional cleaning", 
      "laundry service near me",
      "free pickup and delivery"
    ],
    alternates: {
      canonical: `/services/${id}`,
    },
    openGraph: {
      title: `${service.title} | Premium Care by Speedy Laundry`,
      description: service.description,
      images: [service.image]
    }
  };
}

export default function ServiceDetailLayout({ children }) {
  return <>{children}</>;
}
