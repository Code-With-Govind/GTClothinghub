import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight } from 'lucide-react';
import SEO from '../../components/common/SEO';
import UserLayout from '../../components/user/UserLayout';
import api from '../../services/api';
import { formatDate, formatPrice, getStatusBadgeColor } from '../../utils/formatters';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my-orders').then((res) => {
      setOrders(res.orders || []);
      setLoading(false);
    });
  }, []);

  return (
    <UserLayout>
      <SEO title="My Orders History" />

      <div className="space-y-6">
        <div className="border-b border-neutral-200 pb-4">
          <span className="text-xs font-bold text-[#C8A96B] tracking-widest uppercase font-mono">Purchase History</span>
          <h1 className="text-2xl font-black text-[#171717] uppercase font-display tracking-tight">My Orders</h1>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-neutral-200/80" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200/80 space-y-4 shadow-sm">
            <Package className="w-10 h-10 text-neutral-400 mx-auto" />
            <h3 className="text-lg font-bold text-[#171717]">No orders placed yet</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">Explore our premium catalog and discover our latest drops.</p>
            <Link to="/shop" className="inline-block px-6 py-3 bg-[#111111] hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all">
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div key={ord._id} className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-base text-[#171717] font-mono">{ord.orderNumber}</span>
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${getStatusBadgeColor(ord.orderStatus)}`}>
                      {ord.orderStatus}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">Placed on {formatDate(ord.createdAt)} • {ord.items?.length || 0} Items</p>
                  <p className="text-sm font-bold text-[#111111]">{formatPrice(ord.total)} <span className="text-xs font-normal text-neutral-500">({ord.paymentMethod})</span></p>
                </div>

                <Link
                  to={`/account/orders/${ord._id}`}
                  className="px-4 py-2.5 bg-neutral-100 hover:bg-[#111111] hover:text-white text-[#171717] text-xs font-bold uppercase rounded-xl flex items-center justify-center gap-1.5 self-start md:self-auto transition-all"
                >
                  View Details <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
}

