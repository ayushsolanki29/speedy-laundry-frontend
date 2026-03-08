'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  Truck,
  Calendar,
  Building2
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import Script from "next/script";

const contactMethods = [
  {
    icon: Phone,
    title: "Call Us",
    value: "01494 445291",
    href: "tel:01494445291",
    desc: "Speak directly with our team",
    bgImage: "/assets/img-grid/IMG_9082.jpg"
  },
  {
    icon: Mail,
    title: "Email Us",
    value: "info@speedylaundry.co.uk",
    href: "mailto:info@speedylaundry.co.uk",
    desc: "We reply within 24 hours",
    bgImage: "/assets/img-grid/IMG_9084.jpg"
  },
];

const openingHours = [
  { day: "Monday – Thursday", hours: "6:00 AM – 3:00 PM" },
  { day: "Friday", hours: "6:00 AM – 2:00 PM" },
  { day: "Saturday & Sunday", hours: "Closed" },
];

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LaundryService",
    "name": "Speedy Laundry",
    "image": "https://speedylaundry.co.uk/assets/logo.svg",
    "telephone": "01494 445291",
    "email": "info@speedylaundry.co.uk",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Abbey House, Lincoln Road, Cressex Business Park",
      "addressLocality": "High Wycombe",
      "addressRegion": "Buckinghamshire",
      "postalCode": "HP12 3RD",
      "addressCountry": "GB"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 51.626177,
      "longitude": -0.772390
    },
    "url": "https://speedylaundry.co.uk/contact",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday"],
        "opens": "06:00",
        "closes": "15:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Friday",
        "opens": "06:00",
        "closes": "14:00"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Script
        id="contact-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative h-[55vh] sm:h-[65vh] min-h-[450px] sm:min-h-[550px] flex items-center overflow-hidden pt-16 sm:pt-20">
          <div className="absolute inset-0">
            <Image
              src="/assets/contact/contact-bg.png"
              alt="Professional laundry service"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/95 via-foreground/80 to-transparent" />
          </div>

          <div className="container relative z-10 px-4 sm:px-6 mx-auto">
            <motion.div
              className="max-w-3xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-primary/20">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-white font-medium text-xs sm:text-sm">Ready to Care for Your Garments</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight">
                Book Your <br />
                <span className="text-primary italic">Pickup.</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-white/70 mb-8 max-w-xl">
                Schedule a collection or get in touch with our friendly team. We treat every garment with the care it deserves.
              </p>

              <div className="flex flex-wrap gap-4 sm:gap-8">
                {[
                  { icon: Truck, text: "Free Collections" },
                  { icon: CheckCircle, text: "Quality Certified" },
                  { icon: Phone, text: "Live Assistance" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-white/90 bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
                    <item.icon className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-[10px] sm:text-xs uppercase tracking-wider">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Form and Info Section */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">

              {/* Form Column */}
              <motion.div
                className="lg:col-span-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div id="contact-form" className="bg-white rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl shadow-black/5 border border-border/50 mb-8">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-6 lg:w-7 h-6 lg:h-7 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl lg:text-3xl font-display font-bold text-foreground">Schedule a Pickup</h2>
                      <p className="text-muted-foreground text-sm lg:text-base">Free collection & delivery service</p>
                    </div>
                  </div>

                  <ContactForm />
                </div>

                {/* Team Quote (Now below Form) */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-primary/5 rounded-[2.5rem] p-8 sm:p-12 border border-primary/10 relative overflow-hidden group shadow-sm hover:shadow-md transition-all"
                >
                  <div className="relative z-10">
                    <p className="text-foreground italic text-xl sm:text-2xl leading-relaxed mb-6">
                      &ldquo;Great service starts with a simple conversation. We treat every garment with the precision and care it deserves.&rdquo;
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="h-px w-12 bg-primary" />
                      <span className="font-script text-primary text-3xl sm:text-4xl">The Speedy Laundry Team</span>
                    </div>
                  </div>
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -tr-10 -te-10 group-hover:bg-primary/10 transition-all duration-700" />
                  <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
                </motion.div>
              </motion.div>

              {/* Info Column */}
              <motion.div
                className="lg:col-span-2 space-y-8"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                {/* Business Owner CTA Card */}
                <div className="bg-primary text-white rounded-[2rem] p-8 shadow-xl shadow-primary/20 relative overflow-hidden group border border-primary/20">
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-display font-bold">Business Owner?</h3>
                    </div>
                    <p className="text-white/80 text-sm mb-8 leading-relaxed">
                      We provide specialized commercial laundry services for hotels, restaurants, and schools with dedicated account management.
                    </p>
                    <div className="flex flex-row gap-3">
                      <Link
                        href="/business#quote"
                        className="flex-1 inline-flex items-center gap-2 bg-white text-primary font-bold px-4 py-4 rounded-2xl hover:bg-white/90 active:scale-95 transition-all justify-center shadow-lg text-sm"
                      >
                        <span>Inquire</span>
                        <CheckCircle className="w-4 h-4 shrink-0" />
                      </Link>
                      <Link
                        href="/business"
                        className="flex-1 inline-flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold px-4 py-4 rounded-2xl hover:bg-white/20 active:scale-95 transition-all text-sm"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 -tr-4 -te-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />
                  <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-black/10 rounded-full blur-2xl" />
                </div>

                <div className="grid gap-4">
                  {contactMethods.map((method, index) => (
                    <a
                      key={index}
                      href={method.href}
                      className="relative overflow-hidden flex flex-col p-6 rounded-[2rem] border border-border group shadow-sm hover:shadow-xl transition-all duration-500"
                    >
                      {/* Background Image & Overlay */}
                      <div className="absolute inset-0 z-0">
                        <Image
                          src={method.bgImage}
                          alt={method.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/60 group-hover:bg-primary/80 transition-colors duration-500" />
                      </div>

                      <div className="relative z-10 flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
                          <method.icon className="w-6 h-6 text-white drop-shadow-md" />
                        </div>
                        <div>
                          <div className="font-bold text-white/90 text-sm uppercase tracking-widest mb-1">{method.title}</div>
                          <div className="text-white font-display font-bold text-xl drop-shadow-md">{method.value}</div>
                          <div className="text-white/70 text-xs mt-1">{method.desc}</div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>

                <div className="bg-white rounded-2xl p-6 border border-border">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-2">Visit Us</h3>
                      <address className="text-muted-foreground not-italic leading-relaxed">
                        Speedy Laundry<br />
                        Abbey House, Lincoln Road<br />
                        Cressex Business Park<br />
                        High Wycombe<br />
                        Buckinghamshire<br />
                        <span className="font-medium text-foreground">HP12 3RD</span>
                      </address>
                    </div>
                  </div>
                </div>

                {/* Opening Hours (Now alone in sidebar bottom) */}
                <div className="bg-foreground rounded-[2rem] p-8 shadow-xl shadow-black/5">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/5">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-white uppercase tracking-tight">Opening Hours</h3>
                  </div>
                  <div className="space-y-4">
                    {openingHours.map((item, index) => (
                      <div
                        key={index}
                        className={`flex justify-between items-center py-2 ${index < openingHours.length - 1 ? 'border-b border-white/10' : ''}`}
                      >
                        <span className="text-white/70 text-sm font-medium">{item.day}</span>
                        <span className={`font-bold text-sm ${item.hours === 'Closed' ? 'text-white/40' : 'text-white'}`}>
                          {item.hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-12 lg:py-16 bg-muted">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-display font-bold text-foreground mb-2">Find Us</h2>
              <p className="text-muted-foreground">Cressex Business Park, High Wycombe</p>
            </motion.div>

            <motion.div
              className="rounded-3xl overflow-hidden shadow-lg h-[400px] bg-white border border-border"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1611.06198871445!2d-0.7723896769905402!3d51.62617703354082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48768a6e2e0602d9%3A0x9e4b79a6c2514294!2sSpeedy%20Laundry!5e1!3m2!1sen!2suk!4v1770908455969!5m2!1sen!2suk"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Speedy Laundry Location"
              />
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}