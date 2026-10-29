import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  ArrowRight,
  Trash2,
  ShieldCheck,
  Truck,
  RotateCcw,
  ArrowLeft,
  Lock,
} from 'lucide-react';
import SEO from '../../components/common/SEO';
import { useCart } from '../../context/CartContext';
import CartItem from '../../components/cart/CartItem';
import { formatPrice } from '../../utils/formatters';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartSubtotal, totalItemCount } = useCart();
  const navigate = useNavigate();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearCart = () => {
    clearCart();
    setShowClearConfirm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 bg-[#F7F5F0]">
      <SEO title="Shopping Bag | GT CLOTHING HUB" />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E5E2DC] pb-6">
        <div>
          <span className="text-[10px] font-mono font-bold text-[#6F7358] uppercase tracking-widest block">
            YOUR SELECTION
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] uppercase font-display tracking-tight mt-1">
            SHOPPING BAG {totalItemCount > 0 && <span className="text-neutral-500 font-mono text-xl sm:text-2xl">({totalItemCount})</span>}
          </h1>
        </div>

        {cartItems.length > 0 && (
          <div className="flex items-center gap-3">
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#666666] hover:text-[#111111] uppercase tracking-wider font-mono transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
            </Link>

            <button
              onClick={() => setShowClearConfirm(true)}
              type="button"
              className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 uppercase tracking-wider font-mono transition-colors py-1 px-2 rounded-md hover:bg-rose-50"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear Bag
            </button>
          </div>
        )}
      </div>

      {/* Clear Cart Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-[#E5E2DC] shadow-xl space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-[#111111] uppercase font-display">Clear Shopping Bag?</h3>
              <p className="text-xs text-[#666666]">
                Are you sure you want to remove all items from your shopping bag?
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 bg-[#F7F5F0] text-[#111111] text-xs font-bold uppercase rounded-xl hover:bg-neutral-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearCart}
                className="flex-1 py-2.5 bg-rose-600 text-white text-xs font-bold uppercase rounded-xl hover:bg-rose-700 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Content */}
      {cartItems.length === 0 ? (
        /* Empty Cart State */
        <div className="text-center py-20 px-4 bg-white border border-[#E5E2DC] rounded-2xl space-y-4 shadow-fashion-sm max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#F7F5F0] border border-[#E5E2DC] flex items-center justify-center mx-auto text-[#666666]">
            <ShoppingBag className="w-8 h-8 text-[#888888]" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-[#111111] uppercase tracking-wider font-display">
              YOUR SHOPPING BAG IS EMPTY
            </h2>
            <p className="text-xs text-[#666666] max-w-sm mx-auto font-medium">
              Explore our latest heavyweight drops, oversized streetwear cuts, and custom graphic apparel.
            </p>
          </div>
          <div className="pt-3">
            <Link to="/shop" className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 text-xs font-extrabold tracking-widest">
              DISCOVER APPAREL <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="space-y-3">
              {cartItems.map((item, idx) => (
                <CartItem
                  key={`${item.product}-${item.color}-${item.size}-${idx}`}
                  item={item}
                  onUpdateQty={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>

            {/* Confidence / Value Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#E5E2DC]">
              <div className="p-3.5 bg-white rounded-xl border border-[#E5E2DC] flex items-center gap-3 shadow-2xs">
                <Truck className="w-5 h-5 text-[#6F7358] shrink-0" />
                <div className="text-[11px] leading-tight">
                  <strong className="block text-[#111111] uppercase font-mono">Pan-India Delivery</strong>
                  <span className="text-[#666666]">Dispatched within 2-4 days</span>
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-[#E5E2DC] flex items-center gap-3 shadow-2xs">
                <ShieldCheck className="w-5 h-5 text-[#6F7358] shrink-0" />
                <div className="text-[11px] leading-tight">
                  <strong className="block text-[#111111] uppercase font-mono">240 GSM Cotton</strong>
                  <span className="text-[#666666]">Pre-shrunk premium blanks</span>
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-[#E5E2DC] flex items-center gap-3 shadow-2xs">
                <RotateCcw className="w-5 h-5 text-[#6F7358] shrink-0" />
                <div className="text-[11px] leading-tight">
                  <strong className="block text-[#111111] uppercase font-mono">7-Day Exchanges</strong>
                  <span className="text-[#666666]">Easy sizing exchanges</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Order Summary Card */}
          <div className="lg:col-span-4 bg-white border border-[#E5E2DC] rounded-2xl p-6 sm:p-7 space-y-6 shadow-fashion-sm sticky top-24">
            <div className="border-b border-[#E5E2DC] pb-4">
              <span className="text-[10px] font-mono font-bold text-[#6F7358] uppercase tracking-widest block">
                CHECKOUT SUMMARY
              </span>
              <h3 className="font-extrabold text-base text-[#111111] uppercase tracking-wider font-display mt-0.5">
                ORDER TOTALS
              </h3>
            </div>

            <div className="space-y-3 text-xs text-[#666666] border-b border-[#E5E2DC] pb-5 font-mono">
              <div className="flex justify-between items-center">
                <span>Items Subtotal ({totalItemCount})</span>
                <span className="font-bold text-[#111111] text-sm">{formatPrice(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span>Shipping Fee</span>
                <span className="text-emerald-700 font-bold">Calculated at checkout</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span>Estimated Taxes (GST)</span>
                <span>Included in prices</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-baseline text-xs font-bold text-[#111111] uppercase tracking-wider">
                <span>ESTIMATED TOTAL</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#111111] font-mono">
                  {formatPrice(cartSubtotal)}
                </span>
              </div>
              <p className="text-[10px] text-[#888888] font-mono">
                Final shipping & applicable coupons applied at next step.
              </p>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn-primary w-full py-4 text-xs font-extrabold tracking-widest flex items-center justify-center gap-2 shadow-sm"
            >
              PROCEED TO CHECKOUT <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#888888] font-mono pt-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Encrypted 256-bit SSL Checkout</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
