import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  User,
  Key,
  Truck,
  Shield,
  LogOut,
  ArrowRight,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function UserSidebar() {
  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();

  const navItems = [
    { label: 'Overview', path: '/account', icon: LayoutDashboard },
    { label: 'My Orders', path: '/account/orders', icon: Package },
    { label: 'Profile Settings', path: '/account/profile', icon: User },
    { label: 'Security & Password', path: '/account/change-password', icon: Key },
    { label: 'Track Order', path: '/order-tracking', icon: Truck },
  ];

  return (
    <aside className="w-full lg:w-64 bg-white rounded-xl p-5 border border-[#E5E2DC] shadow-xs shrink-0 space-y-6 self-start">
      {/* Customer Header Profile */}
      <div className="flex items-center gap-3.5 pb-4 border-b border-[#E5E2DC]">
        <div className="w-11 h-11 bg-[#111111] text-white font-bold text-base flex items-center justify-center rounded-lg font-display uppercase shrink-0">
          {user?.name ? user.name.charAt(0) : 'U'}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-[#111111] text-sm truncate tracking-tight">{user?.name || 'Customer'}</h3>
          <p className="text-xs text-[#666666] truncate mt-0.5">{user?.email}</p>
          {isAdmin && (
            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 text-[9px] font-bold bg-[#6F7358]/10 text-[#6F7358] border border-[#6F7358]/30 rounded uppercase tracking-wider font-mono">
              <Shield className="w-3 h-3" /> Admin Staff
            </span>
          )}
        </div>
      </div>

      {/* Admin Portal Banner (Only for admin users) */}
      {isAdmin && (
        <div className="p-3.5 bg-[#111111] text-white rounded-lg space-y-2">
          <div className="flex items-center gap-1.5 text-[#6F7358] font-bold text-[10px] uppercase tracking-wider font-mono">
            <Sparkles className="w-3 h-3 text-[#6F7358]" /> Admin Management
          </div>
          <p className="text-[11px] text-[#E5E2DC] leading-snug">
            Access store dashboard & order fulfillment.
          </p>
          <Link
            to="/admin"
            className="w-full mt-1.5 py-2 px-3 bg-white text-[#111111] hover:bg-[#F7F5F0] text-xs font-bold uppercase rounded transition-all flex items-center justify-between group font-mono"
          >
            <span>Admin Portal</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}

      {/* Account Navigation List */}
      <nav className="space-y-1">
        <span className="text-[10px] font-bold text-[#6F7358] uppercase tracking-widest px-2 block mb-2 font-mono">
          Account Menu
        </span>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between min-h-[44px] px-3 py-2.5 rounded-lg text-xs transition-all ${
                isActive
                  ? 'bg-[#111111] text-white font-bold shadow-xs'
                  : 'text-[#111111] hover:bg-[#F7F5F0] hover:text-[#111111] font-medium'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#666666]'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              <ChevronRight className={`w-4 h-4 shrink-0 opacity-60 ${isActive ? 'text-white' : 'text-[#666666]'}`} />
            </Link>
          );
        })}
      </nav>

      {/* Sign Out Button */}
      <div className="pt-4 border-t border-[#E5E2DC]">
        <button
          onClick={logout}
          className="w-full flex items-center justify-between min-h-[44px] px-3 py-2.5 rounded-lg text-xs font-bold text-[#DC2626] hover:bg-red-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </div>
          <ChevronRight className="w-4 h-4 opacity-60" />
        </button>
      </div>
    </aside>
  );
}



