'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Clock, User, ArrowRight, Calendar, Loader2, SearchX } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const BlogPosts = ({ searchQuery }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('c') || "";
  
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const limit = 9;

  const fetchBlogs = useCallback(async (currentOffset, query = "", isAppend = false) => {
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/blogs.php?limit=${limit}&offset=${currentOffset}`;
      if (query) url += `&search=${encodeURIComponent(query)}`;
      if (categoryFilter) url += `&category=${encodeURIComponent(categoryFilter)}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'success') {
        const fetchedBlogs = data.data.blogs;
        if (isAppend) {
          setBlogs(prev => [...prev, ...fetchedBlogs]);
        } else {
          setBlogs(fetchedBlogs);
        }
        setHasMore(fetchedBlogs.length === limit);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  }, [categoryFilter]);

  // Initial load / search load
  useEffect(() => {
    setIsLoading(true);
    setOffset(0);
    fetchBlogs(0, searchQuery, false);
  }, [searchQuery, categoryFilter, fetchBlogs]);

  // Infinite Scroll Observer
  const lastElementRef = useCallback(node => {
    if (isLoading || isFetchingMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setIsFetchingMore(true);
        const nextOffset = offset + limit;
        setOffset(nextOffset);
        fetchBlogs(nextOffset, searchQuery, true);
      }
    });

    if (node) observer.current.observe(node);
  }, [isLoading, isFetchingMore, hasMore, offset, searchQuery, fetchBlogs]);

  if (isLoading && offset === 0) {
    return (
      <div className="py-32 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
        <p className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">Filtering Wisdom...</p>
      </div>
    );
  }

  const featuredBlog = blogs.length > 0 && !searchQuery ? blogs[0] : null;
  const gridBlogs = featuredBlog ? blogs.slice(1) : blogs;

  return (
    <section className="py-24 bg-white min-h-screen">
      <div className="container">
        {/* Search/Category Results Header */}
        {(searchQuery || categoryFilter) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-display font-bold text-header">
              {blogs.length > 0 
                ? `Found ${blogs.length} articles ${searchQuery ? `for "${searchQuery}"` : ''}${categoryFilter ? `${searchQuery ? ' in ' : 'for '}"${categoryFilter}"` : ''}`
                : `No results ${searchQuery ? `for "${searchQuery}"` : ''}${categoryFilter ? `${searchQuery ? ' in ' : 'for '}"${categoryFilter}"` : ''}`
              }
            </h2>
            <div className="h-1 w-20 bg-primary mt-4 rounded-full" />
          </motion.div>
        )}

        {/* Featured Blog - Horizontal Design */}
        {featuredBlog && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div
              className="bg-slate-50/50 rounded-[2.5rem] overflow-hidden border border-slate-100 group cursor-pointer lg:flex h-auto lg:h-[450px]"
              onClick={() => router.push(`/blog/${featuredBlog.slug}`)}
            >
              {/* Featured Image */}
              <div className="lg:w-1/2 relative h-64 lg:h-full overflow-hidden">
                {featuredBlog.image_url ? (
                  <img
                    src={featuredBlog.image_url}
                    alt={featuredBlog.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-slate-100 flex items-center justify-center text-slate-300">
                    <Calendar className="w-20 h-20" />
                  </div>
                )}
                <div className="absolute top-6 left-6 flex gap-2">
                  {(featuredBlog.category || 'Featured').split(',').map((cat, index) => (
                    <Link 
                      key={index}
                      href={`/blog?c=${encodeURIComponent(cat.trim())}`}
                      onClick={(e) => e.stopPropagation()}
                      className="px-5 py-2 bg-primary text-white hover:bg-white hover:text-primary transition-colors duration-300 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl"
                    >
                      {cat.trim()}
                    </Link>
                  ))}
                  <span className="px-5 py-2 bg-white/90 backdrop-blur-md text-header rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                    Must Read
                  </span>
                </div>
              </div>

              {/* Featured Content */}
              <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
                <div className="flex items-center gap-6 mb-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> {Math.ceil((featuredBlog.content?.length || 0) / 1000) + 2} min read</span>
                  <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> {new Date(featuredBlog.published_at || featuredBlog.created_at).toLocaleDateString()}</span>
                </div>

                <h3 className="text-3xl lg:text-5xl font-display font-bold text-header mb-6 leading-tight group-hover:text-primary transition-colors">
                  {featuredBlog.title}
                </h3>

                <p className="text-slate-500 text-lg mb-10 line-clamp-3 leading-relaxed">
                  {featuredBlog.excerpt}
                </p>

                <div className="flex items-center justify-between items-center mt-auto">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-primary/10">
                      <img src={`https://ui-avatars.com/api/?name=${featuredBlog.author_name || 'Admin'}&background=00AEEF&color=fff`} alt="" />
                    </div>
                    <span className="text-sm font-bold text-header">{featuredBlog.author_name || 'Admin'}</span>
                  </div>
                  <button className="bg-primary text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                    Read Full Article
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          <AnimatePresence>
            {gridBlogs.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: index % 3 * 0.1 }}
                className="flex flex-col group cursor-pointer"
                onClick={() => router.push(`/blog/${post.slug}`)}
              >
                {/* Card Image */}
                <div className="relative h-64 md:h-72 rounded-[2rem] overflow-hidden mb-6 border border-slate-100 shadow-sm group-hover:shadow-xl transition-all duration-500">
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-slate-50 flex items-center justify-center text-slate-200">
                      <Calendar className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                  <div className="flex flex-wrap gap-2">
                    {(post.category || 'Insights').split(',').map((cat, index) => (
                      <Link 
                        key={index}
                        href={`/blog?c=${encodeURIComponent(cat.trim())}`}
                        onClick={(e) => e.stopPropagation()}
                        className="px-4 py-1.5 bg-white/90 backdrop-blur-sm text-primary hover:bg-primary hover:text-white transition-colors duration-300 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg"
                      >
                        {cat.trim()}
                      </Link>
                    ))}
                  </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="px-2">
                  <div className="flex items-center gap-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary" /> {Math.ceil((post.content?.length || 0) / 1000) + 1} min read</span>
                    <span>•</span>
                    <span>{new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
                  </div>

                  <h3 className="text-xl font-display font-bold text-header mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                    {post.title}
                  </h3>

                  <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-100">
                        <img src={`https://ui-avatars.com/api/?name=${post.author_name || 'Admin'}&background=0F172A&color=fff`} alt="" />
                      </div>
                      <span className="text-xs font-bold text-header">{post.author_name || 'Admin'}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-primary transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {blogs.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center"
          >
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <SearchX className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-display font-bold text-header mb-2">No Laundry Secrets Found</h3>
            <p className="text-slate-500">Try adjusting your search terms or exploring a different category.</p>
          </motion.div>
        )}

        {/* Sentinel for Infinite Scroll */}
        <div ref={lastElementRef} className="h-10 mt-10" />

        {/* Loading More State */}
        {isFetchingMore && (
          <div className="py-10 flex justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogPosts;
