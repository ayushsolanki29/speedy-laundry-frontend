'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowRight,
  Building2,
  Hotel,
  UtensilsCrossed,
  Dumbbell,
  Heart,
  Scissors,
  Stethoscope,
  Check,
  Phone,
  Clock,
  Truck,
  Leaf,
  Award,
  Shield,
  MapPin,
  Loader2
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrustedPartners from "@/components/TrustedPartners";
import { useState } from 'react';
import { toast } from 'sonner';
import Script from "next/script";

import Link from "next/link";

const industries = [
  { icon: Hotel, name: "Hotels & B&Bs" },
  { icon: UtensilsCrossed, name: "Restaurants" },
  { icon: Dumbbell, name: "Gyms & Spas" },
  { icon: Heart, name: "Care Homes" },
  { icon: Scissors, name: "Salons" },
  { icon: Stethoscope, name: "Medical" },
  { icon: Building2, name: "Offices" },
];

export default function BusinessPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Commercial Laundry Services",
    "description": "Premium B2B laundry solutions for hotels, restaurants, gyms, and healthcare across Buckinghamshire.",
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
      "High Wycombe", "Marlow", "Beaconsfield", "Maidenhead", "Henley-on-Thames", "Buckinghamshire"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Commercial Services",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Hotel Linen Service" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Restaurant Laundry" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Gym & Spa Towel Service" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Workwear & Uniform Cleaning" } }
      ]
    }
  };

  const [formData, setFormData] = useState({
    business_name: '',
    full_name: '',
    phone: '',
    email: '',
    address: '',
    industry: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (formData.phone.length > 30) {
      toast.error('Phone number is too long (max 30 characters)');
      return;
    }
    if (formData.address.length > 255) {
      toast.error('Address is too long (max 255 characters)');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/business-enquiry.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.status === 'success') {
        toast.success(data.message);
        setFormData({
          business_name: '',
          full_name: '',
          phone: '',
          email: '',
          address: '',
          industry: '',
          message: ''
        });
      } else {
        toast.error(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to connect to the server. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Script
        id="business-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main>
        {/* Hero - Mobile responsive text alignment */}
        <section className="relative h-[90vh] min-h-[600px] flex items-center overflow-hidden pt-20">
          <div className="absolute inset-0">
            <Image
              src="/assets/business/business-hero.png"
              alt="Commercial laundry service"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-transparent" />
          </div>

          <div className="container relative z-10 px-4 sm:px-6">
            <motion.div
              className="max-w-2xl text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-4 lg:mb-6 leading-[1.1]">
                Laundry Solutions<br />
                <span className="text-primary">for Business</span>
              </h1>

              <p className="text-lg sm:text-xl text-white/80 mb-6 lg:mb-8 max-w-lg">
                Reliable, high-quality commercial laundry trusted by hotels, restaurants, and businesses across Buckinghamshire.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/contact?type=business#contact-form"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:brightness-110 transition-all shadow-lg text-base sm:text-lg"
                >
                  Get a Quote
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
                <a
                  href="tel:01494445291"
                  className="inline-flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-white/30 transition-all text-base sm:text-lg"
                >
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                  01494 445291
                </a>
              </div>
            </motion.div>

            {/* Small Trust Indicators - Mobile responsive */}
            <motion.div
              className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 lg:gap-12 mt-8 lg:mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {[
                { icon: Truck, text: "Free Collection" },
                { icon: Clock, text: "24-48hr Turnaround" },
                { icon: Leaf, text: "Eco-Friendly" },
                { icon: Shield, text: "Quality Guaranteed" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-white/80 text-sm sm:text-base">
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  <span className="font-medium whitespace-nowrap">{item.text}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <TrustedPartners />

        {/* Industries - Mobile responsive layout */}
        <section className="py-10 sm:py-14 md:py-16 bg-background overflow-hidden">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-4"
            >
              <p className="text-primary font-semibold uppercase tracking-[0.2em] text-xs mb-4">Our Clients</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold">
                What We <span className="font-script text-primary">Serve</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="overflow-hidden"
            >
              <div className="bg-card rounded-[2rem] sm:rounded-[2.5rem] py-8 sm:py-10 md:py-12 relative overflow-hidden group">
                {/* Gradient Fades for edges */}
                <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 bg-gradient-to-r from-card to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 bg-gradient-to-l from-card to-transparent z-10 pointer-events-none" />

                <div className="flex overflow-hidden">
                  <motion.div
                    className="flex gap-4 sm:gap-6 whitespace-nowrap px-4 sm:px-6"
                    animate={{
                      x: ["0%", "-50%"]
                    }}
                    transition={{
                      duration: 30,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    {/* Double items for perfectly seamless loop */}
                    {[...industries, ...industries].map((industry, idx) => (
                      <Link
                        href={`/contact?type=business&industry=${encodeURIComponent(industry.name)}#contact-form`}
                        key={idx}
                        className="flex items-center gap-2 sm:gap-4 bg-secondary/30 backdrop-blur-sm hover:bg-primary transition-all duration-300 px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl group/item cursor-pointer"
                      >
                        <div className="text-primary group-hover/item:text-white transition-colors">
                          <industry.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" strokeWidth={2.5} />
                        </div>
                        <span className="text-sm sm:text-base md:text-lg font-medium text-foreground group-hover/item:text-white transition-colors">
                          {industry.name}
                        </span>
                      </Link>
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* About Section - Mobile center aligned */}
        <section className="py-12 lg:py-32">
          <div className="container">
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-center lg:text-left"
              >
                <span className="text-primary font-semibold text-xs sm:text-sm tracking-widest uppercase mb-3 lg:mb-4 block">
                  About Us
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4 lg:mb-6 leading-tight">
                  30+ Years of<br />
                  Commercial Excellence
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground mb-6 lg:mb-8 leading-relaxed">
                  What started as a small family business has grown into Buckinghamshire&apos;s trusted commercial laundry partner. We understand the demands of running a business – that&apos;s why we&apos;ve built our service around reliability, quality, and convenience.
                </p>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  From boutique hotels to busy restaurants, we handle thousands of items weekly with the same care and attention we gave our very first client.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 gap-4 sm:gap-6 w-full"
              >
                {[
                  { value: "500+", label: "Business Clients" },
                  { value: "30+", label: "Years Experience" },
                  { value: "50k+", label: "Items Weekly" },
                  { value: "100%", label: "Satisfaction Rate" },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="bg-muted rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center"
                  >
                    <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold text-primary mb-1">
                      {stat.value}
                    </div>
                    <div className="text-muted-foreground text-xs sm:text-sm">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Certifications - Mobile vertical layout */}
        <section className="py-8 sm:py-12 bg-muted border-y border-border">
          <div className="container">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-12 xl:gap-20">
              {[
                { icon: Award, title: "Miele Professional", subtitle: "Approved Partner" },
                { icon: Leaf, title: "WetCare®", subtitle: "Certified Specialist" },
                { icon: Shield, title: "National Laundry Group", subtitle: "Member" },
              ].map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto text-center"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <cert.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="sm:text-left">
                    <div className="font-bold text-foreground text-sm sm:text-base">{cert.title}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">{cert.subtitle}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What We Handle - Content centered on mobile */}
        {/* What We Handle - Content centered on mobile */}
        <section className="py-12 lg:py-32">
          <div className="container">
            <motion.div
              className="text-center mb-10 lg:mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
                What We Handle
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 max-w-5xl mx-auto">
              {[
                {
                  title: "Linens & Bedding",
                  items: ["Sheets & pillowcases", "Duvet covers", "Mattress protectors", "Blankets & throws"]
                },
                {
                  title: "Towels & Textiles",
                  items: ["Bath & hand towels", "Face cloths", "Robes & slippers", "Spa & gym towels"]
                },
                {
                  title: "Uniforms & Workwear",
                  items: ["Chef whites & aprons", "Staff uniforms", "Medical scrubs", "High-vis & PPE"]
                },
              ].map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 border border-border text-center h-full flex flex-col items-center shadow-sm"
                >
                  <h3 className="text-[12px] leading-tight sm:text-lg lg:text-xl font-bold text-foreground mb-3 sm:mb-4">{category.title}</h3>
                  <ul className="space-y-2 flex flex-col items-center">
                    {category.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5 sm:gap-2 text-muted-foreground text-[10px] sm:text-sm lg:text-base text-center">
                        <Check className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-primary shrink-0 mt-0.5" />
                        <span className="flex-1 text-center">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works - Mobile horizontal scroll */}
        <section className="py-12 lg:py-32 bg-secondary/30">
          <div className="container">
            <motion.div
              className="text-center mb-10 lg:mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground">
                How It Works
              </h2>
            </motion.div>

            {/* Mobile: Horizontal scroll, Desktop: Grid */}
            <div className="flex md:grid md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto overflow-x-auto pb-4 md:pb-0">
              {[
                { num: "01", title: "Contact Us", desc: "Tell us your needs" },
                { num: "02", title: "Get Quote", desc: "Custom pricing" },
                { num: "03", title: "Schedule", desc: "Set pickup times" },
                { num: "04", title: "Relax", desc: "We handle the rest" },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center min-w-[200px] md:min-w-0"
                >
                  <div className="text-4xl lg:text-5xl font-display font-bold text-primary/20 mb-2 lg:mb-3">
                    {step.num}
                  </div>
                  <h3 className="text-base lg:text-lg font-bold text-foreground mb-1">{step.title}</h3>
                  <p className="text-muted-foreground text-xs lg:text-sm">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Quote Form - Mobile responsive */}
        <section id="quote" className="py-12 lg:py-32 bg-foreground">
          <div className="container px-4 sm:px-6">
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-center lg:text-left"
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4 lg:mb-6">
                  Get Your<br />
                  <span className="text-primary">Free Quote</span>
                </h2>
                <p className="text-white/70 text-base sm:text-lg mb-8 lg:mb-10">
                  Tell us about your business and we&apos;ll create a tailored laundry solution that fits your needs and budget.
                </p>

                {/* List alignment - mobile centered */}
                <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                  {[
                    "No obligation quote",
                    "Custom pricing for your volume",
                    "Flexible pickup schedules",
                    "Dedicated account manager",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 justify-center lg:justify-start">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <span className="text-white/80 text-sm sm:text-base text-left">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 lg:mt-10 pt-6 lg:pt-10 border-t border-white/10 text-center lg:text-left">
                  <p className="text-white/60 mb-2 text-sm sm:text-base">Prefer to call?</p>
                  <a
                    href="tel:01494445291"
                    className="text-xl sm:text-2xl font-display font-bold text-white hover:text-primary transition-colors"
                  >
                    01494 445291
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="w-full"
              >
                <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-10 lg:p-12 border border-border relative z-10 w-full">
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <div>
                      <label htmlFor="business_name" className="block text-sm font-medium text-foreground mb-2">Business Name *</label>
                      <input
                        id="business_name"
                        type="text"
                        name="business_name"
                        value={formData.business_name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg lg:rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm sm:text-base"
                        placeholder="Your business name"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label htmlFor="full_name" className="block text-sm font-medium text-foreground mb-2">Contact Name *</label>
                        <input
                          id="full_name"
                          type="text"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-lg lg:rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm sm:text-base"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">Phone *</label>
                        <input
                          id="phone"
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-lg lg:rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm sm:text-base"
                          placeholder="Phone number"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">Email *</label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg lg:rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm sm:text-base"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-foreground mb-2">Address *</label>
                      <input
                        id="address"
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg lg:rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm sm:text-base"
                        placeholder="Business address"
                      />
                    </div>
                    <div>
                      <label htmlFor="industry" className="block text-sm font-medium text-foreground mb-2">Industry</label>
                      <select
                        id="industry"
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg lg:rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm sm:text-base"
                      >
                        <option value="">Select your industry</option>
                        <option value="hotel">Hotel / B&B</option>
                        <option value="restaurant">Restaurant / Cafe</option>
                        <option value="gym">Gym / Spa</option>
                        <option value="care">Care Home</option>
                        <option value="salon">Salon / Barber</option>
                        <option value="medical">Medical / Dental</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">Tell us about your needs</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg lg:rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none text-sm sm:text-base"
                        rows={3}
                        placeholder="Approximate volumes, types of items, preferred schedule..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary text-white font-bold py-3 sm:py-4 rounded-full hover:brightness-110 transition-all text-base sm:text-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Request Quote'
                      )}
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
