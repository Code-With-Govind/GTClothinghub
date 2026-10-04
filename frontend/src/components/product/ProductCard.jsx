import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Eye } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
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

  const discount = product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 50;

  return (
    <div className="group bg-white rounded-2xl border border-[#DDD7CB] hover:border-[#292621] transition-all duration-300 flex flex-col h-full hover:shadow-fashion-md overflow-hidden">
      {/* Product Image & Badges Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#FAF8F3] rounded-t-2xl">
        <img
          src={primaryImage}
          alt={product.name}
          className={`w-full h-full object-cover object-center transition-all duration-500 ${
            secondaryImage ? 'group-hover:opacity-0 scale-100' : 'group-hover:scale-105'
          }`}
          loading="lazy"
        />

        {secondaryImage && (
          <img
            src={secondaryImage}
            alt={`${product.name} alternate view`}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
            loading="lazy"
          />
        )}

        {/* Round Red Discount Badge Pill (-50%) */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="bg-[#E53E3E] text-white font-black text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full shadow-sm font-mono">
            -{discount}%
          </span>
        </div>

        {/* Quick View Floating Button on Right */}
        <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
          <Link
            to={`/product/${product.slug}`}
            className="w-7 h-7 bg-white/90 hover:bg-white text-[#292621] rounded-full flex items-center justify-center shadow-sm backdrop-blur-xs transition-transform hover:scale-110"
            title="Quick View"
          >
            <Eye className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* "Select Options" Glassmorphism Overlay Pill Button at Bottom of Image */}
        <div className="absolute inset-x-2.5 bottom-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
          <button
            onClick={handleQuickAdd}
            className="w-full py-2 bg-white/95 hover:bg-white text-[#292621] text-xs font-bold rounded-xl shadow-md border border-white/50 backdrop-blur-xs transition-all hover:scale-[1.02] flex items-center justify-center gap-1.5"
          >
            {added ? 'ADDED TO BAG!' : 'Select Options'}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow justify-between text-center space-y-1.5 bg-white">
        <div>
          <Link to={`/product/${product.slug}`} className="block">
            <h3 className="font-semibold text-xs sm:text-sm text-[#292621] hover:text-[#B89452] transition-colors line-clamp-1 leading-snug font-sans">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price Row: Rs. 1,499.00  Rs. 2,999.00 */}
        <div className="flex items-center justify-center gap-2 pt-0.5 font-mono">
          <span className="text-xs sm:text-sm font-extrabold text-[#E53E3E]">
            Rs. {product.price?.toLocaleString('en-IN') || '1,499.00'}
          </span>
          <span className="text-[11px] sm:text-xs text-[#6F6A61] line-through">
            Rs. {(product.compareAtPrice || product.price * 2)?.toLocaleString('en-IN') || '2,999.00'}
          </span>
        </div>
      </div>
    </div>
  );
}


