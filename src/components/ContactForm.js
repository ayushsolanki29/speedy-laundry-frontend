'use client';

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

function ContactFormInner({ className = "" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    address: '',
    postcode: '',
    service: '',
    other_service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const subject = searchParams.get('subject');
    const area = searchParams.get('area');
    const type = searchParams.get('type');
    
    if (type === 'business') {
      setFormData(prev => ({
        ...prev,
        service: 'commercial',
        message: "I'm interested in professional laundry services for my business. Please provide information about your commercial accounts and pricing."
      }));
    } else if (subject) {
      setFormData(prev => ({
        ...prev,
        message: `I'm interested in ${subject} cleaning service. Please provide more details.`
      }));
    } else if (type === 'area-request') {
      setFormData(prev => ({
        ...prev,
        service: 'area-request',
        other_service: area || '',
        message: `I'm interested in your laundry services but I couldn't find my area in your list. I am located in ${area || '[Please specify your area]'} and would like to know if you can accommodate me.`
      }));
    } else if (area) {
      setFormData(prev => ({
        ...prev,
        message: `I'm interested in your laundry services in ${area}. Do you provide collection and delivery in this area?`
      }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (formData.phone.length > 30) {
      toast.error('Phone number is too long (max 30 characters)');
      return;
    }
    if (formData.postcode.length > 20) {
      toast.error('Postcode is too long (max 20 characters)');
      return;
    }
    if (formData.address.length > 255) {
      toast.error('Address is too long (max 255 characters)');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          service: formData.service === 'other' ? (formData.other_service || 'Other') 
                 : formData.service === 'area-request' ? `Area Request: ${formData.other_service || 'Not specified'}`
                 : formData.service === 'general-inquiry' ? 'General Inquiries'
                 : formData.service === 'iron' ? 'Iron Only'
                 : formData.service === 'wash-iron' ? 'Wash + Iron'
                 : formData.service === 'wash-dry-fold' ? 'Wash, Dry & Fold'
                 : formData.service === 'dry-cleaning' ? 'Dry Cleaning'
                 : formData.service === 'commercial' ? 'Commercial / Business'
                 : formData.service
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        toast.success(data.message);
        setFormData({
          full_name: '',
          phone: '',
          email: '',
          address: '',
          postcode: '',
          service: '',
          other_service: '',
          message: ''
        });
        // Redirect to thank you page
        router.push('/thank-you');
      } else {
        toast.error(data.message || 'Submission failed. Please check your inputs.');
      }
    } catch (error) {
      toast.error('Failed to connect to server. Please try again.');
      console.error('Contact error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 md:space-y-6 ${className}`}>
      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        <div className="space-y-2">
          <label htmlFor="full_name" className="text-sm font-semibold text-foreground/80 ml-1">Full Name *</label>
          <input
            id="full_name"
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
            className="w-full px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm md:text-base"
            placeholder="Your name"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-semibold text-foreground/80 ml-1">Phone Number *</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm md:text-base"
            placeholder="Your phone"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-semibold text-foreground/80 ml-1">Email Address *</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm md:text-base"
            placeholder="your@email.com"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="postcode" className="text-sm font-semibold text-foreground/80 ml-1">Postcode *</label>
          <input
            id="postcode"
            type="text"
            name="postcode"
            value={formData.postcode}
            onChange={handleChange}
            required
            className="w-full px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm md:text-base"
            placeholder="e.g. HP12 3RD"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="address" className="text-sm font-semibold text-foreground/80 ml-1">Address *</label>
          <input
            id="address"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm md:text-base"
            placeholder="House/Flat, Street, Area"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="service" className="text-sm font-semibold text-foreground/80 ml-1">Service Required</label>
        <select
          id="service"
          name="service"
          value={formData.service}
          onChange={handleChange}
          className="w-full px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm md:text-base cursor-pointer"
        >
          <option value="">Select a service</option>
          <option value="iron">Iron Only</option>
          <option value="wash-iron">Wash + Iron</option>
          <option value="wash-dry-fold">Wash, Dry & Fold</option>
          <option value="dry-cleaning">Dry Cleaning</option>
          <option value="commercial">Commercial / Business</option>
          <option value="area-request">Request My Area</option>
          <option value="general-inquiry">General Inquiries</option>
          <option value="other">Other</option>
        </select>

        {(formData.service === 'other' || formData.service === 'area-request') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="mt-3 relative"
          >
            <label htmlFor="other_service" className="text-[10px] font-bold text-primary uppercase tracking-widest absolute -top-2 left-4 bg-background px-2 z-10">
              {formData.service === 'area-request' ? 'Specify Your Area' : 'Specify Request'}
            </label>
            <input
              id="other_service"
              type="text"
              name="other_service"
              value={formData.other_service}
              onChange={handleChange}
              required
              className="w-full px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-primary/20 bg-primary/5 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm md:text-base font-medium placeholder:text-slate-400"
              placeholder={formData.service === 'area-request' ? 'Which area are you located in?' : 'What do you need?'}
              autoFocus
            />
          </motion.div>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-semibold text-foreground/80 ml-1">Message (Optional)</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none text-sm md:text-base"
          rows={3}
          placeholder="Any special requests..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-white font-bold py-3 md:py-5 rounded-xl md:rounded-2xl hover:brightness-110 active:scale-[0.99] transition-all text-base md:text-lg flex items-center justify-center gap-3 shadow-lg shadow-primary/20 disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4 md:w-5 md:h-5" />
            <span>Request Pickup</span>
          </>
        )}
      </button>
    </form>
  );
}

export default function ContactForm(props) {
  return (
    <Suspense fallback={<div className="h-96 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <ContactFormInner {...props} />
    </Suspense>
  );
}
