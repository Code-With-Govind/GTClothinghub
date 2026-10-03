import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import SEO from '../../components/common/SEO';
import api from '../../services/api';
import { formatPrice } from '../../utils/formatters';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products?limit=100');
      setProducts(res.products || []);
    } catch (err) {
      console.warn('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F7F5F0]">
      <SEO title="Product Catalog Management" />
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        <div className="border-b border-neutral-200 pb-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#C8A96B] tracking-widest uppercase font-mono">Catalog Management</span>
            <h1 className="text-3xl font-black text-[#171717] uppercase font-display tracking-tight">Product Catalog</h1>
          </div>

          <Link
            to="/admin/products/add"
            className="px-5 py-3 bg-[#111111] hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Add Product Drop
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-sm">
          {loading ? (
            <div className="h-64 animate-pulse bg-neutral-100 rounded-xl" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-600">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider">
                    <th className="p-3">Product Name</th>
                    <th className="p-3">Main Section (Fit)</th>
                    <th className="p-3">Sub Section (Type)</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Flags</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-mono">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-neutral-50 transition-colors">
                      <td className="p-3 font-bold text-[#171717] flex items-center gap-3 font-sans">
                        <img src={p.images?.[0]?.url} alt={p.name} className="w-9 h-11 object-cover rounded bg-neutral-100 shrink-0" />
                        <span className="max-w-[200px] truncate font-bold text-[#171717]">{p.name}</span>
                      </td>
                      <td className="p-3 font-sans">
                        <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-neutral-100 text-[#171717] uppercase">
                          {p.mainSection || 'Regular T-Shirts'}
                        </span>
                      </td>
                      <td className="p-3 font-sans">
                        <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-neutral-50 text-neutral-600 border border-neutral-200 uppercase">
                          {p.subSection || 'Printed T-Shirts'}
                        </span>
                      </td>
                      <td className="p-3 font-sans text-neutral-500">{p.category?.name}</td>
                      <td className="p-3 font-bold text-[#111111]">{formatPrice(p.price)}</td>
                      <td className="p-3 font-sans">
                        {p.isBestSeller && <span className="px-2 py-0.5 text-[9px] bg-[#111111] text-white rounded font-bold uppercase mr-1">Best</span>}
                        {p.isNewArrival && <span className="px-2 py-0.5 text-[9px] bg-[#C8A96B] text-white rounded font-bold uppercase">New</span>}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <Link to={`/admin/products/edit/${p._id}`} className="p-1.5 text-neutral-400 hover:text-[#111111] inline-block transition-colors">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(p._id)} className="p-1.5 text-neutral-400 hover:text-red-600 inline-block transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

