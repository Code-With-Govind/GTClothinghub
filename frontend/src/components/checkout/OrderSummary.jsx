import React from 'react';
import { Check } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

export default function OrderSummary({
  cartData,
  couponInput,
  setCouponInput,
  onApplyCoupon,
  couponMessage,
  couponError,
}) {
  const { items = [], subtotal = 0, discount = 0, shipping = 0, tax = 0, taxBreakdown = {}, total = 0, couponCode } = cartData || {};

  return (
    <div className="bg-white border border-brand-beige p-6 space-y-6 shadow-fashion-sm">
      <h3 className="font-extrabold text-xs text-brand-espresso uppercase tracking-widest font-display">
        ORDER SUMMARY
      </h3>

      {/* Item List */}
      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between gap-3 text-xs border-b border-brand-beige pb-2">
            <div className="flex items-center gap-3">
              <img
                src={item.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80'}
                alt={item.name}
                className="w-10 h-12 object-cover bg-brand-cream border border-brand-beige shrink-0"
              />
              <div>
                <p className="font-bold text-brand-espresso max-w-[150px] truncate uppercase font-display">{item.name}</p>
                <p className="text-[10px] text-brand-grey font-mono">
                  {item.color} / {item.size} × {item.quantity}
                </p>
              </div>
            </div>
            <span className="font-bold text-brand-espresso font-display">{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      {/* Coupon Application */}
      <div className="pt-2 border-t border-brand-beige space-y-2">
        <label className="block text-[10px] font-bold text-brand-grey uppercase tracking-widest font-mono">
          PROMO / COUPON CODE
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. WELCOME10"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
            className="fashion-input text-xs uppercase"
          />
          <button
            type="button"
            onClick={onApplyCoupon}
            className="btn-secondary py-2 px-4 text-xs font-bold shrink-0"
          >
            APPLY
          </button>
        </div>
        {couponMessage && <p className="text-xs font-bold text-emerald-600 flex items-center gap-1"><Check className="w-3.5 h-3.5"/> {couponMessage}</p>}
        {couponError && <p className="text-xs text-rose-600 font-semibold">{couponError}</p>}
      </div>

      {/* Price Calculations */}
      <div className="pt-4 border-t border-brand-beige space-y-2.5 text-xs text-brand-grey">
        <div className="flex justify-between">
          <span>Items Subtotal</span>
          <span className="font-bold text-brand-espresso">{formatPrice(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-emerald-700 font-semibold">
            <span>Discount ({couponCode})</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="flex justify-between font-mono text-[11px]">
          <span>Shipping Fee</span>
          <span className="font-bold text-brand-espresso">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
        </div>

        <div className="flex justify-between font-mono text-[11px]">
          <span>{taxBreakdown.displayText || 'Estimated Tax'}</span>
          <span className="font-bold text-brand-espresso">{formatPrice(tax)}</span>
        </div>

        <div className="flex justify-between items-baseline pt-4 border-t border-brand-beige text-xs font-extrabold text-brand-espresso uppercase tracking-wider">
          <span>GRAND TOTAL</span>
          <span className="text-2xl font-extrabold font-display">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}

