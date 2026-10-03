import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import SEO from '../../components/common/SEO';
import api from '../../services/api';

export default function CouponList() {
  const [coupons, setCoupons] = useState([]);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState(10);
  const [minOrderValue, setMinOrderValue] = useState(499);

  const fetchCoupons = () => {
    api.get('/coupons').then((res) => setCoupons(res.coupons || []));
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/coupons', {
        code,
        discountType,
        discountValue: Number(discountValue),
        minOrderValue: Number(minOrderValue),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      });
      setCode('');
      fetchCoupons();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/coupons/${id}`);
      fetchCoupons();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F7F5F0]">
      <SEO title="Coupon Management" />
      <AdminSidebar />
      <main className="flex-1 p-8 space-y-8 overflow-y-auto max-w-4xl">
        <div className="border-b border-neutral-200 pb-6">
          <span className="text-xs font-bold text-[#C8A96B] tracking-widest uppercase font-mono">Promotions</span>
          <h1 className="text-3xl font-black text-[#171717] uppercase font-display tracking-tight">Coupon Management</h1>
        </div>

        <form onSubmit={handleCreate} className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-sm space-y-5">
          <h3 className="font-bold text-[#171717] text-sm uppercase font-display">Create Discount Coupon</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#171717] uppercase mb-1">Code</label>
              <input type="text" required value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="WELCOME20" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs text-[#171717] font-mono font-bold uppercase focus:outline-none focus:border-[#111111]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#171717] uppercase mb-1">Discount Type</label>
              <select value={discountType} onChange={(e) => setDiscountType(e.target.value)} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs text-[#171717] focus:outline-none focus:border-[#111111]">
                <option value="PERCENTAGE">PERCENTAGE (%)</option>
                <option value="FIXED">FIXED (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#171717] uppercase mb-1">Value</label>
              <input type="number" required value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs text-[#171717] font-bold focus:outline-none focus:border-[#111111]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#171717] uppercase mb-1">Min Order Value (₹)</label>
              <input type="number" value={minOrderValue} onChange={(e) => setMinOrderValue(e.target.value)} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs text-[#171717] focus:outline-none focus:border-[#111111]" />
            </div>
          </div>
          <button type="submit" className="w-full py-3 bg-[#111111] hover:bg-neutral-800 text-white text-xs font-bold uppercase rounded-xl transition-all shadow-sm">Create Coupon</button>
        </form>

        <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-600">
              <thead>
                <tr className="border-b border-neutral-200 font-bold uppercase tracking-wider text-neutral-500">
                  <th className="p-3">Coupon Code</th>
                  <th className="p-3">Discount</th>
                  <th className="p-3">Min Order</th>
                  <th className="p-3">Uses</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-mono">
                {coupons.map((c) => (
                  <tr key={c._id} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-3 font-bold text-[#171717]">{c.code}</td>
                    <td className="p-3 font-bold text-emerald-600">{c.discountType === 'PERCENTAGE' ? `${c.discountValue}%` : `₹${c.discountValue}`}</td>
                    <td className="p-3">₹{c.minOrderValue}</td>
                    <td className="p-3">{c.usedCount}</td>
                    <td className="p-3 text-right">
                      <button onClick={() => handleDelete(c._id)} className="text-red-600 hover:underline font-sans font-bold">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

