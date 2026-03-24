'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Brand } from '@/lib/config';

const DashboardContext = createContext<{
  brand: Brand;
  setBrand: (b: Brand) => void;
} | undefined>(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('useDashboard must be used within a DashboardProvider');
  return context;
};

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [brand, setBrand] = useState<Brand>('Jean Dousset');

  return (
    <DashboardContext.Provider value={{ brand, setBrand }}>
      {children}
    </DashboardContext.Provider>
  );
}
