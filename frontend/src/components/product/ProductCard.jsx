import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, ShoppingBag } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [added, setAdded] = useState(false);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0].name : 'Pitch Black';
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M';
    addToCart(product, defaultColor, defaultSize, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const primaryImage = product.images && product.images.length > 0
    ? product.images[0].url
    : 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80';

  const secondaryImage = product.images && product.images.length > 1
    ? product.images[1].url
    : null;

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : null;

  return (
    <div className="group bg-white rounded-xl border border-[#E5E2DC] hover:border-[#111111] transition-all duration-300 flex flex-col h-full hover:shadow-fashion-md overflow-hidden">
      {/* Product Image Container (75% visual attention) */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F7F5F0]">
        <img
          src={primaryImage}
          alt={product.name}
          className={`w-full h-full object-cover object-center transition-all duration-300 ${
            secondaryImage ? 'group-hover:opacity-0 scale-100' : 'group-hover:scale-[1.02]'
          }`}
          loading="lazy"
        />

        {secondaryImage && (
          <img
            src={secondaryImage}
            alt={`${product.name} view 2`}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-300"
            loading="lazy"
          />
        )}

        {/* Discount Badge */}
        {discountPercent && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="bg-[#111111] text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded-md shadow-xs">
              -{discountPercent}%
            </span>
          </div>
        )}

        {/* Quick View Button */}
        <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
          <Link
            to={`/product/${product.slug}`}
            className="w-8 h-8 bg-white/90 hover:bg-white text-[#111111] rounded-full flex items-center justify-center shadow-xs backdrop-blur-xs transition-transform hover:scale-105"
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Quick Add Overlay Button on Image Hover */}
        <div className="absolute inset-x-2.5 bottom-2.5 opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 hidden sm:block">
          <button
            onClick={handleQuickAdd}
            type="button"
            className="w-full py-2.5 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm hover:bg-[#222222] transition-colors flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {added ? 'ADDED TO BAG' : 'ADD TO CART'}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3.5 flex flex-col flex-grow justify-between space-y-2 bg-white text-left">
        <div className="space-y-1">
          <span className="text-[9px] font-mono font-bold text-[#666666] uppercase tracking-widest block truncate">
            {product.mainSection || 'GT STREETWEAR'}
          </span>
          <Link to={`/product/${product.slug}`} className="block">
            <h3 className="font-bold text-xs sm:text-sm text-[#111111] hover:text-[#6F7358] transition-colors line-clamp-1 leading-snug uppercase">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price Information */}
        <div className="flex items-baseline gap-2 pt-1 font-mono">
          <span className="text-xs sm:text-sm font-extrabold text-[#111111]">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-[11px] text-[#666666] line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        {/* Mobile Quick Add CTA */}
        <button
          onClick={handleQuickAdd}
          type="button"
          className="sm:hidden w-full py-2 bg-[#111111] text-white text-[11px] font-bold uppercase tracking-wider rounded-lg transition-colors mt-1"
        >
          {added ? 'ADDED' : 'ADD TO CART'}
        </button>
      </div>
    </div>
  );
}



