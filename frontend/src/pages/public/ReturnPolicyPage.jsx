import React from 'react';
import SEO from '../../components/common/SEO';
import { useSettings } from '../../context/SettingsContext';

export default function ReturnPolicyPage() {
  const { settings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8 bg-[#F7F5F0]">
      <SEO title="Return & Refund Policy | GT CLOTHING HUB" />
      <div className="border-b border-[#E5E2DC] pb-6 text-center space-y-2">
        <span className="text-xs font-bold text-[#6F7358] tracking-widest uppercase font-mono">STORE POLICIES</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] uppercase font-display tracking-tight">RETURN & REFUND POLICY</h1>
      </div>

      <div className="bg-white p-8 sm:p-10 rounded-2xl border border-[#E5E2DC] shadow-xs space-y-4 text-[#666666] text-xs sm:text-sm leading-relaxed font-sans font-medium">
        <p>{settings.returnPolicy || 'Returns accepted for defective or damaged products within 7 days of delivery.'}</p>
        <h3 className="font-extrabold text-xs text-[#111111] uppercase pt-2 font-display tracking-wide">RETURN CONDITIONS</h3>
        <p>1. Item must be unworn, unwashed, with original tags intact.</p>
        <p>2. Return request must be initiated within 7 days from delivery date.</p>
        <p>3. Refunds are credited to original payment source upon verification.</p>
      </div>
    </div>
  );
}


