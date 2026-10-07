import React from 'react';
import SEO from '../../components/common/SEO';
import { useSettings } from '../../context/SettingsContext';

export default function TermsPage() {
  const { settings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8 bg-[#F7F5F0]">
      <SEO title="Terms & Conditions | GT CLOTHING HUB" />
      <div className="border-b border-[#E5E2DC] pb-6 text-center space-y-2">
        <span className="text-xs font-bold text-[#6F7358] tracking-widest uppercase font-mono">LEGAL AGREEMENT</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] uppercase font-display tracking-tight">TERMS & CONDITIONS</h1>
      </div>

      <div className="bg-white p-8 sm:p-10 rounded-2xl border border-[#E5E2DC] shadow-xs space-y-4 text-[#666666] text-xs sm:text-sm leading-relaxed font-sans font-medium">
        <p>{settings.termsConditions || 'Standard Terms and Conditions for GT CLOTHING HUB.'}</p>
        <p>By browsing or making a purchase on this site, you agree to our purchasing, tax compliance, and order fulfillment terms.</p>
      </div>
    </div>
  );
}


