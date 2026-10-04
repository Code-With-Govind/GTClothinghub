import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';
import { formatPrice } from '../../utils/formatters';

export default function CartDrawer() {
  const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartSubtotal } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F5F1E8] border-l border-[#DDD7CB] flex flex-col shadow-fashion-lg">
          
          {/* Header */}
          <div className="p-6 border-b border-[#DDD7CB] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#292621]" />
              <h3 className="font-extrabold text-sm text-[#292621] uppercase tracking-widest font-display">
                SHOPPING BAG ({cartItems.reduce((a, b) => a + b.quantity, 0)})
              </h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#6F6A61] hover:text-[#292621] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items Scroll Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-20 space-y-4 bg-white border border-[#DDD7CB] p-8 shadow-fashion-sm">
                <ShoppingBag className="w-10 h-10 text-[#6F6A61] mx-auto" />
                <h4 className="font-bold text-[#292621] text-xs uppercase tracking-wider">Your bag is empty</h4>
                <p className="text-xs text-[#6F6A61]">Explore our streetwear drop catalog to add items.</p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/shop');
                  }}
                  className="btn-primary w-full"
                >
                  EXPLORE DROPS
                </button>
              </div>
            ) : (
              cartItems.map((item, idx) => (
                <CartItem
                  key={`${item.product}-${item.color}-${item.size}-${idx}`}
                  item={item}
                  onUpdateQty={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-[#DDD7CB] bg-white space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-[#292621] uppercase tracking-wider">
                <span>SUBTOTAL</span>
                <span className="text-lg font-extrabold font-display">{formatPrice(cartSubtotal)}</span>
              </div>
              <p className="text-[10px] text-[#6F6A61] font-mono">Taxes and shipping calculated at checkout.</p>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
                className="btn-primary w-full py-4 text-xs font-extrabold tracking-widest flex items-center justify-center gap-2"
              >
                PROCEED TO CHECKOUT <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/cart');
                }}
                className="w-full py-2 text-center text-xs text-[#6F6A61] hover:text-[#292621] font-bold uppercase tracking-wider transition-colors font-mono"
              >
                VIEW FULL CART PAGE
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

