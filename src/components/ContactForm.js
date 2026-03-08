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
    postcode: '',
    service: '',
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

    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.status === 'success') {
        toast.success(data.message);
        setFormData({
          full_name: '',
          phone: '',
          email: '',
          postcode: '',
          service: '',
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
        </select>
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
