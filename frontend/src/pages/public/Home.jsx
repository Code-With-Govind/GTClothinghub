import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import SEO from '../../components/common/SEO';
import ProductCard from '../../components/product/ProductCard';
import ProductCarousel from '../../components/product/ProductCarousel';
import MovingCategoriesMarquee from '../../components/common/MovingCategoriesMarquee';
import api from '../../services/api';
import { useSettings } from '../../context/SettingsContext';

export default function Home() {
  const { settings } = useSettings();
  const [newArrivals, setNewArrivals] = useState([]);
  const [featuredPicks, setFeaturedPicks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newRes, featRes, catRes] = await Promise.all([
          api.get('/products?isNewArrival=true&limit=8'),
          api.get('/products?isFeatured=true&limit=8'),
          api.get('/categories'),
        ]);
        setNewArrivals(newRes.products || []);
        setFeaturedPicks(featRes.products || []);
        setCategories(catRes.categories || []);
      } catch (err) {
        console.warn('Failed to load homepage products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-20 pb-16 bg-[#F5F1E8]">
      <SEO title="GT CLOTHING HUB | Premium Minimalist Streetwear & Graphic Apparel" />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[75vh] flex items-center bg-[#FAF8F3] text-[#292621] overflow-hidden border-b border-[#DDD7CB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white text-[#B89452] text-[10px] font-mono font-bold uppercase tracking-widest border border-[#DDD7CB] shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Modern Apparel Drop
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight font-display leading-[0.95] text-[#292621]">
              WEAR YOUR <br />
              <span className="text-[#B89452]">OWN RULES.</span>
            </h1>

            <p className="max-w-xl text-xs sm:text-sm text-[#6F6A61] leading-relaxed font-sans font-medium">
              Heavyweight 240 GSM combed cotton tees, high-density DTG graphic prints, and custom drop silhouettes engineered on demand for maximum longevity.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Link
                to="/shop"
                className="px-8 py-4 bg-[#292621] text-white hover:bg-[#36322B] text-xs font-bold uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2 border border-[#292621]"
              >
                SHOP NOW <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/shop?isNewArrival=true"
                className="px-8 py-4 bg-transparent border border-[#292621] text-[#292621] hover:bg-[#292621] hover:text-white text-xs font-bold uppercase tracking-widest text-center transition-all"
              >
                EXPLORE COLLECTION
              </Link>
            </div>

            {/* Trust Micro Indicators */}
            <div className="pt-8 flex flex-wrap items-center gap-6 text-[11px] text-[#6F6A61] font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B89452]" /> 100% Super Combed Cotton
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B89452]" /> High-Density DTG Printing
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B89452]" /> Pan-India Express Delivery
              </div>
            </div>
          </div>

          {/* Hero Visual Showcase */}
          <div className="lg:col-span-5 relative aspect-[4/5] bg-white border border-[#DDD7CB] shadow-fashion-lg overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1000&auto=format&fit=crop&q=80"
              alt="Streetwear Hero Visual"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#292621]/80 via-transparent to-transparent p-6 flex flex-col justify-end">
              <span className="text-[10px] font-mono font-bold text-[#B89452] uppercase tracking-widest">
                SIGNATURE OVERSIZED FIT
              </span>
              <p className="text-white text-sm font-bold uppercase tracking-wide">
                240 GSM Bio-Washed Canvas
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Category Marquee */}
      <MovingCategoriesMarquee />

      {/* 2. NEW ARRIVALS CAROUSEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-white border border-[#DDD7CB] animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <ProductCarousel
            products={newArrivals.length > 0 ? newArrivals : featuredPicks}
            title="NEW ARRIVALS"
            subtitle="JUST DROPPED"
          />
        )}
      </section>

      {/* 3. SHOP BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between border-b border-[#DDD7CB] pb-4">
          <div>
            <span className="text-[10px] font-mono font-bold text-[#6F6A61] uppercase tracking-widest block">
              CURATED ESSENTIALS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase text-[#292621] font-display">
              SHOP BY CATEGORY
            </h2>
          </div>
          <Link
            to="/categories"
            className="text-xs font-bold uppercase tracking-wider text-[#292621] hover:text-[#B89452] flex items-center gap-1 transition-colors"
          >
            ALL CATEGORIES <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Link
            to="/shop?mainSection=Regular+T-Shirts"
            className="group relative h-64 sm:h-80 bg-white border border-[#DDD7CB] hover:border-[#292621] rounded-2xl overflow-hidden shadow-fashion-sm transition-all"
          >
            <img
              src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80"
              alt="T-Shirts Category"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#292621]/80 via-[#292621]/20 to-transparent p-4 sm:p-6 flex flex-col justify-end text-white">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#B89452] uppercase tracking-widest">
                CLASSIC SILHOUETTES
              </span>
              <h3 className="text-base sm:text-xl font-extrabold uppercase font-display text-white">T-SHIRTS</h3>
            </div>
          </Link>

          <Link
            to="/shop?mainSection=Oversized+T-Shirts"
            className="group relative h-64 sm:h-80 bg-white border border-[#DDD7CB] hover:border-[#292621] rounded-2xl overflow-hidden shadow-fashion-sm transition-all"
          >
            <img
              src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80"
              alt="Oversized Category"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#292621]/80 via-[#292621]/20 to-transparent p-4 sm:p-6 flex flex-col justify-end text-white">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#B89452] uppercase tracking-widest">
                BOXY 240 GSM DROPS
              </span>
              <h3 className="text-base sm:text-xl font-extrabold uppercase font-display text-white">OVERSIZED</h3>
            </div>
          </Link>

          <Link
            to="/shop?search=Hoodie"
            className="group relative h-64 sm:h-80 bg-white border border-[#DDD7CB] hover:border-[#292621] rounded-2xl overflow-hidden shadow-fashion-sm transition-all"
          >
            <img
              src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80"
              alt="Hoodies Category"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#292621]/80 via-[#292621]/20 to-transparent p-4 sm:p-6 flex flex-col justify-end text-white">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#B89452] uppercase tracking-widest">
                FLEECE COMFORT
              </span>
              <h3 className="text-base sm:text-xl font-extrabold uppercase font-display text-white">HOODIES</h3>
            </div>
          </Link>

          <Link
            to="/shop?isNewArrival=true"
            className="group relative h-64 sm:h-80 bg-white border border-[#DDD7CB] hover:border-[#292621] rounded-2xl overflow-hidden shadow-fashion-sm transition-all"
          >
            <img
              src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80"
              alt="New Drops Category"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#292621]/80 via-[#292621]/20 to-transparent p-4 sm:p-6 flex flex-col justify-end text-white">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#B89452] uppercase tracking-widest">
                LIMITED RUNS
              </span>
              <h3 className="text-base sm:text-xl font-extrabold uppercase font-display text-white">NEW DROPS</h3>
            </div>
          </Link>
        </div>
      </section>

      {/* 4. BRAND STATEMENT */}
      <section className="bg-[#FAF8F3] text-[#292621] py-20 border-y border-[#DDD7CB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[10px] font-mono font-bold text-[#B89452] uppercase tracking-widest">
              OUR PHILOSOPHY
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase font-display leading-tight text-[#292621]">
              NOT JUST CLOTHES. <br />
              <span className="text-[#B89452]">IT'S YOUR EXPRESSION.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#6F6A61] leading-relaxed font-sans max-w-xl font-medium">
              We believe graphic apparel is more than fabric—it is your personal identity statement. Designed for streetwear enthusiasts, engineered with zero compromise on cotton density, print sharpness, or fit consistency.
            </p>
            <div className="pt-2">
              <Link to="/about" className="px-8 py-3.5 bg-[#292621] text-white hover:bg-[#36322B] text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2">
                LEARN ABOUT OUR STORY <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative aspect-square bg-white border border-[#DDD7CB] shadow-fashion-md overflow-hidden rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80"
              alt="Brand Identity Print"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 5. FEATURED PRODUCTS CAROUSEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <ProductCarousel
          products={featuredPicks.length > 0 ? featuredPicks : newArrivals}
          title="FEATURED PRODUCTS"
          subtitle="HANDPICKED DESIGNS"
        />
      </section>


      {/* 6. WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#DDD7CB] p-8 sm:p-12 shadow-fashion-sm">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
            <span className="text-[10px] font-mono font-bold text-[#6F6A61] uppercase tracking-widest">
              OUR COMMITMENT
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase text-[#292621] font-display">
              WHY CHOOSE US
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 text-center sm:text-left">
              <div className="w-10 h-10 bg-[#FAF8F3] border border-[#DDD7CB] flex items-center justify-center mx-auto sm:mx-0">
                <ShieldCheck className="w-5 h-5 text-[#292621]" />
              </div>
              <h3 className="font-extrabold text-sm uppercase text-[#292621]">Premium Quality</h3>
              <p className="text-xs text-[#6F6A61] leading-relaxed font-medium">
                Comfortable 100% super combed cotton & carefully selected heavyweight fabrics.
              </p>
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <div className="w-10 h-10 bg-[#FAF8F3] border border-[#DDD7CB] flex items-center justify-center mx-auto sm:mx-0">
                <Lock className="w-5 h-5 text-[#292621]" />
              </div>
              <h3 className="font-extrabold text-sm uppercase text-[#292621]">Secure Payments</h3>
              <p className="text-xs text-[#6F6A61] leading-relaxed font-medium">
                Safe and encrypted online payments via Razorpay as well as Cash on Delivery.
              </p>
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <div className="w-10 h-10 bg-[#FAF8F3] border border-[#DDD7CB] flex items-center justify-center mx-auto sm:mx-0">
                <RefreshCw className="w-5 h-5 text-[#292621]" />
              </div>
              <h3 className="font-extrabold text-sm uppercase text-[#292621]">Easy Support</h3>
              <p className="text-xs text-[#6F6A61] leading-relaxed font-medium">
                Responsive customer support team available to assist with orders and queries.
              </p>
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <div className="w-10 h-10 bg-[#FAF8F3] border border-[#DDD7CB] flex items-center justify-center mx-auto sm:mx-0">
                <Truck className="w-5 h-5 text-[#292621]" />
              </div>
              <h3 className="font-extrabold text-sm uppercase text-[#292621]">Quality Checked</h3>
              <p className="text-xs text-[#6F6A61] leading-relaxed font-medium">
                Every print and garment is thoroughly inspected before dispatch and fulfillment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. INSTAGRAM / SOCIAL PROOF */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-md mx-auto space-y-2">
          <span className="text-[10px] font-mono font-bold text-[#6F6A61] uppercase tracking-widest">
            COMMUNITY & LOOKBOOK
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase text-[#292621] font-display">
            FOLLOW THE DROP
          </h2>
          <p className="text-xs text-[#6F6A61] font-medium">
            Tag @GTCLOTHINGHUB to be featured in our seasonal lookbook showcase.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="aspect-square bg-white border border-[#DDD7CB] overflow-hidden group shadow-fashion-sm">
            <img
              src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80"
              alt="Community Lookbook 1"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="aspect-square bg-white border border-[#DDD7CB] overflow-hidden group shadow-fashion-sm">
            <img
              src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop&q=80"
              alt="Community Lookbook 2"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="aspect-square bg-white border border-[#DDD7CB] overflow-hidden group shadow-fashion-sm">
            <img
              src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&auto=format&fit=crop&q=80"
              alt="Community Lookbook 3"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="aspect-square bg-white border border-[#DDD7CB] overflow-hidden group shadow-fashion-sm">
            <img
              src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80"
              alt="Community Lookbook 4"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* 8. EMAIL / CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF8F3] text-[#292621] border border-[#DDD7CB] p-8 sm:p-14 text-center space-y-6 shadow-fashion-sm">
          <span className="text-[10px] font-mono font-bold text-[#B89452] uppercase tracking-widest">
            EXCLUSIVE DROPS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase font-display text-[#292621]">
            DON'T MISS THE NEXT DROP
          </h2>
          <p className="text-xs sm:text-sm text-[#6F6A61] max-w-md mx-auto font-medium">
            Subscribe to receive instant drop notifications, secret coupon codes, and priority access to limited graphic tees.
          </p>

          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full px-4 py-3.5 bg-white border border-[#DDD7CB] text-[#292621] placeholder-[#6F6A61] text-xs focus:outline-none focus:border-[#292621]"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#292621] text-white text-xs font-bold uppercase tracking-widest shrink-0 hover:bg-[#36322B] transition-colors"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

