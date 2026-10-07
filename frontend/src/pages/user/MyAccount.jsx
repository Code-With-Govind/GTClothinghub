import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, User, Key, ShieldCheck, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import SEO from '../../components/common/SEO';
import UserLayout from '../../components/user/UserLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { formatPrice, formatDate } from '../../utils/formatters';

export default function MyAccount() {
  const { user, isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my-orders').then((res) => {
      setOrders(res.orders || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <UserLayout>
      <SEO title="My Account Dashboard" />

      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="bg-[#111111] text-[#F7F5F0] p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs border border-[#111111]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#6F7358] tracking-widest uppercase font-mono">
                Customer Account
              </span>
              {isAdmin && (
                <span className="px-2 py-0.5 text-[9px] font-bold bg-[#6F7358] text-white uppercase tracking-wider font-mono rounded">
                  Admin Access Granted
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase font-display tracking-tight mt-1">
              Welcome Back, {user?.name}
            </h1>
            <p className="text-xs text-[#E5E2DC] font-mono mt-1">
              Registered email: <span className="text-white font-bold">{user?.email}</span>
            </p>
          </div>

          {isAdmin && (
            <Link
              to="/admin"
              className="px-5 py-3 bg-white text-[#111111] hover:bg-[#F7F5F0] text-xs font-bold uppercase tracking-wider flex items-center gap-2 group transition-all shrink-0 font-mono rounded-lg shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-[#6F7358]" />
              <span>Admin Panel</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-[#E5E2DC] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 bg-[#F7F5F0] border border-[#E5E2DC] text-[#111111] flex items-center justify-center rounded-xl">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase text-[#666666] font-bold">Total Orders</p>
              <p className="text-2xl font-extrabold text-[#111111] font-display">{orders.length}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E5E2DC] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center rounded-xl">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase text-[#666666] font-bold">Delivered Orders</p>
              <p className="text-2xl font-extrabold text-[#111111] font-display">
                {orders.filter(o => o.orderStatus === 'Delivered').length}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E5E2DC] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 text-[#6F7358] border border-amber-100 flex items-center justify-center rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase text-[#666666] font-bold">Account Status</p>
              <p className="text-xs font-bold text-emerald-700 uppercase font-mono mt-1">Verified Member</p>
            </div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/account/orders"
            className="bg-white p-6 rounded-2xl border border-[#E5E2DC] hover:border-[#111111] transition-all space-y-3 group shadow-xs"
          >
            <Package className="w-8 h-8 text-[#111111] group-hover:scale-110 transition-transform" />
            <h3 className="font-extrabold text-[#111111] text-base font-display">My Orders</h3>
            <p className="text-xs text-[#666666]">View past apparel orders, invoices, and fulfillment details.</p>
          </Link>

          <Link
            to="/account/profile"
            className="bg-white p-6 rounded-2xl border border-[#E5E2DC] hover:border-[#111111] transition-all space-y-3 group shadow-xs"
          >
            <User className="w-8 h-8 text-[#111111] group-hover:scale-110 transition-transform" />
            <h3 className="font-extrabold text-[#111111] text-base font-display">Profile Settings</h3>
            <p className="text-xs text-[#666666]">Update your account name, contact details, and phone number.</p>
          </Link>

          <Link
            to="/account/change-password"
            className="bg-white p-6 rounded-2xl border border-[#E5E2DC] hover:border-[#111111] transition-all space-y-3 group shadow-xs"
          >
            <Key className="w-8 h-8 text-[#111111] group-hover:scale-110 transition-transform" />
            <h3 className="font-extrabold text-[#111111] text-base font-display">Security</h3>
            <p className="text-xs text-[#666666]">Update account password and manage security options.</p>
          </Link>
        </div>

        {/* Recent Orders Preview */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E2DC] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E2DC] pb-4">
            <h3 className="font-extrabold text-base text-[#111111] uppercase font-display">Recent Orders</h3>
            <Link to="/account/orders" className="text-xs font-bold text-[#111111] hover:text-[#6F7358] flex items-center gap-1 font-mono">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="h-20 animate-pulse bg-[#F7F5F0] rounded-xl" />
          ) : orders.length === 0 ? (
            <p className="text-xs text-[#666666] py-4 text-center">No recent orders found in your account history.</p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 3).map((ord) => (
                <div key={ord._id} className="flex items-center justify-between p-4 bg-[#F7F5F0] border border-[#E5E2DC] rounded-xl">
                  <div>
                    <span className="font-bold text-sm text-[#111111] font-mono">{ord.orderNumber}</span>
                    <p className="text-xs text-[#666666] mt-0.5">{formatDate(ord.createdAt)} • {ord.items?.length || 0} Items</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-sm text-[#111111] font-mono">{formatPrice(ord.total)}</span>
                    <p className="text-[10px] text-emerald-700 font-bold uppercase font-mono">{ord.orderStatus}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
}


