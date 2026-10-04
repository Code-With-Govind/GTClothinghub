import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import SEO from '../../components/common/SEO';
import { useSettings } from '../../context/SettingsContext';

export default function ContactPage() {
  const { settings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 bg-[#F5F1E8]">
      <SEO title="Contact Support | GT CLOTHING HUB" />
      <div className="border-b border-[#DDD7CB] pb-6 text-center space-y-2">
        <span className="text-xs font-bold text-[#B89452] tracking-widest uppercase font-mono">GET IN TOUCH</span>
        <h1 className="text-3xl font-extrabold text-[#292621] uppercase font-display tracking-tight">CONTACT SUPPORT</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 border border-[#DDD7CB] shadow-fashion-sm text-center space-y-3">
          <div className="w-12 h-12 bg-[#FAF8F3] border border-[#DDD7CB] text-[#292621] flex items-center justify-center mx-auto">
            <Mail className="w-6 h-6 text-[#292621]" />
          </div>
          <h3 className="font-extrabold text-[#292621] text-xs uppercase font-display">Customer Email</h3>
          <p className="text-xs text-[#6F6A61] font-mono">{settings.supportEmail || 'support@gtclothinghub.com'}</p>
        </div>

        <div className="bg-white p-6 border border-[#DDD7CB] shadow-fashion-sm text-center space-y-3">
          <div className="w-12 h-12 bg-[#FAF8F3] border border-[#DDD7CB] text-[#292621] flex items-center justify-center mx-auto">
            <Phone className="w-6 h-6 text-[#292621]" />
          </div>
          <h3 className="font-extrabold text-[#292621] text-xs uppercase font-display">Phone Support</h3>
          <p className="text-xs text-[#6F6A61] font-mono">{settings.supportPhone || '+91 98765 43210'}</p>
        </div>

        <div className="bg-white p-6 border border-[#DDD7CB] shadow-fashion-sm text-center space-y-3">
          <div className="w-12 h-12 bg-[#FAF8F3] border border-[#DDD7CB] text-[#292621] flex items-center justify-center mx-auto">
            <MapPin className="w-6 h-6 text-[#292621]" />
          </div>
          <h3 className="font-extrabold text-[#292621] text-xs uppercase font-display">Studio Address</h3>
          <p className="text-xs text-[#6F6A61] leading-relaxed font-sans">
            {settings.address?.street || 'Main Studio HQ'}, {settings.address?.city || 'Bengaluru'}, {settings.address?.state || 'Karnataka'} - {settings.address?.pincode || '560001'}
          </p>
        </div>
      </div>
    </div>
  );
}

