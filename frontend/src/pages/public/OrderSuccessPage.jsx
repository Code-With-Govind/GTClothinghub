import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, PackageSearch, ArrowRight } from 'lucide-react';
import SEO from '../../components/common/SEO';
import api from '../../services/api';
import { formatPrice } from '../../utils/formatters';

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');
  const trackingToken = searchParams.get('trackingToken');
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderNumber && trackingToken) {
      api.post('/orders/track', { orderNumber, trackingToken }).then((res) => setOrder(res.order));
    }
  }, [orderNumber, trackingToken]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-8 bg-[#F7F5F0]">
      <SEO title="Order Confirmed | GT CLOTHING HUB" />

      <div className="w-20 h-20 bg-[#111111] text-white rounded-2xl flex items-center justify-center mx-auto shadow-xs">
        <CheckCircle2 className="w-10 h-10 text-[#6F7358]" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold text-[#6F7358] tracking-widest uppercase font-mono">Order Successfully Placed</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] uppercase font-display">THANK YOU FOR YOUR ORDER</h1>
        <p className="text-xs text-[#666666] max-w-md mx-auto">
          We have received your order and sent a confirmation email. Your streetwear items are being prepared for production.
        </p>
      </div>

      {/* Order Info Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E2DC] text-left space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E5E2DC] pb-4">
          <div>
            <span className="text-[10px] text-[#666666] font-mono uppercase">Order Number</span>
            <p className="font-extrabold text-base text-[#111111] font-display">{orderNumber}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#666666] font-mono uppercase">Payment Method</span>
            <p className="font-extrabold text-xs text-[#111111] uppercase font-display">{order?.paymentMethod || 'CONFIRMED'}</p>
          </div>
        </div>

        {order && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-[#666666] font-mono">Items Ordered</h4>
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <span className="text-[#111111] font-medium">{item.name} ({item.color} / {item.size}) x {item.quantity}</span>
                <span className="font-bold text-[#111111] font-display">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="pt-3 border-t border-[#E5E2DC] flex justify-between font-bold text-sm text-[#111111]">
              <span>Total Paid</span>
              <span className="text-base font-extrabold font-display">{formatPrice(order.total)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to={`/order-tracking?orderNumber=${orderNumber}&trackingToken=${trackingToken}`}
          className="btn-primary py-3.5 px-6 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <PackageSearch className="w-4 h-4" /> LIVE ORDER TRACKING
        </Link>
        <Link
          to="/shop"
          className="btn-outline py-3.5 px-6 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
        >
          CONTINUE SHOPPING <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

