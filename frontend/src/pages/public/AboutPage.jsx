import React from 'react';
import SEO from '../../components/common/SEO';
import { useSettings } from '../../context/SettingsContext';

export default function AboutPage() {
  const { settings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8 bg-[#F7F5F0]">
      <SEO title="About Our Brand | GT CLOTHING HUB" />
      <div className="border-b border-[#E5E2DC] pb-6 text-center space-y-2">
        <span className="text-xs font-bold text-[#6F7358] tracking-widest uppercase font-mono">BRAND ETHOS</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] uppercase font-display tracking-tight">
          ABOUT {settings.brandName || 'GT CLOTHING HUB'}
        </h1>
      </div>

      <div className="bg-white p-8 sm:p-10 rounded-2xl border border-[#E5E2DC] shadow-xs space-y-6 text-[#666666] text-xs sm:text-sm leading-relaxed">
        <p>
          Founded with a mission to deliver heavyweight, high-density graphic apparel drops, {settings.brandName || 'GT CLOTHING HUB'} operates on a contemporary print-on-demand model engineered for streetwear enthusiasts.
        </p>

        <h3 className="text-base font-extrabold text-[#111111] uppercase font-display tracking-wide">OUR QUALITY STANDARD</h3>
        <p>
          Every garment is printed individually upon order placement using 240 GSM super-combed cotton. We reject thin, flimsy fabrics. Our drop-shoulder oversized silhouettes are engineered to maintain their structured drape over time.
        </p>

        <h3 className="text-base font-extrabold text-[#111111] uppercase font-display tracking-wide">SUSTAINABILITY & POD FULFILLMENT</h3>
        <p>
          By producing only what our customers order, we eliminate unnecessary fabric waste while maintaining artisan print precision and strict quality standards.
        </p>
      </div>
    </div>
  );
}


