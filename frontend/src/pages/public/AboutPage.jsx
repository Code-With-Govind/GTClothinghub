import React from 'react';
import SEO from '../../components/common/SEO';
import { useSettings } from '../../context/SettingsContext';

export default function AboutPage() {
  const { settings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 bg-[#F5F1E8]">
      <SEO title="About Our Brand | GT CLOTHING HUB" />
      <div className="border-b border-[#DDD7CB] pb-6 text-center space-y-2">
        <span className="text-xs font-bold text-[#B89452] tracking-widest uppercase font-mono">BRAND ETHOS</span>
        <h1 className="text-3xl font-extrabold text-[#292621] uppercase font-display tracking-tight">ABOUT {settings.brandName || 'GT CLOTHING HUB'}</h1>
      </div>

      <div className="bg-white p-8 border border-[#DDD7CB] shadow-fashion-sm space-y-6 text-[#6F6A61] text-xs sm:text-sm leading-relaxed">
        <p>
          Founded with a mission to deliver heavyweight, high-density graphic apparel drops, {settings.brandName || 'GT CLOTHING HUB'} operates on a contemporary print-on-demand model engineered for streetwear enthusiasts.
        </p>

        <h3 className="text-sm font-extrabold text-[#292621] uppercase font-display">OUR QUALITY STANDARD</h3>
        <p>
          Every garment is printed individually upon order placement using 240 GSM super-combed cotton. We reject thin, flimsy fabrics. Our drop-shoulder oversized silhouettes are engineered to maintain their structured drape over time.
        </p>

        <h3 className="text-sm font-extrabold text-[#292621] uppercase font-display">SUSTAINABILITY & POD FULFILLMENT</h3>
        <p>
          By producing only what our customers order, we eliminate unnecessary fabric waste while maintaining artisan print precision and strict quality standards.
        </p>
      </div>
    </div>
  );
}

