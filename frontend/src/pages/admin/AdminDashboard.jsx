import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingBag, Printer, ArrowRight, Plus } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import StatCard from '../../components/admin/StatCard';
import SEO from '../../components/common/SEO';
import api from '../../services/api';
import { formatPrice, formatDate, getStatusBadgeColor } from '../../utils/formatters';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then((res) => {
      setStats(res.stats);
      setRecentOrders(res.recentOrders || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F7F5F0]">
      <SEO title="Admin Control Dashboard" />
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        <div className="border-b border-neutral-200 pb-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#C8A96B] tracking-widest uppercase font-mono">Store Operations</span>
            <h1 className="text-3xl font-black text-[#171717] uppercase font-display tracking-tight">Admin Dashboard</h1>
          </div>
          <Link
            to="/admin/products/add"
            className="px-5 py-3 bg-[#111111] hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Product Drop
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-white rounded-2xl animate-pulse border border-neutral-200/80" />
            ))}
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Revenue" value={formatPrice(stats?.totalSales)} icon={DollarSign} trend="Lifetime Paid" />
              <StatCard title="Today's Sales" value={formatPrice(stats?.todaySales)} icon={DollarSign} trend="Today" />
              <StatCard title="Total Orders" value={stats?.totalOrders || 0} icon={ShoppingBag} />
              <StatCard title="POD Pending" value={stats?.pendingOrders || 0} icon={Printer} />
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <h3 className="font-bold text-base text-[#171717] uppercase font-display">Recent Customer Orders</h3>
                <Link to="/admin/orders" className="text-xs font-bold text-[#111111] hover:text-[#C8A96B] flex items-center gap-1">
                  View All Orders <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-neutral-600">
                  <thead>
                    <tr className="border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider">
                      <th className="p-3">Order Number</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Order Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-mono">
                    {recentOrders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-neutral-50 transition-colors">
                        <td className="p-3 font-bold text-[#171717]">{ord.orderNumber}</td>
                        <td className="p-3 font-sans text-[#171717]">{ord.shippingAddress?.fullName || 'N/A'}</td>
                        <td className="p-3 text-neutral-500">{formatDate(ord.createdAt)}</td>
                        <td className="p-3 font-bold text-[#111111]">{formatPrice(ord.total)}</td>
                        <td className="p-3"><span className="text-[11px] font-bold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">{ord.paymentStatus}</span></td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeColor(ord.orderStatus)}`}>
                            {ord.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

