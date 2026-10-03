import React from 'react';
import SEO from '../../components/common/SEO';
import { useSettings } from '../../context/SettingsContext';

export default function ShippingPolicyPage() {
  const { settings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <SEO title="Shipping Policy" />
      <div className="border-b border-neutral-200 pb-6 text-center space-y-2">
        <span className="text-xs font-bold text-[#C8A96B] tracking-widest uppercase font-mono">Store Policies</span>
        <h1 className="text-3xl font-black text-[#171717] uppercase font-display tracking-tight">Shipping & Delivery Policy</h1>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-neutral-200/80 shadow-sm space-y-4 text-neutral-600 text-xs sm:text-sm leading-relaxed">
        <p>{settings.shippingPolicy || 'Orders are printed on demand and shipped within 3-5 business days.'}</p>
        <h3 className="font-bold text-sm text-[#171717] uppercase pt-2 font-display">Fulfillment Timelines</h3>
        <p>1. Print Production: 1-2 Business Days</p>
        <p>2. Quality Inspection & Packaging: 1 Business Day</p>
        <p>3. Courier Transit (Pan-India): 2-4 Business Days via Delhivery / BlueDart Express</p>
      </div>
    </div>
  );
}

