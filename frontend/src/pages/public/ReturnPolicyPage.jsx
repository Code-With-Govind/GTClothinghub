import React from 'react';
import SEO from '../../components/common/SEO';
import { useSettings } from '../../context/SettingsContext';

export default function ReturnPolicyPage() {
  const { settings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <SEO title="Return & Refund Policy" />
      <div className="border-b border-neutral-200 pb-6 text-center space-y-2">
        <span className="text-xs font-bold text-[#C8A96B] tracking-widest uppercase font-mono">Store Policies</span>
        <h1 className="text-3xl font-black text-[#171717] uppercase font-display tracking-tight">Return & Refund Policy</h1>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-neutral-200/80 shadow-sm space-y-4 text-neutral-600 text-xs sm:text-sm leading-relaxed">
        <p>{settings.returnPolicy || 'Returns accepted for defective or damaged products within 7 days of delivery.'}</p>
        <h3 className="font-bold text-sm text-[#171717] uppercase pt-2 font-display">Return Conditions</h3>
        <p>1. Item must be unworn, unwashed, with original tags intact.</p>
        <p>2. Return request must be initiated within 7 days from delivery date.</p>
        <p>3. Refunds are credited to original payment source upon verification.</p>
      </div>
    </div>
  );
}

