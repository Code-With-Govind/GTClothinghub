import React from 'react';

export default function AddressForm({ address, onChange, errors = {} }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-xs text-[#111111] uppercase tracking-widest font-display">
          1. SHIPPING & CONTACT DETAILS
        </h3>
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          All Deliveries Verified
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-[#666666] uppercase tracking-widest mb-1 font-mono">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={address.fullName}
            onChange={(e) => onChange('fullName', e.target.value)}
            placeholder="Govind Rathod"
            className={`fashion-input ${errors.fullName ? 'border-rose-500 bg-rose-50/20' : ''}`}
          />
          {errors.fullName && <p className="text-[10px] text-rose-600 font-semibold mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <label className="block text-[10px] font-bold text-[#666666] uppercase tracking-widest mb-1 font-mono">
            Phone Number (10 Digits) *
          </label>
          <input
            type="tel"
            required
            maxLength={10}
            value={address.phone}
            onChange={(e) => onChange('phone', e.target.value.replace(/\D/g, ''))}
            placeholder="9876543210"
            className={`fashion-input ${errors.phone ? 'border-rose-500 bg-rose-50/20' : ''}`}
          />
          {errors.phone && <p className="text-[10px] text-rose-600 font-semibold mt-1">{errors.phone}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-[10px] font-bold text-[#666666] uppercase tracking-widest mb-1 font-mono">
            Email Address (For Tracking & Invoice) *
          </label>
          <input
            type="email"
            required
            value={address.email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="customer@example.com"
            className={`fashion-input ${errors.email ? 'border-rose-500 bg-rose-50/20' : ''}`}
          />
          {errors.email && <p className="text-[10px] text-rose-600 font-semibold mt-1">{errors.email}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-[10px] font-bold text-[#666666] uppercase tracking-widest mb-1 font-mono">
            Street Address / House No / Landmark (Min 10 chars) *
          </label>
          <input
            type="text"
            required
            value={address.street}
            onChange={(e) => onChange('street', e.target.value)}
            placeholder="Flat 204, Royal Palms, Near Metro Station"
            className={`fashion-input ${errors.street ? 'border-rose-500 bg-rose-50/20' : ''}`}
          />
          {errors.street && <p className="text-[10px] text-rose-600 font-semibold mt-1">{errors.street}</p>}
        </div>

        <div>
          <label className="block text-[10px] font-bold text-[#666666] uppercase tracking-widest mb-1 font-mono">
            City *
          </label>
          <input
            type="text"
            required
            value={address.city}
            onChange={(e) => onChange('city', e.target.value)}
            placeholder="Mumbai / Bengaluru"
            className={`fashion-input ${errors.city ? 'border-rose-500 bg-rose-50/20' : ''}`}
          />
          {errors.city && <p className="text-[10px] text-rose-600 font-semibold mt-1">{errors.city}</p>}
        </div>

        <div>
          <label className="block text-[10px] font-bold text-[#666666] uppercase tracking-widest mb-1 font-mono">
            State *
          </label>
          <input
            type="text"
            required
            value={address.state}
            onChange={(e) => onChange('state', e.target.value)}
            placeholder="Maharashtra / Karnataka"
            className={`fashion-input ${errors.state ? 'border-rose-500 bg-rose-50/20' : ''}`}
          />
          {errors.state && <p className="text-[10px] text-rose-600 font-semibold mt-1">{errors.state}</p>}
        </div>

        <div>
          <label className="block text-[10px] font-bold text-[#666666] uppercase tracking-widest mb-1 font-mono">
            Pincode (6 Digits) *
          </label>
          <input
            type="text"
            required
            maxLength={6}
            value={address.pincode}
            onChange={(e) => onChange('pincode', e.target.value.replace(/\D/g, ''))}
            placeholder="400001"
            className={`fashion-input ${errors.pincode ? 'border-rose-500 bg-rose-50/20' : ''}`}
          />
          {errors.pincode && <p className="text-[10px] text-rose-600 font-semibold mt-1">{errors.pincode}</p>}
        </div>

        <div>
          <label className="block text-[10px] font-bold text-[#666666] uppercase tracking-widest mb-1 font-mono">
            Country
          </label>
          <input
            type="text"
            readOnly
            value="India"
            className="fashion-input bg-[#F7F5F0] text-[#666666] cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
}


