import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import SEO from '../../components/common/SEO';

export default function NotFoundPage() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 py-16 bg-[#F7F5F0]">
      <SEO title="404 - Page Not Found" description="The page you looking for does not exist." />
      
      <div className="space-y-4 max-w-md mx-auto">
        <span className="text-6xl font-black font-mono text-[#111111] tracking-tighter">404</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold uppercase text-[#111111] font-display">
          PAGE NOT FOUND
        </h1>
        <p className="text-xs text-[#666666] leading-relaxed font-medium">
          The page or product link you clicked might have been moved or doesn't exist anymore.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/shop"
            className="btn-primary py-3.5 px-6 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" /> BROWSE SHOP
          </Link>
          <Link
            to="/"
            className="btn-outline py-3.5 px-6 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            BACK TO HOME <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
