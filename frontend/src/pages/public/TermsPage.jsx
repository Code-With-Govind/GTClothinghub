import React from 'react';
import SEO from '../../components/common/SEO';
import { useSettings } from '../../context/SettingsContext';

export default function TermsPage() {
  const { settings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <SEO title="Terms & Conditions" />
      <div className="border-b border-neutral-200 pb-6 text-center space-y-2">
        <span className="text-xs font-bold text-[#C8A96B] tracking-widest uppercase font-mono">Legal Agreement</span>
        <h1 className="text-3xl font-black text-[#171717] uppercase font-display tracking-tight">Terms & Conditions</h1>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-neutral-200/80 shadow-sm space-y-4 text-neutral-600 text-xs sm:text-sm leading-relaxed">
        <p>{settings.termsConditions || 'Standard Terms and Conditions for GT CLOTHING HUB.'}</p>
        <p>By browsing or making a purchase on this site, you agree to our purchasing, tax compliance, and order fulfillment terms.</p>
      </div>
    </div>
  );
}

