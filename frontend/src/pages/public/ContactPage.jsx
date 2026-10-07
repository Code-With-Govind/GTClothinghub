import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import SEO from '../../components/common/SEO';
import { useSettings } from '../../context/SettingsContext';

export default function ContactPage() {
  const { settings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8 bg-[#F7F5F0]">
      <SEO title="Contact Support | GT CLOTHING HUB" />
      <div className="border-b border-[#E5E2DC] pb-6 text-center space-y-2">
        <span className="text-xs font-bold text-[#6F7358] tracking-widest uppercase font-mono">GET IN TOUCH</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] uppercase font-display tracking-tight">CONTACT SUPPORT</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E2DC] shadow-xs text-center space-y-4">
          <div className="w-12 h-12 bg-[#F7F5F0] border border-[#E5E2DC] text-[#111111] flex items-center justify-center mx-auto rounded-xl">
            <Mail className="w-6 h-6 text-[#111111]" />
          </div>
          <h3 className="font-extrabold text-[#111111] text-xs uppercase font-display tracking-wide">Customer Email</h3>
          <p className="text-xs text-[#666666] font-mono">{settings.supportEmail || 'support@gtclothinghub.com'}</p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E2DC] shadow-xs text-center space-y-4">
          <div className="w-12 h-12 bg-[#F7F5F0] border border-[#E5E2DC] text-[#111111] flex items-center justify-center mx-auto rounded-xl">
            <Phone className="w-6 h-6 text-[#111111]" />
          </div>
          <h3 className="font-extrabold text-[#111111] text-xs uppercase font-display tracking-wide">Phone Support</h3>
          <p className="text-xs text-[#666666] font-mono">{settings.supportPhone || '+91 98765 43210'}</p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E2DC] shadow-xs text-center space-y-4">
          <div className="w-12 h-12 bg-[#F7F5F0] border border-[#E5E2DC] text-[#111111] flex items-center justify-center mx-auto rounded-xl">
            <MapPin className="w-6 h-6 text-[#111111]" />
          </div>
          <h3 className="font-extrabold text-[#111111] text-xs uppercase font-display tracking-wide">Studio Address</h3>
          <p className="text-xs text-[#666666] leading-relaxed font-sans">
            {settings.address?.street || 'Main Studio HQ'}, {settings.address?.city || 'Bengaluru'}, {settings.address?.state || 'Karnataka'} - {settings.address?.pincode || '560001'}
          </p>
        </div>
      </div>
    </div>
  );
}


