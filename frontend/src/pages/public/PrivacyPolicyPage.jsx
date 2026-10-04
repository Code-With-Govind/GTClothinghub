import React from 'react';
import SEO from '../../components/common/SEO';
import { useSettings } from '../../context/SettingsContext';

export default function PrivacyPolicyPage() {
  const { settings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 bg-[#F5F1E8]">
      <SEO title="Privacy Policy | GT CLOTHING HUB" />
      <div className="border-b border-[#DDD7CB] pb-6 text-center space-y-2">
        <span className="text-xs font-bold text-[#B89452] tracking-widest uppercase font-mono">LEGAL COMPLIANCE</span>
        <h1 className="text-3xl font-extrabold text-[#292621] uppercase font-display tracking-tight">PRIVACY POLICY</h1>
      </div>

      <div className="bg-white p-8 border border-[#DDD7CB] shadow-fashion-sm space-y-4 text-[#6F6A61] text-xs sm:text-sm leading-relaxed font-sans font-medium">
        <p>{settings.privacyPolicy || 'Standard Privacy Policy for GT CLOTHING HUB.'}</p>
        <p>We strictly protect your personal information, shipping addresses, and payment details. We do not sell or trade user data to third-party advertisers.</p>
      </div>
    </div>
  );
}

