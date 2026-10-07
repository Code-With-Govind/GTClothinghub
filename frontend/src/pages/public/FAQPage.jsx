import React from 'react';
import SEO from '../../components/common/SEO';

export default function FAQPage() {
  const faqs = [
    {
      q: 'How long does Print-on-Demand fulfillment take?',
      a: 'Orders enter print production within 24 hours of payment verification. Printing and quality inspection take 1-2 business days, followed by 2-3 days for courier delivery.',
    },
    {
      q: 'What is your fabric GSM & cotton quality?',
      a: 'We strictly use 220-240 GSM 100% super combed bio-washed premium cotton. Our tees are pre-shrunk to prevent shrinking after wash.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept Razorpay online payments (UPI GPay/PhonePe, Credit/Debit cards, Net Banking, Paytm) and Cash on Delivery (COD) for eligible pincodes.',
    },
    {
      q: 'Can I return or exchange a size?',
      a: 'Yes, we accept returns for defective, damaged, or size exchanges within 7 days of delivery. Please request a return through your account or order tracking link.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8 bg-[#F7F5F0]">
      <SEO title="Frequently Asked Questions" />
      <div className="border-b border-[#E5E2DC] pb-6 text-center space-y-2">
        <span className="text-xs font-bold text-[#6F7358] tracking-widest uppercase font-mono">Help Center</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] uppercase font-display tracking-tight">Frequently Asked Questions</h1>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-[#E5E2DC] shadow-xs space-y-2">
            <h3 className="font-extrabold text-base text-[#111111] font-display">{faq.q}</h3>
            <p className="text-xs text-[#666666] leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


