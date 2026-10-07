import React from 'react';
import { CreditCard, Banknote, ShieldCheck } from 'lucide-react';

export default function PaymentSelector({ paymentMethod, onSelectMethod, codEnabled }) {
  return (
    <div className="space-y-4">
      <h3 className="font-extrabold text-xs text-[#111111] uppercase tracking-widest font-display">
        2. PAYMENT METHOD
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Razorpay Online */}
        <div
          onClick={() => onSelectMethod('RAZORPAY')}
          className={`p-4 bg-white border rounded-xl cursor-pointer transition-all shadow-xs ${
            paymentMethod === 'RAZORPAY'
              ? 'border-[#111111] ring-1 ring-[#111111]'
              : 'border-[#E5E2DC] hover:border-[#111111]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-[#111111]" />
              <div>
                <h4 className="font-bold text-[#111111] text-xs uppercase tracking-wider font-display">Instant Online Payment</h4>
                <p className="text-[10px] text-[#666666] font-mono">UPI, Debit/Credit Cards, NetBanking</p>
              </div>
            </div>
            <input
              type="radio"
              checked={paymentMethod === 'RAZORPAY'}
              onChange={() => onSelectMethod('RAZORPAY')}
              className="accent-[#111111] w-4 h-4"
            />
          </div>

          <div className="flex items-center gap-1.5 pt-2 text-[10px] text-emerald-700 font-mono border-t border-[#E5E2DC]">
            <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit SSL Encrypted Checkout
          </div>
        </div>

        {/* Cash on Delivery */}
        <div
          onClick={() => codEnabled && onSelectMethod('COD')}
          className={`p-4 bg-white border rounded-xl transition-all shadow-xs ${
            !codEnabled
              ? 'opacity-50 cursor-not-allowed border-[#E5E2DC]'
              : paymentMethod === 'COD'
              ? 'border-[#111111] ring-1 ring-[#111111] cursor-pointer'
              : 'border-[#E5E2DC] hover:border-[#111111] cursor-pointer'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Banknote className="w-5 h-5 text-[#6F7358]" />
              <div>
                <h4 className="font-bold text-[#111111] text-xs uppercase tracking-wider font-display">Cash On Delivery (COD)</h4>
                <p className="text-[10px] text-[#666666] font-mono">Pay cash upon doorstep delivery</p>
              </div>
            </div>
            <input
              type="radio"
              disabled={!codEnabled}
              checked={paymentMethod === 'COD'}
              onChange={() => codEnabled && onSelectMethod('COD')}
              className="accent-[#111111] w-4 h-4"
            />
          </div>

          <div className="pt-2 text-[10px] text-[#666666] font-mono border-t border-[#E5E2DC]">
            {codEnabled ? 'Pay cash on delivery' : 'COD disabled in store settings'}
          </div>
        </div>

      </div>
    </div>
  );
}


