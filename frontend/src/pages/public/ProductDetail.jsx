import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  RefreshCw,
  Star,
  ArrowLeft,
  Zap,
  ChevronDown,
  ChevronUp,
  Package,
  CheckCircle2,
  AlertCircle,
  Tag,
  Share2,
  Copy,
  Check,
  MessageCircle,
} from 'lucide-react';
import SEO from '../../components/common/SEO';
import VariantSelector from '../../components/product/VariantSelector';
import ReviewSection from '../../components/product/ReviewSection';
import ProductCard from '../../components/product/ProductCard';
import SizeGuidePage from './SizeGuidePage';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/formatters';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState('');
  const [imageError, setImageError] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [addedToast, setAddedToast] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [copiedToast, setCopiedToast] = useState(false);

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState('DESCRIPTION');

  const toggleAccordion = (name) => {
    setOpenAccordion(openAccordion === name ? null : name);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/products/${slug}`);
        if (res.product) {
          const prod = res.product;
          setProduct(prod);

          const activeVariants = Array.isArray(prod.variants)
            ? prod.variants.filter((v) => v.isActive !== false)
            : [];

          // 1. Initial color selection
          let initialColor = '';
          if (activeVariants.length > 0) {
            initialColor = activeVariants[0].color;
          } else if (Array.isArray(prod.colors) && prod.colors.length > 0) {
            initialColor = prod.colors[0].name;
          } else {
            initialColor = 'Pitch Black';
          }
          setSelectedColor(initialColor);

          // 2. Initial size selection for that color
          let initialSize = '';
          if (activeVariants.length > 0) {
            const sizesForColor = activeVariants.filter(
              (v) => v.color?.toLowerCase() === initialColor.toLowerCase()
            );
            initialSize = sizesForColor.length > 0 ? sizesForColor[0].size : activeVariants[0].size;
          } else if (Array.isArray(prod.sizes) && prod.sizes.length > 0) {
            initialSize = prod.sizes[0];
          } else {
            initialSize = 'M';
          }
          setSelectedSize(initialSize);

          // 3. Initial image
          setActiveImage(prod.images?.[0]?.url || '');
          setImageError(false);

          // 4. Fetch related items
          const relatedRes = await api.get('/products?limit=4');
          setRelatedProducts((relatedRes.products || []).filter((p) => p._id !== prod._id));
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  // Handle color change: ensures selected size remains valid for new color
  const handleColorChange = (newColor) => {
    setSelectedColor(newColor);
    setValidationError('');

    if (product?.variants && product.variants.length > 0) {
      const activeForNewColor = product.variants.filter(
        (v) => v.color?.toLowerCase() === newColor.toLowerCase() && v.isActive !== false
      );
      const isCurrentSizeValid = activeForNewColor.some(
        (v) => v.size?.toUpperCase() === selectedSize?.toUpperCase()
      );

      if (!isCurrentSizeValid && activeForNewColor.length > 0) {
        setSelectedSize(activeForNewColor[0].size);
      }
    }
  };

  const handleSizeChange = (newSize) => {
    setSelectedSize(newSize);
    setValidationError('');
  };

  // Compute active variant details
  const activeVariant = product?.variants?.find(
    (v) =>
      v.color?.toLowerCase() === selectedColor?.toLowerCase() &&
      v.size?.toUpperCase() === selectedSize?.toUpperCase()
  );

  const currentPrice = activeVariant ? activeVariant.price : product?.price || 0;
  const currentCompareAtPrice =
    activeVariant && activeVariant.compareAtPrice > 0
      ? activeVariant.compareAtPrice
      : product?.compareAtPrice || 0;

  const currentSku = activeVariant?.sku || product?.sku || (product ? `GT-${product.slug?.toUpperCase()}` : '');

  const isAvailable =
    product?.status === 'ACTIVE' &&
    (!activeVariant || (activeVariant.isActive !== false && activeVariant.providerAvailability !== false));

  const hasDiscount = currentCompareAtPrice > currentPrice;
  const discountPercent = hasDiscount
    ? Math.round(((currentCompareAtPrice - currentPrice) / currentCompareAtPrice) * 100)
    : null;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-8 h-8 border-2 border-[#111111] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono text-[#666666] mt-4 uppercase tracking-wider">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-14 h-14 bg-[#F7F5F0] border border-[#E5E2DC] rounded-full flex items-center justify-center mx-auto text-[#666666]">
          <Package className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold uppercase text-[#111111] font-display">{error || 'Product Not Found'}</h2>
        <p className="text-xs text-[#666666] max-w-sm mx-auto">
          The requested apparel item is unavailable or may have been archived from the drop catalog.
        </p>
        <Link to="/shop" className="btn-primary inline-flex">Back to Catalog</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/product/${slug}` } } });
      return;
    }

    if (!selectedColor || !selectedSize) {
      setValidationError('Please select both a color and a size before adding to bag.');
      return;
    }

    if (!isAvailable) {
      setValidationError('The selected variant is currently out of stock.');
      return;
    }

    setValidationError('');
    addToCart(product, selectedColor, selectedSize, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/product/${slug}` } } });
      return;
    }

    if (!selectedColor || !selectedSize) {
      setValidationError('Please select both a color and a size.');
      return;
    }

    if (!isAvailable) {
      setValidationError('The selected variant is currently out of stock.');
      return;
    }

    setValidationError('');
    addToCart(product, selectedColor, selectedSize, quantity);
    navigate('/checkout');
  };

  const getShareUrl = () => {
    if (typeof window !== 'undefined' && window.location?.href) {
      return window.location.href;
    }
    return `https://gt-clothinghub.vercel.app/product/${product?.slug || slug}`;
  };

  const handleCopyLink = async () => {
    const url = getShareUrl();
    let copied = false;

    if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(url);
        copied = true;
      } catch (err) {
        // Fall through to textarea fallback
      }
    }

    if (!copied && typeof document !== 'undefined') {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        copied = document.execCommand('copy');
        textArea.remove();
      } catch (err) {
        copied = false;
      }
    }

    if (copied) {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  const handleShare = async () => {
    const url = getShareUrl();
    const shareData = {
      title: product?.name ? `${product.name} | GT CLOTHING HUB` : 'GT CLOTHING HUB',
      text: product?.name
        ? `Check out the ${product.name} at GT Clothing Hub: `
        : 'Check out this drop at GT Clothing Hub: ',
      url,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }
      }
    }

    await handleCopyLink();
  };

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images?.length > 0 ? product.images.map((i) => (typeof i === 'string' ? i : i.url)) : [activeImage],
    description: product.description,
    sku: currentSku,
    brand: {
      '@type': 'Brand',
      name: 'GT CLOTHING HUB',
    },
    offers: {
      '@type': 'Offer',
      url: `https://gt-clothinghub.vercel.app/product/${product.slug}`,
      priceCurrency: 'INR',
      price: currentPrice,
      itemCondition: 'https://schema.org/NewCondition',
      availability: isAvailable ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 bg-[#F7F5F0]">
      <SEO
        title={product.seoTitle || `${product.name} | GT CLOTHING HUB`}
        description={product.seoDescription || product.description}
        image={activeImage}
        path={`/product/${product.slug}`}
        schema={productSchema}
      />

      <Link
        to="/shop"
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#666666] hover:text-[#111111] transition-colors font-mono"
      >
        <ArrowLeft className="w-4 h-4" /> CATALOG
      </Link>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* LEFT: Product Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Hero Image */}
          <div className="aspect-[4/5] bg-white border border-[#E5E2DC] rounded-2xl relative overflow-hidden shadow-fashion-sm flex items-center justify-center p-4 sm:p-8">
            {activeImage && !imageError ? (
              <img
                src={activeImage}
                alt={product.name}
                onError={() => setImageError(true)}
                className="w-full h-full object-contain object-center transition-all duration-300 select-none"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 space-y-3 text-[#666666]">
                <div className="w-16 h-16 rounded-full bg-[#F7F5F0] border border-[#E5E2DC] flex items-center justify-center">
                  <Package className="w-8 h-8 text-[#888888]" />
                </div>
                <p className="text-xs font-mono uppercase font-bold text-[#111111]">{product.name}</p>
                <span className="text-[11px] text-[#888888]">Product Artwork Preview</span>
              </div>
            )}

            {/* Discount Badge */}
            {discountPercent && (
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-[#111111] text-white font-mono font-bold text-xs px-2.5 py-1 rounded-md shadow-sm">
                  -{discountPercent}% OFF
                </span>
              </div>
            )}

            {/* Main Section Badge */}
            <div className="absolute top-4 right-4 z-10">
              <span className="bg-white/90 backdrop-blur-xs text-[#111111] border border-[#E5E2DC] font-mono font-bold text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider shadow-xs">
                {product.mainSection || 'Streetwear'}
              </span>
            </div>
          </div>

          {/* Clickable Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {product.images.map((img, idx) => {
                const imgUrl = typeof img === 'string' ? img : img.url;
                const isActive = activeImage === imgUrl;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActiveImage(imgUrl);
                      setImageError(false);
                    }}
                    className={`w-20 sm:w-24 aspect-[4/5] border rounded-xl transition-all shrink-0 bg-white overflow-hidden p-1.5 flex items-center justify-center ${
                      isActive
                        ? 'border-[#111111] ring-2 ring-[#111111] shadow-sm'
                        : 'border-[#E5E2DC] opacity-70 hover:opacity-100 hover:border-[#888888]'
                    }`}
                    aria-label={`View product image ${idx + 1}`}
                  >
                    <img
                      src={imgUrl}
                      alt={img.altText || `${product.name} view ${idx + 1}`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT: Product Information & Controls */}
        <div className="lg:col-span-5 space-y-6 bg-white border border-[#E5E2DC] rounded-2xl p-6 sm:p-8 shadow-fashion-sm">
          {/* Header & Title */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[10px] font-mono font-bold text-[#6F7358] uppercase tracking-widest block">
                {product.mainSection || 'GT STREETWEAR'} • {product.subSection || 'ORIGINAL DROP'}
              </span>
              <div className="flex items-center gap-3">
                {currentSku && (
                  <span className="text-[10px] font-mono text-[#888888] uppercase tracking-wider">
                    SKU: {currentSku}
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleShare}
                  className="p-1.5 rounded-lg border border-[#E5E2DC] hover:border-[#111111] hover:bg-[#F7F5F0] text-[#666666] hover:text-[#111111] transition-all inline-flex items-center gap-1.5 text-[11px] font-mono"
                  title="Share this product"
                  aria-label="Share this product"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline font-bold">SHARE</span>
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase text-[#111111] font-display leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            {product.numReviews > 0 && (
              <div className="flex items-center gap-2 mt-2 text-xs text-[#6F7358]">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current text-[#111111]" />
                  ))}
                </div>
                <span className="font-bold text-[#111111] text-xs font-mono">{product.averageRating?.toFixed(1)}</span>
                <span className="text-[#666666] text-[11px]">({product.numReviews} reviews)</span>
              </div>
            )}
          </div>

          {/* Pricing & Stock Availability */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-y border-[#E5E2DC] py-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-[#111111] font-mono">
                {formatPrice(currentPrice)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-base text-[#666666] line-through font-mono">
                    {formatPrice(currentCompareAtPrice)}
                  </span>
                  <span className="text-xs font-bold text-[#6F7358] bg-[#F7F5F0] border border-[#E5E2DC] px-2 py-0.5 rounded-md font-mono">
                    {discountPercent}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Stock / Availability Status */}
            <div>
              {isAvailable ? (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> IN STOCK
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md font-mono">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" /> UNAVAILABLE
                </span>
              )}
            </div>
          </div>

          {/* Variant Selector (Colors & Sizes) */}
          <VariantSelector
            variants={product.variants}
            colors={product.colors}
            sizes={product.sizes}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            onSelectColor={handleColorChange}
            onSelectSize={handleSizeChange}
            onOpenSizeGuide={() => setShowSizeGuide(true)}
          />

          {/* Validation Error Message */}
          {validationError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-medium text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Quantity & Actions */}
          <div className="space-y-4 pt-4 border-t border-[#E5E2DC]">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-[#666666] uppercase tracking-widest font-mono">QUANTITY:</span>
              <div className="flex items-center border border-[#E5E2DC] bg-white rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-1.5 text-[#111111] font-bold hover:bg-[#F7F5F0] transition-colors"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-4 text-xs font-extrabold text-[#111111] font-mono select-none">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-1.5 text-[#111111] font-bold hover:bg-[#F7F5F0] transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={!isAvailable}
                className="btn-primary w-full py-4 text-xs font-extrabold tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" />
                {isAvailable ? 'ADD TO CART' : 'CURRENTLY UNAVAILABLE'}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!isAvailable}
                className="btn-outline w-full py-4 text-xs font-extrabold tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap className="w-4 h-4" /> BUY NOW
              </button>
            </div>

            {addedToast && (
              <div className="p-3 bg-[#111111] text-white text-xs font-bold text-center uppercase tracking-wider rounded-xl animate-fade-in flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Added {quantity} × {product.name} ({selectedColor} / {selectedSize}) to bag!
              </div>
            )}

            {/* Share & Social Row */}
            <div className="pt-2">
              <div className="p-3 bg-[#F7F5F0] border border-[#E5E2DC] rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <Share2 className="w-4 h-4 text-[#6F7358] shrink-0" />
                  <span className="text-xs font-mono font-bold text-[#111111] uppercase tracking-wider truncate">
                    Share this drop
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E5E2DC] hover:border-[#111111] rounded-lg text-xs font-mono font-bold text-[#111111] transition-colors shadow-xs"
                    aria-label="Copy link to clipboard"
                  >
                    {copiedToast ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#666666]" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `Check out ${product.name} on GT Clothing Hub: ${getShareUrl()}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-white border border-[#E5E2DC] hover:border-emerald-500 hover:text-emerald-600 rounded-lg text-[#666666] transition-colors shadow-xs"
                    title="Share on WhatsApp"
                    aria-label="Share on WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#111111] text-white hover:bg-[#333333] rounded-lg text-xs font-mono font-bold transition-colors shadow-xs"
                    title="Share via native device menu"
                    aria-label="Native share menu"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                </div>
              </div>

              {copiedToast && (
                <div className="mt-2 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold text-center rounded-lg animate-fade-in flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Link copied to clipboard! Share it with friends.
                </div>
              )}
            </div>
          </div>

          {/* Product Information Accordions */}
          <div className="pt-6 border-t border-[#E5E2DC] space-y-2">
            {/* Accordion 1: DESCRIPTION */}
            <div className="border-b border-[#E5E2DC] pb-3">
              <button
                onClick={() => toggleAccordion('DESCRIPTION')}
                className="w-full flex justify-between items-center py-2 text-xs font-bold uppercase tracking-widest text-[#111111] font-display"
              >
                <span>DESCRIPTION</span>
                {openAccordion === 'DESCRIPTION' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'DESCRIPTION' && (
                <div className="pt-2 text-xs text-[#666666] leading-relaxed font-sans animate-fade-in">
                  {product.description}
                </div>
              )}
            </div>

            {/* Accordion 2: SIZE & FIT */}
            <div className="border-b border-[#E5E2DC] pb-3">
              <button
                onClick={() => toggleAccordion('SIZE_FIT')}
                className="w-full flex justify-between items-center py-2 text-xs font-bold uppercase tracking-widest text-[#111111] font-display"
              >
                <span>SIZE & FIT</span>
                {openAccordion === 'SIZE_FIT' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'SIZE_FIT' && (
                <div className="pt-2 text-xs text-[#666666] space-y-1.5 font-sans animate-fade-in">
                  <p>• Fit: {product.mainSection || 'Streetwear Boxy Silhouette'}</p>
                  <p>• Model fit: True to size. Choose one size up for an exaggerated oversized fit.</p>
                  <p>• Pre-shrunk to ensure consistent sizing after washing.</p>
                </div>
              )}
            </div>

            {/* Accordion 3: MATERIAL & CARE */}
            <div className="border-b border-[#E5E2DC] pb-3">
              <button
                onClick={() => toggleAccordion('MATERIAL_CARE')}
                className="w-full flex justify-between items-center py-2 text-xs font-bold uppercase tracking-widest text-[#111111] font-display"
              >
                <span>MATERIAL & CARE</span>
                {openAccordion === 'MATERIAL_CARE' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'MATERIAL_CARE' && (
                <div className="pt-2 text-xs text-[#666666] space-y-1.5 font-sans animate-fade-in">
                  <p>• Fabric: 100% Super Combed Heavyweight Cotton (240 GSM)</p>
                  <p>• Wash Care: Machine wash cold inside out with like colors.</p>
                  <p>• Do not iron directly over printed artwork.</p>
                </div>
              )}
            </div>

            {/* Accordion 4: SHIPPING & DELIVERY */}
            <div className="border-b border-[#E5E2DC] pb-3">
              <button
                onClick={() => toggleAccordion('SHIPPING')}
                className="w-full flex justify-between items-center py-2 text-xs font-bold uppercase tracking-widest text-[#111111] font-display"
              >
                <span>SHIPPING & DELIVERY</span>
                {openAccordion === 'SHIPPING' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'SHIPPING' && (
                <div className="pt-2 text-xs text-[#666666] space-y-1.5 font-sans animate-fade-in">
                  <p>• Dispatched within 2-4 business days across Pan-India.</p>
                  <p>• Live tracking links sent via email/SMS upon courier dispatch.</p>
                  <p>• Cash on Delivery (COD) & Prepaid payments supported.</p>
                </div>
              )}
            </div>

            {/* Accordion 5: RETURNS & EXCHANGES */}
            <div className="border-b border-[#E5E2DC] pb-3">
              <button
                onClick={() => toggleAccordion('RETURNS')}
                className="w-full flex justify-between items-center py-2 text-xs font-bold uppercase tracking-widest text-[#111111] font-display"
              >
                <span>RETURNS & EXCHANGES</span>
                {openAccordion === 'RETURNS' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'RETURNS' && (
                <div className="pt-2 text-xs text-[#666666] space-y-1.5 font-sans animate-fade-in">
                  <p>• 7-day hassle-free exchange window for sizing or print issues.</p>
                  <p>• Items must be unwashed and unworn with original tags.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section 27: Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-10 border-t border-[#E5E2DC]">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-[#6F7358] uppercase tracking-widest block">
                CURATED RECOMMENDATIONS
              </span>
              <h2 className="text-2xl font-extrabold uppercase text-[#111111] font-display">
                YOU MAY ALSO LIKE
              </h2>
            </div>
            <Link to="/shop" className="text-xs font-bold uppercase tracking-wider text-[#111111] hover:text-[#6F7358] transition-colors">
              EXPLORE ALL
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.slice(0, 4).map((relProduct) => (
              <ProductCard key={relProduct._id} product={relProduct} />
            ))}
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <ReviewSection productId={product._id} />

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white border border-[#E5E2DC] rounded-t-2xl sm:rounded-2xl shadow-fashion-lg p-6 relative self-end sm:self-center">
            <button
              onClick={() => setShowSizeGuide(false)}
              className="absolute top-4 right-4 text-[#666666] hover:text-[#111111] font-bold text-lg"
              aria-label="Close size guide"
            >
              ✕
            </button>
            <SizeGuidePage isModal={true} />
          </div>
        </div>
      )}

      {/* Mobile Sticky CTA Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-white/95 backdrop-blur-md border-t border-[#E5E2DC] flex gap-2 shadow-fashion-hover">
        <button
          onClick={handleAddToCart}
          disabled={!isAvailable}
          className="btn-primary flex-1 py-3 text-[11px] font-extrabold tracking-widest disabled:opacity-50"
        >
          {isAvailable ? 'ADD TO CART' : 'UNAVAILABLE'}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={!isAvailable}
          className="btn-outline flex-1 py-3 text-[11px] font-extrabold tracking-widest disabled:opacity-50"
        >
          BUY NOW
        </button>
      </div>
    </div>
  );
}
