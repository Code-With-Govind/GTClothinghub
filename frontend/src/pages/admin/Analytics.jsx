import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import SEO from '../../components/common/SEO';
import api from '../../services/api';
import { formatPrice } from '../../utils/formatters';

export default function Analytics() {
  const [salesOverTime, setSalesOverTime] = useState([]);

  useEffect(() => {
    api.get('/admin/dashboard').then((res) => {
      setSalesOverTime(res.salesOverTime || []);
    });
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F7F5F0]">
      <SEO title="Sales Analytics" />
      <AdminSidebar />
      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        <div className="border-b border-neutral-200 pb-6">
          <span className="text-xs font-bold text-[#C8A96B] tracking-widest uppercase font-mono">Financial Insights</span>
          <h1 className="text-3xl font-black text-[#171717] uppercase font-display tracking-tight">Sales Analytics</h1>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-sm space-y-4">
          <h3 className="font-bold text-[#171717] text-sm uppercase font-display border-b border-neutral-100 pb-3">Revenue Over Time (Daily Breakdown)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-600">
              <thead>
                <tr className="border-b border-neutral-200 font-bold uppercase tracking-wider text-neutral-500">
                  <th className="p-3">Date</th>
                  <th className="p-3">Orders Count</th>
                  <th className="p-3">Daily Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-mono">
                {salesOverTime.map((s, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-3 font-bold text-[#171717]">{s._id}</td>
                    <td className="p-3 font-sans text-neutral-600">{s.ordersCount} Orders</td>
                    <td className="p-3 font-bold text-[#111111]">{formatPrice(s.sales)}</td>
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

