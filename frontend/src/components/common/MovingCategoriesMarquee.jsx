import React from 'react';
import { Link } from 'react-router-dom';
import { Shirt, Palette, Paintbrush, Flame, Sparkles, ArrowRight } from 'lucide-react';

export default function MovingCategoriesMarquee() {
  const categoryItems = [
    {
      name: 'Regular T-Shirts',
      badge: 'Classic Fit',
      icon: Shirt,
      path: '/shop?mainSection=Regular+T-Shirts',
      image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Oversized Drops',
      badge: 'Heavy 240 GSM',
      icon: Flame,
      path: '/shop?mainSection=Oversized+T-Shirts',
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Fleece Hoodies',
      badge: 'Winter Comfort',
      icon: Palette,
      path: '/shop?search=Hoodie',
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Custom Prints',
      badge: 'Your Artwork',
      icon: Paintbrush,
      path: '/shop?subSection=Add+Your+Custom+Designs',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
    },
  ];

  // Repeat items for seamless marquee loop
  const marqueeItems = [...categoryItems, ...categoryItems, ...categoryItems];

  return (
    <div className="w-full space-y-3 py-4 overflow-hidden border-y border-[#DDD7CB] bg-[#FAF8F3]">
      <div className="flex items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#B89452]" />
          <span className="text-[10px] font-mono font-bold uppercase text-[#292621] tracking-widest">
            FEATURED CATEGORIES (4 AT A TIME)
          </span>
        </div>
        <span className="text-[10px] text-[#6F6A61] font-mono hidden sm:inline-block">
          Hover to pause
        </span>
      </div>

      <div className="relative w-full max-w-7xl mx-auto overflow-hidden py-2 px-4 sm:px-8">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] gap-4">
          {marqueeItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                to={item.path}
                className="group shrink-0 w-[calc((100vw-3rem)/2)] sm:w-[calc((100vw-5rem)/3)] md:w-[285px] lg:w-[292px] h-32 p-4 bg-white border border-[#DDD7CB] hover:border-[#292621] transition-all duration-300 relative overflow-hidden flex flex-col justify-between shadow-fashion-sm"
              >
                <div className="flex items-center justify-between relative z-10">
                  <span className="fashion-badge-subtle">
                    {item.badge}
                  </span>
                  <Icon className="w-4 h-4 text-[#292621] group-hover:scale-110 transition-transform" />
                </div>

                <div className="relative z-10">
                  <h4 className="font-display font-extrabold text-[#292621] text-xs sm:text-sm uppercase leading-tight group-hover:text-[#B89452] transition-colors">
                    {item.name}
                  </h4>
                  <span className="text-[9px] font-bold text-[#6F6A61] uppercase tracking-widest flex items-center gap-1 mt-1 group-hover:text-[#292621]">
                    Explore Drop <ArrowRight className="w-3 h-3" />
                  </span>
                </div>

                <img
                  src={item.image}
                  alt={item.name}
                  className="absolute right-0 top-0 w-28 h-full object-cover opacity-15 group-hover:opacity-30 transition-opacity pointer-events-none"
                />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

