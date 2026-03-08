'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import {
  Leaf,
  Clock,
  Truck,
  Shield,
  Users,
  Award,
  Sparkles,
  Heart,
  ArrowRight,
  MapPin,
  Phone
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrustedPartners from "@/components/TrustedPartners";
import Script from "next/script";

// Animated counter component
const Counter = ({ end, suffix = "", duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const increment = end / (duration * 60);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);
      return () => clearInterval(timer);
    }
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const stats = [
  { value: 10, suffix: "+", label: "Years Experience" },
  { value: 5000, suffix: "+", label: "Happy Customers" },
  { value: 24, suffix: "hr", label: "Fast Turnaround" },
  { value: 100, suffix: "%", label: "Eco-Friendly" },
];

const values = [
  {
    icon: Sparkles,
    title: "Premium Quality",
    image: "/assets/img-grid/IMG_9081.jpg"
  },
  {
    icon: Leaf,
    title: "Eco-Friendly",
    image: "/assets/img-grid/20208 - Vodafone - WashCo - B-roll Cutdown.00_28_15_02.Still002.jpg"
  },
  {
    icon: Truck,
    title: "Free Delivery",
    image: "/assets/img-grid/IMG_9083.jpg"
  },
  {
    icon: Clock,
    title: "24-48hr Service",
    image: "/assets/img-grid/259949512_4615477651842803_5580518647924254211_n.jpg"
  },
  {
    icon: Sparkles,
    title: "Eco Practices",
    image: "/assets/img-grid/IMG_9085.jpg"
  },
  {
    icon: Leaf,
    title: "Gentle Care",
    image: "/assets/img-grid/Firefly 20240607092950.png"
  },
  {
    icon: Truck,
    title: "Quick Pickup",
    image: "/assets/img-grid/IMG_9084.jpg"
  },
  {
    icon: Clock,
    title: "Timely Returns",
    image: "/assets/img-grid/20208 - Vodafone - WashCo - B-roll Cutdown.00_35_37_23.Still007.jpg"
  },
  {
    icon: Sparkles,
    title: "Expert Cleaning",
    image: "/assets/img-grid/IMG_9086.jpg"
  },
  {
    icon: Leaf,
    title: "Safe Solvents",
    image: "/assets/img-grid/219863733_6257125504103_5292601337594092513_n.jpg"
  },
  {
    icon: Truck,
    title: "Local Service",
    image: "/assets/img-grid/IMG_9087.jpg"
  },
  {
    icon: Clock,
    title: "Always Ready",
    image: "/assets/img-grid/IMG_9082.jpg"
  }
];

const features = [
  { icon: Users, label: "Expert Team" },
  { icon: Shield, label: "Trusted Service" },
  { icon: Award, label: "Premium Care" },
  { icon: Heart, label: "Customer Love" },
];

export default function About() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "mainEntity": {
      "@type": "Organization",
      "name": "Speedy Laundry",
      "foundingDate": "2014",
      "description": "High Wycombe's premier family-owned laundry and dry cleaning specialist.",
      "logo": "https://speedylaundry.co.uk/assets/logo.svg",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "01494 445291",
        "contactType": "customer service"
      }
    }
  };

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const containerRef = useRef(null);
  const autoSlideRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto slide every 3 seconds
  useEffect(() => {
    autoSlideRef.current = setInterval(() => {
      if (!isDragging) {
        if (isMobile) {
          setCurrentSlide((prev) => (prev + 1) % values.length);
        } else {
          // On desktop, move by 1 card at a time
          setCurrentSlide((prev) => (prev + 1) % values.length);
        }
      }
    }, 3000);

    return () => {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current);
      }
    };
  }, [isDragging, isMobile]);

  const nextSlide = () => {
    if (isMobile) {
      setCurrentSlide((prev) => (prev + 1) % values.length);
    } else {
      setCurrentSlide((prev) => (prev + 1) % values.length);
    }
    resetAutoSlide();
  };

  const prevSlide = () => {
    if (isMobile) {
      setCurrentSlide((prev) => (prev - 1 + values.length) % values.length);
    } else {
      setCurrentSlide((prev) => (prev - 1 + values.length) % values.length);
    }
    resetAutoSlide();
  };

  const resetAutoSlide = () => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
      autoSlideRef.current = setInterval(() => {
        if (!isDragging) {
          if (isMobile) {
            setCurrentSlide((prev) => (prev + 1) % values.length);
          } else {
            setCurrentSlide((prev) => (prev + 1) % values.length);
          }
        }
      }, 3000);
    }
  };

  // Touch and drag handlers for mobile
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
  };

  const handleTouchEnd = (e) => {
    if (!isDragging) return;
    setIsDragging(false);

    const touchEndX = e.changedTouches[0].clientX;
    const diff = dragStartX - touchEndX;
    const threshold = 50;

    if (diff > threshold && currentSlide < values.length - 1) {
      nextSlide();
    } else if (diff < -threshold && currentSlide > 0) {
      prevSlide();
    }

    resetAutoSlide();
  };

  // Mouse drag handlers for desktop testing
  const handleMouseDown = (e) => {
    if (!isMobile) return;
    setIsDragging(true);
    setDragStartX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !isMobile) return;
    e.preventDefault();
  };

  const handleMouseUp = (e) => {
    if (!isDragging || !isMobile) return;
    setIsDragging(false);

    const mouseUpX = e.clientX;
    const diff = dragStartX - mouseUpX;
    const threshold = 50;

    if (diff > threshold && currentSlide < values.length - 1) {
      nextSlide();
    } else if (diff < -threshold && currentSlide > 0) {
      prevSlide();
    }

    resetAutoSlide();
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    resetAutoSlide();
  };

  return (
    <div className="min-h-screen bg-background">
      <Script
        id="about-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main>
        {/* Hero - Full Screen Visual */}
        <section className="relative h-[70vh] sm:h-[80vh] md:h-[90vh] min-h-[500px] sm:min-h-[550px] md:min-h-[600px] flex items-center overflow-hidden pt-16 sm:pt-20">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1489274495757-95c7c837b101?w=1920&h=1080&fit=crop"
              alt="Premium laundry service"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-transparent" />
          </div>

          <div className="container px-4 sm:px-6 relative z-10">
            <motion.div
              className="max-w-2xl"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-2 rounded-full mb-4 sm:mb-6"
              >
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                <span className="text-white/90 text-xs sm:text-sm font-medium">High Wycombe &amp; Surrounding Areas</span>
              </motion.div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-white mb-4 sm:mb-6 leading-[1.1]">
                Laundry
                <br />
                <span className="text-primary">Reimagined</span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 mb-6 sm:mb-8 max-w-lg">
                Premium care for your clothes. Eco-friendly practices. Delivered to your door.
              </p>

              <div className="flex flex-wrap gap-3 sm:gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-primary text-white font-bold px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full hover:brightness-110 transition-all shadow-lg text-sm sm:text-base"
                >
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                  Book Now
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-5 h-8 sm:w-6 sm:h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5 sm:p-2">
              <div className="w-1.5 h-3 bg-white/50 rounded-full" />
            </div>
          </motion.div>
        </section>

        {/* Stats Bar */}
        <section className="bg-primary py-6 sm:py-8">
          <div className="container px-4 sm:px-6">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1">
                    <Counter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-white/80 text-xs sm:text-sm font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <TrustedPartners />

        {/* Visual Values Grid - What Makes Us Different */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 bg-background overflow-hidden">
          <div className="container px-4">
            <motion.div
              className="text-center mb-8 sm:mb-12 md:mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
                What Makes Us <span className="text-primary">Different</span>
              </h2>
            </motion.div>

            {/* Desktop: Show 3 cards at once, scroll 1 at a time */}
            <div className="hidden md:block">
              <div
                ref={containerRef}
                className="relative"
              >
                {/* Carousel Container */}
                <div className="relative overflow-hidden">
                  <motion.div
                    className="flex"
                    animate={{ x: `-${currentSlide * (100 / 3)}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    {values.map((value, index) => (
                      <div
                        key={index}
                        className="flex-shrink-0 w-1/3 px-4"
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          whileHover={{
                            scale: 1.05,
                            transition: { duration: 0.4 }
                          }}
                          className="w-full"
                        >
                          <div className="relative aspect-video rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl group border border-white/10 mx-auto max-w-[380px]">
                            {/* Image */}
                            <div className="absolute inset-0 overflow-hidden">
                              <Image
                                src={value.image}
                                alt={value.title}
                                fill
                                className="object-cover object-center"
                              />
                            </div>

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:via-black/30 transition-all duration-500" />

                            {/* Content */}
                            <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-end">
                              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-primary/90 rounded-xl flex items-center justify-center mb-4 shadow-xl backdrop-blur-sm">
                                <value.icon className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                              </div>
                              <h3 className="text-xl lg:text-2xl font-bold text-white mb-2 tracking-tight">
                                {value.title}
                              </h3>
                              <div className="h-1 w-10 bg-primary rounded-full transform origin-left group-hover:w-16 transition-all duration-500" />
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Desktop Navigation */}
                <div className="mt-12">
                  <div className="flex flex-col items-center gap-6">
                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={prevSlide}
                        className="w-12 h-12 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors flex items-center justify-center group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Previous Slide"
                        disabled={currentSlide === 0}
                      >
                        <ArrowRight className="w-6 h-6 text-primary rotate-180 group-hover/btn:scale-110 transition-transform" />
                      </button>
                      
                      <div className="bg-primary/5 px-6 py-3 rounded-full border border-primary/10 backdrop-blur-md">
                        <span className="text-xs font-bold uppercase tracking-widest text-primary/80 leading-none">
                          Explore Our Legacy
                        </span>
                      </div>
                      
                      <button
                        onClick={nextSlide}
                        className="w-12 h-12 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors flex items-center justify-center group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Next Slide"
                        disabled={currentSlide === values.length - 1}
                      >
                        <ArrowRight className="w-6 h-6 text-primary group-hover/btn:scale-110 transition-transform" />
                      </button>
                    </div>

                    {/* Dots Indicator */}
                    <div className="flex gap-2">
                      {values.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToSlide(index)}
                          className="group p-2 -m-2 flex items-center justify-center"
                          aria-label={`Go to slide ${index + 1}`}
                        >
                          <div className={`h-2 transition-all duration-300 rounded-full ${index === currentSlide ? 'bg-primary w-6' : 'bg-gray-300 w-2 group-hover:bg-gray-400'}`} />
                        </button>
                      ))}
                    </div>

                    {/* Slide Counter */}
                    <div className="text-sm text-muted-foreground font-medium">
                      <span className="text-primary">{currentSlide + 1}</span>
                      <span className="mx-1">/</span>
                      <span>{values.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile: Touchable Slider - Show 1 card at a time */}
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
                onMouseLeave={() => setIsDragging(false)}
                style={{
                  cursor: isDragging ? 'grabbing' : 'grab'
                }}
              >
                <motion.div
                  className="flex"
                  animate={{ x: `-${currentSlide * 100}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {values.map((value, index) => (
                    <div
                      key={index}
                      className="w-full flex-shrink-0 px-2"
                    >
                      <div className="relative aspect-video rounded-[1.5rem] overflow-hidden shadow-xl group border border-white/5">
                        {/* Image */}
                        <div className="absolute inset-0 overflow-hidden">
                          <Image
                            src={value.image}
                            alt={value.title}
                            fill
                            className="object-cover object-center"
                          />
                        </div>

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent group-hover:via-black/20 transition-all duration-500" />

                        {/* Content */}
                        <div className="absolute inset-0 p-6 flex flex-col justify-end">
                          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4 shadow-xl">
                            <value.icon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                            {value.title}
                          </h3>
                          <div className="h-1 w-8 bg-primary rounded-full mb-3 transform origin-left group-hover:w-16 transition-all duration-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Mobile Navigation */}
              <div className="mt-8 px-4">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center justify-between w-full max-w-sm">
                    <button
                      onClick={prevSlide}
                      className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Previous slide"
                      disabled={currentSlide === 0}
                    >
                      <ArrowRight className="w-5 h-5 text-primary rotate-180" />
                    </button>

                    {/* Dots Indicator */}
                    <div className="flex gap-2">
                      {values.slice(0, 5) .map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToSlide(index)}
                          className="group p-2 -m-2 flex items-center justify-center"
                          aria-label={`Go to slide ${index + 1}`}
                        >
                          <div className={`h-2 transition-all rounded-full ${index === currentSlide ? 'bg-primary w-6' : 'bg-gray-300 w-2 hover:bg-gray-400'}`} />
                        </button>
                      ))}
                      {values.length > 5 && (
                        <div className="flex items-center text-xs text-gray-500">
                          +{values.length - 5} more
                        </div>
                      )}
                    </div>

                    <button
                      onClick={nextSlide}
                      className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Next slide"
                      disabled={currentSlide === values.length - 1}
                    >
                      <ArrowRight className="w-5 h-5 text-primary" />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full max-w-sm h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      animate={{ width: `${((currentSlide + 1) / values.length) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 bg-secondary/30 overflow-hidden">
          <div className="container px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="relative">
                  <Image
                    src="https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=800&h=600&fit=crop"
                    alt="Our team at work"
                    width={800}
                    height={600}
                    className="rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl w-full h-auto"
                  />
                  <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 lg:-right-12 bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                      </div>
                      <div>
                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Family</div>
                        <div className="text-muted-foreground text-xs sm:text-sm">Owned Business</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="text-primary font-bold text-xs sm:text-sm tracking-widest uppercase mb-3 sm:mb-4 block">
                  Our Story
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4 sm:mb-6 leading-tight">
                  Built on Trust,
                  <br />
                  <span className="text-primary">Driven by Care</span>
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                  What started as a small family dream has grown into High Wycombe&apos;s most trusted laundry service. Every garment tells a story – and we treat yours with the care it deserves.
                </p>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center gap-2 sm:gap-3 bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-sm"
                    >
                      <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary" />
                      <span className="font-semibold text-foreground text-xs sm:text-sm md:text-base">{feature.label}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Promise Section */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-foreground overflow-hidden">
          <div className="container px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
              {/* Left Side: Brand Promise */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest mb-4 sm:mb-6">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                  Quality Certified
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-white leading-tight mb-6 sm:mb-8">
                  The Speedy<br />
                  Promise<span className="text-primary">.</span>
                </h2>
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 sm:gap-3 text-white font-bold hover:text-primary transition-all text-sm sm:text-base md:text-lg"
                >
                  Book Your Experience
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </motion.div>

              {/* Right Side: Statement */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="relative lg:pl-8 lg:border-l border-white/10"
              >
                <div className="text-5xl md:text-6xl text-primary font-serif absolute -top-6 -left-3 hidden lg:block">&quot;</div>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-display font-bold text-white mb-6 sm:mb-8 leading-snug">
                  Your satisfaction isn&apos;t just our goal – it&apos;s our <span className="font-script text-primary inline mt-2 text-2xl sm:text-3xl md:text-4xl">promise.</span>
                </p>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="h-px w-6 sm:w-8 bg-primary" />
                  <p className="text-base sm:text-lg md:text-xl text-white font-script italic">
                    The Speedy Laundry Team
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Process Visual - Horizontal on Mobile */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
          <div className="container px-4 sm:px-6">
            <motion.div
              className="text-center mb-8 sm:mb-12 md:mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground">
                Simple as <span className="text-primary">1, 2, 3</span>
              </h2>
            </motion.div>

            {/* Mobile: Horizontal Cards */}
            <div className="md:hidden">
              <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-hide">
                {[
                  { step: "01", title: "We Collect", desc: "Schedule a pickup" },
                  { step: "02", title: "We Clean", desc: "Expert care & eco-friendly" },
                  { step: "03", title: "We Deliver", desc: "Fresh to your door" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                    className="min-w-[85vw] bg-white p-6 rounded-2xl shadow-lg border border-border"
                  >
                    <div className="relative mb-4">
                      <div className="text-6xl font-bold text-primary/10">
                        {item.step}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-xl font-bold text-white">{index + 1}</span>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Desktop: Grid Layout */}
            <div className="hidden md:grid md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
              {[
                { step: "01", title: "We Collect", desc: "Schedule a pickup" },
                { step: "02", title: "We Clean", desc: "Expert care & eco-friendly" },
                { step: "03", title: "We Deliver", desc: "Fresh to your door" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="text-center group"
                >
                  <div className="relative inline-block mb-6">
                    <div className="text-7xl sm:text-8xl md:text-9xl font-bold text-primary/10 group-hover:text-primary/20 transition-colors">
                      {item.step}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <span className="text-2xl font-bold text-white">{index + 1}</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm sm:text-base">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 bg-foreground">
          <div className="container px-4 sm:px-6">
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4 sm:mb-6">
                Ready for <span className="text-primary">Fresh</span> Clothes?
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/70 mb-6 sm:mb-8 md:mb-10">
                Join thousands of happy customers across High Wycombe
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-full hover:brightness-110 transition-all shadow-lg text-sm sm:text-base md:text-lg w-full sm:w-auto"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-bold px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-full hover:bg-white/20 transition-all text-sm sm:text-base md:text-lg w-full sm:w-auto"
                >
                  View Services
                </Link>
              </div>
              <p className="mt-6 sm:mt-8 md:mt-10 text-lg sm:text-xl md:text-2xl font-script text-primary">
                Making Laundry Day a Breeze!
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}