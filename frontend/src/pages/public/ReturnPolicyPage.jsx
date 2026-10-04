import React from 'react';
import SEO from '../../components/common/SEO';
import { useSettings } from '../../context/SettingsContext';

export default function ReturnPolicyPage() {
  const { settings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 bg-[#F5F1E8]">
      <SEO title="Return & Refund Policy | GT CLOTHING HUB" />
      <div className="border-b border-[#DDD7CB] pb-6 text-center space-y-2">
        <span className="text-xs font-bold text-[#B89452] tracking-widest uppercase font-mono">STORE POLICIES</span>
        <h1 className="text-3xl font-extrabold text-[#292621] uppercase font-display tracking-tight">RETURN & REFUND POLICY</h1>
      </div>

      <div className="bg-white p-8 border border-[#DDD7CB] shadow-fashion-sm space-y-4 text-[#6F6A61] text-xs sm:text-sm leading-relaxed font-sans font-medium">
        <p>{settings.returnPolicy || 'Returns accepted for defective or damaged products within 7 days of delivery.'}</p>
        <h3 className="font-extrabold text-xs text-[#292621] uppercase pt-2 font-display">RETURN CONDITIONS</h3>
        <p>1. Item must be unworn, unwashed, with original tags intact.</p>
        <p>2. Return request must be initiated within 7 days from delivery date.</p>
        <p>3. Refunds are credited to original payment source upon verification.</p>
      </div>
    </div>
  );
}

