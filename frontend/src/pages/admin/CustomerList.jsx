import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import SEO from '../../components/common/SEO';
import api from '../../services/api';

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    api.get('/admin/orders').then((res) => {
      const unique = [];
      const map = new Map();
      (res.orders || []).forEach((o) => {
        if (o.shippingAddress?.email && !map.has(o.shippingAddress.email)) {
          map.set(o.shippingAddress.email, true);
          unique.push({
            name: o.shippingAddress.fullName,
            email: o.shippingAddress.email,
            phone: o.shippingAddress.phone,
            city: o.shippingAddress.city,
            totalOrders: 1,
          });
        }
      });
      setCustomers(unique);
    });
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F7F5F0]">
      <SEO title="Customer Directory" />
      <AdminSidebar />
      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        <div className="border-b border-neutral-200 pb-6">
          <span className="text-xs font-bold text-[#C8A96B] tracking-widest uppercase font-mono">User Database</span>
          <h1 className="text-3xl font-black text-[#171717] uppercase font-display tracking-tight">Customer Directory</h1>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-600">
              <thead>
                <tr className="border-b border-neutral-200 font-bold uppercase tracking-wider text-neutral-500">
                  <th className="p-3">Customer Name</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">City</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-mono">
                {customers.map((c, i) => (
                  <tr key={i} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-3 font-bold text-[#171717] font-sans">{c.name}</td>
                    <td className="p-3 text-neutral-600">{c.email}</td>
                    <td className="p-3 text-neutral-600">{c.phone}</td>
                    <td className="p-3 font-sans text-neutral-600">{c.city}</td>
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

