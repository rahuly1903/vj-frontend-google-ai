'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Database, TrendingUp, Box, ShoppingCart, ChevronRight, LayoutDashboard, Terminal } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasMounted(true);
  }, []);

  if (!hasMounted) return <div className="min-h-screen bg-[#E4E3E0]" />;

  return (
    <main className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#141414] selection:text-[#E4E3E0] overflow-hidden">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-8 pt-32 pb-24 relative">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] pointer-events-none">
          <Database className="w-full h-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12 relative z-10">
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] font-bold opacity-40"
              >
                <div className="w-12 h-px bg-[#141414]" />
                <span>Enterprise Intelligence Platform</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-7xl lg:text-8xl font-serif italic leading-[0.85] tracking-tighter"
              >
                Unified <br />
                <span className="not-italic font-sans font-black uppercase">Analytics.</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl opacity-60 max-w-lg leading-relaxed"
              >
                A centralized command center for JD, WC, and Verigold. 
                Surface deep insights from Gross Margin to Inventory Snapshots in one professional interface.
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <Link 
                href="/dashboard/gross-margin"
                className="bg-[#141414] text-[#E4E3E0] px-10 py-6 rounded-sm text-[11px] uppercase tracking-[0.3em] font-bold hover:opacity-90 transition-all flex items-center justify-center gap-4 group shadow-2xl"
              >
                Enter Dashboard
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="border border-[#141414] px-10 py-6 rounded-sm text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-[#141414] hover:text-[#E4E3E0] transition-all">
                Documentation
              </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-12 pt-12 border-t border-[#141414]/10"
            >
              {[
                { label: 'Real-time', icon: Terminal },
                { label: 'Multi-DB', icon: Database },
                { label: 'Secure', icon: LayoutDashboard },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 opacity-30">
                  <item.icon className="w-4 h-4" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Visual Preview */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative hidden lg:block"
          >
            <div className="bg-white border border-[#141414] p-4 shadow-[32px_32px_0px_0px_rgba(20,20,20,1)]">
              <div className="bg-[#141414] h-8 w-full mb-4 flex items-center px-4 gap-2">
                <div className="w-2 h-2 rounded-full bg-[#E4E3E0]/30" />
                <div className="w-2 h-2 rounded-full bg-[#E4E3E0]/30" />
                <div className="w-2 h-2 rounded-full bg-[#E4E3E0]/30" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-32 bg-[#141414]/5 rounded-sm" />
                <div className="h-32 bg-[#141414]/5 rounded-sm" />
                <div className="col-span-2 h-64 bg-[#141414]/5 rounded-sm p-6 space-y-4">
                  <div className="h-4 w-1/3 bg-[#141414]/10 rounded-full" />
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-[#141414]/5 rounded-full" />
                    <div className="h-2 w-full bg-[#141414]/5 rounded-full" />
                    <div className="h-2 w-2/3 bg-[#141414]/5 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Accents */}
            <div className="absolute -top-12 -left-12 bg-white border border-[#141414] p-6 shadow-xl">
              <TrendingUp className="w-8 h-8 opacity-20" />
            </div>
            <div className="absolute -bottom-12 -right-12 bg-[#141414] text-[#E4E3E0] p-6 shadow-xl">
              <ShoppingCart className="w-8 h-8 opacity-50" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="fixed bottom-0 left-0 right-0 p-8 pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-between items-end opacity-20">
          <div className="text-[10px] font-mono uppercase tracking-tighter">
            System: Unified Analytics Core<br />
            Status: Operational
          </div>
          <div className="text-[10px] font-mono uppercase tracking-tighter text-right">
            © 2026 Enterprise Intelligence<br />
            All Rights Reserved
          </div>
        </div>
      </footer>
    </main>
  );
}
