import React from 'react';
import SEO from '../../components/common/SEO';
import { useSettings } from '../../context/SettingsContext';

export default function AboutPage() {
  const { settings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <SEO title="About Our Brand" />
      <div className="border-b border-neutral-200 pb-6 text-center space-y-2">
        <span className="text-xs font-bold text-[#C8A96B] tracking-widest uppercase font-mono">Brand Ethos</span>
        <h1 className="text-3xl font-black text-[#171717] uppercase font-display tracking-tight">About {settings.brandName || 'GT CLOTHING HUB'}</h1>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-neutral-200/80 shadow-sm space-y-6 text-neutral-600 text-xs sm:text-sm leading-relaxed">
        <p>
          Founded with a mission to eliminate mass apparel waste while delivering heavyweight, high-density graphic apparel drops, {settings.brandName || 'GT CLOTHING HUB'} operates on a modern print-on-demand model.
        </p>

        <h3 className="text-lg font-bold text-[#171717] uppercase font-display">Our Quality Standard</h3>
        <p>
          Every single garment in our drops is printed individually upon order placement using 240 GSM super-combed cotton. We reject thin, flimsy fabrics. Our drop shoulder oversized fits are engineered to maintain their structured drape after dozens of washes.
        </p>

        <h3 className="text-lg font-bold text-[#171717] uppercase font-display">Sustainability & POD Fulfillment</h3>
        <p>
          Traditional fast fashion generates millions of unsold garments that end up in landfills. By producing only what our customers order, we minimize fabric waste while maintaining custom artisan print precision.
        </p>
      </div>
    </div>
  );
}

