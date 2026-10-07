import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, RefreshCw } from 'lucide-react';
import SEO from '../../components/common/SEO';
import ProductCard from '../../components/product/ProductCard';
import api from '../../services/api';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  // Filters State
  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const mainSection = searchParams.get('mainSection') || '';
  const subSection = searchParams.get('subSection') || '';
  const sort = searchParams.get('sort') || 'newest';
  const size = searchParams.get('size') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.categories || []);
      } catch (err) {
        console.warn('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams(searchParams);
        const res = await api.get(`/products?${queryParams.toString()}`);
        setProducts(res.products || []);
        setTotalPages(res.pages || 1);
      } catch (err) {
        console.warn('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#F7F5F0]">
      <SEO title="Shop Catalog | GT CLOTHING HUB" />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E5E2DC] pb-6">
        <div>
          <span className="text-[10px] font-mono font-bold text-[#6F7358] uppercase tracking-widest block">
            GT APPAREL CATALOG
          </span>
          <h1 className="text-3xl font-extrabold uppercase text-[#111111] font-display">
            {mainSection ? mainSection : search ? `SEARCH: "${search}"` : 'ALL PRODUCTS'}
          </h1>
          {subSection && (
            <span className="inline-block mt-1.5 px-3 py-0.5 text-[10px] font-bold bg-[#111111] text-white uppercase font-mono tracking-wider rounded-md">
              SECTION: {subSection}
            </span>
          )}
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden btn-secondary py-2.5 px-4 text-xs"
          >
            <SlidersHorizontal className="w-4 h-4" /> FILTERS
          </button>

          <select
            value={sort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="fashion-select py-2.5 text-xs font-bold uppercase tracking-wider"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="popular">Popularity</option>
          </select>
        </div>
      </div>

      {/* Main Fit Section Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 border border-[#E5E2DC] rounded-xl">
        <span className="text-[10px] font-mono font-bold uppercase text-[#666666] px-3">
          FIT SELECTION:
        </span>
        <button
          onClick={() => updateFilter('mainSection', '')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${
            !mainSection ? 'bg-[#111111] text-white' : 'text-[#111111] hover:bg-[#F7F5F0]'
          }`}
        >
          ALL FITS
        </button>
        <button
          onClick={() => updateFilter('mainSection', 'Regular T-Shirts')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${
            mainSection === 'Regular T-Shirts' ? 'bg-[#111111] text-white' : 'text-[#111111] hover:bg-[#F7F5F0]'
          }`}
        >
          REGULAR TEES
        </button>
        <button
          onClick={() => updateFilter('mainSection', 'Oversized T-Shirts')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${
            mainSection === 'Oversized T-Shirts' ? 'bg-[#111111] text-white' : 'text-[#111111] hover:bg-[#F7F5F0]'
          }`}
        >
          OVERSIZED TEES
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <aside className={`space-y-6 ${mobileFilterOpen ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white border border-[#E5E2DC] rounded-2xl p-6 space-y-6 shadow-fashion-sm">
            <div className="flex items-center justify-between border-b border-[#E5E2DC] pb-4">
              <h3 className="font-bold text-xs uppercase tracking-widest text-[#111111] flex items-center gap-2 font-display">
                <Filter className="w-4 h-4 text-[#111111]" /> FILTERS
              </h3>
              <button
                onClick={clearFilters}
                className="text-[10px] font-bold uppercase text-[#666666] hover:text-[#111111] flex items-center gap-1 font-mono"
              >
                <RefreshCw className="w-3 h-3" /> RESET
              </button>
            </div>

            {/* Sub Section Filter */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#666666] uppercase font-mono tracking-widest">
                GARMENT TYPE
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => updateFilter('subSection', '')}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold uppercase rounded-lg transition-colors ${
                    !subSection ? 'bg-[#111111] text-white' : 'text-[#111111] hover:bg-[#F7F5F0]'
                  }`}
                >
                  All Types
                </button>
                {['Plain T-Shirts', 'Printed T-Shirts', 'Add Your Custom Designs'].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => updateFilter('subSection', sub === subSection ? '' : sub)}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold uppercase rounded-lg transition-colors ${
                      subSection === sub ? 'bg-[#111111] text-white' : 'text-[#111111] hover:bg-[#F7F5F0]'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-[#666666] uppercase font-mono tracking-widest">
                  CATEGORIES
                </span>
                <div className="space-y-1">
                  <button
                    onClick={() => updateFilter('category', '')}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium uppercase rounded-md transition-colors ${
                      !category ? 'bg-[#111111] text-white font-bold' : 'text-[#666666] hover:text-[#111111]'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => updateFilter('category', cat.slug)}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium uppercase rounded-md transition-colors ${
                        category === cat.slug ? 'bg-[#111111] text-white font-bold' : 'text-[#666666] hover:text-[#111111]'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Filter */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#666666] uppercase font-mono tracking-widest">
                SIZES
              </span>
              <div className="flex flex-wrap gap-2">
                {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => updateFilter('size', size === sz ? '' : sz)}
                    className={`px-3 py-1.5 text-xs font-bold border rounded-md transition-all ${
                      size === sz ? 'bg-[#111111] border-[#111111] text-white' : 'border-[#E5E2DC] text-[#666666] hover:border-[#111111]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#666666] uppercase font-mono tracking-widest">
                PRICE RANGE (₹)
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => updateFilter('minPrice', e.target.value)}
                  className="fashion-input py-1.5 px-3 text-xs"
                />
                <span className="text-[#666666]">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => updateFilter('maxPrice', e.target.value)}
                  className="fashion-input py-1.5 px-3 text-xs"
                />
              </div>
            </div>

          </div>
        </aside>

        {/* Product Grid */}
        <main className="md:col-span-3 space-y-8">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-white border border-[#E5E2DC] rounded-xl animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            /* Section 35 & 45: Section Empty States */
            <div className="text-center py-20 bg-white border border-[#E5E2DC] rounded-2xl space-y-4 shadow-fashion-sm">
              <Search className="w-10 h-10 text-[#666666] mx-auto" />
              <h3 className="text-base font-bold text-[#111111] uppercase tracking-wider font-display">NO PRODUCTS FOUND</h3>
              <p className="text-xs text-[#666666]">Try another search or reset active filters.</p>
              <button
                onClick={clearFilters}
                className="btn-primary"
              >
                RESET ALL FILTERS
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-6">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => updateFilter('page', pageNum.toString())}
                    className={`w-9 h-9 text-xs font-bold border rounded-lg transition-all ${
                      page === pageNum
                        ? 'bg-[#111111] border-[#111111] text-white'
                        : 'bg-white border-[#E5E2DC] text-[#666666] hover:border-[#111111] hover:text-[#111111]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}


