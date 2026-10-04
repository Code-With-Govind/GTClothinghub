import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, RefreshCw, Star, ArrowLeft, Zap } from 'lucide-react';
import SEO from '../../components/common/SEO';
import VariantSelector from '../../components/product/VariantSelector';
import ReviewSection from '../../components/product/ReviewSection';
import ProductCard from '../../components/product/ProductCard';
import SizeGuidePage from './SizeGuidePage';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

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
    addToCart(product, selectedColor, selectedSize, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 bg-[#F5F1E8]">
      <SEO title={product.seoTitle || `${product.name} | GT CLOTHING HUB`} description={product.seoDescription || product.description} />

      <Link to="/shop" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6F6A61] hover:text-[#292621] transition-colors font-mono">
        <ArrowLeft className="w-4 h-4" /> Back to Catalog
      </Link>

      {/* Main Product PDP Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT: Multi-Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[4/5] bg-white border border-[#DDD7CB] relative overflow-hidden shadow-fashion-sm">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Thumbnails list */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img.url)}
                  className={`w-24 aspect-[4/5] border transition-all shrink-0 bg-white ${
                    activeImage === img.url ? 'border-[#292621] ring-1 ring-[#292621]' : 'border-[#DDD7CB] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Product Information & Purchase Form */}
        <div className="lg:col-span-5 space-y-8 bg-white border border-[#DDD7CB] p-6 sm:p-8 shadow-fashion-sm">
          <div>
            <span className="text-[10px] font-mono font-bold text-[#6F6A61] uppercase tracking-widest block mb-1">
              {product.mainSection || 'Streetwear'} • {product.subSection || 'Drop'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase text-[#292621] font-display leading-tight">
              {product.name}
            </h1>

            {/* Rating if available */}
            {product.numReviews > 0 && (
              <div className="flex items-center gap-2 mt-2 text-xs text-[#B89452]">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-bold text-[#292621] text-xs">{product.averageRating?.toFixed(1)}</span>
                <span className="text-[#6F6A61] text-[11px]">({product.numReviews} reviews)</span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 border-y border-[#DDD7CB] py-4">
            <span className="text-3xl font-extrabold text-[#292621] font-display">{formatPrice(product.price)}</span>
            {product.compareAtPrice > product.price && (
              <span className="text-sm text-[#6F6A61] line-through font-mono">{formatPrice(product.compareAtPrice)}</span>
            )}
          </div>

          {/* Variant Selector */}
          <VariantSelector
            colors={product.colors}
            sizes={product.sizes}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            onSelectColor={setSelectedColor}
            onSelectSize={setSelectedSize}
            onOpenSizeGuide={() => setShowSizeGuide(true)}
          />

          {/* Quantity & Prominent Action CTAs */}
          <div className="space-y-4 pt-4 border-t border-[#DDD7CB]">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-[#6F6A61] uppercase tracking-widest font-mono">QUANTITY:</span>
              <div className="flex items-center border border-[#DDD7CB] bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-1.5 text-[#292621] font-bold hover:bg-[#FAF8F3]"
                >
                  -
                </button>
                <span className="px-4 text-xs font-extrabold text-[#292621]">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-1.5 text-[#292621] font-bold hover:bg-[#FAF8F3]"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="btn-outline w-full py-4 text-xs font-extrabold tracking-widest"
              >
                <ShoppingBag className="w-4 h-4" /> ADD TO CART
              </button>

              <button
                onClick={handleBuyNow}
                className="btn-primary w-full py-4 text-xs font-extrabold tracking-widest"
              >
                <Zap className="w-4 h-4 fill-current" /> BUY NOW
              </button>
            </div>

            {addedToast && (
              <div className="p-3 bg-[#FAF8F3] border border-[#DDD7CB] text-[#292621] text-xs font-bold text-center uppercase tracking-wider animate-fade-in">
                Added {quantity} × {product.name} ({selectedSize}) to bag!
              </div>
            )}

            {/* Genuine Trust Elements */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-[10px] text-[#6F6A61] font-mono border-t border-[#DDD7CB]">
              <div className="flex items-center gap-1.5 p-2 bg-[#FAF8F3] border border-[#DDD7CB]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B89452] shrink-0" />
                <span className="font-bold text-[#292621]">Secure Payment</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 bg-[#FAF8F3] border border-[#DDD7CB]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B89452] shrink-0" />
                <span className="font-bold text-[#292621]">240 GSM Cotton</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 bg-[#FAF8F3] border border-[#DDD7CB]">
                <Truck className="w-3.5 h-3.5 text-[#B89452] shrink-0" />
                <span className="font-bold text-[#292621]">Pan-India Shipping</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 bg-[#FAF8F3] border border-[#DDD7CB]">
                <RefreshCw className="w-3.5 h-3.5 text-[#B89452] shrink-0" />
                <span className="font-bold text-[#292621]">7-Day Exchange</span>
              </div>
            </div>
          </div>

          {/* Product Specifications & Details */}
          <div className="space-y-3 pt-6 border-t border-[#DDD7CB]">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#292621] font-display">
              PRODUCT DETAILS & SPECIFICATIONS
            </h3>
            <p className="text-xs text-[#6F6A61] leading-relaxed font-sans">{product.description}</p>

            <div className="grid grid-cols-1 gap-2 pt-2 text-xs font-medium text-[#292621]">
              <div className="p-3 bg-[#FAF8F3] border border-[#DDD7CB] flex items-center justify-between">
                <span className="text-[#6F6A61] uppercase text-[10px] font-mono">Fabric Weight</span>
                <span className="font-bold">240 GSM Combed Cotton</span>
              </div>
              <div className="p-3 bg-[#FAF8F3] border border-[#DDD7CB] flex items-center justify-between">
                <span className="text-[#6F6A61] uppercase text-[10px] font-mono">Fit Profile</span>
                <span className="font-bold">{product.mainSection || 'Streetwear Fit'}</span>
              </div>
              <div className="p-3 bg-[#FAF8F3] border border-[#DDD7CB] flex items-center justify-between">
                <span className="text-[#6F6A61] uppercase text-[10px] font-mono">Print Standard</span>
                <span className="font-bold">High-Density Direct-To-Garment</span>
              </div>
            </div>

            {/* Shipping & Returns Details */}
            <div className="space-y-3 pt-6 border-t border-[#DDD7CB]">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#292621] font-display flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#292621]" /> SHIPPING & RETURNS
              </h3>
              <div className="space-y-2 text-xs text-[#6F6A61]">
                <p><strong className="text-[#292621]">Pan-India Shipping:</strong> Dispatched within 3-5 business days. Free shipping on orders over ₹999.</p>
                <p><strong className="text-[#292621]">Return Policy:</strong> 7-day easy exchange/return policy for damaged or defective items.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Related Products Grid ("You May Also Like") */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-10 border-t border-[#DDD7CB]">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#6F6A61] uppercase tracking-widest block">
                CURATED FOR YOU
              </span>
              <h2 className="text-2xl font-extrabold uppercase text-[#292621] font-display">
                YOU MAY ALSO LIKE
              </h2>
            </div>
            <Link to="/shop" className="text-xs font-bold uppercase tracking-wider text-[#292621] hover:text-[#B89452] transition-colors">
              EXPLORE ALL
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white border border-[#DDD7CB] shadow-fashion-lg p-6 relative">
            <button
              onClick={() => setShowSizeGuide(false)}
              className="absolute top-4 right-4 text-[#6F6A61] hover:text-[#292621] font-bold"
            >
              ✕
            </button>
            <SizeGuidePage isModal={true} />
          </div>
        </div>
      )}

      {/* Sticky Mobile Purchase Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-white/95 backdrop-blur-md border-t border-[#DDD7CB] flex gap-2 shadow-fashion-hover">
        <button
          onClick={handleAddToCart}
          className="btn-outline flex-1 py-3 text-[11px] font-extrabold tracking-widest"
        >
          ADD TO CART
        </button>
        <button
          onClick={handleBuyNow}
          className="btn-primary flex-1 py-3 text-[11px] font-extrabold tracking-widest"
        >
          BUY NOW
        </button>
      </div>
    </div>
  );
}

