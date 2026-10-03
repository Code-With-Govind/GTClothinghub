import React from 'react';
import SEO from '../../components/common/SEO';
import { useSettings } from '../../context/SettingsContext';

export default function PrivacyPolicyPage() {
  const { settings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <SEO title="Privacy Policy" />
      <div className="border-b border-neutral-200 pb-6 text-center space-y-2">
        <span className="text-xs font-bold text-[#C8A96B] tracking-widest uppercase font-mono">Legal Compliance</span>
        <h1 className="text-3xl font-black text-[#171717] uppercase font-display tracking-tight">Privacy Policy</h1>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-neutral-200/80 shadow-sm space-y-4 text-neutral-600 text-xs sm:text-sm leading-relaxed">
        <p>{settings.privacyPolicy || 'Standard Privacy Policy for GT CLOTHING HUB.'}</p>
        <p>We strictly protect your personal information, shipping addresses, and payment details. We do not sell or trade user data to third-party advertisers.</p>
      </div>
    </div>
  );
}

