import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

export default function CartItem({ item, onUpdateQty, onRemove }) {
  return (
    <div className="flex gap-4 p-4 bg-white border border-[#E5E2DC] rounded-xl relative group shadow-fashion-sm">
      {/* Product Image */}
      <img
        src={item.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80'}
        alt={item.name}
        className="w-20 aspect-[4/5] object-cover bg-[#F7F5F0] border border-[#E5E2DC] rounded-lg shrink-0"
      />

      {/* Details */}
      <div className="flex flex-col justify-between flex-grow pr-6">
        <div>
          <h4 className="font-extrabold text-xs text-[#111111] line-clamp-1 uppercase tracking-tight font-display">{item.name}</h4>
          <div className="flex items-center gap-2 text-[10px] text-[#666666] uppercase font-mono mt-1">
            <span>Color: <strong className="text-[#111111]">{item.color}</strong></span>
            <span>•</span>
            <span>Size: <strong className="text-[#111111]">{item.size}</strong></span>
          </div>
          <p className="text-xs font-bold text-[#111111] mt-1 font-mono">{formatPrice(item.price)}</p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#E5E2DC]">
          <div className="flex items-center border border-[#E5E2DC] bg-white rounded-md overflow-hidden">
            <button
              onClick={() => onUpdateQty(item.product, item.color, item.size, item.quantity - 1)}
              className="px-2.5 py-1 text-[#666666] hover:text-[#111111] transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-xs font-bold text-[#111111] px-2 font-mono">{item.quantity}</span>
            <button
              onClick={() => onUpdateQty(item.product, item.color, item.size, item.quantity + 1)}
              className="px-2.5 py-1 text-[#666666] hover:text-[#111111] transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <span className="text-xs font-extrabold text-[#111111] font-mono">{formatPrice(item.price * item.quantity)}</span>
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.product, item.color, item.size)}
        className="absolute top-4 right-4 text-[#666666] hover:text-rose-600 transition-colors"
        title="Remove Item"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

