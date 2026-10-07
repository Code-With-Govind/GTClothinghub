import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, Lock, Headset, Sparkles, CheckCircle2 } from 'lucide-react';
import SEO from '../../components/common/SEO';
import ProductCard from '../../components/product/ProductCard';
import ProductCarousel from '../../components/product/ProductCarousel';
import api from '../../services/api';
import { useSettings } from '../../context/SettingsContext';

export default function Home() {
  const { settings } = useSettings();
  const [featuredDrops, setFeaturedDrops] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featRes, newRes] = await Promise.all([
          api.get('/products?isFeatured=true&limit=8'),
          api.get('/products?isNewArrival=true&limit=8'),
        ]);
        setFeaturedDrops(featRes.products || []);
        setNewArrivals(newRes.products || []);
      } catch (err) {
        console.warn('Failed to load homepage catalog:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const heroProductImage = featuredDrops[0]?.images?.[0]?.url || 
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1000&auto=format&fit=crop&q=80';

  const collectionProductImage = featuredDrops[1]?.images?.[0]?.url || 
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&auto=format&fit=crop&q=80';

  return (
    <div className="bg-[#F7F5F0] text-[#111111] min-h-screen">
      <SEO title="GT Clothing Hub | Modern Streetwear & T-Shirts" />

      {/* 10 — HERO SECTION */}
      <section className="relative pt-8 pb-16 lg:py-20 border-b border-[#E5E2DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column Content */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#6F7358]">
              GT CLOTHING HUB
            </span>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase font-display leading-[0.95] text-[#111111] tracking-tight">
              WEAR YOUR <br />
              OWN RULES.
            </h1>

            <p className="max-w-lg text-sm sm:text-base text-[#666666] leading-relaxed font-medium">
              Modern everyday pieces designed for people who don't follow the usual rules. Heavyweight 240 GSM cotton, bio-washed feel, and direct-to-garment graphic art.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                to="/shop"
                className="btn-primary"
              >
                SHOP COLLECTION <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/shop?isNewArrival=true"
                className="btn-outline"
              >
                EXPLORE
              </Link>
            </div>
          </div>

          {/* Right Column Visual Showcase */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/5] bg-white rounded-2xl border border-[#E5E2DC] overflow-hidden shadow-fashion-lg group">
              <img
                src={heroProductImage}
                alt="GT Streetwear Editorial Visual"
                className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/70 via-transparent to-transparent p-6 flex flex-col justify-end">
                <span className="text-[10px] font-mono font-bold text-[#F7F5F0] uppercase tracking-widest">
                  NEW SEASON DROP
                </span>
                <p className="text-white text-base font-bold uppercase tracking-wide">
                  Heavyweight 240 GSM Silhouette
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 11 — TRUST STRIP */}
      <section className="py-8 bg-white border-b border-[#E5E2DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#111111] shrink-0" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111]">QUALITY</h4>
                <p className="text-[11px] text-[#666666]">Premium-focused products</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-[#111111] shrink-0" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111]">SECURE PAYMENT</h4>
                <p className="text-[11px] text-[#666666]">Safe checkout</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-[#111111] shrink-0" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111]">PAN INDIA</h4>
                <p className="text-[11px] text-[#666666]">Delivery availability</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Headset className="w-5 h-5 text-[#111111] shrink-0" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111]">SUPPORT</h4>
                <p className="text-[11px] text-[#666666]">Customer assistance</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 12 — FEATURED PRODUCTS */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E2DC] pb-4">
          <div>
            <h2 className="text-2xl sm:text-4xl font-extrabold uppercase text-[#111111] font-display">
              FEATURED DROPS
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] font-medium mt-1">
              The pieces worth making room for.
            </p>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold uppercase tracking-widest text-[#111111] hover:text-[#6F7358] flex items-center gap-1 transition-colors"
          >
            VIEW ALL DROPS <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-white border border-[#E5E2DC] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {(featuredDrops.length > 0 ? featuredDrops : newArrivals).slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 14 — SHOP BY STYLE */}
      <section className="py-16 bg-white border-y border-[#E5E2DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold text-[#6F7358] uppercase tracking-widest">
              CURATED CATEGORIES
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold uppercase text-[#111111] font-display">
              SHOP BY STYLE
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Block 1: MINIMAL */}
            <Link
              to="/shop?subSection=Plain+T-Shirts"
              className="group relative h-80 sm:h-96 rounded-2xl overflow-hidden border border-[#E5E2DC] shadow-fashion-sm"
            >
              <img
                src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80"
                alt="Minimal Style"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/85 via-[#111111]/30 to-transparent p-6 flex flex-col justify-end text-white">
                <h3 className="text-xl font-extrabold uppercase font-display text-white">MINIMAL</h3>
                <p className="text-xs text-[#E5E2DC] font-medium mt-1">Clean everyday pieces.</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F7F5F0] mt-3 group-hover:text-[#6F7358] transition-colors">
                  SHOP NOW <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>

            {/* Block 2: GRAPHIC */}
            <Link
              to="/shop?subSection=Printed+T-Shirts"
              className="group relative h-80 sm:h-96 rounded-2xl overflow-hidden border border-[#E5E2DC] shadow-fashion-sm"
            >
              <img
                src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80"
                alt="Graphic Style"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/85 via-[#111111]/30 to-transparent p-6 flex flex-col justify-end text-white">
                <h3 className="text-xl font-extrabold uppercase font-display text-white">GRAPHIC</h3>
                <p className="text-xs text-[#E5E2DC] font-medium mt-1">Bold artwork. Strong personality.</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F7F5F0] mt-3 group-hover:text-[#6F7358] transition-colors">
                  SHOP NOW <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>

            {/* Block 3: TYPOGRAPHY */}
            <Link
              to="/shop?mainSection=Oversized+T-Shirts"
              className="group relative h-80 sm:h-96 rounded-2xl overflow-hidden border border-[#E5E2DC] shadow-fashion-sm"
            >
              <img
                src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80"
                alt="Typography Style"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/85 via-[#111111]/30 to-transparent p-6 flex flex-col justify-end text-white">
                <h3 className="text-xl font-extrabold uppercase font-display text-white">TYPOGRAPHY</h3>
                <p className="text-xs text-[#E5E2DC] font-medium mt-1">Simple words. Strong meaning.</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F7F5F0] mt-3 group-hover:text-[#6F7358] transition-colors">
                  SHOP NOW <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>

            {/* Block 4: ESSENTIALS */}
            <Link
              to="/shop?mainSection=Regular+T-Shirts"
              className="group relative h-80 sm:h-96 rounded-2xl overflow-hidden border border-[#E5E2DC] shadow-fashion-sm"
            >
              <img
                src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80"
                alt="Essentials Style"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/85 via-[#111111]/30 to-transparent p-6 flex flex-col justify-end text-white">
                <h3 className="text-xl font-extrabold uppercase font-display text-white">ESSENTIALS</h3>
                <p className="text-xs text-[#E5E2DC] font-medium mt-1">Everyday staples.</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F7F5F0] mt-3 group-hover:text-[#6F7358] transition-colors">
                  SHOP NOW <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* 15 — BRAND STATEMENT */}
      <section className="bg-[#111111] text-[#F7F5F0] py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <span className="text-xs font-mono font-bold text-[#6F7358] uppercase tracking-widest">
            BRAND MANIFESTO
          </span>
          
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold uppercase font-display tracking-tight text-white leading-tight">
            MORE THAN A T-SHIRT.
          </h2>

          <p className="text-sm sm:text-lg text-[#666666] leading-relaxed max-w-2xl mx-auto font-medium">
            What you wear says something about you. GT Clothing Hub is built around simple pieces, strong ideas and everyday self-expression.
          </p>

          <div className="pt-4">
            <Link
              to="/about"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#F7F5F0] text-[#111111] text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-white hover:-translate-y-0.5 transition-all"
            >
              OUR STORY <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 16 — FEATURED COLLECTION */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#E5E2DC] rounded-2xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center shadow-fashion-sm">
          
          {/* 60% Image */}
          <div className="lg:col-span-7 aspect-[4/3] rounded-xl overflow-hidden bg-[#F7F5F0]">
            <img
              src={collectionProductImage}
              alt="Featured Collection Drop"
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* 40% Content */}
          <div className="lg:col-span-5 space-y-6">
            <span className="inline-block px-3 py-1 bg-[#6F7358] text-white text-[10px] font-bold uppercase tracking-widest rounded-md font-mono">
              NEW DROP
            </span>

            <h2 className="text-2xl sm:text-4xl font-extrabold uppercase text-[#111111] font-display leading-tight">
              SIGNATURE OVERSIZED STREETWEAR
            </h2>

            <p className="text-xs sm:text-sm text-[#666666] leading-relaxed font-medium">
              Engineered with 240 GSM super combed cotton canvas. Boxy drop-shoulder cut designed for maximum daily comfort and longevity.
            </p>

            <div className="pt-2">
              <Link
                to="/shop?mainSection=Oversized+T-Shirts"
                className="btn-primary"
              >
                SHOP NOW <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 17 — WHY GT CLOTHING HUB */}
      <section className="py-16 bg-white border-y border-[#E5E2DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold text-[#6F7358] uppercase tracking-widest">
              OUR STANDARDS
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold uppercase text-[#111111] font-display">
              WHY GT CLOTHING HUB
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="space-y-3 p-6 bg-[#F7F5F0] rounded-xl border border-[#E5E2DC]">
              <span className="text-xs font-mono font-bold text-[#6F7358]">01 —</span>
              <h3 className="font-extrabold text-sm uppercase text-[#111111] font-display">QUALITY</h3>
              <p className="text-xs text-[#666666] leading-relaxed font-medium">
                Focus on products customers can confidently wear every single day.
              </p>
            </div>

            <div className="space-y-3 p-6 bg-[#F7F5F0] rounded-xl border border-[#E5E2DC]">
              <span className="text-xs font-mono font-bold text-[#6F7358]">02 —</span>
              <h3 className="font-extrabold text-sm uppercase text-[#111111] font-display">EVERYDAY FIT</h3>
              <p className="text-xs text-[#666666] leading-relaxed font-medium">
                Designed around everyday styling, boxy silhouettes, and versatile cuts.
              </p>
            </div>

            <div className="space-y-3 p-6 bg-[#F7F5F0] rounded-xl border border-[#E5E2DC]">
              <span className="text-xs font-mono font-bold text-[#6F7358]">03 —</span>
              <h3 className="font-extrabold text-sm uppercase text-[#111111] font-display">MODERN STYLE</h3>
              <p className="text-xs text-[#666666] leading-relaxed font-medium">
                Minimal and expressive pieces built for Indian streetwear enthusiasts.
              </p>
            </div>

            <div className="space-y-3 p-6 bg-[#F7F5F0] rounded-xl border border-[#E5E2DC]">
              <span className="text-xs font-mono font-bold text-[#6F7358]">04 —</span>
              <h3 className="font-extrabold text-sm uppercase text-[#111111] font-display">CUSTOMER FIRST</h3>
              <p className="text-xs text-[#666666] leading-relaxed font-medium">
                Simple shopping experience, fast fulfillment, and responsive customer support.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 18 — SOCIAL / INSTAGRAM SECTION */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-md mx-auto space-y-2">
          <h2 className="text-2xl sm:text-4xl font-extrabold uppercase text-[#111111] font-display">
            FOLLOW THE DROP
          </h2>
          <p className="text-xs sm:text-sm text-[#666666] font-medium">
            See how the community wears GT.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="aspect-square bg-white border border-[#E5E2DC] rounded-xl overflow-hidden group shadow-fashion-sm">
            <img
              src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80"
              alt="Community Lookbook 1"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="aspect-square bg-white border border-[#E5E2DC] rounded-xl overflow-hidden group shadow-fashion-sm">
            <img
              src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop&q=80"
              alt="Community Lookbook 2"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="aspect-square bg-white border border-[#E5E2DC] rounded-xl overflow-hidden group shadow-fashion-sm">
            <img
              src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&auto=format&fit=crop&q=80"
              alt="Community Lookbook 3"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="aspect-square bg-white border border-[#E5E2DC] rounded-xl overflow-hidden group shadow-fashion-sm">
            <img
              src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80"
              alt="Community Lookbook 4"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        <div className="text-center pt-2">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex items-center gap-2"
          >
            FOLLOW @GTCLOTHINGHUB
          </a>
        </div>
      </section>

      {/* 19 — NEWSLETTER */}
      <section className="pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#E5E2DC] rounded-2xl p-8 sm:p-14 text-center space-y-6 shadow-fashion-sm">
          <h2 className="text-2xl sm:text-4xl font-extrabold uppercase text-[#111111] font-display">
            STAY IN THE LOOP.
          </h2>
          <p className="text-xs sm:text-sm text-[#666666] max-w-md mx-auto font-medium">
            New drops, collections and updates — straight to your inbox.
          </p>

          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Email address..."
              className="fashion-input flex-1"
            />
            <button
              type="submit"
              className="btn-primary w-full sm:w-auto px-8"
            >
              JOIN
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}

