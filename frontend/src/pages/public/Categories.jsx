import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shirt, Palette, Paintbrush } from 'lucide-react';
import SEO from '../../components/common/SEO';

export default function Categories() {

  const sections = [
    {
      mainTitle: 'Regular T-Shirts',
      badge: 'Classic Fit',
      description: 'Timeless tailored silhouette, 180 GSM super combed cotton, lightweight & versatile everyday wear.',
      subSections: [
        {
          name: 'Plain T-Shirts',
          icon: Shirt,
          tagline: 'Clean & minimalist solid tees',
          image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80',
          path: '/shop?mainSection=Regular+T-Shirts&subSection=Plain+T-Shirts',
        },
        {
          name: 'Printed T-Shirts',
          icon: Palette,
          tagline: 'Typography & aesthetic art prints',
          image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
          path: '/shop?mainSection=Regular+T-Shirts&subSection=Printed+T-Shirts',
        },
        {
          name: 'Custom Artwork Canvas',
          icon: Paintbrush,
          tagline: 'Custom POD print canvas',
          image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
          path: '/shop?mainSection=Regular+T-Shirts&subSection=Add+Your+Custom+Designs',
        },
      ],
    },
    {
      mainTitle: 'Oversized T-Shirts',
      badge: 'Heavyweight Boxy Drop',
      description: '240 GSM heavy cotton streetwear drop shoulder boxy tees. Ultimate comfort & urban aesthetics.',
      subSections: [
        {
          name: 'Plain T-Shirts',
          icon: Shirt,
          tagline: 'Raw boxy heavyweight basics',
          image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
          path: '/shop?mainSection=Oversized+T-Shirts&subSection=Plain+T-Shirts',
        },
        {
          name: 'Printed T-Shirts',
          icon: Palette,
          tagline: 'Cyberpunk & anime back graphics',
          image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80',
          path: '/shop?mainSection=Oversized+T-Shirts&subSection=Printed+T-Shirts',
        },
        {
          name: 'Custom Artwork Canvas',
          icon: Paintbrush,
          tagline: 'Custom oversized streetwear canvas',
          image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
          path: '/shop?mainSection=Oversized+T-Shirts&subSection=Add+Your+Custom+Designs',
        },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 bg-[#F7F5F0]">
      <SEO title="Explore T-Shirt Sections & Sub-Sections" />

      {/* Page Header */}
      <div className="border-b border-[#E5E2DC] pb-6">
        <span className="text-xs font-bold text-[#6F7358] tracking-widest uppercase font-mono">Catalog Architecture</span>
        <h1 className="text-3xl font-extrabold text-[#111111] uppercase font-display">T-Shirt Sections & Styles</h1>
        <p className="text-xs text-[#666666] mt-1">Explore Regular T-Shirts and Oversized T-Shirts by Plain, Printed, or Custom Design types.</p>
      </div>


      {/* Main Sections Grid */}
      {sections.map((sec, idx) => (
        <div key={idx} className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E2DC] space-y-8 shadow-xs">
          {/* Main Section Title Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E2DC] pb-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#6F7358] text-white rounded-md font-mono">
                  {sec.badge}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] uppercase font-display">{sec.mainTitle}</h2>
              </div>
              <p className="text-xs text-[#666666] mt-2 max-w-2xl">{sec.description}</p>
            </div>

            <Link
              to={`/shop?mainSection=${encodeURIComponent(sec.mainTitle)}`}
              className="btn-primary self-start md:self-auto py-2.5 px-5 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            >
              <span>Explore All {sec.mainTitle}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Sub Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sec.subSections.map((sub, sIdx) => {
              const Icon = sub.icon;
              return (
                <Link
                  key={sIdx}
                  to={sub.path}
                  className="group bg-[#F7F5F0] rounded-xl overflow-hidden border border-[#E5E2DC] hover:border-[#111111] transition-all flex flex-col h-72 relative shadow-xs"
                >
                  <img
                    src={sub.image}
                    alt={sub.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-[#111111]/40 to-transparent p-6 flex flex-col justify-end space-y-1.5">
                    <div className="flex items-center gap-2 text-[#F7F5F0]">
                      <Icon className="w-4 h-4 text-[#6F7358]" />
                      <span className="text-[10px] font-bold uppercase tracking-widest font-mono text-[#F7F5F0]">Sub Section</span>
                    </div>
                    <h3 className="text-lg font-bold text-white uppercase font-display group-hover:text-[#F7F5F0] transition-colors">
                      {sub.name}
                    </h3>
                    <p className="text-xs text-[#E5E2DC] line-clamp-1">{sub.tagline}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-white uppercase tracking-wider pt-2 group-hover:translate-x-1 transition-transform">
                      Shop Now <ArrowRight className="w-4 h-4 text-[#6F7358]" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

