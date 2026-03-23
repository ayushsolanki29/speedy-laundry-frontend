'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogHero from "@/components/blog/BlogHero";
import BlogPosts from "@/components/blog/BlogPosts";
import CTABanner from "@/components/CTABanner";

import { useState, Suspense } from "react";

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />
      <main>
        <BlogHero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <Suspense fallback={<div className="py-20 text-center">Loading articles...</div>}>
          <BlogPosts searchQuery={searchQuery} />
        </Suspense>
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
