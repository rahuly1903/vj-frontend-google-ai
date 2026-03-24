'use client';

import React, { useState, useEffect } from 'react';
import { Brand, BRAND_CONFIG, NAVIGATION } from '@/lib/config';
import { DashboardProvider, useDashboard } from '@/components/DashboardProvider';
import { 
  Database, 
  ChevronDown, 
  TrendingUp, 
  BarChart3, 
  Box, 
  ShoppingCart, 
  Truck, 
  LayoutDashboard,
  Menu,
  X,
  Bell,
  User,
  Search
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';

const ICON_MAP: Record<string, any> = {
  TrendingUp,
  BarChart3,
  Box,
  ShoppingCart,
  Truck,
  LayoutDashboard
};

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { brand, setBrand } = useDashboard();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasMounted(true);
  }, []);

  if (!hasMounted) return <div className="min-h-screen bg-[#E4E3E0]" />;

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans flex overflow-hidden">
        
        {/* Sidebar */}
        <motion.aside 
          initial={false}
          animate={{ width: isSidebarOpen ? 280 : 0, opacity: isSidebarOpen ? 1 : 0 }}
          className="bg-[#141414] text-[#E4E3E0] flex-shrink-0 relative z-50 overflow-hidden"
        >
          <div className="w-[280px] h-full flex flex-col">
            {/* Logo Area */}
            <div className="p-8 border-b border-[#E4E3E0]/10">
              <div className="flex items-center gap-3">
                <div className="bg-[#E4E3E0] p-2 rounded-sm">
                  <Database className="text-[#141414] w-5 h-5" />
                </div>
                <div>
                  <h1 className="font-serif italic text-lg leading-none">Enterprise</h1>
                  <p className="text-[9px] uppercase tracking-[0.3em] opacity-50 mt-1">Analytics Unified</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {NAVIGATION.map((section) => (
                <div key={section.section} className="space-y-3">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-30 px-4">
                    {section.section}
                  </h3>
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = ICON_MAP[item.icon] || LayoutDashboard;
                      const isActive = pathname.includes(item.id);
                      return (
                        <Link 
                          key={item.id} 
                          href={`/dashboard/${item.id}`}
                          className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all group ${
                            isActive 
                              ? 'bg-[#E4E3E0] text-[#141414] shadow-lg' 
                              : 'hover:bg-white/5'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? 'text-[#141414]' : 'opacity-40 group-hover:opacity-100'}`} />
                          <span className="text-xs font-medium tracking-wide">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* User Profile Area */}
            <div className="p-6 border-t border-[#E4E3E0]/10 bg-black/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#E4E3E0]/10 flex items-center justify-center">
                  <User className="w-4 h-4 opacity-50" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate">Admin User</p>
                  <p className="text-[9px] opacity-40 truncate">System Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
          
          {/* Top Bar */}
          <header className="h-20 bg-white/80 backdrop-blur-md border-b border-[#141414]/10 flex items-center justify-between px-8 flex-shrink-0 z-40">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-[#141414]/5 rounded-md transition-colors"
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              
              <div className="h-8 w-px bg-[#141414]/10" />

              <div className="flex items-center gap-4">
                <span className="text-[10px] uppercase tracking-widest font-bold opacity-30">Active Brand</span>
                <div className="relative group">
                  <button className="flex items-center gap-3 bg-[#141414] text-[#E4E3E0] px-4 py-2 rounded-sm text-[10px] uppercase tracking-widest font-bold shadow-md">
                    {brand}
                    <ChevronDown className="w-3 h-3 opacity-50" />
                  </button>
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-[#141414] shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    {(['Jean Dousset', 'With Clarity', 'Verigold'] as Brand[]).map((b) => (
                      <button
                        key={b}
                        onClick={() => setBrand(b)}
                        className="w-full text-left px-4 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors border-b border-[#141414]/5 last:border-0"
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-20" />
                <input 
                  type="text" 
                  placeholder="Search reports..." 
                  className="bg-[#141414]/5 border border-[#141414]/10 rounded-full py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-[#141414]/30 w-64"
                />
              </div>
              <button className="relative p-2 hover:bg-[#141414]/5 rounded-full transition-colors">
                <Bell className="w-5 h-5 opacity-50" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
              </button>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Global Footer Status */}
          <footer className="h-10 bg-white border-t border-[#141414]/10 flex items-center justify-between px-8 flex-shrink-0">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] uppercase tracking-widest font-bold opacity-40">System Live</span>
              </div>
              <div className="h-3 w-px bg-[#141414]/10" />
              <span className="text-[9px] uppercase tracking-widest font-bold opacity-40">DB: {BRAND_CONFIG[brand].db}</span>
            </div>
            <div className="text-[9px] uppercase tracking-widest font-bold opacity-20">
              Enterprise Intelligence Platform v4.2.0
            </div>
          </footer>
        </div>
      </div>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <DashboardLayoutContent>
        {children}
      </DashboardLayoutContent>
    </DashboardProvider>
  );
}
