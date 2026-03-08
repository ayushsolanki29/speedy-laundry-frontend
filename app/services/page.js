'use client';

import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  Truck,
  Clock,
  Leaf,
  Phone,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect, useRef } from "react";

import { servicesData } from "@/data/services";
import Script from "next/script";

export default function ServicesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Speedy Laundry Professional Services",
    "description": "Premium laundry, ironing, and dry cleaning services with free pickup and delivery.",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Professional Laundry Catalog",
      "itemListElement": servicesData.map(service => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": service.title,
          "description": service.description,
          "url": `https://speedylaundry.co.uk/services/${service.id}`
        }
      }))
    }
  };
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef(null);
  const autoSlideRef = useRef(null);
  const controls = useAnimation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto slide every 3 seconds on mobile
  useEffect(() => {
    if (!isMobile) return;

    autoSlideRef.current = setInterval(() => {
      if (!isDragging) {
        setCurrentSlide((prev) => (prev + 1) % servicesData.length);
      }
    }, 3000);

    return () => {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current);
      }
    };
  }, [isMobile, isDragging]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % servicesData.length);
    resetAutoSlide();
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + servicesData.length) % servicesData.length);
    resetAutoSlide();
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    resetAutoSlide();
  };

  const resetAutoSlide = () => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
      autoSlideRef.current = setInterval(() => {
        if (!isDragging) {
          setCurrentSlide((prev) => (prev + 1) % servicesData.length);
        }
      }, 3000);
    }
  };

  // Touch and drag handlers
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
    setDragStartY(e.touches[0].clientY);
    setDragOffset(0);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;

    // Calculate difference
    const diffX = Math.abs(dragStartX - currentX);
    const diffY = Math.abs(dragStartY - currentY);

    // If moving more vertically than horizontally, stop the slider dragging 
    // to allow the browser to handle page scrolling
    if (diffY > diffX && diffY > 5) {
      setIsDragging(false);
      return;
    }

    const diff = dragStartX - currentX;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 50; // Minimum drag distance to trigger slide change

    if (dragOffset > threshold && currentSlide < servicesData.length - 1) {
      // Swiped left - go to next
      nextSlide();
    } else if (dragOffset < -threshold && currentSlide > 0) {
      // Swiped right - go to previous
      prevSlide();
    }

    setDragOffset(0);
    resetAutoSlide();
  };

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragOffset(0);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const diff = dragStartX - currentX;
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 50;

    if (dragOffset > threshold && currentSlide < servicesData.length - 1) {
      nextSlide();
    } else if (dragOffset < -threshold && currentSlide > 0) {
      prevSlide();
    }

    setDragOffset(0);
    resetAutoSlide();
  };

  // Prevent default drag behavior
  const handleDragStart = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-background">
      <Script
        id="services-catalog-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main>
        {/* Hero - Clean & Minimal */}
        <section className="relative h-[50vh] sm:h-[60vh] min-h-[400px] sm:min-h-[500px] flex items-center overflow-hidden pt-16 sm:pt-20">
          <div className="absolute inset-0">
            <Image
              src="/assets/our services/ChatGPT Image Feb 6, 2026, 09_58_10 AM.png"
              alt="Premium laundry service"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-transparent" />
          </div>

          <div className="container px-4 sm:px-6 relative z-10">
            <motion.div
              className="max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-white mb-4 sm:mb-6 tracking-tight">
                Our Services<span className="text-primary">.</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-xl">
                Premium laundry care tailored to your specific needs, delivered right to your doorstep.
              </p>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 lg:gap-8 mt-6 sm:mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {[
                { icon: Truck, text: "Free Pickup & Delivery" },
                { icon: Clock, text: "24-48hr Turnaround" },
                { icon: Leaf, text: "Eco-Friendly Processing" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-white/90">
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  <span className="font-medium text-xs sm:text-sm lg:text-base">{item.text}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Main Services Grid - Desktop 2 columns, Mobile Slider */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 pt-6 sm:pt-8">
          <div className="container px-4 sm:px-6">

            {/* Desktop: 2 Column Grid */}
            <div className="hidden md:grid md:grid-cols-2 gap-8 lg:gap-12">
              {servicesData.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <Link href={`/services/${service.id}`} className="block">
                    <div className="relative aspect-[16/9] rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden mb-6 border border-border shadow-xl">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 1024px) 50vw, 33vw"
                        priority={index < 2}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                      {/* Floating Badge on Image */}
                      <div className="absolute bottom-6 left-6 text-white">
                        <h2 className="text-3xl lg:text-4xl font-display font-bold mb-1">
                          {service.title}
                        </h2>
                        <p className="text-white/80 font-medium tracking-wide uppercase text-xs">
                          {service.subtitle}
                        </p>
                      </div>

                      {/* View Button */}
                      <div className="absolute top-6 right-6 w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center -rotate-45 group-hover:rotate-0 group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                        <ArrowRight size={24} className="text-white" />
                      </div>
                    </div>
                  </Link>

                  <div className="flex flex-col gap-4">
                    <p className="text-muted-foreground text-lg leading-relaxed line-clamp-2">
                      {service.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {service.items.slice(0, 4).map((item, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-4 py-2 rounded-full border border-border"
                        >
                          {item}
                        </span>
                      ))}
                      {service.items.length > 4 && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
                          +{service.items.length - 4} More
                        </span>
                      )}
                    </div>

                    {/* CTA Button inside card */}
                    <Link
                      href="/contact"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-8 py-4 rounded-full hover:bg-primary/90 hover:scale-105 transition-all shadow-lg shadow-primary/20 w-full"
                    >
                      Book Now
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mobile: Touchable and Draggable Slider */}
            <div className="md:hidden">
              <div
                ref={containerRef}
                className="relative overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onDragStart={handleDragStart}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
              >
                <motion.div
                  className="flex touch-auto"
                  animate={{
                    x: `calc(-${currentSlide * 100}% + ${isDragging ? -dragOffset : 0}px)`
                  }}
                  transition={{
                    type: "spring",
                    stiffness: isDragging ? 100 : 300,
                    damping: 30
                  }}
                >
                  {servicesData.map((service, index) => (
                    <div
                      key={service.id}
                      className="w-full flex-shrink-0 px-2"
                    >
                      <div className="group relative">
                        <Link href={`/services/${service.id}`} className="block">
                          <div className="relative aspect-[4/3] rounded-[1.5rem] overflow-hidden mb-4 border border-border shadow-xl select-none">
                            <Image
                              src={service.image}
                              alt={service.title}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                              sizes="100vw"
                              draggable="false"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                            {/* Floating Badge on Image */}
                            <div className="absolute bottom-4 left-4 text-white">
                              <h2 className="text-xl font-display font-bold mb-1">
                                {service.title}
                              </h2>
                              <p className="text-white/80 font-medium tracking-wide uppercase text-xs">
                                {service.subtitle}
                              </p>
                            </div>

                            {/* View Button */}
                            <div className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center -rotate-45 group-hover:rotate-0 group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                              <ArrowRight size={20} className="text-white" />
                            </div>
                          </div>
                        </Link>

                        <div className="flex flex-col gap-3">
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {service.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {service.items.slice(0, 3).map((item, i) => (
                              <span
                                key={i}
                                className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-2 py-1 rounded-full border border-border"
                              >
                                {item}
                              </span>
                            ))}
                            {service.items.length > 3 && (
                              <span className="text-[8px] font-bold uppercase tracking-widest text-primary bg-primary/5 px-2 py-1 rounded-full border border-primary/10">
                                +{service.items.length - 3} More
                              </span>
                            )}
                          </div>

                          {/* CTA Button inside card */}
                          <Link
                            href="/contact"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-4 py-3 rounded-full hover:bg-primary/90 hover:scale-105 transition-all shadow-lg shadow-primary/20 w-full text-sm"
                          >
                            Book Now
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>

                {/* Drag Indicator (optional) */}
                {isDragging && (
                  <div className="absolute top-0 right-0 left-0 h-1 bg-primary/20 z-10">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(Math.abs(dragOffset) / 2, 100)}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Slider Navigation */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={prevSlide}
                  className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                  aria-label="Previous service"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Dots Indicator */}
                <div className="flex gap-2">
                  {servicesData.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? 'bg-primary w-6' : 'bg-gray-300'
                        }`}
                      aria-label={`Go to service ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextSlide}
                  className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                  aria-label="Next service"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* View All Services Button */}

          </div>
        </section>


        {/* Process Steps - Clean */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 bg-background">
          <div className="container px-4 sm:px-6">
            <motion.div
              className="text-center mb-8 sm:mb-12 md:mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground">
                How It Works
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-12 max-w-4xl mx-auto">
              {[
                { num: "01", title: "Book", desc: "Schedule online" },
                { num: "02", title: "Collect", desc: "Free pickup" },
                { num: "03", title: "Clean", desc: "Expert care" },
                { num: "04", title: "Deliver", desc: "To your door" },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-primary/20 mb-2 sm:mb-3 md:mb-4">
                    {step.num}
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground mb-1">{step.title}</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Guarantee */}
        <section className="py-8 sm:py-12 md:py-16 bg-primary">
          <div className="container px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-base sm:text-lg md:text-xl font-display font-bold text-white">
                    100% Satisfaction Guarantee
                  </h3>
                  <p className="text-white/70 text-xs sm:text-sm md:text-base">Not happy? We&apos;ll re-clean it free</p>
                </div>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full hover:bg-white/90 transition-all text-sm sm:text-base w-full sm:w-auto"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                Book Now
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 bg-muted">
          <div className="container px-4 sm:px-6">
            <motion.div
              className="max-w-2xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4 sm:mb-6">
                Ready for Fresh Clothes?
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 md:mb-10">
                Join thousands of happy customers in High Wycombe
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full hover:brightness-110 transition-all text-sm sm:text-base md:text-lg w-full sm:w-auto"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 bg-white text-foreground font-bold px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full hover:bg-background transition-all text-sm sm:text-base md:text-lg w-full sm:w-auto border border-border"
                >
                  About Us
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}