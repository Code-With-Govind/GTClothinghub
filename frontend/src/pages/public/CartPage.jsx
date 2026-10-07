import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import SEO from '../../components/common/SEO';
import { useCart } from '../../context/CartContext';
import CartItem from '../../components/cart/CartItem';
import { formatPrice } from '../../utils/formatters';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartSubtotal } = useCart();
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 bg-[#F7F5F0]">
      <SEO title="Shopping Bag | GT CLOTHING HUB" />

      <div className="flex items-center justify-between border-b border-[#E5E2DC] pb-6">
        <div>
          <span className="text-[10px] font-mono font-bold text-[#6F7358] uppercase tracking-widest block">
            YOUR SELECTION
          </span>
          <h1 className="text-3xl font-extrabold text-[#111111] uppercase font-display">
            SHOPPING BAG
          </h1>
        </div>

        {cartItems.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1 uppercase tracking-wider font-mono"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Cart
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        /* Section 45: Empty States */
        <div className="text-center py-20 bg-white border border-[#E5E2DC] rounded-2xl space-y-4 shadow-fashion-sm">
          <ShoppingBag className="w-12 h-12 text-[#666666] mx-auto" />
          <h2 className="text-xl font-extrabold text-[#111111] uppercase tracking-wider font-display">YOUR CART IS EMPTY</h2>
          <p className="text-xs text-[#666666] max-w-sm mx-auto font-medium">Looks like you haven't added anything yet.</p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="btn-primary"
            >
              SHOP PRODUCTS
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map((item, idx) => (
              <CartItem
                key={`${item.product}-${item.color}-${item.size}-${idx}`}
                item={item}
                onUpdateQty={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          {/* Section 28: Order Summary Card */}
          <div className="bg-white border border-[#E5E2DC] rounded-2xl p-6 space-y-6 h-fit shadow-fashion-sm">
            <h3 className="font-extrabold text-xs text-[#111111] uppercase tracking-widest font-display">
              ORDER SUMMARY
            </h3>

            <div className="space-y-3 text-xs text-[#666666] border-b border-[#E5E2DC] pb-4 font-mono">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-[#111111]">{formatPrice(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>Taxes</span>
                <span>Included in price</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline text-xs font-bold text-[#111111] uppercase tracking-wider">
              <span>TOTAL AMOUNT</span>
              <span className="text-2xl font-extrabold text-[#111111] font-mono">{formatPrice(cartSubtotal)}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn-primary w-full py-4 text-xs font-extrabold tracking-widest flex items-center justify-center gap-2"
            >
              CHECKOUT <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

