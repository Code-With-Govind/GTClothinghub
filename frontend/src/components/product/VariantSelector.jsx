import React from 'react';
import { Check, AlertCircle } from 'lucide-react';

export default function VariantSelector({
  variants = [],
  colors = [],
  sizes = [],
  selectedColor = '',
  selectedSize = '',
  onSelectColor,
  onSelectSize,
  onOpenSizeGuide,
}) {
  // 1. Resolve colors
  // If product has variants, derive unique colors from active variants
  const activeVariants = Array.isArray(variants) ? variants.filter((v) => v.isActive !== false) : [];

  let availableColors = [];
  if (activeVariants.length > 0) {
    const colorMap = new Map();
    activeVariants.forEach((v) => {
      const colorName = v.color?.trim();
      if (colorName && !colorMap.has(colorName.toLowerCase())) {
        const matchingColor = Array.isArray(colors)
          ? colors.find((c) => c.name?.toLowerCase() === colorName.toLowerCase())
          : null;
        colorMap.set(colorName.toLowerCase(), {
          name: colorName,
          hex: matchingColor?.hex || v.colorHex || '#111111',
        });
      }
    });
    availableColors = Array.from(colorMap.values());
  } else if (Array.isArray(colors) && colors.length > 0) {
    availableColors = colors;
  }

  // 2. Resolve sizes available for the currently selected color
  let availableSizesForColor = [];
  if (activeVariants.length > 0 && selectedColor) {
    availableSizesForColor = activeVariants
      .filter((v) => v.color?.toLowerCase() === selectedColor.toLowerCase())
      .map((v) => v.size?.toUpperCase());
  } else if (Array.isArray(sizes) && sizes.length > 0) {
    availableSizesForColor = sizes.map((s) => s.toUpperCase());
  }

  // Master list of all valid sizes for this apparel style
  let allProductSizes = [];
  if (Array.isArray(sizes) && sizes.length > 0) {
    allProductSizes = sizes;
  } else if (activeVariants.length > 0) {
    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
    const uniqueSizes = Array.from(new Set(activeVariants.map((v) => v.size?.toUpperCase())));
    allProductSizes = uniqueSizes.sort((a, b) => {
      const ia = sizeOrder.indexOf(a);
      const ib = sizeOrder.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });
  } else {
    allProductSizes = ['S', 'M', 'L', 'XL', 'XXL'];
  }

  return (
    <div className="space-y-3.5">
      {/* Color Selection */}
      {availableColors.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-[#666666] font-mono flex items-center gap-2">
              <span>COLOR:</span>
              <span className="text-[#111111] font-extrabold">{selectedColor || 'Select a color'}</span>
              {availableColors.length > 1 && (
                <span className="text-[10px] font-mono text-[#6F7358] font-bold bg-[#F7F5F0] border border-[#E5E2DC] px-2 py-0.5 rounded-md">
                  ({availableColors.length} COLORS AVAILABLE)
                </span>
              )}
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin scroll-smooth">
            {availableColors.map((colorObj, idx) => {
              const isSelected = selectedColor?.toLowerCase() === colorObj.name.toLowerCase();
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectColor(colorObj.name)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] border rounded-lg text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
                    isSelected
                      ? 'border-[#111111] bg-[#111111] text-white shadow-xs'
                      : 'border-[#E5E2DC] bg-white text-[#111111] hover:border-[#111111]'
                  }`}
                  aria-pressed={isSelected}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/20 flex items-center justify-center shrink-0"
                    style={{ backgroundColor: colorObj.hex || '#111111' }}
                  >
                    {isSelected && <Check className="w-2 h-2 text-white" />}
                  </span>
                  <span className="whitespace-nowrap">{colorObj.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {allProductSizes.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-[#666666] font-mono">
              SIZE: <span className="text-[#111111] font-extrabold">{selectedSize || 'Select a size'}</span>
            </span>

            {onOpenSizeGuide && (
              <button
                type="button"
                onClick={onOpenSizeGuide}
                className="text-xs font-bold text-[#111111] hover:text-[#6F7358] underline uppercase tracking-wider font-mono transition-colors"
              >
                SIZE GUIDE
              </button>
            )}
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
            {allProductSizes.map((sz) => {
              const upperSz = sz.toUpperCase();
              const isSelected = selectedSize?.toUpperCase() === upperSz;
              const isSupported = availableSizesForColor.includes(upperSz);

              if (!isSupported) {
                return (
                  <button
                    key={sz}
                    type="button"
                    disabled
                    title={`${sz} is unavailable in ${selectedColor}`}
                    className="py-2 min-h-[38px] border border-dashed border-[#E5E2DC] rounded-lg text-xs font-bold uppercase tracking-widest text-[#AAAAAA] bg-[#F7F5F0] cursor-not-allowed line-through opacity-60"
                  >
                    {sz}
                  </button>
                );
              }

              return (
                <button
                  key={sz}
                  type="button"
                  onClick={() => onSelectSize(sz)}
                  className={`py-2 min-h-[38px] border rounded-lg text-xs font-extrabold uppercase tracking-widest transition-all ${
                    isSelected
                      ? 'border-[#111111] bg-[#111111] text-white shadow-xs'
                      : 'border-[#E5E2DC] bg-white text-[#111111] hover:border-[#111111]'
                  }`}
                  aria-pressed={isSelected}
                >
                  {sz}
                </button>
              );
            })}
          </div>

          {availableSizesForColor.length === 0 && (
            <p className="text-xs text-rose-600 font-medium flex items-center gap-1.5 pt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> No sizes currently in stock for {selectedColor}.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
