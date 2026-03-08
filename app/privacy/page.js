'use client';

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Lock, Eye, FileText } from "lucide-react";
import Image from "next/image";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main>
                {/* Hero Section */}
                <section className="relative h-[40vh] min-h-[400px] flex items-center overflow-hidden pt-20">
                    <div className="absolute inset-0">
                        <Image
                            src="/assets/img-grid/IMG_9086.jpg"
                            alt="Privacy Policy"
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
                                <Shield className="w-4 h-4 text-primary" />
                                <span className="text-white/90 text-sm font-medium">Security & Trust</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">
                                Privacy <span className="text-primary">Policy</span>
                            </h1>
                            <p className="text-xl text-white/80 max-w-2xl">
                                Your privacy is important to us. Learn how we handle and protect your data.
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
                                        <Eye className="text-primary w-8 h-8" />
                                        Introduction
                                    </h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        At Speedy Laundry, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our services.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-3xl font-display font-bold text-foreground mb-6 flex items-center gap-3">
                                        <FileText className="text-primary w-8 h-8" />
                                        Information We Collect
                                    </h2>
                                    <p className="text-muted-foreground leading-relaxed mb-4">
                                        We collect information that is necessary to provide our laundry services effectively:
                                    </p>
                                    <ul className="grid md:grid-cols-2 gap-4 list-none p-0">
                                        {[
                                            "Contact details (Name, Email, Phone)",
                                            "Service address for pickup and delivery",
                                            "Order history and preferences",
                                            "Payment information (securely processed)",
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 bg-secondary/50 p-4 rounded-xl border border-primary/10">
                                                <div className="w-2 h-2 bg-primary rounded-full" />
                                                <span className="text-foreground font-medium">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h2 className="text-3xl font-display font-bold text-foreground mb-6 flex items-center gap-3">
                                        <Lock className="text-primary w-8 h-8" />
                                        How We Use Your Data
                                    </h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Your information is used primarily to:
                                    </p>
                                    <ul className="space-y-3 mt-4 text-muted-foreground">
                                        <li>• Process and manage your laundry orders</li>
                                        <li>• Coordinate pickup and delivery services</li>
                                        <li>• Communicate important updates regarding your orders</li>
                                        <li>• Improve our services based on your feedback</li>
                                    </ul>
                                </div>

                                <div className="bg-foreground text-white rounded-[2rem] p-8 md:p-12 relative overflow-hidden group shadow-xl">
                                    <div className="absolute inset-0 z-0">
                                        <Image
                                          src="/assets/img-grid/259949512_4615477651842803_5580518647924254211_n.jpg"
                                          alt="Privacy team"
                                          fill
                                          className="object-cover opacity-30 mix-blend-overlay group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-tr from-black/80 to-transparent z-10" />
                                    </div>
                                    <div className="relative z-20">
                                      <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 drop-shadow-md">Contact Our <span className="text-primary italic">Privacy Team</span></h2>
                                      <p className="text-white/80 text-lg mb-8 max-w-lg leading-relaxed">
                                          If you have any questions or concerns about our privacy practices or wish to request data modifications, please reach out to us.
                                      </p>
                                      <a
                                          href="mailto:info@speedylaundry.co.uk"
                                          className="inline-flex items-center gap-3 bg-white text-foreground font-bold px-8 py-4 rounded-full hover:bg-white/90 hover:scale-105 transition-all shadow-xl group/btn"
                                      >
                                          Contact privacy office
                                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover/btn:bg-primary/20 transition-colors">
                                            <Shield className="w-4 h-4 text-primary" />
                                          </div>
                                      </a>
                                    </div>
                                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
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
