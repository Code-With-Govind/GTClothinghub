import React from 'react';
import { CreditCard, Banknote, ShieldCheck } from 'lucide-react';

export default function PaymentSelector({ paymentMethod, onSelectMethod, codEnabled }) {
  return (
    <div className="space-y-4">
      <h3 className="font-extrabold text-xs text-brand-espresso uppercase tracking-widest font-display">
        2. PAYMENT METHOD
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Razorpay Online */}
        <div
          onClick={() => onSelectMethod('RAZORPAY')}
          className={`p-4 bg-white border cursor-pointer transition-all shadow-fashion-sm ${
            paymentMethod === 'RAZORPAY'
              ? 'border-brand-espresso ring-1 ring-brand-espresso'
              : 'border-brand-beige hover:border-brand-espresso'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-brand-espresso" />
              <div>
                <h4 className="font-bold text-brand-espresso text-xs uppercase tracking-wider font-display">Instant Online Payment</h4>
                <p className="text-[10px] text-brand-grey font-mono">UPI, Debit/Credit Cards, NetBanking</p>
              </div>
            </div>
            <input
              type="radio"
              checked={paymentMethod === 'RAZORPAY'}
              onChange={() => onSelectMethod('RAZORPAY')}
              className="accent-[#292621] w-4 h-4"
            />
          </div>

          <div className="flex items-center gap-1.5 pt-2 text-[10px] text-emerald-700 font-mono border-t border-brand-beige">
            <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit SSL Encrypted Checkout
          </div>
        </div>

        {/* Cash on Delivery */}
        <div
          onClick={() => codEnabled && onSelectMethod('COD')}
          className={`p-4 bg-white border transition-all shadow-fashion-sm ${
            !codEnabled
              ? 'opacity-50 cursor-not-allowed border-brand-beige'
              : paymentMethod === 'COD'
              ? 'border-brand-espresso ring-1 ring-brand-espresso cursor-pointer'
              : 'border-brand-beige hover:border-brand-espresso cursor-pointer'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Banknote className="w-5 h-5 text-brand-gold" />
              <div>
                <h4 className="font-bold text-brand-espresso text-xs uppercase tracking-wider font-display">Cash On Delivery (COD)</h4>
                <p className="text-[10px] text-brand-grey font-mono">Pay cash upon doorstep delivery</p>
              </div>
            </div>
            <input
              type="radio"
              disabled={!codEnabled}
              checked={paymentMethod === 'COD'}
              onChange={() => codEnabled && onSelectMethod('COD')}
              className="accent-[#292621] w-4 h-4"
            />
          </div>

          <div className="pt-2 text-[10px] text-brand-grey font-mono border-t border-brand-beige">
            {codEnabled ? 'Pay cash on delivery' : 'COD disabled in store settings'}
          </div>
        </div>

      </div>
    </div>
  );
}

