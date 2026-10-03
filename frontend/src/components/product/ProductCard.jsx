import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShoppingBag } from 'lucide-react';
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
    : 0;

  return (
    <div className="group bg-white border border-[#DDD7CB] hover:border-[#292621] transition-all duration-300 flex flex-col h-full hover:shadow-fashion-md">
      {/* Product Image & Badges Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#FAF8F3]">
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

        {/* Minimal Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNewArrival && (
            <span className="fashion-badge">
              NEW DROP
            </span>
          )}
          {discount > 0 && (
            <span className="fashion-badge-accent">
              -{discount}%
            </span>
          )}
        </div>

        {/* Quick View & Quick Add Buttons Hover Overlay */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 flex gap-2">
          <button
            onClick={handleQuickAdd}
            className="btn-outline flex-1 text-[10px] py-2 bg-white/95"
            title="Quick Add to Bag"
          >
            {added ? 'ADDED!' : 'QUICK ADD'}
          </button>
          <Link
            to={`/product/${product.slug}`}
            className="btn-primary flex-1 text-[10px] py-2"
          >
            VIEW <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-grow justify-between space-y-2 bg-white">
        <div>
          {/* Main & Sub Section */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-bold tracking-widest text-[#6F6A61] uppercase font-mono">
              {product.mainSection || 'Collection'}
            </span>
          </div>

          {/* Product Title */}
          <Link to={`/product/${product.slug}`} className="block">
            <h3 className="font-semibold text-xs sm:text-sm text-[#292621] group-hover:text-[#B89452] transition-colors line-clamp-2 leading-snug font-sans">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Rating Row */}
        <div className="flex items-center justify-between pt-2 border-t border-[#DDD7CB]">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-extrabold text-[#292621] font-display">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice > product.price && (
              <span className="text-xs text-[#6F6A61] line-through font-mono">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Genuine rating if available */}
          {product.numReviews > 0 && (
            <div className="flex items-center gap-1 text-[#B89452] text-[11px]">
              <Star className="w-3 h-3 fill-current" />
              <span className="font-semibold text-[#292621]">{product.averageRating?.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

