import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  FolderTree,
  BarChart3,
  Settings,
  Printer,
  ShieldAlert,
  ArrowLeft,
  Store,
} from 'lucide-react';

export default function AdminSidebar() {
  const location = useLocation();

  const links = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Product Catalog', path: '/admin/products', icon: Package },
    { label: 'Orders Mgmt', path: '/admin/orders', icon: ShoppingBag },
    { label: 'POD Fulfillment', path: '/admin/pod', icon: Printer },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Coupons', path: '/admin/coupons', icon: Tag },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Sales Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: ShieldAlert },
    { label: 'Website Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#111111] text-white min-h-screen p-5 flex flex-col justify-between shrink-0 border-r border-neutral-800">
      <div className="space-y-6">
        
        {/* Brand Admin Badge */}
        <div className="flex items-center gap-3 px-2 py-2 border-b border-neutral-800 pb-5">
          <div className="w-9 h-9 bg-white text-[#111111] font-black flex items-center justify-center rounded-lg text-xs font-display tracking-tight">
            GT
          </div>
          <div>
            <h2 className="font-display font-black text-sm text-white uppercase tracking-wider">GT CLOTHING HUB</h2>
            <span className="text-[9px] font-mono text-[#C8A96B] font-bold uppercase tracking-widest block">ADMIN PORTAL</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium tracking-wide transition-all ${
                  isActive
                    ? 'bg-[#C8A96B] text-white font-bold shadow-sm'
                    : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Dual Dashboard Switcher Section */}
      <div className="pt-4 border-t border-neutral-800 space-y-3">
        <div className="p-3.5 bg-neutral-900 rounded-xl border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase text-[#C8A96B] tracking-widest">
              PORTAL SWITCHER
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-[11px] text-neutral-400 leading-snug">
            Toggle between Admin mode and Customer view.
          </p>
          <Link
            to="/account"
            className="w-full py-2 px-3 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold uppercase rounded-lg transition-all flex items-center justify-between"
          >
            <span>Customer Account</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          <Store className="w-4 h-4 text-[#C8A96B]" /> Customer Store Front
        </Link>
      </div>
    </aside>
  );
}

