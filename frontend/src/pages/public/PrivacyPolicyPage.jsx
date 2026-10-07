import React from 'react';
import SEO from '../../components/common/SEO';
import { useSettings } from '../../context/SettingsContext';

export default function PrivacyPolicyPage() {
  const { settings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8 bg-[#F7F5F0]">
      <SEO title="Privacy Policy | GT CLOTHING HUB" />
      <div className="border-b border-[#E5E2DC] pb-6 text-center space-y-2">
        <span className="text-xs font-bold text-[#6F7358] tracking-widest uppercase font-mono">LEGAL COMPLIANCE</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] uppercase font-display tracking-tight">PRIVACY POLICY</h1>
      </div>

      <div className="bg-white p-8 sm:p-10 rounded-2xl border border-[#E5E2DC] shadow-xs space-y-4 text-[#666666] text-xs sm:text-sm leading-relaxed">
        <p>{settings.privacyPolicy || 'Standard Privacy Policy for GT CLOTHING HUB.'}</p>
        <p>We strictly protect your personal information, shipping addresses, and payment details. We do not sell or trade user data to third-party advertisers.</p>
      </div>
    </div>
  );
}


