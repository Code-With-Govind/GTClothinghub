import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEO from '../../components/common/SEO';
import api from '../../services/api';
import { formatDate, formatPrice, getStatusBadgeColor } from '../../utils/formatters';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [returnReason, setReturnReason] = useState('');
  const [returnDetails, setReturnDetails] = useState('');
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnSuccess, setReturnSuccess] = useState('');

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.order);
    } catch (err) {
      console.warn('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/orders/${id}/return`, { reason: returnReason, details: returnDetails });
      setReturnSuccess('Return request submitted successfully');
      setShowReturnModal(false);
      fetchOrder();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="max-w-4xl mx-auto py-20 text-center text-neutral-500 text-xs font-mono uppercase">Loading order details...</div>;
  if (!order) return <div className="max-w-4xl mx-auto py-20 text-center text-neutral-500 text-xs font-mono uppercase">Order not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <SEO title={`Order ${order.orderNumber}`} />

      <Link to="/account/orders" className="inline-flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-[#111111] transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to My Orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <span className="text-xs font-bold text-[#C8A96B] tracking-widest uppercase font-mono">Order Details</span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#171717] uppercase font-display tracking-tight">{order.orderNumber}</h1>
          <p className="text-xs text-neutral-500 mt-1">Placed on {formatDate(order.createdAt)}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusBadgeColor(order.orderStatus)}`}>
            {order.orderStatus}
          </span>
          {order.orderStatus === 'DELIVERED' && order.returnRequest?.status === 'NONE' && (
            <button
              onClick={() => setShowReturnModal(true)}
              className="px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold uppercase rounded-xl hover:bg-amber-100 transition-colors"
            >
              Request Return
            </button>
          )}
        </div>
      </div>

      {returnSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-bold">
          {returnSuccess}
        </div>
      )}

      {/* Items List */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-sm space-y-6">
        <h3 className="font-bold text-sm text-[#171717] uppercase font-display">Items In Package</h3>
        <div className="divide-y divide-neutral-100 space-y-4">
          {order.items.map((item, idx) => (
            <div key={idx} className="pt-4 first:pt-0 flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-14 h-16 object-cover rounded-lg bg-neutral-100 shrink-0" />
                <div>
                  <h4 className="font-bold text-[#171717]">{item.name}</h4>
                  <p className="text-neutral-500 mt-0.5">{item.color} / {item.size} x {item.quantity}</p>
                </div>
              </div>
              <span className="font-bold text-[#171717] font-mono">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-neutral-200 space-y-2 text-xs text-neutral-600">
          <div className="flex justify-between"><span>Subtotal</span><span className="font-mono">{formatPrice(order.subtotal)}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-emerald-600 font-bold"><span>Discount</span><span className="font-mono">-{formatPrice(order.discount)}</span></div>}
          <div className="flex justify-between"><span>Shipping</span><span className="font-mono">{formatPrice(order.shipping)}</span></div>
          <div className="flex justify-between"><span>Taxes</span><span className="font-mono">{formatPrice(order.tax)}</span></div>
          <div className="flex justify-between font-bold text-sm text-[#171717] pt-3 border-t border-neutral-200">
            <span>Total Paid</span>
            <span className="text-[#111111] font-mono">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Return Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <form onSubmit={handleReturnSubmit} className="bg-white rounded-2xl p-6 max-w-md w-full border border-neutral-200 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-[#171717] uppercase font-display">Request Return / Exchange</h3>
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Reason for Return *</label>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs text-[#171717] focus:outline-none focus:border-[#111111]"
                required
              >
                <option value="">Select Reason</option>
                <option value="Damaged / Defective Print">Damaged / Defective Print</option>
                <option value="Wrong Size Delivered">Wrong Size Delivered</option>
                <option value="Size Fit Issue">Size Fit Issue</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Additional Details</label>
              <textarea
                rows={3}
                value={returnDetails}
                onChange={(e) => setReturnDetails(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs text-[#171717] focus:outline-none focus:border-[#111111]"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowReturnModal(false)} className="w-full py-2.5 bg-neutral-100 text-[#171717] text-xs font-bold uppercase rounded-xl hover:bg-neutral-200">Cancel</button>
              <button type="submit" className="w-full py-2.5 bg-[#111111] text-white text-xs font-bold uppercase rounded-xl hover:bg-neutral-800">Submit Request</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

