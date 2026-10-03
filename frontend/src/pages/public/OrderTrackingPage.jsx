import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PackageSearch, Search, Truck, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import SEO from '../../components/common/SEO';
import api from '../../services/api';
import { formatDate, formatPrice, getStatusBadgeColor } from '../../utils/formatters';

export default function OrderTrackingPage() {
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get('orderNumber') || '');
  const [trackingToken, setTrackingToken] = useState(searchParams.get('trackingToken') || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTracking = async (e) => {
    if (e) e.preventDefault();
    if (!orderNumber || !trackingToken) {
      return setError('Both Order Number and Secure Tracking Token are required to lookup status.');
    }

    setLoading(true);
    setError('');
    try {
      const res = await api.post('/orders/track', { orderNumber, trackingToken });
      setOrder(res.order);
    } catch (err) {
      setError(err.message);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get('orderNumber') && searchParams.get('trackingToken')) {
      fetchTracking();
    }
  }, [searchParams]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 bg-brand-ivory">
      <SEO title="Order Status & Tracking | GT CLOTHING HUB" />

      <div className="border-b border-brand-beige pb-6 text-center space-y-2">
        <span className="text-[10px] font-mono font-bold text-brand-grey uppercase tracking-widest block">
          REAL-TIME FULFILLMENT STATUS
        </span>
        <h1 className="text-3xl font-extrabold uppercase text-brand-espresso font-display">
          TRACK YOUR ORDER
        </h1>
        <p className="text-xs text-brand-grey max-w-md mx-auto font-sans">
          Enter your Order Number and secure tracking token from your confirmation receipt.
        </p>
      </div>

      {/* Lookup Form */}
      <form onSubmit={fetchTracking} className="bg-white border border-brand-beige p-6 space-y-4 max-w-2xl mx-auto shadow-fashion-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-brand-grey uppercase tracking-widest mb-1 font-mono">
              Order Number *
            </label>
            <input
              type="text"
              placeholder="e.g. TSH-2026-123456"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="fashion-input uppercase"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-brand-grey uppercase tracking-widest mb-1 font-mono">
              Tracking Token *
            </label>
            <input
              type="text"
              placeholder="Paste token from receipt"
              value={trackingToken}
              onChange={(e) => setTrackingToken(e.target.value)}
              className="fashion-input"
              required
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" /> {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3 text-xs font-extrabold tracking-widest flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" /> {loading ? 'LOOKING UP...' : 'TRACK ORDER STATUS'}
        </button>
      </form>

      {/* Order Status Display */}
      {order && (
        <div className="bg-white border border-brand-beige p-6 sm:p-8 space-y-6 animate-fade-in shadow-fashion-sm">
          <div className="flex flex-wrap items-center justify-between border-b border-brand-beige pb-6 gap-4">
            <div>
              <span className="text-[10px] text-brand-grey font-mono uppercase tracking-widest">ORDER NUMBER</span>
              <h3 className="text-xl font-extrabold text-brand-espresso font-display">{order.orderNumber}</h3>
              <p className="text-xs text-brand-grey">Placed on {formatDate(order.createdAt)}</p>
            </div>

            <div>
              <span className="fashion-badge text-xs">
                STATUS: {order.orderStatus}
              </span>
            </div>
          </div>

          {/* Timeline Status */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4 text-center">
            <div className="p-4 bg-brand-cream border border-brand-beige space-y-2">
              <Clock className="w-5 h-5 text-brand-espresso mx-auto" />
              <span className="text-xs font-extrabold text-brand-espresso uppercase block font-display">1. Placed</span>
              <span className="text-[10px] text-brand-grey font-mono block">{formatDate(order.createdAt)}</span>
            </div>

            <div className="p-4 bg-brand-cream border border-brand-beige space-y-2">
              <CheckCircle2 className="w-5 h-5 text-brand-espresso mx-auto" />
              <span className="text-xs font-extrabold text-brand-espresso uppercase block font-display">2. Printing</span>
              <span className="text-[10px] text-brand-grey font-mono block">DTG Print In Progress</span>
            </div>

            <div className="p-4 bg-brand-cream border border-brand-beige space-y-2">
              <Truck className="w-5 h-5 text-brand-espresso mx-auto" />
              <span className="text-xs font-extrabold text-brand-espresso uppercase block font-display">3. Courier</span>
              <span className="text-[10px] text-brand-grey font-mono block">{order.courier || 'Express Partner'}</span>
            </div>

            <div className="p-4 bg-brand-cream border border-brand-beige space-y-2">
              <PackageSearch className="w-5 h-5 text-brand-espresso mx-auto" />
              <span className="text-xs font-extrabold text-brand-espresso uppercase block font-display">4. Delivery</span>
              <span className="text-[10px] text-brand-grey font-mono block">{order.trackingNumber || 'Awaiting Tracking'}</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

