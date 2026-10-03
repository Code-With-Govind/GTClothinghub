import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import SEO from '../../components/common/SEO';
import api from '../../services/api';

export default function PODList() {
  const [podOrders, setPodOrders] = useState([]);

  useEffect(() => {
    api.get('/pod/orders').then((res) => setPodOrders(res.podOrders || []));
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F7F5F0]">
      <SEO title="POD Fulfillment Queue" />
      <AdminSidebar />
      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        <div className="border-b border-neutral-200 pb-6">
          <span className="text-xs font-bold text-[#C8A96B] tracking-widest uppercase font-mono">Qikink POD Integration</span>
          <h1 className="text-3xl font-black text-[#171717] uppercase font-display tracking-tight">POD Provider Orders</h1>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-600">
              <thead>
                <tr className="border-b border-neutral-200 font-bold uppercase tracking-wider text-neutral-500">
                  <th className="p-3">POD Order ID</th>
                  <th className="p-3">Internal Order</th>
                  <th className="p-3">Provider</th>
                  <th className="p-3">POD Status</th>
                  <th className="p-3">Tracking</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-mono">
                {podOrders.map((pod) => (
                  <tr key={pod._id} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-3 font-bold text-[#171717]">{pod.podOrderId}</td>
                    <td className="p-3 text-[#111111] font-bold">{pod.order?.orderNumber}</td>
                    <td className="p-3 font-sans"><span className="px-2 py-0.5 bg-neutral-100 text-[#171717] rounded text-[10px] font-bold">{pod.podProvider}</span></td>
                    <td className="p-3 font-bold text-emerald-700">{pod.podStatus}</td>
                    <td className="p-3 text-neutral-500">{pod.trackingNumber || 'Pending'}</td>
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

