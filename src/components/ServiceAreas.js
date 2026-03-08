'use client';

import { motion } from "framer-motion";
import { MapPin, Check } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const serviceAreas = [
  {
    region: "High Wycombe",
    count: "17+ Areas",
    image: "/assets/our%20services/High%20Wycombe%2001.png",
    areas: [
      "High Wycombe", "Hazlemere", "Holmer Green", "Hughenden", "Great Kingshill",
      "Little Kingshill", "Naphill", "Prestwood", "Penn", "Tylers Green",
      "Lane End", "Stokenchurch", "Radnage", "Flackwell Heath", "Loudwater",
      "Wooburn Green", "Hyde Heath"
    ]
  },
  {
    region: "Henley-on-Thames",
    count: "25+ Areas",
    image: "/assets/our%20services/Henley%20on%20Thames01.png",
    areas: [
      "Henley-on-Thames", "Checkenden", "Cookley Green", "Fingest",
      "Highmoor", "Maidensgrove", "Nettlebed", "Northend", "Nuffield",
      "Rotherfield Grays", "Rotherfield Peppard", "Skirmett", "Stoke Row",
      "Stonor", "Turville", "Turville Heath", "Watlington", "Peppard",
      "Harpsden", "Remenham Hill", "Wargrave", "Hurley", "Hambleden", "Frieth"
    ]
  },
  {
    region: "Beaconsfield",
    count: "10+ Areas",
    image: "/assets/our%20services/Beaconsfield01.png",
    areas: [
      "Beaconsfield", "Gerrards Cross", "Amersham",
      "Chesham", "Chalfont St Giles", "Chalfont St Peter", "Little Chalfont",
      "Seer Green", "Penn Street"
    ]
  },
  {
    region: "Maidenhead",
    count: "13+ Areas",
    image: "/assets/our%20services/Maidenhead.png",
    areas: [
      "Maidenhead", "Bisham", "Medmenham", "Harleyford Estate", "Marlow",
      "Cookham", "Shiplake", "Kidmore End", "Hook End", "Sonning Common",
      "Mill End", "Binfield Heath", "Speen"
    ]
  }
];

const ServiceAreas = () => {
  const [activeRegion, setActiveRegion] = useState(0);

  return (
    <section id="areas" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background overflow-hidden relative">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <p className="text-primary font-semibold uppercase tracking-[0.2em] text-xs mb-3 sm:mb-4">Coverage</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-3 sm:mb-4">
            Areas We <span className="font-script text-primary">Serve</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed px-4">
            Premium laundry care delivered to your doorstep. Free pickup & delivery across these regions.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 max-w-7xl mx-auto">
          {serviceAreas.map((region, regionIdx) => (
            <Link 
              href={`/contact?area=${encodeURIComponent(region.region)}`}
              key={region.region}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: regionIdx * 0.1 }}
                className="group relative h-[280px] sm:h-[320px] md:h-[350px] lg:h-[400px] rounded-xl sm:rounded-2xl md:rounded-[2rem] overflow-hidden cursor-pointer shadow-lg sm:shadow-xl"
              >
                {/* Image Background - Optimized */}
                <Image
                  src={region.image}
                  alt={`${region.region} service area`}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  priority={regionIdx < 2} // Prioritize first 2 images
                  quality={85}
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col justify-end">
                  <div className="inline-flex bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-2 sm:px-3 py-1 text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-widest mb-2 sm:mb-3 w-fit">
                    Top Local Service
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-1 sm:mb-2 group-hover:text-primary transition-colors">
                    {region.region}
                  </h3>
                  <p className="text-white/70 text-xs sm:text-sm font-medium">
                    Stays in & Around {region.count}
                  </p>
                </div>

                {/* Hover Badge */}
                <div className="absolute top-3 sm:top-4 md:top-6 right-3 sm:right-4 md:right-6">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <MapPin className="text-primary w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Interactive Area List Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 max-w-7xl mx-auto"
        >


          {/* Region Tabs */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10">
            {serviceAreas.map((region, idx) => (
              <button
                key={idx}
                onClick={() => setActiveRegion(idx)}
                className={`
                  flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium text-sm sm:text-base
                  transition-all duration-300 border-2
                  ${activeRegion === idx
                    ? 'bg-primary text-white border-primary shadow-lg scale-105'
                    : 'bg-white text-foreground border-border hover:border-primary/50 hover:bg-primary/5'
                  }
                `}
              >
                <MapPin className={`w-4 h-4 ${activeRegion === idx ? 'text-white' : 'text-primary'}`} />
                <span>{region.region} & Surrounding Areas</span>
              </button>
            ))}
          </div>

          {/* Areas Grid */}
          <motion.div
            key={activeRegion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-border/50"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {serviceAreas[activeRegion].areas.map((area, idx) => (
                <Link
                  href={`/contact?area=${encodeURIComponent(area)}`}
                  key={idx}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group/area flex h-full items-center gap-2 sm:gap-3 bg-white rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 shadow-sm hover:shadow-lg hover:scale-105 hover:bg-primary transition-all duration-300 border border-border/30 hover:border-primary cursor-pointer"
                  >
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/10 group-hover/area:bg-white flex items-center justify-center shrink-0 transition-colors duration-300">
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary group-hover/area:text-primary" strokeWidth={3} />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-foreground group-hover/area:text-white transition-colors duration-300">
                      {area}
                    </span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Not in list CTA - Reimagined */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 text-center p-6 sm:p-8 md:p-12 bg-secondary/30 rounded-2xl sm:rounded-3xl md:rounded-[3rem] border border-border/50 max-w-4xl mx-auto relative overflow-hidden"
        >
          <h3 className="text-lg sm:text-xl md:text-2xl font-display font-bold mb-3 sm:mb-4 relative z-10">
            Don't see your area listed?
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-xl mx-auto relative z-10 leading-relaxed px-2 sm:px-0">
            We are constantly expanding our service routes. Contact us today and we'll see if we can accommodate your location!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 relative z-10">
            <a
              href="tel:01494445291"
              className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-primary text-white rounded-full font-bold hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto"
            >
              Call 01494 445291
            </a>
            <span className="text-muted-foreground font-medium text-sm sm:text-base">- OR -</span>
            <a
              href="#contact"
              className="text-primary font-bold hover:underline underline-offset-8 text-sm sm:text-base"
            >
              Send an Inquiry
            </a>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-primary/5 blur-[60px] sm:blur-[80px] md:blur-[100px] pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceAreas;