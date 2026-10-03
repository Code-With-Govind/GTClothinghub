import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RefreshCw, Lock } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="bg-[#292621] text-white pt-16 pb-12 text-sm border-t border-[#292621]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value / Trust Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-[#36322B] mb-12">
          <div className="flex items-center gap-3.5 p-4 bg-[#1D1A16]/60 border border-[#36322B]">
            <Truck className="w-6 h-6 text-[#B89452] shrink-0" />
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">Pan-India Delivery</h4>
              <p className="text-[11px] text-[#A39C8E] mt-0.5">Printed & dispatched in 3-5 days</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 bg-[#1D1A16]/60 border border-[#36322B]">
            <ShieldCheck className="w-6 h-6 text-[#B89452] shrink-0" />
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">Heavyweight Fabrics</h4>
              <p className="text-[11px] text-[#A39C8E] mt-0.5">100% Super combed & bio-washed</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 bg-[#1D1A16]/60 border border-[#36322B]">
            <Lock className="w-6 h-6 text-[#B89452] shrink-0" />
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">Secure Checkout</h4>
              <p className="text-[11px] text-[#A39C8E] mt-0.5">256-Bit SSL Encrypted Razorpay</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 bg-[#1D1A16]/60 border border-[#36322B]">
            <RefreshCw className="w-6 h-6 text-[#B89452] shrink-0" />
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">Easy Support</h4>
              <p className="text-[11px] text-[#A39C8E] mt-0.5">Prompt customer resolution</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-[#36322B]">
          
          {/* Brand Info & Statement */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-white text-[#292621] font-brand font-black text-xs flex items-center justify-center">
                GT
              </div>
              <span className="font-display font-extrabold text-lg tracking-wider text-white uppercase">
                {settings.brandName || 'GT CLOTHING HUB'}
              </span>
            </Link>
            <p className="text-xs text-[#A39C8E] leading-relaxed pr-6 max-w-md font-sans">
              Minimalist fashion apparel and print-on-demand streetwear. Crafted with premium heavyweight cotton, direct-to-garment art, and contemporary drop silhouettes.
            </p>
            <div className="text-xs text-[#A39C8E] font-mono space-y-1 pt-2">
              <p>Email: {settings.supportEmail || 'support@gtclothinghub.com'}</p>
              <p>Phone: {settings.supportPhone || '+91 98765 43210'}</p>
              <p>Location: {settings.address?.city || 'Bengaluru'}, {settings.address?.state || 'Karnataka'}, India</p>
            </div>
          </div>

          {/* SHOP Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4 font-display">
              SHOP
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A39C8E] font-medium">
              <li><Link to="/shop" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/shop?isNewArrival=true" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop?mainSection=Regular+T-Shirts" className="hover:text-white transition-colors">T-Shirts</Link></li>
              <li><Link to="/shop?mainSection=Oversized+T-Shirts" className="hover:text-white transition-colors">Oversized Drops</Link></li>
              <li><Link to="/categories" className="hover:text-white transition-colors">Category Overview</Link></li>
            </ul>
          </div>

          {/* HELP Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4 font-display">
              HELP
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A39C8E] font-medium">
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link to="/return-policy" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/order-tracking" className="hover:text-white transition-colors">Track Order</Link></li>
              <li><Link to="/size-guide" className="hover:text-white transition-colors">Size Guide</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* COMPANY Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4 font-display">
              COMPANY
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A39C8E] font-medium">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            </ul>

            {/* Email Drop Signup */}
            <div className="pt-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B89452] block mb-2 font-mono">
                DON'T MISS THE NEXT DROP
              </span>
              <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your Email..."
                  className="w-full bg-[#1D1A16] border border-[#36322B] px-3 py-2 text-xs text-white placeholder-[#A39C8E] focus:outline-none focus:border-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-white text-[#292621] text-[10px] font-bold uppercase tracking-widest shrink-0 hover:bg-[#FAF8F3] transition-colors"
                >
                  Join
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A39C8E] font-mono">
          <p>© {new Date().getFullYear()} {settings.brandName || 'GT Clothing Hub'}. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 border border-[#36322B] text-[10px] uppercase text-[#A39C8E]">UPI</span>
            <span className="px-2 py-0.5 border border-[#36322B] text-[10px] uppercase text-[#A39C8E]">Razorpay</span>
            <span className="px-2 py-0.5 border border-[#36322B] text-[10px] uppercase text-[#A39C8E]">Cards</span>
            <span className="px-2 py-0.5 border border-[#36322B] text-[10px] uppercase text-[#A39C8E]">COD</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

