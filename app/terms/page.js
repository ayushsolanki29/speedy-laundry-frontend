'use client';

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText, Scale, AlertCircle, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function TermsAndConditions() {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main>
                {/* Hero Section */}
                <section className="relative h-[40vh] min-h-[400px] flex items-center overflow-hidden pt-20">
                    <div className="absolute inset-0">
                        <Image
                            src="/assets/img-grid/IMG_9087.jpg"
                            alt="Terms and Conditions"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-transparent" />
                    </div>

                    <div className="container relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                                <Scale className="w-4 h-4 text-primary" />
                                <span className="text-white/90 text-sm font-medium">Service Agreement</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">
                                Terms & <span className="text-primary">Conditions</span>
                            </h1>
                            <p className="text-xl text-white/80 max-w-2xl">
                                Please read these terms carefully before using our laundry and dry cleaning services.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-20 bg-background">
                    <div className="container max-w-4xl">
                        <div className="prose prose-lg prose-slate max-w-none">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="space-y-12"
                            >
                                <div>
                                    <h2 className="text-3xl font-display font-bold text-foreground mb-6 flex items-center gap-3">
                                        <CheckCircle2 className="text-primary w-8 h-8" />
                                        Acceptance of Terms
                                    </h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        By accessing or using Speedy Laundry's services, you agree to be bound by these Terms and Conditions. Our services include but are not limited to wash, dry, fold, ironing, and dry cleaning.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-3xl font-display font-bold text-foreground mb-6 flex items-center gap-3">
                                        <FileText className="text-primary w-8 h-8" />
                                        Service Guidelines
                                    </h2>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="bg-secondary/30 p-6 rounded-2xl border border-primary/5">
                                            <h3 className="text-xl font-bold text-foreground mb-3">Pick-up and Delivery</h3>
                                            <p className="text-muted-foreground text-sm">
                                                Please ensure someone is available at the scheduled time or provide safe access to the items.
                                            </p>
                                        </div>
                                        <div className="bg-secondary/30 p-6 rounded-2xl border border-primary/5">
                                            <h3 className="text-xl font-bold text-foreground mb-3">Garment Care</h3>
                                            <p className="text-muted-foreground text-sm">
                                                Check all pockets before pick-up. We are not responsible for items left in garments.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-3xl font-display font-bold text-foreground mb-6 flex items-center gap-3">
                                        <AlertCircle className="text-primary w-8 h-8" />
                                        Liability and Claims
                                    </h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        While we take the utmost care with every garment, our liability for any lost or damaged item is limited to 10 times the cost of cleaning that specific item. All claims must be reported within 24 hours of delivery.
                                    </p>
                                </div>

                                <div className="bg-foreground text-white rounded-[2rem] p-8 md:p-12 relative overflow-hidden group shadow-xl">
                                    <div className="absolute inset-0 z-0">
                                        <Image
                                          src="/assets/img-grid/20208 - Vodafone - WashCo - B-roll Cutdown.00_28_15_02.Still002.jpg"
                                          alt="Support team"
                                          fill
                                          className="object-cover opacity-30 mix-blend-overlay group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-tr from-black/80 to-transparent z-10" />
                                    </div>
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/30 transition-all duration-500" />
                                    
                                    <div className="relative z-20">
                                      <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 drop-shadow-md">Have <span className="text-primary italic">questions?</span></h2>
                                      <p className="text-white/80 text-lg mb-8 max-w-lg leading-relaxed">
                                          If anything in our terms is unclear, we're here to help you understand our commitment to your garments.
                                      </p>
                                      <a
                                          href="/contact"
                                          className="inline-flex items-center gap-3 bg-white text-foreground font-bold px-8 py-4 rounded-full hover:bg-white/90 hover:scale-105 transition-all shadow-xl group/btn"
                                      >
                                          Contact Support
                                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover/btn:bg-primary/20 transition-colors">
                                            <AlertCircle className="w-4 h-4 text-primary" />
                                          </div>
                                      </a>
                                    </div>
                                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/20 rounded-full blur-3xl z-0" />
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
