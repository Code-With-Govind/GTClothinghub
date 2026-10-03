import React from 'react';
import { Link } from 'react-router-dom';
import { Shirt, Palette, Paintbrush, Flame, Sparkles, ArrowRight } from 'lucide-react';

export default function MovingCategoriesMarquee() {
  const categoryItems = [
    {
      name: 'Regular Plain T-Shirts',
      badge: 'Classic Fit',
      icon: Shirt,
      path: '/shop?mainSection=Regular+T-Shirts&subSection=Plain+T-Shirts',
      image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Oversized Graphics',
      badge: 'Heavy 240 GSM',
      icon: Flame,
      path: '/shop?mainSection=Oversized+T-Shirts&subSection=Printed+T-Shirts',
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Custom Printed Canvas',
      badge: 'Your Artwork',
      icon: Paintbrush,
      path: '/shop?subSection=Add+Your+Custom+Designs',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Oversized Plain Basics',
      badge: 'Drop Shoulder',
      icon: Shirt,
      path: '/shop?mainSection=Oversized+T-Shirts&subSection=Plain+T-Shirts',
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Regular Printed Art',
      badge: 'Vintage Prints',
      icon: Palette,
      path: '/shop?mainSection=Regular+T-Shirts&subSection=Printed+T-Shirts',
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const marqueeItems = [...categoryItems, ...categoryItems];

  return (
    <div className="w-full space-y-3 py-4 overflow-hidden border-y border-[#E5E0D8] bg-white">
      <div className="flex items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#111111]" />
          <span className="text-[10px] font-mono font-bold uppercase text-[#111111] tracking-widest">
            FEATURED CATEGORIES
          </span>
        </div>
        <span className="text-[10px] text-[#737373] font-mono hidden sm:inline-block">
          Hover to pause
        </span>
      </div>

      <div className="relative w-full overflow-hidden py-2 bg-[#F7F5F0]">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] gap-4 px-4">
          {marqueeItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                to={item.path}
                className="group shrink-0 w-72 h-32 p-4 bg-white border border-[#E5E0D8] hover:border-[#111111] transition-all duration-300 relative overflow-hidden flex flex-col justify-between shadow-fashion-sm"
              >
                <div className="flex items-center justify-between relative z-10">
                  <span className="fashion-badge-subtle">
                    {item.badge}
                  </span>
                  <Icon className="w-4 h-4 text-[#111111] group-hover:scale-110 transition-transform" />
                </div>

                <div className="relative z-10">
                  <h4 className="font-display font-extrabold text-[#111111] text-sm uppercase leading-tight group-hover:text-[#404040]">
                    {item.name}
                  </h4>
                  <span className="text-[9px] font-bold text-[#737373] uppercase tracking-widest flex items-center gap-1 mt-1 group-hover:text-[#111111]">
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

