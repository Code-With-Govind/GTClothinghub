import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import SEO from '../../components/common/SEO';
import api from '../../services/api';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const fetchCategories = () => {
    api.get('/categories').then((res) => setCategories(res.categories || []));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', { name, description, image: { url: imageUrl } });
      setName('');
      setDescription('');
      setImageUrl('');
      fetchCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F7F5F0]">
      <SEO title="Category Management" />
      <AdminSidebar />
      <main className="flex-1 p-8 space-y-8 overflow-y-auto max-w-4xl">
        <div className="border-b border-neutral-200 pb-6">
          <span className="text-xs font-bold text-[#C8A96B] tracking-widest uppercase font-mono">Taxonomy</span>
          <h1 className="text-3xl font-black text-[#171717] uppercase font-display tracking-tight">Category Management</h1>
        </div>

        <form onSubmit={handleCreate} className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-sm space-y-4">
          <h3 className="font-bold text-[#171717] text-sm uppercase font-display">Add Category</h3>
          <div>
            <label className="block text-xs font-bold text-[#171717] uppercase mb-1">Category Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Oversized T-Shirts" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs text-[#171717] focus:outline-none focus:border-[#111111]" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#171717] uppercase mb-1">Image URL</label>
            <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://images.unsplash.com/..." className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs text-[#171717] focus:outline-none focus:border-[#111111]" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#171717] uppercase mb-1">Description</label>
            <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs text-[#171717] focus:outline-none focus:border-[#111111]" />
          </div>
          <button type="submit" className="w-full py-3 bg-[#111111] hover:bg-neutral-800 text-white text-xs font-bold uppercase rounded-xl transition-all shadow-sm">Add Category</button>
        </form>

        <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-600">
              <thead>
                <tr className="border-b border-neutral-200 font-bold uppercase tracking-wider text-neutral-500">
                  <th className="p-3">Category Name</th>
                  <th className="p-3">Slug</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-mono">
                {categories.map((c) => (
                  <tr key={c._id} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-3 font-bold text-[#171717] font-sans">{c.name}</td>
                    <td className="p-3 text-neutral-500">{c.slug}</td>
                    <td className="p-3 text-right">
                      <button onClick={() => handleDelete(c._id)} className="text-red-600 hover:underline font-sans font-bold">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

