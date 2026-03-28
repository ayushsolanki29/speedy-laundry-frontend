import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogPost from "@/components/blog/BlogPost";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog-detail.php?slug=${slug}`);
    const data = await response.json();
    
    if (data.status === 'success') {
      const post = data.data;
      return {
        title: `${post.title} | Speedy Laundry Blog`,
        description: post.excerpt || "Expert laundry care tips and professional dry cleaning advice from Speedy Laundry.",
        alternates: {
          canonical: `/blog/${slug}`,
        },
        openGraph: {
          title: post.title,
          description: post.excerpt,
          images: post.image_url ? [post.image_url] : ["/assets/img-grid/IMG_9085.jpg"],
        },
      };
    }
  } catch (error) {
    console.error('Error fetching blog metadata:', error);
  }

  return {
    title: "Blog Post | Speedy Laundry",
    alternates: {
      canonical: `/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />
      <main>
        <BlogPost slug={slug} />
      </main>
      <Footer />
    </div>
  );
}
