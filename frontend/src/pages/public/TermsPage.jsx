import React from 'react';
import SEO from '../../components/common/SEO';
import { useSettings } from '../../context/SettingsContext';

export default function TermsPage() {
  const { settings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 bg-[#F5F1E8]">
      <SEO title="Terms & Conditions | GT CLOTHING HUB" />
      <div className="border-b border-[#DDD7CB] pb-6 text-center space-y-2">
        <span className="text-xs font-bold text-[#B89452] tracking-widest uppercase font-mono">LEGAL AGREEMENT</span>
        <h1 className="text-3xl font-extrabold text-[#292621] uppercase font-display tracking-tight">TERMS & CONDITIONS</h1>
      </div>

      <div className="bg-white p-8 border border-[#DDD7CB] shadow-fashion-sm space-y-4 text-[#6F6A61] text-xs sm:text-sm leading-relaxed font-sans font-medium">
        <p>{settings.termsConditions || 'Standard Terms and Conditions for GT CLOTHING HUB.'}</p>
        <p>By browsing or making a purchase on this site, you agree to our purchasing, tax compliance, and order fulfillment terms.</p>
      </div>
    </div>
  );
}

