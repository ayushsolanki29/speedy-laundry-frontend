'use client';

import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

const FALLBACK_COLORS = [
  { bg: "bg-[#2A5C72]", text: "text-white" },
  { bg: "bg-[#AEE1E1]", text: "text-slate-800" },
  { bg: "bg-[#F7C978]", text: "text-slate-800" },
  { bg: "bg-[#F2A71B]", text: "text-slate-900" },
  { bg: "bg-[#2D3748]", text: "text-white" },
  { bg: "bg-[#E2E8F0]", text: "text-slate-800" },
  { bg: "bg-[#CBD5E0]", text: "text-slate-900" },
  { bg: "bg-[#ECC94B]", text: "text-slate-900" },
];

const staticReviews = [
  { name: "Jane Whitfield", content: "Speedy Iron/Laundry is the most wonderful Company. Have used them for twenty years and not once have they let me down.", photo_url: null },
  { name: "Anna Fountain", content: "Amazing! My long delicate dress was very dirty after dragging on the floor at a wedding, I was so surprised they managed to get the dirt out.", photo_url: null },
  { name: "Jonathan Martin", content: "Excellent service!! For both cleanliness and liaison's!! Thank you for going beyond expectations!!", photo_url: null },
];

const Reviews = () => {
  const [reviewsList, setReviewsList] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const autoSlideRef = useRef(null);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews.php`);
      const data = await res.json();
      let merged = [];
      if (data.status === "success" && data.data?.length > 0) {
        const apiNames = new Set(data.data.map((r) => r.name));
        const fromStatic = staticReviews.filter((s) => !apiNames.has(s.name));
        merged = [...data.data, ...fromStatic];
      } else {
        merged = [...staticReviews];
      }
      setReviewsList(
        merged.map((r, i) => ({
          ...r,
          content: r.content || r.text || "",
          bgColor: FALLBACK_COLORS[i % FALLBACK_COLORS.length].bg,
          textColor: FALLBACK_COLORS[i % FALLBACK_COLORS.length].text,
        }))
      );
    } catch {
      setReviewsList(
        staticReviews.map((r, i) => ({
          ...r,
          bgColor: FALLBACK_COLORS[i % FALLBACK_COLORS.length].bg,
          textColor: FALLBACK_COLORS[i % FALLBACK_COLORS.length].text,
        }))
      );
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isPaused || reviewsList.length === 0) return;
    autoSlideRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % reviewsList.length);
    }, 4000);
    return () => clearInterval(autoSlideRef.current);
  }, [isPaused, reviewsList.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + reviewsList.length) % reviewsList.length);
  };

  const goNext = () => {
    setCurrentSlide((prev) => (prev + 1) % reviewsList.length);
  };

  const getAvatar = (review) => {
    if (review.photo_url) {
      return (
        <img
          src={review.photo_url}
          alt={review.name}
          className="w-14 h-14 rounded-full border-4 border-white/20 object-cover shadow-md"
        />
      );
    }
    return (
      <div className="w-14 h-14 rounded-full border-4 border-white/20 flex items-center justify-center bg-white/90 text-slate-800 font-bold text-xl shadow-md">
        {(review.name || "?").charAt(0).toUpperCase()}
      </div>
    );
  };

  const avgRating = reviewsList.length
    ? (reviewsList.reduce((a, r) => a + (r.rating || 5), 0) / reviewsList.length).toFixed(1)
    : "4.9";

  return (
    <section id="reviews" className="py-16 md:py-24 bg-background overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] -z-10" />

      <div className="container px-4 mb-12 md:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-primary font-bold text-sm uppercase tracking-wider">Customer Reviews</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
            Trusted by the <br className="md:hidden" />
            <span className="font-script text-primary">Community</span>
          </h2>
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-[#E7711B] fill-[#E7711B]" />
              ))}
            </div>
            <span className="text-muted-foreground font-bold text-lg">{avgRating}/5 Average Rating</span>
          </div>
        </motion.div>
      </div>

      {/* Desktop: Infinite Scroll Marquee */}
      {reviewsList.length > 0 && (
        <div className="hidden md:block relative">
          <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          <div className="flex">
            <motion.div
              className="flex gap-8 whitespace-nowrap px-8 py-6"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            >
              {[...reviewsList, ...reviewsList].map((review, index) => (
                <div
                  key={index}
                  className={`${review.bgColor} ${review.textColor} w-[380px] rounded-[2.5rem] p-8 md:p-10 flex flex-col min-h-[460px] shadow-2xl relative overflow-hidden shrink-0 whitespace-normal group hover:scale-[1.02] transition-transform duration-500`}
                >
                  <div className="mb-8 flex justify-between items-start">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                      <svg viewBox="0 0 24 24" className="w-7 h-7">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1c-4.3 0-8.01 2.47-9.82 6.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                    </div>
                    <Quote className={`w-12 h-12 opacity-10 ${review.textColor}`} />
                  </div>
                  <div className="flex-grow">
                    <p className="text-xl font-medium leading-relaxed italic line-clamp-6">&ldquo;{review.content}&rdquo;</p>
                  </div>
                  <div className="flex items-center gap-5 mt-10 pt-8 border-t border-black/5">
                    <div className="relative">{getAvatar(review)}</div>
                    <div>
                      <span className="font-bold text-xl block leading-tight">{review.name}</span>
                      <span className="text-xs uppercase font-bold tracking-[0.2em] opacity-80">Verified Client</span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      )}

      {/* Mobile: Card Slider with Pause/Play, Prev/Next */}
      {reviewsList.length > 0 && (
        <div className="md:hidden relative px-4">
          <div className="relative overflow-hidden min-h-[450px]">
            <motion.div
              className="flex"
              animate={{ x: `-${currentSlide * 100}%` }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              {reviewsList.map((review, index) => (
                <div key={index} className="w-full flex-shrink-0 px-2">
                  <div className={`${review.bgColor} ${review.textColor} rounded-[2.5rem] p-8 flex flex-col min-h-[420px] shadow-2xl relative overflow-hidden`}>
                    <div className="mb-6 flex justify-between items-start">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                        <svg viewBox="0 0 24 24" className="w-6 h-6">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1c-4.3 0-8.01 2.47-9.82 6.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <p className="text-lg font-medium leading-relaxed italic line-clamp-8">&ldquo;{review.content}&rdquo;</p>
                    </div>
                    <div className="flex items-center gap-4 mt-8 pt-6 border-t border-black/5">
                      {review.photo_url ? (
                        <img src={review.photo_url} alt={review.name} className="w-12 h-12 rounded-full border-2 border-white/20 object-cover shadow-sm" />
                      ) : (
                        <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center bg-white/90 text-slate-800 font-bold text-lg shadow-sm">
                          {(review.name || "?").charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-base block">{review.name}</span>
                        <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">Verified Client</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Controls: Pause/Play, Prev, Next, Dots */}
          <div className="flex items-center justify-between mt-6 px-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPaused((p) => !p)}
                className="p-2.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                aria-label={isPaused ? "Play" : "Pause"}
              >
                {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              </button>
              <button onClick={goPrev} className="p-2.5 rounded-full bg-slate-200 hover:bg-slate-300 transition-colors" aria-label="Previous review">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={goNext} className="p-2.5 rounded-full bg-slate-200 hover:bg-slate-300 transition-colors" aria-label="Next review">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              {reviewsList.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className="group p-2 -m-2 flex items-center justify-center"
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <div className={`h-2 transition-all duration-300 rounded-full ${index === currentSlide ? "bg-primary w-8" : "bg-gray-300 w-2 group-hover:bg-gray-400"}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA Card */}
      <div className="container px-4 mt-16 md:mt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-card border border-border rounded-[3rem] p-8 md:p-16 text-center max-w-5xl mx-auto shadow-2xl relative overflow-hidden group"
        >
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-[#E7711B]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Star className="w-8 h-8 text-[#E7711B] fill-[#E7711B]" />
            </div>
            <h3 className="text-3xl md:text-5xl font-display font-bold mb-6">
              Your Review <span className="font-script text-primary">Makes Our Day</span>
            </h3>
            <p className="text-muted-foreground text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              We take pride in every clean. Join our community of happy customers and help others find the care their garments deserve.
            </p>
            <a
              href="https://www.google.com/search?sca_esv=c8b5f341cb5ad75c&sxsrf=ANbL-n5BPFpcPoI_V7rP9if22dLiXIKcig:1771099428664&si=AL3DRZHrmvnFAVQPOO2Bzhf8AX9KZZ6raUI_dT7DG_z0kV2_x5y9JMAGqfr4bAoZfpUtPvjPbS2cpoI-Xc1gWPhcXMC8s-48tf-hQ2XJ8D09SeQ7ZN3eC2hSdGvMkTHJB-YPJURX_yXg&q=Speedy+Laundry+Reviews&sa=X&ved=2ahUKEwiayLrC49mSAxUoe_UHHWY7MVIQ0bkNegQIIxAH&biw=1366&bih=607&dpr=1#lrd=0x48768a6e2e0602d9:0x9e4b79a6c2514294,3,,,,"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 bg-primary text-white px-8 md:px-12 py-4 md:py-6 rounded-full text-lg md:text-xl font-bold hover:brightness-110 transition-all transform active:scale-95"
            >
              Post a Review on Google
            </a>
          </div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
        </motion.div>
      </div>
    </section>
  );
};

export default Reviews;
