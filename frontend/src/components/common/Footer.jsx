import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RefreshCw, Lock, Plus, Minus, Instagram, Github } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';


export default function Footer() {
  const { settings } = useSettings();
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="bg-[#111111] text-[#F7F5F0] pt-16 pb-12 text-sm border-t border-[#222222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-[#222222] mb-12">
          <div className="flex items-center gap-3.5 p-4 bg-[#181818] border border-[#262626] rounded-xl">
            <Truck className="w-5 h-5 text-[#6F7358] shrink-0" />
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono">PAN INDIA DISPATCH</h4>
              <p className="text-[11px] text-[#888888] mt-0.5">Reliable express shipping</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 bg-[#181818] border border-[#262626] rounded-xl">
            <ShieldCheck className="w-5 h-5 text-[#6F7358] shrink-0" />
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono">PREMIUM HEAVYWEIGHT</h4>
              <p className="text-[11px] text-[#888888] mt-0.5">240 GSM Super combed cotton</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 bg-[#181818] border border-[#262626] rounded-xl">
            <Lock className="w-5 h-5 text-[#6F7358] shrink-0" />
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono">SECURE CHECKOUT</h4>
              <p className="text-[11px] text-[#888888] mt-0.5">Razorpay & Cash on Delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 bg-[#181818] border border-[#262626] rounded-xl">
            <RefreshCw className="w-5 h-5 text-[#6F7358] shrink-0" />
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono">EASY SUPPORT</h4>
              <p className="text-[11px] text-[#888888] mt-0.5">Dedicated customer assistance</p>
            </div>
          </div>
        </div>

        {/* Footer Content Columns (Desktop Grid, Mobile Accordion) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-12 border-b border-[#222222]">
          
          {/* BRAND Column (Always Visible) */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-white text-[#111111] font-mono font-black text-xs flex items-center justify-center rounded-md">
                GT
              </div>
              <span className="font-display font-extrabold text-lg tracking-wider text-white uppercase">
                {settings.brandName || 'GT CLOTHING HUB'}
              </span>
            </Link>
            <p className="text-xs text-[#999999] leading-relaxed pr-4 max-w-md font-sans">
              Modern everyday pieces designed for people who don't follow the usual rules. Premium Indian Gen-Z streetwear crafted with 240 GSM combed cotton and high-density DTG graphic art.
            </p>
            <div className="text-xs text-[#888888] font-mono space-y-1 pt-2">
              <p>Support: {settings.supportEmail || 'support@gtclothinghub.com'}</p>
              <p>Location: {settings.address?.city || 'Bengaluru'}, {settings.address?.state || 'Karnataka'}, India</p>
            </div>
          </div>

          {/* SHOP Column */}
          <div className="border-t border-[#222222] md:border-t-0 pt-4 md:pt-0">
            <button
              onClick={() => toggleSection('SHOP')}
              className="w-full flex justify-between items-center md:cursor-default"
            >
              <h4 className="text-xs font-bold uppercase tracking-widest text-white font-display">
                SHOP
              </h4>
              <span className="md:hidden text-[#888888]">
                {openSection === 'SHOP' ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </span>
            </button>
            <ul className={`mt-4 space-y-2.5 text-xs text-[#999999] font-medium ${openSection === 'SHOP' ? 'block' : 'hidden md:block'}`}>
              <li><Link to="/shop" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/shop?isNewArrival=true" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop?mainSection=Regular+T-Shirts" className="hover:text-white transition-colors">Regular T-Shirts</Link></li>
              <li><Link to="/shop?mainSection=Oversized+T-Shirts" className="hover:text-white transition-colors">Oversized Drop</Link></li>
              <li><Link to="/categories" className="hover:text-white transition-colors">Collections</Link></li>
            </ul>
          </div>

          {/* HELP Column */}
          <div className="border-t border-[#222222] md:border-t-0 pt-4 md:pt-0">
            <button
              onClick={() => toggleSection('HELP')}
              className="w-full flex justify-between items-center md:cursor-default"
            >
              <h4 className="text-xs font-bold uppercase tracking-widest text-white font-display">
                HELP
              </h4>
              <span className="md:hidden text-[#888888]">
                {openSection === 'HELP' ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </span>
            </button>
            <ul className={`mt-4 space-y-2.5 text-xs text-[#999999] font-medium ${openSection === 'HELP' ? 'block' : 'hidden md:block'}`}>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/size-guide" className="hover:text-white transition-colors">Size Guide</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-white transition-colors">Shipping Information</Link></li>
              <li><Link to="/return-policy" className="hover:text-white transition-colors">Returns & Exchange</Link></li>
              <li><Link to="/order-tracking" className="hover:text-white transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* LEGAL & SOCIAL Column */}
          <div className="border-t border-[#222222] md:border-t-0 pt-4 md:pt-0">
            <button
              onClick={() => toggleSection('LEGAL')}
              className="w-full flex justify-between items-center md:cursor-default"
            >
              <h4 className="text-xs font-bold uppercase tracking-widest text-white font-display">
                LEGAL & SOCIAL
              </h4>
              <span className="md:hidden text-[#888888]">
                {openSection === 'LEGAL' ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </span>
            </button>
            <ul className={`mt-4 space-y-2.5 text-xs text-[#999999] font-medium ${openSection === 'LEGAL' ? 'block' : 'hidden md:block'}`}>
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/return-policy" className="hover:text-white transition-colors">Refund Policy</Link></li>
              <li className="pt-2 flex flex-col space-y-2">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white transition-colors text-xs font-bold font-mono">
                  <Instagram className="w-4 h-4 text-[#6F7358]" /> Instagram
                </a>
                <a href="https://github.com/Code-With-Govind" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white transition-colors text-xs font-bold font-mono">
                  <Github className="w-4 h-4 text-[#6F7358]" /> GitHub Profile
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#888888] font-mono">
          <p>© 2026 GT Clothing Hub. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 border border-[#222222] text-[10px] uppercase text-[#888888] rounded-md">UPI</span>
            <span className="px-2.5 py-1 border border-[#222222] text-[10px] uppercase text-[#888888] rounded-md">Razorpay</span>
            <span className="px-2.5 py-1 border border-[#222222] text-[10px] uppercase text-[#888888] rounded-md">Cards</span>
            <span className="px-2.5 py-1 border border-[#222222] text-[10px] uppercase text-[#888888] rounded-md">COD</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

