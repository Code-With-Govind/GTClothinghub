import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, Package } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

export default function CartItem({ item, onUpdateQty, onRemove }) {
  const [imageError, setImageError] = useState(false);

  // Link to genuine product details page using slug or ID
  const productUrl = `/product/${item.slug || item.productId || item.product}`;

  return (
    <div className="flex gap-4 p-4 sm:p-5 bg-white border border-[#E5E2DC] rounded-xl relative group shadow-fashion-sm transition-all hover:border-[#CCCCCC]">
      {/* Product Image (Clickable & Uncropped) */}
      <Link
        to={productUrl}
        className="w-20 sm:w-24 aspect-[4/5] bg-[#F7F5F0] border border-[#E5E2DC] rounded-xl p-1.5 shrink-0 flex items-center justify-center overflow-hidden hover:opacity-90 transition-opacity"
        aria-label={`View ${item.name}`}
      >
        {!imageError && item.image ? (
          <img
            src={item.image}
            alt={item.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-contain object-center select-none"
          />
        ) : (
          <div className="flex items-center justify-center text-[#888888]">
            <Package className="w-6 h-6" />
          </div>
        )}
      </Link>

      {/* Details */}
      <div className="flex flex-col justify-between flex-grow pr-0 sm:pr-8 min-w-0">
        <div>
          <Link
            to={productUrl}
            className="font-extrabold text-xs sm:text-sm text-[#111111] hover:text-[#6F7358] transition-colors line-clamp-1 uppercase tracking-tight font-display block"
          >
            {item.name}
          </Link>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[#666666] font-mono mt-1">
            <span>
              Color: <strong className="text-[#111111]">{item.color}</strong>
            </span>
            <span>•</span>
            <span>
              Size: <strong className="text-[#111111]">{item.size}</strong>
            </span>
            {item.sku && (
              <>
                <span className="hidden sm:inline">•</span>
                <span className="text-[10px] text-[#888888] hidden sm:inline font-mono">
                  SKU: {item.sku}
                </span>
              </>
            )}
          </div>

          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-xs font-bold text-[#111111] font-mono">
              {formatPrice(item.price)}
            </span>
            <span className="text-[10px] text-[#888888] font-mono">each</span>
          </div>
        </div>

        {/* Quantity Controls & Line Subtotal */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E5E2DC] gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-[#E5E2DC] bg-white rounded-lg overflow-hidden shadow-2xs">
              <button
                type="button"
                onClick={() => onUpdateQty(item.product, item.color, item.size, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="p-1.5 sm:px-2.5 sm:py-1 text-[#666666] hover:text-[#111111] hover:bg-[#F7F5F0] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-extrabold text-[#111111] px-3 font-mono select-none min-w-[28px] text-center">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => onUpdateQty(item.product, item.color, item.size, item.quantity + 1)}
                className="p-1.5 sm:px-2.5 sm:py-1 text-[#666666] hover:text-[#111111] hover:bg-[#F7F5F0] transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile Remove Button */}
            <button
              type="button"
              onClick={() => onRemove(item.product, item.color, item.size)}
              className="text-[11px] font-bold text-rose-600 hover:text-rose-800 transition-colors uppercase font-mono inline-flex items-center gap-1 sm:hidden p-1"
              aria-label={`Remove ${item.name}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs sm:text-sm font-extrabold text-[#111111] font-mono block">
              {formatPrice(item.price * item.quantity)}
            </span>
            <span className="text-[10px] text-[#888888] font-mono hidden sm:block">
              Subtotal
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Remove Button */}
      <button
        type="button"
        onClick={() => onRemove(item.product, item.color, item.size)}
        className="absolute top-4 right-4 text-[#888888] hover:text-rose-600 p-1 rounded-md transition-colors hidden sm:block"
        title="Remove Item"
        aria-label={`Remove ${item.name} from bag`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
