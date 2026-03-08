'use client';

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Check, 
  Clock, 
  Truck, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Phone
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { servicesData } from "@/data/services";
import Script from "next/script";

export default function ServiceDetailPage() {
  const params = useParams();
  const serviceId = params.id;
  
  const service = servicesData.find(s => s.id === serviceId);

  if (!service) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-4xl font-display font-bold mb-4">Service Not Found</h1>
          <Link href="/services" className="text-primary hover:underline font-bold">Return to Services</Link>
        </div>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.description,
    "provider": {
      "@type": "LaundryService",
      "name": "Speedy Laundry",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Abbey House, Lincoln Road, Cressex Business Park",
        "addressLocality": "High Wycombe",
        "addressRegion": "Buckinghamshire",
        "postalCode": "HP12 3RD",
        "addressCountry": "GB"
      }
    },
    "areaServed": [
      "High Wycombe", "Henley-on-Thames", "Beaconsfield", "Maidenhead", "Marlow"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Laundry Services",
      "itemListElement": service.items.map(item => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": item
        }
      }))
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Script
        id="service-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      
      <main className="flex-grow">
        {/* Top Image Banner - Blurred Hero */}
        <section className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover blur-[5px] md:blur-[20px] scale-105 opacity-60"
            priority
          />
          {/* Subtle gradient overlay to blend into the content and ensure navbar visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background" />
        </section>

        {/* Hero Section - Balanced Split */}
        <section className="py-20 lg:py-32 -mt-40 md:-mt-64 relative z-10 overflow-hidden">
          <div className="container px-6">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
              {/* Left Side: Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Link 
                  href="/services" 
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 text-xs uppercase tracking-[0.2em] font-bold"
                >
                  <ArrowLeft size={16} />
                  Back to Services
                </Link>
                
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-tight mb-8 text-header">
                  {service.title}<span className="text-primary">.</span>
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl">
                  {service.description}
                </p>

                <div className="flex flex-wrap gap-4 mb-10">
                  <Link 
                    href={`/contact?subject=${encodeURIComponent(service.title)}`}
                    className="group inline-flex items-center gap-3 bg-primary text-white font-bold px-10 py-5 rounded-full hover:scale-105 transition-all shadow-xl shadow-primary/25"
                  >
                    Book Pickup Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                  <a 
                    href="tel:01494445291"
                    className="inline-flex items-center gap-3 bg-white border border-border text-header font-bold px-10 py-5 rounded-full hover:bg-muted transition-all"
                  >
                    <Phone size={20} className="text-primary" />
                    Our Office
                  </a>
                </div>
                
                {/* Stats/Badges */}
                <div className="flex gap-8 border-t border-border pt-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">24h Turnaround</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                      <Truck className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Free Delivery</span>
                  </div>
                </div>
              </motion.div>

              {/* Right Side: Image with Frame */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden">
                  <Image 
                    src={service.image} 
                    alt={service.title} 
                    fill 
                    className="object-cover transition-transform duration-1000 hover:scale-110"
                  />
                </div>
                
                {/* Floating Satisfaction Badge */}
                <div className="absolute -bottom-6 -left-6 bg-white border border-border p-6 rounded-3xl shadow-xl backdrop-blur-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
                      <ShieldCheck size={24} className="text-white" />
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">Guaranteed</div>
                      <div className="text-lg font-display font-bold text-header">Premium Care</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Details Grid - Clean Theme */}
        <section className="py-24 bg-muted/30 border-y border-border">
          <div className="container px-6">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Features Card */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="p-10 rounded-[2.5rem] bg-white border border-border shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center mb-8">
                  <Sparkles size={28} className="text-primary" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-6 text-header">Key Features</h3>
                <ul className="space-y-4">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Items Card */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="p-10 rounded-[2.5rem] bg-white border border-border shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center mb-8">
                  <Check size={28} className="text-primary" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-6 text-header">What We Clean</h3>
                <div className="flex flex-wrap gap-2">
                  {service.items.map((item, i) => (
                    <span key={i} className="bg-muted px-4 py-2 rounded-full text-sm font-bold text-muted-foreground border border-border/50 uppercase tracking-wider text-[10px]">
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Detailed Breakdown */}
        <section className="py-24 lg:py-32">
          <div className="container px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-20">
                <span className="text-primary font-bold uppercase tracking-[0.3em] text-xs mb-4 block">Our Process</span>
                <h2 className="text-4xl lg:text-7xl font-display font-bold text-header">
                  The Details Matter<span className="text-primary">.</span>
                </h2>
              </div>
              <div className="grid gap-12">
                {service.details.map((detail, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative pl-12 border-l-2 border-primary/10 hover:border-primary transition-colors"
                  >
                    <div className="absolute top-0 left-[-2px] h-8 w-[2px] bg-primary shadow-[0_0_10px_rgba(0,149,218,0.5)]" />
                    <h4 className="text-2xl font-display font-bold text-header mb-4">{detail.title}</h4>
                    <p className="text-lg text-muted-foreground leading-relaxed font-light">{detail.content}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Action Bar - Themed */}
        <section className="py-20 bg-primary/5 border-t border-border">
          <div className="container px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-8 font-bold text-xs uppercase tracking-widest">
              <ShieldCheck size={14} />
              Satisfaction Guaranteed
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-10 text-header">Ready to experience {service.title}?</h2>
            <Link 
              href={`/contact?subject=${encodeURIComponent(service.title)}`}
              className="inline-flex items-center gap-3 bg-primary text-white font-bold px-12 py-5 rounded-full hover:scale-105 transition-all shadow-xl shadow-primary/20 text-lg"
            >
              Get Started Now
              <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
