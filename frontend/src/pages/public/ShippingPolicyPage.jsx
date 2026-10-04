import React from 'react';
import SEO from '../../components/common/SEO';
import { useSettings } from '../../context/SettingsContext';

export default function ShippingPolicyPage() {
  const { settings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 bg-[#F5F1E8]">
      <SEO title="Shipping & Delivery Policy | GT CLOTHING HUB" />
      <div className="border-b border-[#DDD7CB] pb-6 text-center space-y-2">
        <span className="text-xs font-bold text-[#B89452] tracking-widest uppercase font-mono">STORE POLICIES</span>
        <h1 className="text-3xl font-extrabold text-[#292621] uppercase font-display tracking-tight">SHIPPING & DELIVERY POLICY</h1>
      </div>

      <div className="bg-white p-8 border border-[#DDD7CB] shadow-fashion-sm space-y-4 text-[#6F6A61] text-xs sm:text-sm leading-relaxed font-sans font-medium">
        <p>{settings.shippingPolicy || 'Orders are printed on demand and shipped within 3-5 business days.'}</p>
        <h3 className="font-extrabold text-xs text-[#292621] uppercase pt-2 font-display">FULFILLMENT TIMELINES</h3>
        <p>1. Print Production: 1-2 Business Days</p>
        <p>2. Quality Inspection & Packaging: 1 Business Day</p>
        <p>3. Courier Transit (Pan-India): 2-4 Business Days via Delhivery / BlueDart Express</p>
      </div>
    </div>
  );
}

