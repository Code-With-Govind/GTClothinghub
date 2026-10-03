import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import SEO from '../../components/common/SEO';
import { useSettings } from '../../context/SettingsContext';
import api from '../../services/api';

export default function WebsiteSettingsPage() {
  const { settings, refreshSettings } = useSettings();
  const [formData, setFormData] = useState({
    storeName: '',
    brandName: '',
    supportEmail: '',
    supportPhone: '',
    businessMode: 'PRE_REGISTRATION',
    gstin: '',
    gstRatePercentage: 5,
    shippingFee: 79,
    freeShippingThreshold: 999,
    codEnabled: true,
    codExtraFee: 49,
    termsConditions: '',
    privacyPolicy: '',
    shippingPolicy: '',
    returnPolicy: '',
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (settings) {
      setFormData({
        storeName: settings.storeName || '',
        brandName: settings.brandName || '',
        supportEmail: settings.supportEmail || '',
        supportPhone: settings.supportPhone || '',
        businessMode: settings.businessMode || 'PRE_REGISTRATION',
        gstin: settings.gstin || '',
        gstRatePercentage: settings.gstRatePercentage || 5,
        shippingFee: settings.shippingFee || 79,
        freeShippingThreshold: settings.freeShippingThreshold || 999,
        codEnabled: settings.codEnabled !== false,
        codExtraFee: settings.codExtraFee || 49,
        termsConditions: settings.termsConditions || '',
        privacyPolicy: settings.privacyPolicy || '',
        shippingPolicy: settings.shippingPolicy || '',
        returnPolicy: settings.returnPolicy || '',
      });
    }
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await api.put('/settings', formData);
      await refreshSettings();
      setMessage('Settings updated successfully');
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F7F5F0]">
      <SEO title="Website Settings" />
      <AdminSidebar />
      <main className="flex-1 p-8 space-y-8 overflow-y-auto max-w-4xl">
        <div className="border-b border-neutral-200 pb-6">
          <span className="text-xs font-bold text-[#C8A96B] tracking-widest uppercase font-mono">Store Configuration</span>
          <h1 className="text-3xl font-black text-[#171717] uppercase font-display tracking-tight">Store Settings & Business Compliance</h1>
        </div>

        {message && <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-bold">{message}</div>}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200/80 shadow-sm space-y-6">
          
          {/* Business Compliance Section */}
          <div className="space-y-4 border-b border-neutral-200 pb-6">
            <h3 className="font-bold text-sm text-[#171717] uppercase font-display">1. Tax Compliance & Business Mode</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#171717] uppercase mb-1">Business Compliance Mode</label>
                <select
                  value={formData.businessMode}
                  onChange={(e) => setFormData({ ...formData, businessMode: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs text-[#171717] focus:outline-none focus:border-[#111111]"
                >
                  <option value="PRE_REGISTRATION">PRE_REGISTRATION (Pre-GST Bill of Sale)</option>
                  <option value="GST_REGISTERED">GST_REGISTERED (GST Tax Invoices)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] uppercase mb-1">GSTIN (Optional until registered)</label>
                <input
                  type="text"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                  placeholder="29AAAAA0000A1Z5"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs text-[#171717] uppercase font-mono focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>
          </div>

          {/* Store Brand Details */}
          <div className="space-y-4 border-b border-neutral-200 pb-6">
            <h3 className="font-bold text-sm text-[#171717] uppercase font-display">2. Storefront Identity</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#171717] uppercase mb-1">Brand Name</label>
                <input
                  type="text"
                  value={formData.brandName}
                  onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs text-[#171717] focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] uppercase mb-1">Support Email</label>
                <input
                  type="email"
                  value={formData.supportEmail}
                  onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs text-[#171717] focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>
          </div>

          {/* Shipping & COD Controls */}
          <div className="space-y-4 border-b border-neutral-200 pb-6">
            <h3 className="font-bold text-sm text-[#171717] uppercase font-display">3. Shipping & Payment Rules</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#171717] uppercase mb-1">Base Shipping Fee (₹)</label>
                <input
                  type="number"
                  value={formData.shippingFee}
                  onChange={(e) => setFormData({ ...formData, shippingFee: Number(e.target.value) })}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs text-[#171717] focus:outline-none focus:border-[#111111]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#171717] uppercase mb-1">Free Shipping Threshold (₹)</label>
                <input
                  type="number"
                  value={formData.freeShippingThreshold}
                  onChange={(e) => setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs text-[#171717] focus:outline-none focus:border-[#111111]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#171717] uppercase mb-1">COD Enabled</label>
                <select
                  value={formData.codEnabled ? 'true' : 'false'}
                  onChange={(e) => setFormData({ ...formData, codEnabled: e.target.value === 'true' })}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs text-[#171717] focus:outline-none focus:border-[#111111]"
                >
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
              </div>
            </div>
          </div>

          <button type="submit" disabled={saving} className="w-full py-4 bg-[#111111] hover:bg-neutral-800 text-white text-xs font-bold uppercase rounded-xl transition-all shadow-sm">
            {saving ? 'Saving...' : 'Save All Website Settings'}
          </button>
        </form>
      </main>
    </div>
  );
}

