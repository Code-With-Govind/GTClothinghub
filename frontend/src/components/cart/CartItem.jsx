import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

export default function CartItem({ item, onUpdateQty, onRemove }) {
  return (
    <div className="flex gap-4 p-3 bg-white border border-[#DDD7CB] relative group shadow-fashion-sm">
      {/* Product Image */}
      <img
        src={item.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80'}
        alt={item.name}
        className="w-20 aspect-[4/5] object-cover bg-[#FAF8F3] border border-[#DDD7CB] shrink-0"
      />

      {/* Details */}
      <div className="flex flex-col justify-between flex-grow pr-4">
        <div>
          <h4 className="font-extrabold text-xs text-[#292621] line-clamp-1 uppercase tracking-tight font-display">{item.name}</h4>
          <div className="flex items-center gap-2 text-[10px] text-[#6F6A61] uppercase font-mono mt-1">
            <span>Color: <strong className="text-[#292621]">{item.color}</strong></span>
            <span>•</span>
            <span>Size: <strong className="text-[#292621]">{item.size}</strong></span>
          </div>
          <p className="text-xs font-bold text-[#292621] mt-1 font-display">{formatPrice(item.price)}</p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#DDD7CB]">
          <div className="flex items-center border border-[#DDD7CB] bg-white">
            <button
              onClick={() => onUpdateQty(item.product, item.color, item.size, item.quantity - 1)}
              className="px-2 py-0.5 text-[#6F6A61] hover:text-[#292621] transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-xs font-bold text-[#292621] px-2 font-mono">{item.quantity}</span>
            <button
              onClick={() => onUpdateQty(item.product, item.color, item.size, item.quantity + 1)}
              className="px-2 py-0.5 text-[#6F6A61] hover:text-[#292621] transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <span className="text-xs font-extrabold text-[#292621] font-display">{formatPrice(item.price * item.quantity)}</span>
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.product, item.color, item.size)}
        className="absolute top-3 right-3 text-[#6F6A61] hover:text-rose-600 transition-colors"
        title="Remove Item"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

