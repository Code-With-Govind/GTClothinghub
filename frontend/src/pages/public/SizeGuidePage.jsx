import React from 'react';
import SEO from '../../components/common/SEO';

export default function SizeGuidePage({ isModal = false }) {
  return (
    <div className={`space-y-6 ${isModal ? 'p-2 sm:p-4 bg-white' : 'max-w-4xl mx-auto px-4 py-16 bg-[#F7F5F0]'}`}>
      {!isModal && <SEO title="Size Guide | GT CLOTHING HUB" />}

      <div className="border-b border-[#E5E2DC] pb-4">
        <span className="text-xs font-bold text-[#6F7358] tracking-widest uppercase font-mono">FIT SPECIFICATIONS</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] uppercase font-display tracking-tight">SIZE & FIT GUIDE</h1>
      </div>

      <p className="text-xs text-[#666666] leading-relaxed font-sans font-medium">
        Our apparel features a relaxed, drop-shoulder streetwear fit. If you prefer a fitted silhouette, consider sizing down.
      </p>

      <div className="overflow-x-auto bg-white border border-[#E5E2DC] rounded-xl shadow-xs">
        <table className="w-full text-left text-xs text-[#666666] border-collapse">
          <thead>
            <tr className="border-b border-[#E5E2DC] bg-[#F7F5F0] font-bold uppercase text-[#111111]">
              <th className="p-3.5 font-display">Size Tag</th>
              <th className="p-3.5 font-display">Chest Width (Inches)</th>
              <th className="p-3.5 font-display">Length (Inches)</th>
              <th className="p-3.5 font-display">Sleeve Length (Inches)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E2DC] font-mono">
            <tr>
              <td className="p-3.5 font-bold text-[#111111]">S</td>
              <td className="p-3.5">40"</td>
              <td className="p-3.5">28"</td>
              <td className="p-3.5">8.5"</td>
            </tr>
            <tr>
              <td className="p-3.5 font-bold text-[#111111]">M</td>
              <td className="p-3.5">42"</td>
              <td className="p-3.5">29"</td>
              <td className="p-3.5">9.0"</td>
            </tr>
            <tr>
              <td className="p-3.5 font-bold text-[#111111]">L</td>
              <td className="p-3.5">44"</td>
              <td className="p-3.5">30"</td>
              <td className="p-3.5">9.5"</td>
            </tr>
            <tr>
              <td className="p-3.5 font-bold text-[#111111]">XL</td>
              <td className="p-3.5">46"</td>
              <td className="p-3.5">31"</td>
              <td className="p-3.5">10.0"</td>
            </tr>
            <tr>
              <td className="p-3.5 font-bold text-[#111111]">XXL</td>
              <td className="p-3.5">48"</td>
              <td className="p-3.5">32"</td>
              <td className="p-3.5">10.5"</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}


