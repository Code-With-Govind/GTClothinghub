import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Plus, Trash2 } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import SEO from '../../components/common/SEO';
import api from '../../services/api';

export default function ProductAdd() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(899);
  const [compareAtPrice, setCompareAtPrice] = useState(1499);
  const [category, setCategory] = useState('');
  const [mainSection, setMainSection] = useState('Regular T-Shirts');
  const [subSection, setSubSection] = useState('Printed T-Shirts');

  const [podProductId, setPodProductId] = useState('');

  // Multiple Images State
  const [imagesList, setImagesList] = useState([]);
  const [urlInput, setUrlInput] = useState('');

  const [isFeatured, setIsFeatured] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/categories').then((res) => {
      setCategories(res.categories || []);
      if (res.categories?.length > 0) setCategory(res.categories[0]._id);
    });
  }, []);

  // Multi-File Upload Handler (From Computer System Folder)
  const handleMultipleFiles = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagesList((prev) => [
            ...prev,
            { url: reader.result, altText: file.name },
          ]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Add Direct Web URL
  const handleAddUrl = () => {
    if (urlInput.trim()) {
      setImagesList((prev) => [
        ...prev,
        { url: urlInput.trim(), altText: name || 'Product Photo' },
      ]);
      setUrlInput('');
    }
  };

  // Remove Photo from Gallery
  const handleRemoveImage = (indexToRemove) => {
    setImagesList((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imagesList.length === 0) {
      alert('Please upload at least 1 product photo!');
      return;
    }
    setLoading(true);

    try {
      const baseSku = podProductId ? podProductId.trim() : name.substring(0, 5).toUpperCase();
      const defaultVariants = [
        { sku: `${baseSku}-S`, color: 'Pitch Black', colorHex: '#121212', size: 'S', price: Number(price), podVariantId: `${baseSku}-S` },
        { sku: `${baseSku}-M`, color: 'Pitch Black', colorHex: '#121212', size: 'M', price: Number(price), podVariantId: `${baseSku}-M` },
        { sku: `${baseSku}-L`, color: 'Pitch Black', colorHex: '#121212', size: 'L', price: Number(price), podVariantId: `${baseSku}-L` },
        { sku: `${baseSku}-XL`, color: 'Pitch Black', colorHex: '#121212', size: 'XL', price: Number(price), podVariantId: `${baseSku}-XL` },
      ];

      await api.post('/products', {
        name,
        description,
        price: Number(price),
        compareAtPrice: Number(compareAtPrice),
        category,
        mainSection,
        subSection,
        podProductId: podProductId.trim(),
        images: imagesList,
        colors: [{ name: 'Pitch Black', hex: '#121212' }],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        variants: defaultVariants,
        flags: { isFeatured, isBestSeller, isNewArrival },
      });

      navigate('/admin/products');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F7F5F0]">
      <SEO title="Add Product Drop" />
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto max-w-4xl">
        <div className="border-b border-neutral-200 pb-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#C8A96B] tracking-widest uppercase font-mono">Catalog Control</span>
            <h1 className="text-3xl font-black text-[#171717] uppercase font-display tracking-tight">Add New Product</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200/80 shadow-sm space-y-6">
          
          {/* Title & Qikink SKU */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#171717] uppercase mb-1.5">Product Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Heavyweight Oversized Cotton Tee"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-[#171717] focus:outline-none focus:border-[#111111] font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#171717] uppercase mb-1.5 font-mono">Qikink Product ID / SKU (Optional)</label>
              <input
                type="text"
                value={podProductId}
                onChange={(e) => setPodProductId(e.target.value)}
                placeholder="e.g. 64751292 or Qikink SKU"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-[#171717] focus:outline-none focus:border-[#111111] font-mono"
              />
            </div>
          </div>

          {/* Classification Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#171717] uppercase mb-1.5">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-[#171717] focus:outline-none focus:border-[#111111]"
                required
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] uppercase mb-1.5">Main Section (Fit) *</label>
              <select
                value={mainSection}
                onChange={(e) => setMainSection(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-[#171717] focus:outline-none focus:border-[#111111] font-bold"
                required
              >
                <option value="Regular T-Shirts">Regular T-Shirts</option>
                <option value="Oversized T-Shirts">Oversized T-Shirts</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] uppercase mb-1.5">Sub Section (Type) *</label>
              <select
                value={subSection}
                onChange={(e) => setSubSection(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-[#171717] focus:outline-none focus:border-[#111111] font-bold"
                required
              >
                <option value="Plain T-Shirts">Plain T-Shirts</option>
                <option value="Printed T-Shirts">Printed T-Shirts</option>
                <option value="Add Your Custom Designs">Add Your Custom Designs</option>
              </select>
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#171717] uppercase mb-1.5">Sale Price (₹) *</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-[#171717] focus:outline-none focus:border-[#111111] font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase mb-1.5">Compare-at Price (₹)</label>
              <input
                type="number"
                value={compareAtPrice}
                onChange={(e) => setCompareAtPrice(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-[#171717] focus:outline-none focus:border-[#111111]"
              />
            </div>
          </div>

          {/* MULTIPLE IMAGE UPLOAD SECTION */}
          <div className="space-y-4 p-5 bg-neutral-50 rounded-2xl border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-[#171717] uppercase font-mono tracking-wider">
                  Product Photos Gallery (Multiple Images) *
                </label>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Upload photos from computer or paste web image links
                </p>
              </div>
              <span className="px-3 py-1 text-xs font-bold bg-[#111111] text-white rounded-lg font-mono">
                {imagesList.length} Photos
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {/* File Browser Input */}
              <div className="relative border-2 border-dashed border-neutral-300 hover:border-[#111111] rounded-2xl p-6 bg-white text-center transition-all cursor-pointer group">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleMultipleFiles}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20"
                />
                <div className="flex flex-col items-center gap-2 pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 text-[#111111] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-[#171717] uppercase">Browse Computer Images</span>
                  <span className="text-[10px] text-neutral-400 font-mono">Select PNG, JPG, WEBP</span>
                </div>
              </div>

              {/* Add Image URL */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-neutral-500 block uppercase">Or Image URL:</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-1 bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#111111]"
                  />
                  <button
                    type="button"
                    onClick={handleAddUrl}
                    className="px-4 py-2.5 bg-[#111111] hover:bg-neutral-800 text-white text-xs font-bold uppercase rounded-xl flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
              </div>
            </div>

            {/* Gallery Thumbnail Preview Grid */}
            {imagesList.length > 0 && (
              <div className="pt-2">
                <span className="text-[11px] font-mono font-bold text-neutral-700 uppercase block mb-3">
                  Attached Photos ({imagesList.length}):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {imagesList.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-white border border-neutral-200 group shadow-sm">
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                      
                      <span className={`absolute top-2 left-2 px-2 py-0.5 text-[9px] font-bold uppercase rounded ${
                        idx === 0 ? 'bg-[#111111] text-white' : 'bg-black/60 text-white backdrop-blur-sm'
                      }`}>
                        {idx === 0 ? 'MAIN COVER' : `#${idx + 1}`}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-80 hover:opacity-100 transition-opacity"
                        title="Remove Photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#171717] uppercase mb-1.5">Product Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="240 GSM Super combed bio-washed heavyweight cotton..."
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-[#171717] focus:outline-none focus:border-[#111111]"
            />
          </div>

          {/* Flags */}
          <div className="flex gap-6 text-xs text-[#171717] pt-2">
            <label className="flex items-center gap-2 cursor-pointer font-bold">
              <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="accent-[#111111]" />
              Featured Drop
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-bold">
              <input type="checkbox" checked={isBestSeller} onChange={(e) => setIsBestSeller(e.target.checked)} className="accent-[#111111]" />
              Best Seller
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-bold">
              <input type="checkbox" checked={isNewArrival} onChange={(e) => setIsNewArrival(e.target.checked)} className="accent-[#111111]" />
              New Drop Flag
            </label>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#111111] hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
          >
            {loading ? 'Creating Product Drop...' : 'Save & Publish Product'}
          </button>
        </form>
      </main>
    </div>
  );
}

