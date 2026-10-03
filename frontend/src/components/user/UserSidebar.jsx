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
    <aside className="w-full lg:w-64 bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-sm shrink-0 space-y-6 self-start">
      {/* User Header Profile */}
      <div className="flex items-center gap-3 pb-5 border-b border-neutral-100">
        <div className="w-11 h-11 bg-[#111111] text-white font-bold text-base flex items-center justify-center rounded-xl font-display uppercase">
          {user?.name ? user.name.charAt(0) : 'U'}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-[#171717] text-sm truncate">{user?.name || 'Customer'}</h3>
          <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
          {isAdmin && (
            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 text-[9px] font-bold bg-[#C8A96B]/10 text-[#C8A96B] border border-[#C8A96B]/30 rounded uppercase tracking-wider">
              <Shield className="w-3 h-3" /> Admin Staff
            </span>
          )}
        </div>
      </div>

      {/* DUAL DASHBOARD SWITCHER (If Admin) */}
      {isAdmin && (
        <div className="p-4 bg-neutral-900 text-white rounded-xl space-y-2">
          <div className="flex items-center gap-1.5 text-[#C8A96B] font-bold text-[11px] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Admin Portal
          </div>
          <p className="text-xs text-neutral-400 leading-snug">
            Access store management, products & order fulfillment.
          </p>
          <Link
            to="/admin"
            className="w-full mt-2 py-2.5 px-3 bg-[#C8A96B] hover:bg-[#b59557] text-white text-xs font-bold uppercase rounded-lg transition-all flex items-center justify-between group"
          >
            <span>Admin Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}

      {/* Account Nav Items */}
      <nav className="space-y-1">
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-3 block mb-2 font-mono">
          Account Menu
        </span>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#111111] text-white font-semibold shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-[#171717]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout Action */}
      <div className="pt-4 border-t border-neutral-100">
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  );
}

