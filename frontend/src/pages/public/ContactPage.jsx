import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import SEO from '../../components/common/SEO';
import { useSettings } from '../../context/SettingsContext';

export default function ContactPage() {
  const { settings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <SEO title="Contact Support" />
      <div className="border-b border-neutral-200 pb-6 text-center space-y-2">
        <span className="text-xs font-bold text-[#C8A96B] tracking-widest uppercase font-mono">Get In Touch</span>
        <h1 className="text-3xl font-black text-[#171717] uppercase font-display tracking-tight">Contact Support</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-sm text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-neutral-100 text-[#111111] flex items-center justify-center mx-auto">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-[#171717] text-sm">Customer Email</h3>
          <p className="text-xs text-neutral-500 font-mono">{settings.supportEmail || 'support@gtclothinghub.com'}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-sm text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-neutral-100 text-[#111111] flex items-center justify-center mx-auto">
            <Phone className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-[#171717] text-sm">Phone Support</h3>
          <p className="text-xs text-neutral-500 font-mono">{settings.supportPhone || '+91 98765 43210'}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-sm text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-neutral-100 text-[#111111] flex items-center justify-center mx-auto">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-[#171717] text-sm">Studio Address</h3>
          <p className="text-xs text-neutral-500">
            {settings.address?.street || 'Main HQ'}, {settings.address?.city || 'Bengaluru'}, {settings.address?.state || 'Karnataka'} - {settings.address?.pincode || '560001'}
          </p>
        </div>
      </div>
    </div>
  );
}

