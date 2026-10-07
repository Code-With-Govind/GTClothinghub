import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, ShoppingBag, Truck } from 'lucide-react';
import SEO from '../../components/common/SEO';
import UserLayout from '../../components/user/UserLayout';
import api from '../../services/api';
import { formatDate, formatPrice, getStatusBadgeColor } from '../../utils/formatters';

export default function MyOrders() {
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
      <SEO title="My Orders | GT Clothing Hub" />

      <div className="space-y-6">
        {/* Section Header */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E5E2DC] shadow-xs">
          <span className="text-[11px] font-mono font-bold text-[#6F7358] tracking-widest uppercase block">
            PURCHASE HISTORY
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] uppercase font-display tracking-tight mt-1">
            MY ORDERS
          </h1>
          <p className="text-xs text-[#666666] mt-1 font-medium">
            Review past orders, track delivery status and download invoices.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 bg-white rounded-xl animate-pulse border border-[#E5E2DC]" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          /* Empty Orders State */
          <div className="bg-white rounded-xl p-10 sm:p-14 border border-[#E5E2DC] text-center space-y-4 shadow-xs">
            <div className="w-14 h-14 bg-[#F7F5F0] border border-[#E5E2DC] text-[#666666] rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-[#111111] uppercase tracking-wide font-display">
                NO ORDERS YET
              </h3>
              <p className="text-xs text-[#666666] max-w-sm mx-auto">
                You haven't placed any orders yet. Discover something you love.
              </p>
            </div>
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
          /* Fashion Orders List */
          <div className="space-y-4">
            {orders.map((ord) => {
              const firstItem = ord.items?.[0];
              return (
                <div
                  key={ord._id}
                  className="bg-white rounded-xl p-5 sm:p-6 border border-[#E5E2DC] shadow-xs space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E2DC] pb-3 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-[#111111] font-mono text-sm">
                        {ord.orderNumber}
                      </span>
                      <span className="text-[#666666] font-mono text-[11px]">
                        Placed on {formatDate(ord.createdAt)}
                      </span>
                    </div>
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded uppercase font-mono border ${getStatusBadgeColor(ord.orderStatus)}`}>
                      {ord.orderStatus}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {firstItem?.image ? (
                        <img
                          src={firstItem.image}
                          alt={firstItem.name || 'Order Item'}
                          className="w-16 h-20 object-cover rounded-lg bg-[#F7F5F0] border border-[#E5E2DC] shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-20 bg-[#F7F5F0] border border-[#E5E2DC] rounded-lg flex items-center justify-center shrink-0 text-[#666666]">
                          <Package className="w-6 h-6" />
                        </div>
                      )}
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-[#111111]">{firstItem?.name || 'Streetwear Apparel'}</h4>
                        <p className="text-xs text-[#666666]">
                          {firstItem?.size ? `Size: ${firstItem.size} • ` : ''}Qty: {firstItem?.quantity || ord.items?.length || 1}
                          {ord.items?.length > 1 ? ` (+${ord.items.length - 1} more items)` : ''}
                        </p>
                        <p className="text-sm font-extrabold text-[#111111] font-mono">
                          {formatPrice(ord.total)}
                          <span className="text-[11px] font-normal text-[#666666] ml-2">({ord.paymentMethod})</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto">
                      <Link
                        to={`/account/orders/${ord._id}`}
                        className="flex-1 sm:flex-initial px-4 py-2.5 bg-white hover:bg-[#111111] hover:text-white text-[#111111] border border-[#E5E2DC] text-xs font-bold uppercase rounded-lg transition-all text-center"
                      >
                        VIEW ORDER
                      </Link>
                      <Link
                        to="/order-tracking"
                        className="px-3.5 py-2.5 bg-[#F7F5F0] hover:bg-[#111111] hover:text-white text-[#111111] border border-[#E5E2DC] text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5"
                        title="Track Shipment"
                      >
                        <Truck className="w-4 h-4" />
                        <span className="hidden sm:inline text-[11px] uppercase font-mono">Track</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </UserLayout>
  );
}


