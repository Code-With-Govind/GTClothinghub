import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, User, Key, ArrowRight, Truck, ShoppingBag, ChevronRight } from 'lucide-react';
import SEO from '../../components/common/SEO';
import UserLayout from '../../components/user/UserLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { formatPrice, formatDate } from '../../utils/formatters';

export default function MyAccount() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my-orders')
      .then((res) => {
        setOrders(res.orders || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <UserLayout>
      <SEO title="My Account | GT Clothing Hub" />

      <div className="space-y-6">
        {/* Customer Page Header */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E5E2DC] shadow-xs">
          <span className="text-[11px] font-mono font-bold text-[#6F7358] tracking-widest uppercase block">
            MY ACCOUNT
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] uppercase font-display tracking-tight mt-1">
            Hello, {user?.name || 'Customer'} 👋
          </h1>
          <p className="text-xs text-[#666666] mt-1 font-medium">
            Manage your orders, profile and account preferences.
          </p>
        </div>

        {/* Action Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/account/orders"
            className="bg-white p-5 rounded-xl border border-[#E5E2DC] hover:border-[#111111] transition-all group shadow-xs flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-[#F7F5F0] text-[#111111] flex items-center justify-center border border-[#E5E2DC]">
                <Package className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-[#666666] group-hover:translate-x-1 group-hover:text-[#111111] transition-all" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#111111] text-sm font-display uppercase tracking-tight">MY ORDERS</h3>
              <p className="text-xs text-[#666666] mt-1">View and track your orders.</p>
            </div>
          </Link>

          <Link
            to="/account/profile"
            className="bg-white p-5 rounded-xl border border-[#E5E2DC] hover:border-[#111111] transition-all group shadow-xs flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-[#F7F5F0] text-[#111111] flex items-center justify-center border border-[#E5E2DC]">
                <User className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-[#666666] group-hover:translate-x-1 group-hover:text-[#111111] transition-all" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#111111] text-sm font-display uppercase tracking-tight">PROFILE</h3>
              <p className="text-xs text-[#666666] mt-1">Manage your personal information.</p>
            </div>
          </Link>

          <Link
            to="/account/change-password"
            className="bg-white p-5 rounded-xl border border-[#E5E2DC] hover:border-[#111111] transition-all group shadow-xs flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-[#F7F5F0] text-[#111111] flex items-center justify-center border border-[#E5E2DC]">
                <Key className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-[#666666] group-hover:translate-x-1 group-hover:text-[#111111] transition-all" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#111111] text-sm font-display uppercase tracking-tight">ACCOUNT SETTINGS</h3>
              <p className="text-xs text-[#666666] mt-1">Manage your password and security.</p>
            </div>
          </Link>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E5E2DC] shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-[#E5E2DC] pb-4">
            <h2 className="font-extrabold text-sm sm:text-base text-[#111111] uppercase font-display tracking-tight">
              RECENT ORDERS
            </h2>
            {orders.length > 0 && (
              <Link to="/account/orders" className="text-xs font-bold text-[#111111] hover:text-[#6F7358] flex items-center gap-1 font-mono uppercase">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {loading ? (
            <div className="h-24 animate-pulse bg-[#F7F5F0] rounded-xl border border-[#E5E2DC]" />
          ) : orders.length === 0 ? (
            /* Clean Empty Orders State */
            <div className="text-center py-10 sm:py-12 space-y-3">
              <div className="w-12 h-12 bg-[#F7F5F0] border border-[#E5E2DC] text-[#666666] rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-extrabold text-[#111111] uppercase tracking-wide font-display">
                NO ORDERS YET
              </h3>
              <p className="text-xs text-[#666666] max-w-xs mx-auto">
                You haven't placed any orders yet. Discover something you love.
              </p>
              <div className="pt-2">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#111111] hover:bg-[#222222] text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-all shadow-xs"
                >
                  SHOP NOW
                </Link>
              </div>
            </div>
          ) : (
            /* Orders Preview List */
            <div className="space-y-4">
              {orders.slice(0, 3).map((ord) => (
                <div key={ord._id} className="p-4 bg-[#F7F5F0] border border-[#E5E2DC] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    {ord.items?.[0]?.image ? (
                      <img
                        src={ord.items[0].image}
                        alt={ord.items[0].name}
                        className="w-14 h-16 object-cover rounded-lg bg-white border border-[#E5E2DC] shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-16 bg-white border border-[#E5E2DC] rounded-lg flex items-center justify-center shrink-0">
                        <Package className="w-6 h-6 text-[#666666]" />
                      </div>
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#111111] font-mono">{ord.orderNumber}</span>
                        <span className="px-2 py-0.5 text-[9px] font-bold uppercase font-mono rounded bg-white text-[#111111] border border-[#E5E2DC]">
                          {ord.orderStatus}
                        </span>
                      </div>
                      <p className="text-xs text-[#666666]">
                        {formatDate(ord.createdAt)} • {ord.items?.length || 1} Item(s)
                      </p>
                      <p className="text-xs font-extrabold text-[#111111] font-mono">
                        {formatPrice(ord.total)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Link
                      to={`/account/orders/${ord._id}`}
                      className="px-3.5 py-2 bg-white hover:bg-[#111111] hover:text-white text-[#111111] border border-[#E5E2DC] text-xs font-bold uppercase rounded-lg transition-all"
                    >
                      VIEW ORDER
                    </Link>
                    <Link
                      to="/order-tracking"
                      className="px-3 py-2 bg-white hover:bg-[#111111] hover:text-white text-[#666666] hover:border-[#111111] border border-[#E5E2DC] text-xs rounded-lg transition-all"
                      title="Track Order"
                    >
                      <Truck className="w-4 h-4" />
                    </Link>
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



