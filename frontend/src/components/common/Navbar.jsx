import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

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
      <header className="sticky top-0 z-40 w-full bg-[#F5F1E8]/95 backdrop-blur-md border-b border-[#DDD7CB] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Mobile Menu Toggle Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 sm:p-2 text-[#292621] hover:text-[#B89452] transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-1.5 sm:gap-3 group shrink-0 max-w-[50%] sm:max-w-none">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#292621] text-white font-brand font-black text-xs sm:text-sm flex items-center justify-center tracking-tighter shrink-0 group-hover:bg-[#36322B] transition-colors">
                GT
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-display font-extrabold text-xs xs:text-sm sm:text-base md:text-lg tracking-wider text-[#292621] uppercase group-hover:text-[#B89452] transition-colors whitespace-nowrap truncate">
                  {settings.brandName || 'GT CLOTHING HUB'}
                </span>
                <span className="text-[8px] sm:text-[9px] tracking-widest text-[#6F6A61] uppercase font-mono hidden sm:block truncate">Modern Apparel</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8 text-xs font-bold uppercase tracking-widest text-[#292621]">
              <Link to="/" className="hover:text-[#B89452] transition-colors py-2">
                Home
              </Link>

              {/* Shop Dropdown */}
              <div
                className="relative py-2 group"
                onMouseEnter={() => setShopDropdownOpen(true)}
                onMouseLeave={() => setShopDropdownOpen(false)}
              >
                <Link
                  to="/shop"
                  className="flex items-center gap-1 hover:text-[#B89452] transition-colors"
                >
                  Shop <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition-transform duration-200" />
                </Link>

                {shopDropdownOpen && (
                  <div className="absolute left-0 top-full w-56 py-3 bg-white border border-[#DDD7CB] shadow-fashion-lg z-50 animate-fade-in">
                    <div className="px-4 py-1 text-[9px] font-mono font-bold text-[#6F6A61] uppercase tracking-widest border-b border-[#DDD7CB] mb-1">
                      Browse Collections
                    </div>
                    <Link
                      to="/shop"
                      className="block px-4 py-2.5 text-xs font-semibold text-[#292621] hover:bg-[#FAF8F3] hover:text-[#B89452] transition-colors"
                    >
                      All Products
                    </Link>
                    <Link
                      to="/shop?mainSection=Regular+T-Shirts"
                      className="block px-4 py-2.5 text-xs font-semibold text-[#292621] hover:bg-[#FAF8F3] hover:text-[#B89452] transition-colors"
                    >
                      T-Shirts
                    </Link>
                    <Link
                      to="/shop?mainSection=Oversized+T-Shirts"
                      className="block px-4 py-2.5 text-xs font-semibold text-[#292621] hover:bg-[#FAF8F3] hover:text-[#B89452] transition-colors"
                    >
                      Oversized
                    </Link>
                    <Link
                      to="/shop?search=Hoodie"
                      className="block px-4 py-2.5 text-xs font-semibold text-[#292621] hover:bg-[#FAF8F3] hover:text-[#B89452] transition-colors"
                    >
                      Hoodies
                    </Link>
                    <Link
                      to="/shop?isNewArrival=true"
                      className="block px-4 py-2.5 text-xs font-semibold text-[#292621] hover:bg-[#FAF8F3] hover:text-[#B89452] transition-colors border-t border-[#DDD7CB] mt-1 pt-2 font-bold"
                    >
                      New Arrivals
                    </Link>
                  </div>
                )}
              </div>

              <Link to="/shop?isNewArrival=true" className="hover:text-[#B89452] transition-colors py-2">
                New Arrivals
              </Link>
              <Link to="/about" className="hover:text-[#B89452] transition-colors py-2">
                About
              </Link>
              <Link to="/contact" className="hover:text-[#B89452] transition-colors py-2">
                Contact
              </Link>
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              
              {/* Search Trigger Button */}
              <button
                onClick={() => setShowSearchModal(true)}
                className="p-1.5 sm:p-2.5 text-[#292621] hover:text-[#B89452] hover:bg-[#FAF8F3] transition-colors"
                title="Search Products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart Drawer Trigger Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-1.5 sm:p-2.5 text-[#292621] hover:text-[#B89452] hover:bg-[#FAF8F3] transition-colors"
                title="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-4 h-4 bg-[#292621] text-white text-[10px] font-bold flex items-center justify-center rounded-none shadow-sm">
                    {totalItemCount}
                  </span>
                )}
              </button>

              {/* Account / User Menu */}
              {user ? (
                <div className="relative group">
                  <Link
                    to={isAdmin ? '/admin' : '/account'}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-[#FAF8F3] border border-[#DDD7CB] text-[#292621] text-xs font-bold uppercase tracking-wider hover:bg-[#DDD7CB] transition-colors"
                  >
                    <User className="w-4 h-4 text-[#292621]" />
                    <span className="hidden sm:inline-block max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
                    {isAdmin && (
                      <span className="px-1.5 py-0.5 text-[9px] font-black bg-[#292621] text-white uppercase">
                        Admin
                      </span>
                    )}
                  </Link>

                  {/* Dropdown for User Account */}
                  <div className="absolute right-0 mt-1 w-52 py-2 bg-white border border-[#DDD7CB] shadow-fashion-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 divide-y divide-[#DDD7CB]">
                    <div className="py-1">
                      {isAdmin ? (
                        <>
                          <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#292621] hover:bg-[#FAF8F3]">
                            <Shield className="w-4 h-4 text-[#292621]" /> Admin Dashboard
                          </Link>
                          <Link to="/account" className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#6F6A61] hover:bg-[#FAF8F3] hover:text-[#292621]">
                            <User className="w-4 h-4" /> Customer Profile
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link to="/account" className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#292621] hover:bg-[#FAF8F3]">
                            <User className="w-4 h-4" /> My Account
                          </Link>
                          <Link to="/account/orders" className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#292621] hover:bg-[#FAF8F3]">
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
                  className="p-1.5 sm:px-5 sm:py-2.5 bg-[#FAF8F3] sm:bg-[#292621] border sm:border-none border-[#DDD7CB] text-[#292621] sm:text-white text-xs font-bold uppercase tracking-widest hover:bg-[#36322B] hover:text-white transition-colors flex items-center justify-center"
                  title="Account Login"
                >
                  <User className="w-5 h-5 sm:hidden" />
                  <span className="hidden sm:inline">Account</span>
                </Link>
              )}

            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF8F3] border-t border-[#DDD7CB] px-6 pt-5 pb-8 space-y-4 animate-slide-up shadow-fashion-lg">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs font-bold uppercase tracking-widest text-[#292621] hover:text-[#B89452] transition-colors"
            >
              Home
            </Link>

            <div className="space-y-2.5 pt-3 border-t border-[#DDD7CB]">
              <span className="text-[10px] font-mono font-bold text-[#6F6A61] uppercase tracking-widest block">
                Shop Collections
              </span>
              <Link
                to="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="block pl-3 py-1 text-xs font-semibold text-[#292621] hover:text-[#B89452] transition-colors"
              >
                All Products
              </Link>
              <Link
                to="/shop?mainSection=Regular+T-Shirts"
                onClick={() => setMobileMenuOpen(false)}
                className="block pl-3 py-1 text-xs font-semibold text-[#292621] hover:text-[#B89452] transition-colors"
              >
                T-Shirts
              </Link>
              <Link
                to="/shop?mainSection=Oversized+T-Shirts"
                onClick={() => setMobileMenuOpen(false)}
                className="block pl-3 py-1 text-xs font-semibold text-[#292621] hover:text-[#B89452] transition-colors"
              >
                Oversized
              </Link>
              <Link
                to="/shop?search=Hoodie"
                onClick={() => setMobileMenuOpen(false)}
                className="block pl-3 py-1 text-xs font-semibold text-[#292621] hover:text-[#B89452] transition-colors"
              >
                Hoodies
              </Link>
              <Link
                to="/shop?isNewArrival=true"
                onClick={() => setMobileMenuOpen(false)}
                className="block pl-3 py-1 text-xs font-bold text-[#292621] hover:text-[#B89452] transition-colors"
              >
                New Arrivals
              </Link>
            </div>

            <div className="pt-3 border-t border-[#DDD7CB] space-y-3">
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs font-bold uppercase tracking-widest text-[#292621] hover:text-[#B89452] transition-colors"
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs font-bold uppercase tracking-widest text-[#292621] hover:text-[#B89452] transition-colors"
              >
                Contact
              </Link>
              <Link
                to="/order-tracking"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs font-bold uppercase tracking-widest text-[#6F6A61] hover:text-[#292621] transition-colors"
              >
                Track Order
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-xl bg-[#FAF8F3] border border-[#DDD7CB] shadow-fashion-lg p-6 relative">
            <button
              onClick={() => setShowSearchModal(false)}
              className="absolute top-4 right-4 text-[#6F6A61] hover:text-[#292621]"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-bold text-[#292621] uppercase tracking-widest mb-4 font-display">
              Search Products
            </h3>
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Search tees, oversized drops, styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="fashion-input flex-1"
                autoFocus
              />
              <button
                type="submit"
                className="btn-primary shrink-0"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

