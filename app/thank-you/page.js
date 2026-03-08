'use client';

import { motion } from "framer-motion";
import { CheckCircle, Home, Truck, MessageSquare, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Top Image Banner */}
        <section className="relative w-full h-[35vh] md:h-[45vh] overflow-hidden">
          <Image
            src="/thank-you-image.png"
            alt="Freshly folded laundry"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay to ensure text/navbar visibility and premium feel */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background" />

          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mb-6 mx-auto border border-white/20 shadow-2xl">
                <CheckCircle className="w-12 h-12 text-primary" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="pb-20 -mt-10 relative z-10">
          <div className="container px-4 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-4xl mx-auto bg-card rounded-[2.5rem] shadow-2xl shadow-black/5 border border-border/50 p-8 md:p-16 text-center"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-foreground">
                Request <span className="text-primary italic">Received!</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-2xl mx-auto">
                Thank you for contacting Speedy Laundry. We&apos;ve received your message and our team will be in touch with you shortly.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-16 max-w-lg mx-auto">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold py-4 px-8 rounded-2xl hover:brightness-110 transition-all shadow-lg shadow-primary/20"
                >
                  <Home className="w-5 h-5" />
                  Return Home
                </Link>

                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 bg-white text-foreground font-bold py-4 px-8 rounded-2xl border border-border hover:bg-muted transition-all"
                >
                  Explore Services
                </Link>
              </div>

              <div className="text-left border-t border-border pt-12">
                <h3 className="font-bold text-2xl text-foreground mb-8 text-center flex items-center justify-center gap-3">
                  <div className="h-px w-8 bg-primary" />
                  How it works now
                  <div className="h-px w-8 bg-primary" />
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { icon: Clock, title: "Review", desc: "Our specialists will review your specific requirements and service area." },
                    { icon: MessageSquare, title: "Response", desc: "We'll reach out via phone or email to discuss your needs and confirm details." },
                    { icon: Truck, title: "Service", desc: "Once confirmed, we'll arrange a professional pickup for your laundry." }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center text-center p-6 bg-muted/30 rounded-3xl border border-border/40 hover:bg-muted/50 transition-colors">
                      <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-sm">
                        <item.icon className="w-7 h-7 text-primary" />
                      </div>
                      <div className="font-bold text-foreground mb-2">{item.title}</div>
                      <div className="text-muted-foreground text-sm leading-relaxed">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
