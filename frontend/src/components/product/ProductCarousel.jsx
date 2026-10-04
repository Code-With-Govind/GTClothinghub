import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

export default function ProductCarousel({ products = [], title, subtitle }) {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const totalSlides = Math.max(1, products.length);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) {
      setActiveIndex(0);
      return;
    }
    const index = Math.round((scrollLeft / maxScroll) * (totalSlides - 1));
    setActiveIndex(Math.min(index, totalSlides - 1));
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, [products]);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;
    const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const scrollToIndex = (index) => {
    if (!scrollRef.current) return;
    const { scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    const targetScroll = (index / (totalSlides - 1)) * maxScroll;
    scrollRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="w-full relative group">
      {/* Title Header if provided */}
      {(title || subtitle) && (
        <div className="mb-6 flex items-end justify-between border-b border-[#DDD7CB] pb-4">
          <div>
            {subtitle && (
              <span className="text-[10px] font-mono font-bold text-[#6F6A61] uppercase tracking-widest block">
                {subtitle}
              </span>
            )}
            {title && (
              <h2 className="text-2xl sm:text-3xl font-extrabold uppercase text-[#292621] font-display">
                {title}
              </h2>
            )}
          </div>
        </div>
      )}

      {/* Main Carousel Wrapper with Left & Right Floating Arrow Buttons */}
      <div className="relative">
        {/* Left Circular Arrow Button */}
        <button
          onClick={() => scroll('left')}
          className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 bg-white/95 hover:bg-white text-[#292621] rounded-full border border-[#DDD7CB] shadow-fashion-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-30"
          aria-label="Previous Products"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Right Circular Arrow Button */}
        <button
          onClick={() => scroll('right')}
          className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 bg-white/95 hover:bg-white text-[#292621] rounded-full border border-[#DDD7CB] shadow-fashion-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-30"
          aria-label="Next Products"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Scrollable Track */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none py-2 px-1 scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div
              key={product._id || product.id}
              className="shrink-0 w-[calc(50%-8px)] sm:w-[calc(33.333%-12px)] md:w-[calc(25%-14px)] lg:w-[calc(20%-15px)] snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Carousel Navigation Dots Indicator */}
      <div className="flex justify-center items-center gap-2 pt-6">
        {products.slice(0, Math.min(8, products.length)).map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollToIndex(idx)}
            className={`transition-all duration-300 rounded-full ${
              activeIndex === idx
                ? 'w-6 h-2 bg-[#292621]'
                : 'w-2 h-2 bg-[#DDD7CB] hover:bg-[#6F6A61]'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
