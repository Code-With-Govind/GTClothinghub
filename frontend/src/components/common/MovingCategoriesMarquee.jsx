import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Tag, ShieldCheck, Zap } from 'lucide-react';

export default function MovingCategoriesMarquee() {
  const categoryBanners = [
    {
      id: 1,
      name: 'OVERSIZED STREETWEAR',
      badge: 'EARLY BIRD DROP',
      offer: 'Min. 40-70% Off',
      details: '240 GSM Boxy Heavyweight',
      bankOffer: 'AXIS | ICICI | UPI 10% Instant Discount*',
      path: '/shop?mainSection=Oversized+T-Shirts',
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop&q=80',
      gradient: 'from-[#2A1B4E] via-[#4C1D95] to-[#5B21B6]',
      accentColor: 'border-purple-300/40',
      badgeBg: 'bg-amber-400 text-purple-950',
    },
    {
      id: 2,
      name: 'HEAVY FLEECE HOODIES',
      badge: 'WINTER SPECIAL',
      offer: 'Under ₹999 Deals',
      details: 'Drop Shoulder Fleece Silhouette',
      bankOffer: 'BHIM | PAYTM | CRED Extra Savings*',
      path: '/shop?search=Hoodie',
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80',
      gradient: 'from-[#0F172A] via-[#1E293B] to-[#2563EB]',
      accentColor: 'border-blue-300/40',
      badgeBg: 'bg-blue-400 text-slate-950',
    },
    {
      id: 3,
      name: 'CLASSIC REGULAR FITS',
      badge: 'EVERYDAY BASICS',
      offer: 'Starting @ ₹399',
      details: '100% Super Combed Pure Cotton',
      bankOffer: 'AXIS | HDFC | ICICI 10% Instant Discount*',
      path: '/shop?mainSection=Regular+T-Shirts',
      image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&auto=format&fit=crop&q=80',
      gradient: 'from-[#3B192E] via-[#881337] to-[#E11D48]',
      accentColor: 'border-rose-300/40',
      badgeBg: 'bg-rose-300 text-rose-950',
    },
    {
      id: 4,
      name: 'CUSTOM PRINT CANVAS',
      badge: 'PRINT ON DEMAND',
      offer: 'Upload Your Art',
      details: 'High-Density DTG Custom Print',
      bankOffer: 'FREE SHIPPING Pan-India Delivery*',
      path: '/shop?subSection=Add+Your+Custom+Designs',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
      gradient: 'from-[#292621] via-[#4A3E2D] to-[#B89452]',
      accentColor: 'border-amber-300/40',
      badgeBg: 'bg-[#B89452] text-[#292621]',
    },
  ];

  return (
    <div className="w-full py-6 bg-[#FAF8F3] border-y border-[#DDD7CB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#B89452]" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#292621]">
              FEATURED DROPS & EXCLUSIVE OFFERS
            </span>
          </div>
          <span className="text-[11px] text-[#6F6A61] font-mono font-semibold hidden sm:inline-block">
            4 Exclusive Category Banners
          </span>
        </div>

        {/* 4 Cards Responsive Banner Grid (1 card on mobile slider, 2 on tablet, 4 on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryBanners.map((banner) => (
            <Link
              key={banner.id}
              to={banner.path}
              className={`group relative h-36 sm:h-40 bg-gradient-to-br ${banner.gradient} text-white rounded-3xl p-3.5 sm:p-4 border border-white/20 shadow-fashion-sm hover:shadow-fashion-md hover:scale-[1.02] transition-all duration-300 overflow-hidden flex flex-col justify-between`}
            >
              {/* Background ambient lighting overlay */}
              <div className="absolute -top-12 -left-12 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />

              {/* Top Row: Badge pill */}
              <div className="flex items-center justify-between relative z-10">
                <span className={`px-2.5 py-0.5 text-[9px] font-mono font-black uppercase tracking-wider rounded-full shadow-sm flex items-center gap-1 ${banner.badgeBg}`}>
                  <Sparkles className="w-2.5 h-2.5 shrink-0" />
                  {banner.badge}
                </span>
                <div className="w-5 h-5 bg-white/20 group-hover:bg-white text-white group-hover:text-[#292621] rounded-full flex items-center justify-center transition-colors">
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>

              {/* Middle Section: Title & Offer text */}
              <div className="relative z-10 max-w-[62%] space-y-0.5 my-auto">
                <h3 className="font-display font-black text-xs sm:text-sm uppercase tracking-tight text-white group-hover:text-amber-300 transition-colors leading-tight line-clamp-1">
                  {banner.name}
                </h3>
                <p className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wide leading-none">
                  {banner.offer}
                </p>
                <p className="text-[9px] font-mono font-medium text-white/80 line-clamp-1">
                  {banner.details}
                </p>
              </div>

              {/* Bottom Row: Bank / UPI Offer Pill Bar */}
              <div className="relative z-10 max-w-[65%]">
                <div className="bg-white/95 text-[#292621] px-2 py-0.5 rounded-md text-[8px] font-mono font-bold flex items-center gap-1 truncate shadow-xs">
                  <Tag className="w-2.5 h-2.5 shrink-0 text-[#B89452]" />
                  <span className="truncate">{banner.bankOffer}</span>
                </div>
              </div>

              {/* Right Side: Curved Arch Product Cutout Showcase */}
              <div className="absolute right-2 top-2 bottom-2 w-24 sm:w-28 rounded-t-full rounded-b-2xl overflow-hidden border-2 border-white/30 shadow-md group-hover:border-white transition-colors bg-black/20">
                <img
                  src={banner.image}
                  alt={banner.name}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            </Link>
          ))}
        </div>

        {/* Carousel Pagination Dots Indicator */}
        <div className="flex justify-center items-center gap-1.5 pt-1">
          <span className="w-6 h-1.5 bg-[#292621] rounded-full transition-all" />
          <span className="w-1.5 h-1.5 bg-[#DDD7CB] rounded-full" />
          <span className="w-1.5 h-1.5 bg-[#DDD7CB] rounded-full" />
          <span className="w-1.5 h-1.5 bg-[#DDD7CB] rounded-full" />
        </div>
      </div>
    </div>
  );
}


