import React from 'react';

export default function StatCard({ title, value, icon: Icon, trend }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-sm space-y-3 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{title}</span>
        <div className="p-2.5 rounded-xl bg-neutral-100 text-[#111111]">
          {Icon && <Icon className="w-5 h-5 text-[#111111]" />}
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-black text-[#171717] font-display">{value}</h3>
        {trend && <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">{trend}</span>}
      </div>
    </div>
  );
}

