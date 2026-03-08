'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  User,
  Calendar,
  Share2,
  Heart,
  MessageCircle,
  Tag,
  Loader2,
  ChevronRight,
  Share
} from "lucide-react";
import Link from "next/link";
import BlogInteractions from "@/components/blog/BlogInteractions";

const BlogPost = ({ slug }) => {
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Fetch article details
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog-detail.php?slug=${slug}`);
        const data = await response.json();
        if (data.status === 'success') {
          setPost(data.data);

          // Fetch related/latest posts for the "Related" section
          const relatedRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs.php?limit=3`);
          const relatedData = await relatedRes.json();
          if (relatedData.status === 'success') {
            // Filter out the current post
            setRelatedPosts(relatedData.data.blogs.filter(b => b.slug !== slug).slice(0, 2));
          }
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">Loading Wisdom...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-white">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-display font-bold text-header mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">The laundry tips you're looking for aren't here.</p>
          <Link href="/blog" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-bold transition-all hover:brightness-110">
            <ArrowLeft className="w-4 h-4" />
            Back to Library
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 text-center overflow-hidden">
        {/* Background Image or Fallback */}
        <div className="absolute inset-0 z-0 bg-[#1a142e]">
          {post.image_url ? (
            <>
              <div 
                className="absolute inset-0 bg-cover bg-center blur-[2px] transform scale-110"
                style={{ backgroundImage: `url(${post.image_url})` }}
              />
              <div className="absolute inset-0 bg-black/50 pointer-events-none" />
            </>
          ) : (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
          )}
        </div>

        <div className="container relative z-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link href="/blog" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-10 transition-colors font-medium text-sm">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            <div className="mb-8">
              <span className="px-6 py-2 bg-white/5 backdrop-blur-md border border-white/10 text-primary rounded-full text-[11px] font-bold uppercase tracking-widest">
                {post.category || 'Laundry Tips'}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 max-w-4xl mx-auto leading-tight">
              {post.title}
            </h1>

            <p className="text-lg md:text-xl text-white/60 mb-12 max-w-3xl mx-auto leading-relaxed">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-y-4 gap-x-8 text-white/50 text-sm font-medium">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                <span>{post.author_name || 'Sarah Johnson'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{new Date(post.published_at || post.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>{Math.ceil((post.content?.length || 0) / 1000) + 2} min read</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-20 md:py-28">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="prose prose-slate prose-lg max-w-none 
                         prose-headings:text-header prose-headings:font-display prose-headings:font-bold
                         prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-8
                         prose-strong:text-header prose-strong:font-bold
                         prose-img:rounded-[2.5rem] prose-img:shadow-2xl prose-img:mt-12
                         prose-li:text-slate-600 prose-ul:my-8"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags & Actions */}
            <div className="mt-20 pt-10 border-t border-slate-100">
              <div className="flex items-center gap-3 mb-8">
                <Tag className="w-5 h-5 text-primary" />
                <span className="text-header font-bold text-sm">Tags:</span>
                <div className="flex flex-wrap gap-2">
                  {['Laundry Tips', 'Clothing Care', 'Washing Machine', 'Fabric Care'].map(tag => (
                    <span key={tag} className="px-4 py-1.5 bg-slate-50 text-slate-500 rounded-full text-[11px] font-bold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <BlogInteractions
                blogId={post.id}
                initialLikes={post.likes_count || 0}
                initialComments={post.comments || []}
                userLikedInitially={post.is_liked || false}
              />
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-24">
                <h2 className="text-3xl font-display font-bold text-header mb-12">Related Posts</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {relatedPosts.map((rPost) => (
                    <Link
                      key={rPost.id}
                      href={`/blog/${rPost.slug}`}
                      className="group block"
                    >
                      <div className="relative h-48 rounded-3xl overflow-hidden mb-6 border border-slate-100 shadow-sm transition-all duration-300 group-hover:shadow-xl">
                        {rPost.image_url ? (
                          <img src={rPost.image_url} alt={rPost.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        ) : (
                          <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center transition-transform duration-500 group-hover:scale-110">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                              <span className="text-primary font-display font-bold text-2xl">
                                Speedy
                              </span>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Laundry</span>
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl font-display font-bold text-header mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                        {rPost.title}
                      </h3>
                      <div className="flex items-center gap-2 text-primary font-bold text-sm">
                        <span>Read More</span>
                        <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom CTA Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-24 p-8 md:p-12 bg-primary rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl shadow-primary/20"
            >
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                <div className="max-w-md">
                  <h3 className="text-2xl md:text-3xl font-display font-bold mb-4 leading-tight">
                    Professional Care for Your Clothes
                  </h3>
                  <p className="text-white/80 font-medium">
                    Experience the ultimate convenience with our 24/48h service.
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="bg-white text-primary px-10 py-5 rounded-full font-bold text-lg hover:scale-105 transition-all shadow-xl"
                >
                  Book Your Pickup
                </Link>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>
    </article>
  );
};

export default BlogPost;
