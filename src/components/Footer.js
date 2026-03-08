'use client';

import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSettings } from "@/context/SettingsContext";

const logo = "/assets/logo.svg";

const deliveryAreas = [
  { name: "High Wycombe", image: "/assets/our services/High Wycombe 01.png" },
  { name: "Henley-on-Thames", image: "/assets/our services/Henley on Thames01.png" },
  { name: "Beaconsfield", image: "/assets/our services/Beaconsfield01.png" },
  { name: "Maidenhead", image: "/assets/our services/Maidenhead.png" },
  { name: "Marlow", image: "/assets/our services/Marlow01.png" }
];

const socialLinks = [
  { key: 'facebook', label: 'Facebook', hrefKey: 'footer_facebook', icon: 'facebook' },
  { key: 'instagram', label: 'Instagram', hrefKey: 'footer_instagram', icon: 'instagram' },
  { key: 'twitter', label: 'Twitter', hrefKey: 'footer_twitter', icon: 'twitter' },
  { key: 'linkedin', label: 'LinkedIn', hrefKey: 'footer_linkedin', icon: 'linkedin' }
]

const Footer = () => {
  const settings = useSettings()
  const phone = settings.contact_phone || '01494 445291'
  const email = settings.contact_email || 'info@speedylaundry.co.uk'
  const hours = settings.contact_hours || 'Mon-Fri: 6AM - 3PM'

  const socialIcons = {
    facebook: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
    ),
    instagram: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
    ),
    twitter: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
    ),
    linkedin: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
    )
  }

  return (
    <footer className="bg-foreground">
      {/* Main Footer */}
      <div className="container py-16 lg:py-20">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-8">

          {/* Brand Section */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="mb-6">
              <Image src={logo} alt="Speedy Laundry" className="h-10 sm:h-12 brightness-0 invert w-auto" width={200} height={40} />
            </div>
            <p className="text-white/60 mb-8 leading-relaxed text-sm sm:text-base max-w-sm">
              Premium laundry & dry cleaning with free pickup and delivery. Making laundry day a breeze since 2014.
            </p>
            <div className="flex gap-4 mb-8">
              {socialLinks.map(({ key, label, hrefKey }) => {
                const href = settings[hrefKey] || ''
                if (!href) return null
                const Icon = socialIcons[key]
                if (!Icon) return null
                return (
                  <a key={key} href={href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-primary hover:text-white transition-all duration-300" aria-label={label}>
                    {Icon}
                  </a>
                )
              })}
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">

              {/* Services */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <h3 className="text-white font-bold mb-6 text-xs tracking-[0.2em] uppercase opacity-90">Our Services</h3>
                <ul className="space-y-4">
                  {[
                    { name: "Iron Only", id: "iron-only" },
                    { name: "Wash + Iron", id: "wash-iron" },
                    { name: "Wash, Dry & Fold", id: "wash-dry-fold" },
                    { name: "Dry Cleaning", id: "dry-cleaning" }
                  ].map((service) => (
                    <li key={service.id}>
                      <Link href={`/services/${service.id}`} className="text-white/60 hover:text-primary transition-colors block text-sm sm:text-base font-medium">
                        {service.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <h3 className="text-white font-bold mb-6 text-xs tracking-[0.2em] uppercase opacity-90">Experience</h3>
                <ul className="space-y-4">
                  <li><Link href="/about" className="text-white/60 hover:text-primary transition-colors block text-sm sm:text-base font-medium">About Our Story</Link></li>
                  <li><Link href="/#how-it-works" className="text-white/60 hover:text-primary transition-colors block text-sm sm:text-base font-medium">The Process</Link></li>
                  <li><Link href="/#contact" className="text-white/60 hover:text-primary transition-colors block text-sm sm:text-base font-medium">Support & Contact</Link></li>
                </ul>
              </div>

              {/* Contact Info - Distinctive centered stack for mobile */}
              <div className="col-span-2 sm:col-span-1 border-t border-white/5 lg:border-0 pt-12 lg:pt-0">
                <h3 className="text-white font-bold mb-8 text-xs tracking-[0.2em] uppercase opacity-90 text-center lg:text-left">Get In Touch</h3>
                <ul className="space-y-6">
                  <li className="flex flex-col lg:flex-row items-center lg:items-start gap-3 text-center lg:text-left">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-white/70 hover:text-white transition-colors text-base font-bold">{phone}</a>
                  </li>
                  <li className="flex flex-col lg:flex-row items-center lg:items-start gap-3 text-center lg:text-left">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <a href={`mailto:${email}`} className="text-white/70 hover:text-white transition-colors text-sm font-medium">{email}</a>
                  </li>
                  <li className="flex flex-col lg:flex-row items-center lg:items-start gap-3 text-center lg:text-left">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-white/70 text-xs uppercase tracking-widest font-bold whitespace-pre-line">{hours}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-12 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-white font-bold text-[10px] tracking-[0.3em] uppercase">High Wycombe & Surrounds</h3>
              <p className="text-white/60 text-[11px] leading-loose">
                Hazlemere • Holmer Green • Hughenden • Great Kingshill • Little Kingshill • Naphill • Prestwood • Penn • Tylers Green • Lane End • Stokenchurch • Radnage • Flackwell Heath • Loudwater • Wooburn Green • Hyde Heath
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-white font-bold text-[10px] tracking-[0.3em] uppercase">Henley-on-Thames & Surrounds</h3>
              <p className="text-white/60 text-[11px] leading-loose">
                Checkenden • Cookley Green • Fingest • Highmoor • Maidensgrove • Nettlebed • Northend • Nuffield • Rotherfield Grays • Rotherfield Peppard • Skirmett • Stoke Row • Turville • Turville Heath • Watlington • Wargrave • Hurley • Hambleden
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-white font-bold text-[10px] tracking-[0.3em] uppercase">Beaconsfield & Surrounds</h3>
              <p className="text-white/60 text-[11px] leading-loose">
                Gerrards Cross • Amersham • Chesham • Chalfont St Giles • Chalfont St Peter • Little Chalfont • Seer Green • Penn Street
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-white font-bold text-[10px] tracking-[0.3em] uppercase">Maidenhead & Marlow</h3>
              <p className="text-white/60 text-[11px] leading-loose">
                Bisham • Medmenham • Harleyford Estate • Marlow • Cookham • Shiplake • Kidmore End • Hook End • Sonning Common • Mill End • Binfield Heath • Speen
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-col lg:flex-row items-center justify-between gap-6 border-t border-white/5 pt-8">
            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              <span className="text-white/60 text-[10px] uppercase tracking-widest font-bold">Quick Links:</span>
              {deliveryAreas.map((area) => (
                <Link key={area.name} href={`/contact?area=${encodeURIComponent(area.name)}`} className="text-white/70 hover:text-primary transition-all text-[10px] uppercase font-bold tracking-wider">
                  {area.name}
                </Link>
              ))}
              <Link href="/#areas" className="text-sky-400 hover:text-sky-300 hover:underline transition-all text-[10px] uppercase font-bold tracking-wider">
                Explore Full Coverage
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="bg-black/20 py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-white/50 text-xs tracking-wide">
              © {new Date().getFullYear()} Speedy Laundry. Crafted with pride in HP12.
              <span className="mx-2 opacity-20">|</span>
              Made with <span className="text-primary animate-pulse">❤️</span> by{" "}
              <Link 
                href="https://ayushsolanki.com" 
                target="_blank" 
                className="text-white/70 hover:text-white transition-colors font-semibold"
              >
                ayushsolanki
              </Link>
            </p>
            <div className="flex gap-8">
              <Link href="/privacy" className="text-white/50 hover:text-white transition-colors text-xs font-medium tracking-widest uppercase">Privacy</Link>
              <Link href="/terms" className="text-white/50 hover:text-white transition-colors text-xs font-medium tracking-widest uppercase">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;