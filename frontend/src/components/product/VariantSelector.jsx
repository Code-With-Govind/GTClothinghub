import React from 'react';
import { Check } from 'lucide-react';

export default function VariantSelector({
  colors = [],
  sizes = [],
  selectedColor,
  selectedSize,
  onSelectColor,
  onSelectSize,
  onOpenSizeGuide,
}) {
  return (
    <div className="space-y-6">
      
      {/* Color Selection */}
      {colors.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#737373] font-mono">
              COLOR: <span className="text-[#111111] font-extrabold">{selectedColor}</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {colors.map((colorObj, idx) => {
              const isSelected = selectedColor?.toLowerCase() === colorObj.name.toLowerCase();
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectColor(colorObj.name)}
                  className={`flex items-center gap-2 px-3 py-2 border text-xs font-bold uppercase tracking-wider transition-all ${
                    isSelected
                      ? 'border-[#111111] bg-[#111111] text-white'
                      : 'border-[#E5E0D8] bg-white text-[#171717] hover:border-[#111111]'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 border border-black/20 flex items-center justify-center"
                    style={{ backgroundColor: colorObj.hex || '#121212' }}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                  </span>
                  <span>{colorObj.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {sizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#737373] font-mono">
              SIZE: <span className="text-[#111111] font-extrabold">{selectedSize}</span>
            </span>

            {onOpenSizeGuide && (
              <button
                type="button"
                onClick={onOpenSizeGuide}
                className="text-xs font-bold text-[#111111] hover:underline uppercase tracking-wider font-mono"
              >
                Size Guide
              </button>
            )}
          </div>

          <div className="grid grid-cols-5 gap-2">
            {sizes.map((sz) => {
              const isSelected = selectedSize?.toUpperCase() === sz.toUpperCase();
              return (
                <button
                  key={sz}
                  type="button"
                  onClick={() => onSelectSize(sz)}
                  className={`py-3 border text-xs font-extrabold uppercase tracking-widest transition-all ${
                    isSelected
                      ? 'border-[#111111] bg-[#111111] text-white'
                      : 'border-[#E5E0D8] bg-white text-[#171717] hover:border-[#111111]'
                  }`}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

