import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, RefreshCw, Star, ArrowLeft, Zap, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [activeImage, setActiveImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  // Section 25: Accordion state
  const [openAccordion, setOpenAccordion] = useState('DESCRIPTION');

  const toggleAccordion = (name) => {
    setOpenAccordion(openAccordion === name ? null : name);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${slug}`);
        if (res.product) {
          setProduct(res.product);
          setActiveImage(res.product.images?.[0]?.url || '');
          setSelectedColor(res.product.colors?.[0]?.name || 'Pitch Black');
          setSelectedSize(res.product.sizes?.[0] || 'M');

          // Fetch related items
          const relatedRes = await api.get('/products?limit=4');
          setRelatedProducts((relatedRes.products || []).filter(p => p._id !== res.product._id));
        }
      } catch (err) {
        console.warn('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-8 h-8 border-2 border-[#111111] border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold uppercase text-[#111111]">Product Not Found</h2>
        <Link to="/shop" className="btn-primary">Back to Catalog</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/product/${slug}` } } });
      return;
    }
    addToCart(product, selectedColor, selectedSize, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/product/${slug}` } } });
      return;
    }
    addToCart(product, selectedColor, selectedSize, quantity);
    navigate('/checkout');
  };

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 bg-[#F7F5F0]">
      <SEO title={product.seoTitle || `${product.name} | GT CLOTHING HUB`} description={product.seoDescription || product.description} />

      <Link to="/shop" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#666666] hover:text-[#111111] transition-colors font-mono">
        <ArrowLeft className="w-4 h-4" /> CATALOG
      </Link>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT: Section 20 - Product Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[4/5] bg-white border border-[#E5E2DC] rounded-2xl relative overflow-hidden shadow-fashion-sm">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {discountPercent && (
              <div className="absolute top-4 left-4">
                <span className="bg-[#111111] text-white font-mono font-bold text-xs px-2.5 py-1 rounded-md">
                  -{discountPercent}% OFF
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails (Front, Back, Detail Views) */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img.url)}
                  className={`w-24 aspect-[4/5] border rounded-lg transition-all shrink-0 bg-white overflow-hidden ${
                    activeImage === img.url ? 'border-[#111111] ring-2 ring-[#111111]' : 'border-[#E5E2DC] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Section 21 - Product Information */}
        <div className="lg:col-span-5 space-y-8 bg-white border border-[#E5E2DC] rounded-2xl p-6 sm:p-8 shadow-fashion-sm">
          <div>
            <span className="text-[10px] font-mono font-bold text-[#6F7358] uppercase tracking-widest block mb-1">
              {product.mainSection || 'GT STREETWEAR'} • {product.subSection || 'ORIGINAL DROP'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase text-[#111111] font-display leading-tight">
              {product.name}
            </h1>

            {/* Rating if real */}
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

          {/* Section 22: Product Price Design */}
          <div className="flex items-baseline gap-3 border-y border-[#E5E2DC] py-4">
            <span className="text-3xl font-extrabold text-[#111111] font-mono">{formatPrice(product.price)}</span>
            {hasDiscount && (
              <>
                <span className="text-base text-[#666666] line-through font-mono">{formatPrice(product.compareAtPrice)}</span>
                <span className="text-xs font-bold text-[#6F7358] bg-[#F7F5F0] border border-[#E5E2DC] px-2 py-0.5 rounded-md font-mono">
                  {discountPercent}% OFF
                </span>
              </>
            )}
          </div>

          {/* Section 23: Size Selector */}
          <VariantSelector
            colors={product.colors}
            sizes={product.sizes}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            onSelectColor={setSelectedColor}
            onSelectSize={setSelectedSize}
            onOpenSizeGuide={() => setShowSizeGuide(true)}
          />

          {/* Quantity & Section 26: CTAs */}
          <div className="space-y-4 pt-4 border-t border-[#E5E2DC]">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-[#666666] uppercase tracking-widest font-mono">QUANTITY:</span>
              <div className="flex items-center border border-[#E5E2DC] bg-white rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-1.5 text-[#111111] font-bold hover:bg-[#F7F5F0]"
                >
                  -
                </button>
                <span className="px-4 text-xs font-extrabold text-[#111111] font-mono">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-1.5 text-[#111111] font-bold hover:bg-[#F7F5F0]"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="btn-primary w-full py-4 text-xs font-extrabold tracking-widest"
              >
                <ShoppingBag className="w-4 h-4" /> ADD TO CART
              </button>

              <button
                onClick={handleBuyNow}
                className="btn-outline w-full py-4 text-xs font-extrabold tracking-widest"
              >
                <Zap className="w-4 h-4" /> BUY NOW
              </button>
            </div>

            {addedToast && (
              <div className="p-3 bg-[#111111] text-white text-xs font-bold text-center uppercase tracking-wider rounded-lg animate-fade-in">
                Added {quantity} × {product.name} ({selectedSize}) to bag!
              </div>
            )}
          </div>

          {/* Section 25: Product Information Accordion */}
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

            {/* Accordion 4: SHIPPING */}
            <div className="border-b border-[#E5E2DC] pb-3">
              <button
                onClick={() => toggleAccordion('SHIPPING')}
                className="w-full flex justify-between items-center py-2 text-xs font-bold uppercase tracking-widest text-[#111111] font-display"
              >
                <span>SHIPPING</span>
                {openAccordion === 'SHIPPING' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'SHIPPING' && (
                <div className="pt-2 text-xs text-[#666666] space-y-1.5 font-sans animate-fade-in">
                  <p>• Dispatched within 3-5 business days across Pan-India.</p>
                  <p>• Tracking links emailed upon courier dispatch.</p>
                </div>
              )}
            </div>

            {/* Accordion 5: RETURNS */}
            <div className="border-b border-[#E5E2DC] pb-3">
              <button
                onClick={() => toggleAccordion('RETURNS')}
                className="w-full flex justify-between items-center py-2 text-xs font-bold uppercase tracking-widest text-[#111111] font-display"
              >
                <span>RETURNS</span>
                {openAccordion === 'RETURNS' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'RETURNS' && (
                <div className="pt-2 text-xs text-[#666666] space-y-1.5 font-sans animate-fade-in">
                  <p>• 7-day exchange window for sizing or print issues.</p>
                  <p>• Items must be unwashed and unworn with original tags.</p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Section 27: Related Products ("YOU MAY ALSO LIKE") */}
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

      {/* Section 24: Size Guide Modal / Drawer */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white border border-[#E5E2DC] rounded-t-2xl sm:rounded-2xl shadow-fashion-lg p-6 relative self-end sm:self-center">
            <button
              onClick={() => setShowSizeGuide(false)}
              className="absolute top-4 right-4 text-[#666666] hover:text-[#111111] font-bold text-lg"
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
          className="btn-primary flex-1 py-3 text-[11px] font-extrabold tracking-widest"
        >
          ADD TO CART
        </button>
        <button
          onClick={handleBuyNow}
          className="btn-outline flex-1 py-3 text-[11px] font-extrabold tracking-widest"
        >
          BUY NOW
        </button>
      </div>
    </div>
  );
}

