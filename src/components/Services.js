'use client';

import { motion } from "framer-motion";
import { Sparkles, UserRound, Layers, Bed, Maximize2, Snowflake, Waves, Feather, Shirt, Utensils, ArrowRight } from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: (
      <svg className="w-full h-full" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 4L8 12v8c0 11.5 6.8 22.3 16 26 9.2-3.7 16-14.5 16-26v-8L24 4z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M16 24l6 6 12-12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Iron Only",
    description: "Professional steam pressing for wrinkle-free perfection",
    image: "/assets/our%20services/i-1.png",
    slug: "iron-only",
  },
  {
    icon: (
      <svg className="w-full h-full" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <path d="M18 24c0-3.3 2.7-6 6-6s6 2.7 6 6M15 30c2-3 5.3-5 9-5s7 2 9 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="24" cy="14" r="2" fill="currentColor" />
      </svg>
    ),
    title: "Wash + Iron",
    description: "Complete wash and iron – fresh, clean, perfectly pressed",
    image: "/assets/our%20services/f-1.png",
    slug: "wash-iron",
  },
  {
    icon: (
      <svg className="w-full h-full" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="14" width="32" height="24" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <path d="M8 22h32M16 14V8M32 14V8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M20 28h8M18 32h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Wash + Dry + Fold",
    description: "Full service laundry, neatly folded and ready to wear",
    image: "/assets/our%20services/w-1.png",
    slug: "wash-dry-fold",
  },
  {
    icon: (
      <svg className="w-full h-full" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 4l4 8h8l-6 6 2 8-8-4-8 4 2-8-6-6h8l4-8z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
        <circle cx="24" cy="36" r="8" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <path d="M24 32v8M20 36h8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Dry Cleaning",
    description: "Expert care for suits, dresses, and delicate fabrics",
    image: "/assets/our%20services/d-2.png",
    slug: "dry-cleaning",
  },
];

const additionalItems = [
  { name: "Wedding Dresses", icon: Sparkles },
  { name: "Suits & Blazers", icon: UserRound },
  { name: "Leather & Suede", icon: Layers },
  { name: "Duvets & Pillows", icon: Bed },
  { name: "Curtains & Drapes", icon: Maximize2 },
  { name: "Fur Coats", icon: Snowflake },
  { name: "Knitwear & Woolens", icon: Waves },
  { name: "Silk & Delicates", icon: Feather },
  { name: "Uniforms", icon: Shirt },
  { name: "Table Linens", icon: Utensils },
];

const Services = () => {
  return (
    <section id="services" className="py-16 sm:py-20 md:py-24 bg-muted">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-primary font-semibold uppercase tracking-wider text-sm mb-3">What We Offer</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4">
            Our <span className="font-script text-primary">Services</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg px-4">
            Professional laundry care for all your needs
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {services.map((service, index) => (
            <Link href={`/services/${service.slug}`} key={service.title}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-card rounded-2xl sm:rounded-3xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-2xl transition-all duration-500 h-64 sm:h-72 md:h-80 cursor-pointer"
              >
                {/* Background image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${service.image})` }}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 text-white text-center sm:text-left">
                  {/* Icon - Properly centered and sized */}
                  <div className="flex justify-center sm:justify-start mb-3 sm:mb-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:bg-primary group-hover:border-primary transition-all duration-300 p-2">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center">
                        {service.icon}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2">{service.title}</h3>
                  <p className="text-white/80 text-xs sm:text-sm leading-relaxed">{service.description}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* View All Services Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mt-12 md:mt-16"
        >
          <Link href="/services">
            <div className="group inline-flex items-center gap-3 bg-white text-primary font-bold px-10 py-4 rounded-full border-2 border-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-xl shadow-primary/10 hover:shadow-primary/20 active:scale-95 cursor-pointer">
              <span>View All Services</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </motion.div>

        {/* Additional items we clean - Infinite Marquee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 sm:mt-16 md:mt-20 overflow-hidden"
        >
          <div className="bg-card rounded-[2rem] sm:rounded-[2.5rem] py-10 sm:py-14 md:py-16 border border-border relative overflow-hidden group">
            <h3 className="text-center text-2xl sm:text-3xl font-display font-bold mb-8 sm:mb-12">
              We Also <span className="font-script text-primary">Clean</span>
            </h3>

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
                  duration: 25,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                {/* Double items for perfectly seamless loop */}
                {[...additionalItems, ...additionalItems].map((item, idx) => (
                  <Link
                    href={`/contact?subject=${encodeURIComponent(item.name)}`}
                    key={idx}
                    className="flex items-center gap-2 sm:gap-4 bg-secondary/30 backdrop-blur-sm hover:bg-primary transition-all duration-300 px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl border border-border group/item cursor-pointer justify-center sm:justify-start"
                  >
                    <div className="text-primary group-hover/item:text-white transition-colors">
                      <item.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" strokeWidth={2.5} />
                    </div>
                    <span className="text-sm sm:text-base md:text-lg font-medium text-foreground group-hover/item:text-white transition-colors">
                      {item.name}
                    </span>
                  </Link>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;