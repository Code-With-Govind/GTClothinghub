import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X, ChevronDown, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { totalItemCount, setIsCartOpen } = useCart();
  const { settings } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchModal(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Section 09: Announcement Bar */}
      <div className="w-full bg-[#111111] text-[#F7F5F0] h-[32px] flex items-center justify-center text-[11px] sm:text-[12px] font-mono font-medium uppercase tracking-widest px-4 border-b border-[#222222] select-none z-50">
        <span>FREE SHIPPING ON ELIGIBLE ORDERS • NEW DROPS EVERY MONTH</span>
      </div>

      {/* Section 06: Minimalist Navbar */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-[#F7F5F0]/95 backdrop-blur-md border-b border-[#E5E2DC] shadow-fashion-sm'
            : 'bg-[#F7F5F0] border-b border-[#E5E2DC]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            
            {/* Mobile Menu Toggle Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#111111] hover:text-[#6F7358] transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-8 h-8 bg-[#111111] text-white font-mono font-black text-xs flex items-center justify-center tracking-tighter shrink-0 rounded-md group-hover:bg-[#222222] transition-colors">
                GT
              </div>
              <span className="font-display font-extrabold text-base sm:text-lg md:text-xl tracking-wider text-[#111111] uppercase group-hover:text-[#6F7358] transition-colors whitespace-nowrap">
                {settings.brandName || 'GT CLOTHING HUB'}
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8 text-xs font-bold uppercase tracking-widest text-[#111111]">
              <Link
                to="/"
                className={`hover:text-[#6F7358] transition-colors py-2 ${
                  location.pathname === '/' ? 'text-[#6F7358] underline underline-offset-4 decoration-2' : ''
                }`}
              >
                HOME
              </Link>

              {/* Shop Dropdown */}
              <div
                className="relative py-2 group"
                onMouseEnter={() => setShopDropdownOpen(true)}
                onMouseLeave={() => setShopDropdownOpen(false)}
              >
                <Link
                  to="/shop"
                  className={`flex items-center gap-1 hover:text-[#6F7358] transition-colors ${
                    location.pathname === '/shop' ? 'text-[#6F7358]' : ''
                  }`}
                >
                  SHOP <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition-transform duration-200" />
                </Link>

                {shopDropdownOpen && (
                  <div className="absolute left-0 top-full w-56 py-3 bg-white border border-[#E5E2DC] rounded-xl shadow-fashion-lg z-50 animate-fade-in">
                    <div className="px-4 py-1 text-[9px] font-mono font-bold text-[#666666] uppercase tracking-widest border-b border-[#E5E2DC] mb-1">
                      Browse Catalog
                    </div>
                    <Link
                      to="/shop"
                      className="block px-4 py-2.5 text-xs font-semibold text-[#111111] hover:bg-[#F7F5F0] hover:text-[#6F7358] transition-colors"
                    >
                      All Products
                    </Link>
                    <Link
                      to="/shop?mainSection=Regular+T-Shirts"
                      className="block px-4 py-2.5 text-xs font-semibold text-[#111111] hover:bg-[#F7F5F0] hover:text-[#6F7358] transition-colors"
                    >
                      Regular T-Shirts
                    </Link>
                    <Link
                      to="/shop?mainSection=Oversized+T-Shirts"
                      className="block px-4 py-2.5 text-xs font-semibold text-[#111111] hover:bg-[#F7F5F0] hover:text-[#6F7358] transition-colors"
                    >
                      Oversized Tees
                    </Link>
                    <Link
                      to="/shop?search=Hoodie"
                      className="block px-4 py-2.5 text-xs font-semibold text-[#111111] hover:bg-[#F7F5F0] hover:text-[#6F7358] transition-colors"
                    >
                      Heavy Hoodies
                    </Link>
                    <Link
                      to="/shop?isNewArrival=true"
                      className="block px-4 py-2.5 text-xs font-semibold text-[#111111] hover:bg-[#F7F5F0] hover:text-[#6F7358] transition-colors border-t border-[#E5E2DC] mt-1 pt-2 font-bold"
                    >
                      New Drops
                    </Link>
                  </div>
                )}
              </div>

              <Link
                to="/categories"
                className={`hover:text-[#6F7358] transition-colors py-2 ${
                  location.pathname === '/categories' ? 'text-[#6F7358]' : ''
                }`}
              >
                COLLECTIONS
              </Link>

              <Link
                to="/about"
                className={`hover:text-[#6F7358] transition-colors py-2 ${
                  location.pathname === '/about' ? 'text-[#6F7358]' : ''
                }`}
              >
                ABOUT
              </Link>
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2 sm:gap-4">
              
              {/* Search Icon */}
              <button
                onClick={() => setShowSearchModal(true)}
                className="p-2 text-[#111111] hover:text-[#6F7358] transition-colors"
                title="Search Products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart Bag Icon */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-[#111111] hover:text-[#6F7358] transition-colors"
                title="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItemCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#111111] text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm font-mono">
                    {totalItemCount}
                  </span>
                )}
              </button>

              {/* User Account / Auth Menu */}
              {user ? (
                <div className="relative group">
                  <Link
                    to={isAdmin ? '/admin' : '/account'}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E5E2DC] text-[#111111] text-xs font-bold uppercase tracking-wider hover:border-[#111111] transition-colors rounded-lg"
                  >
                    <User className="w-4 h-4 text-[#111111]" />
                    <span className="hidden sm:inline-block max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
                    {isAdmin && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold bg-[#6F7358] text-white uppercase rounded-xs">
                        Admin
                      </span>
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-1 w-52 py-2 bg-white border border-[#E5E2DC] rounded-xl shadow-fashion-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 divide-y divide-[#E5E2DC]">
                    <div className="py-1">
                      {isAdmin ? (
                        <>
                          <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#111111] hover:bg-[#F7F5F0]">
                            <Shield className="w-4 h-4 text-[#111111]" /> Admin Dashboard
                          </Link>
                          <Link to="/account" className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#666666] hover:bg-[#F7F5F0] hover:text-[#111111]">
                            <User className="w-4 h-4" /> Customer Profile
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link to="/account" className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#111111] hover:bg-[#F7F5F0]">
                            <User className="w-4 h-4" /> My Account
                          </Link>
                          <Link to="/account/orders" className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#111111] hover:bg-[#F7F5F0]">
                            <ShoppingBag className="w-4 h-4" /> My Orders
                          </Link>
                        </>
                      )}
                    </div>
                    <div className="pt-1">
                      <button
                        onClick={logout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-[#111111] text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-[#222222] transition-colors flex items-center gap-1.5"
                  title="Account Access"
                >
                  <User className="w-4 h-4 sm:hidden" />
                  <span className="hidden sm:inline">ACCOUNT</span>
                </Link>
              )}

            </div>
          </div>
        </div>

        {/* Section 07: Mobile Navigation Panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#F7F5F0] border-t border-[#E5E2DC] px-6 pt-6 pb-8 space-y-5 animate-slide-up shadow-fashion-lg">
            <nav className="space-y-4">
              <Link
                to="/"
                className="block text-sm font-bold uppercase tracking-widest text-[#111111] hover:text-[#6F7358]"
              >
                HOME
              </Link>
              <Link
                to="/shop"
                className="block text-sm font-bold uppercase tracking-widest text-[#111111] hover:text-[#6F7358]"
              >
                SHOP
              </Link>
              <Link
                to="/categories"
                className="block text-sm font-bold uppercase tracking-widest text-[#111111] hover:text-[#6F7358]"
              >
                COLLECTIONS
              </Link>
              <Link
                to="/about"
                className="block text-sm font-bold uppercase tracking-widest text-[#111111] hover:text-[#6F7358]"
              >
                ABOUT
              </Link>
              <Link
                to="/contact"
                className="block text-sm font-bold uppercase tracking-widest text-[#111111] hover:text-[#6F7358]"
              >
                CONTACT
              </Link>
              <Link
                to={user ? '/account' : '/login'}
                className="block text-sm font-bold uppercase tracking-widest text-[#111111] hover:text-[#6F7358]"
              >
                ACCOUNT
              </Link>
            </nav>

            <div className="pt-4 border-t border-[#E5E2DC] space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#666666] uppercase tracking-widest block">
                Quick Category Filters
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-[#111111]">
                <Link to="/shop?mainSection=Regular+T-Shirts" className="p-2 bg-white border border-[#E5E2DC] rounded-md text-center">Regular Tees</Link>
                <Link to="/shop?mainSection=Oversized+T-Shirts" className="p-2 bg-white border border-[#E5E2DC] rounded-md text-center">Oversized Tees</Link>
                <Link to="/shop?search=Hoodie" className="p-2 bg-white border border-[#E5E2DC] rounded-md text-center">Hoodies</Link>
                <Link to="/shop?isNewArrival=true" className="p-2 bg-white border border-[#E5E2DC] rounded-md text-center">New Arrivals</Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Full-width Clean Search Interface */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-xl bg-[#F7F5F0] border border-[#E5E2DC] rounded-2xl shadow-fashion-lg p-6 relative">
            <button
              onClick={() => setShowSearchModal(false)}
              className="absolute top-4 right-4 p-1 text-[#666666] hover:text-[#111111]"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xs font-bold text-[#111111] uppercase tracking-widest mb-4 font-display">
              SEARCH PRODUCT CATALOG
            </h3>
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Search tees, oversized drops, hoodies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="fashion-input flex-1"
                autoFocus
              />
              <button
                type="submit"
                className="btn-primary shrink-0"
              >
                SEARCH
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

