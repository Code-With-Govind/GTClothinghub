import React from 'react';

export default function AddressForm({ address, onChange }) {
  return (
    <div className="space-y-4">
      <h3 className="font-extrabold text-xs text-brand-espresso uppercase tracking-widest font-display">
        1. SHIPPING & CONTACT DETAILS
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-brand-grey uppercase tracking-widest mb-1 font-mono">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={address.fullName}
            onChange={(e) => onChange('fullName', e.target.value)}
            placeholder="John Doe"
            className="fashion-input"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-brand-grey uppercase tracking-widest mb-1 font-mono">
            Phone Number *
          </label>
          <input
            type="tel"
            required
            value={address.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="+91 98765 43210"
            className="fashion-input"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-[10px] font-bold text-brand-grey uppercase tracking-widest mb-1 font-mono">
            Email Address (For Tracking & Invoice) *
          </label>
          <input
            type="email"
            required
            value={address.email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="john@example.com"
            className="fashion-input"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-[10px] font-bold text-brand-grey uppercase tracking-widest mb-1 font-mono">
            Street Address / House No / Locality *
          </label>
          <input
            type="text"
            required
            value={address.street}
            onChange={(e) => onChange('street', e.target.value)}
            placeholder="Flat 402, Building A, Main Road"
            className="fashion-input"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-brand-grey uppercase tracking-widest mb-1 font-mono">
            City *
          </label>
          <input
            type="text"
            required
            value={address.city}
            onChange={(e) => onChange('city', e.target.value)}
            placeholder="Bengaluru"
            className="fashion-input"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-brand-grey uppercase tracking-widest mb-1 font-mono">
            State *
          </label>
          <input
            type="text"
            required
            value={address.state}
            onChange={(e) => onChange('state', e.target.value)}
            placeholder="Karnataka"
            className="fashion-input"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-brand-grey uppercase tracking-widest mb-1 font-mono">
            Pincode *
          </label>
          <input
            type="text"
            required
            value={address.pincode}
            onChange={(e) => onChange('pincode', e.target.value)}
            placeholder="560001"
            className="fashion-input"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-brand-grey uppercase tracking-widest mb-1 font-mono">
            Country
          </label>
          <input
            type="text"
            readOnly
            value="India"
            className="fashion-input bg-brand-cream text-brand-grey cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
}

