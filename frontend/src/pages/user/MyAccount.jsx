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
        <div className="bg-brand-espresso text-white p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-fashion-lg border border-brand-beige">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-brand-gold tracking-widest uppercase font-mono">
                Customer Account
              </span>
              {isAdmin && (
                <span className="px-2 py-0.5 text-[9px] font-bold bg-brand-gold text-white uppercase tracking-wider font-mono">
                  Admin Access Granted
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase font-display tracking-tight mt-1">
              Welcome Back, {user?.name}
            </h1>
            <p className="text-xs text-brand-grey font-mono mt-1">
              Registered email: <span className="text-white">{user?.email}</span>
            </p>
          </div>

          {isAdmin && (
            <Link
              to="/admin"
              className="px-5 py-3 bg-brand-gold hover:bg-[#a38042] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 group transition-all shrink-0 font-mono shadow-fashion-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Admin Panel</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-6 border border-brand-beige shadow-fashion-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-cream border border-brand-beige text-brand-espresso flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase text-brand-grey font-bold">Total Orders</p>
              <p className="text-2xl font-extrabold text-brand-espresso font-display">{orders.length}</p>
            </div>
          </div>

          <div className="bg-white p-6 border border-brand-beige shadow-fashion-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase text-brand-grey font-bold">Delivered Orders</p>
              <p className="text-2xl font-extrabold text-brand-espresso font-display">
                {orders.filter(o => o.orderStatus === 'Delivered').length}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 border border-brand-beige shadow-fashion-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 text-brand-gold border border-amber-100 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase text-brand-grey font-bold">Account Status</p>
              <p className="text-xs font-bold text-emerald-700 uppercase font-mono mt-1">Verified Member</p>
            </div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/account/orders"
            className="bg-white p-6 border border-brand-beige hover:border-brand-espresso transition-all space-y-3 group shadow-fashion-sm"
          >
            <Package className="w-8 h-8 text-brand-espresso group-hover:scale-110 transition-transform" />
            <h3 className="font-extrabold text-brand-espresso text-base font-display">My Orders</h3>
            <p className="text-xs text-brand-grey">View past apparel orders, invoices, and fulfillment details.</p>
          </Link>

          <Link
            to="/account/profile"
            className="bg-white p-6 border border-brand-beige hover:border-brand-espresso transition-all space-y-3 group shadow-fashion-sm"
          >
            <User className="w-8 h-8 text-brand-espresso group-hover:scale-110 transition-transform" />
            <h3 className="font-extrabold text-brand-espresso text-base font-display">Profile Settings</h3>
            <p className="text-xs text-brand-grey">Update your account name, contact details, and phone number.</p>
          </Link>

          <Link
            to="/account/change-password"
            className="bg-white p-6 border border-brand-beige hover:border-brand-espresso transition-all space-y-3 group shadow-fashion-sm"
          >
            <Key className="w-8 h-8 text-brand-espresso group-hover:scale-110 transition-transform" />
            <h3 className="font-extrabold text-brand-espresso text-base font-display">Security</h3>
            <p className="text-xs text-brand-grey">Update account password and manage security options.</p>
          </Link>
        </div>

        {/* Recent Orders Preview */}
        <div className="bg-white p-6 border border-brand-beige shadow-fashion-sm space-y-4">
          <div className="flex items-center justify-between border-b border-brand-beige pb-4">
            <h3 className="font-extrabold text-base text-brand-espresso uppercase font-display">Recent Orders</h3>
            <Link to="/account/orders" className="text-xs font-bold text-brand-espresso hover:text-brand-gold flex items-center gap-1 font-mono">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="h-20 animate-pulse bg-brand-cream" />
          ) : orders.length === 0 ? (
            <p className="text-xs text-brand-grey py-4 text-center">No recent orders found in your account history.</p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 3).map((ord) => (
                <div key={ord._id} className="flex items-center justify-between p-4 bg-brand-cream border border-brand-beige">
                  <div>
                    <span className="font-bold text-sm text-brand-espresso font-mono">{ord.orderNumber}</span>
                    <p className="text-xs text-brand-grey mt-0.5">{formatDate(ord.createdAt)} • {ord.items?.length || 0} Items</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-sm text-brand-espresso font-mono">{formatPrice(ord.total)}</span>
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

