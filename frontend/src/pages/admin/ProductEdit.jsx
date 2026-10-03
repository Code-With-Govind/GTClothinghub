import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, Plus, Trash2 } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import SEO from '../../components/common/SEO';
import api from '../../services/api';

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [compareAtPrice, setCompareAtPrice] = useState(0);
  const [mainSection, setMainSection] = useState('Regular T-Shirts');
  const [subSection, setSubSection] = useState('Printed T-Shirts');
  
  // Multiple Images State
  const [imagesList, setImagesList] = useState([]);
  const [urlInput, setUrlInput] = useState('');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => {
      if (res.product) {
        setName(res.product.name);
        setDescription(res.product.description);
        setPrice(res.product.price);
        setCompareAtPrice(res.product.compareAtPrice || 0);
        setMainSection(res.product.mainSection || 'Regular T-Shirts');
        setSubSection(res.product.subSection || 'Printed T-Shirts');
        setImagesList(res.product.images || []);
      }
      setLoading(false);
    });
  }, [id]);

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
      alert('Please attach at least 1 product photo!');
      return;
    }
    try {
      await api.put(`/products/${id}`, {
        name,
        description,
        price: Number(price),
        compareAtPrice: Number(compareAtPrice),
        mainSection,
        subSection,
        images: imagesList,
      });
      navigate('/admin/products');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-8 text-neutral-500 font-mono text-xs uppercase">Loading product details...</div>;

  return (
    <div className="flex min-h-screen bg-[#F7F5F0]">
      <SEO title="Edit Product" />
      <AdminSidebar />
      <main className="flex-1 p-8 space-y-8 max-w-4xl">
        <h1 className="text-3xl font-black text-[#171717] uppercase font-display tracking-tight">Edit Product</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200/80 shadow-sm space-y-6">
          <div>
            <label className="block text-xs font-bold text-[#171717] uppercase mb-1.5">Product Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-[#171717] font-semibold focus:outline-none focus:border-[#111111]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#171717] uppercase mb-1.5">Main Section (Fit)</label>
              <select
                value={mainSection}
                onChange={(e) => setMainSection(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-[#171717] font-bold focus:outline-none focus:border-[#111111]"
              >
                <option value="Regular T-Shirts">Regular T-Shirts</option>
                <option value="Oversized T-Shirts">Oversized T-Shirts</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#171717] uppercase mb-1.5">Sub Section (Type)</label>
              <select
                value={subSection}
                onChange={(e) => setSubSection(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-[#171717] font-bold focus:outline-none focus:border-[#111111]"
              >
                <option value="Plain T-Shirts">Plain T-Shirts</option>
                <option value="Printed T-Shirts">Printed T-Shirts</option>
                <option value="Add Your Custom Designs">Add Your Custom Designs</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#171717] uppercase mb-1.5">Price (₹)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-[#171717] font-bold focus:outline-none focus:border-[#111111]"
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
                  Current Gallery Photos ({imagesList.length}):
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

          <div>
            <label className="block text-xs font-bold text-[#171717] uppercase mb-1.5">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-[#171717] focus:outline-none focus:border-[#111111]"
            />
          </div>

          <button type="submit" className="w-full py-4 bg-[#111111] hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm">
            Save Product Changes
          </button>
        </form>
      </main>
    </div>
  );
}

