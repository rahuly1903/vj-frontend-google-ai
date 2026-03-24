'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { REPORTS, BRAND_CONFIG, ReportConfig } from '@/lib/config';
import { API_BASE_URL } from '@/lib/apiConfig';
import { useDashboard } from '@/components/DashboardProvider';
import { 
  Filter, 
  Play, 
  RefreshCcw, 
  Download, 
  Table as TableIcon, 
  Database, 
  ChevronDown, 
  Info,
  Terminal,
  Code,
  AlertCircle,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const { brand } = useDashboard();
  const reportId = params.report as string;

  const config = useMemo(() => REPORTS.find(r => r.id === reportId), [reportId]);

  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [reportData, setReportData] = useState<{ kpis: any; rows: any[] } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Reset state when report changes
  useEffect(() => {
    setFilterValues({});
    setReportData(null);
    setError(null);
  }, [reportId]);

  if (!hasMounted) return null;

  if (!config) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <AlertCircle className="w-12 h-12 opacity-20" />
        <h2 className="text-xl font-serif italic opacity-50">Report module not found or under construction.</h2>
        <button 
          onClick={() => router.push('/dashboard/gross-margin')}
          className="text-[10px] uppercase tracking-widest font-bold border border-[#141414] px-6 py-3 hover:bg-[#141414] hover:text-[#E4E3E0] transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleFilterChange = (id: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [id]: value }));
  };

  const generateReport = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/reports/${reportId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          database: BRAND_CONFIG[brand].db,
          params: filterValues
        })
      });

      if (!response.ok) {
        throw new Error('Unable to fetch report data');
      }

      const data = await response.json();
      setReportData(data);
    } catch (err: any) {
      console.error('Report Error:', err);
      setError('Unable to fetch report data');
    } finally {
      setIsGenerating(false);
    }
  };

  const mandatoryFilters = config.filters.filter(f => f.mandatory);
  const optionalFilters = config.filters.filter(f => !f.mandatory);
  const isFormValid = mandatoryFilters.every(f => filterValues[f.id]);

  const formatValue = (val: number, format: string) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    }
    if (format === 'percent') {
      return `${val.toFixed(2)}%`;
    }
    return new Intl.NumberFormat('en-US').format(val);
  };

  const getMarginColor = (margin: number) => {
    if (margin < 15) return 'text-rose-600 font-bold';
    if (margin < 25) return 'text-amber-600 font-bold';
    return 'text-emerald-600 font-bold';
  };

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">
            <span>{config.category}</span>
            <span className="opacity-20">/</span>
            <span>{config.title}</span>
          </div>
          <h1 className="text-4xl font-serif italic leading-none">{config.title}</h1>
          <p className="text-sm opacity-60 max-w-xl">{config.description}</p>
        </div>
        <div className="flex gap-3">
          <button 
            disabled={!reportData}
            className="flex items-center gap-2 bg-white border border-[#141414]/10 px-5 py-3 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-[#141414]/5 transition-colors disabled:opacity-20"
          >
            <Download className="w-4 h-4" /> Export Data
          </button>
          <button 
            onClick={generateReport}
            disabled={!isFormValid || isGenerating}
            className="flex items-center gap-2 bg-white border border-[#141414]/10 px-5 py-3 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-[#141414]/5 transition-colors disabled:opacity-20"
          >
            <RefreshCcw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard 
          label="Total Sales" 
          value={reportData?.kpis.totalSales || 0} 
          format="currency" 
          loading={isGenerating} 
        />
        <KPICard 
          label="Total Cost" 
          value={reportData?.kpis.totalCost || 0} 
          format="currency" 
          loading={isGenerating} 
        />
        <KPICard 
          label="Total Profit" 
          value={reportData?.kpis.totalProfit || 0} 
          format="currency" 
          loading={isGenerating} 
        />
        <KPICard 
          label="Margin %" 
          value={reportData?.kpis.marginPercent || 0} 
          format="percent" 
          loading={isGenerating} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#141414] p-8">
            <div className="flex items-center gap-2 mb-8 border-b border-[#141414]/10 pb-4">
              <Filter className="w-4 h-4" />
              <h4 className="text-xs uppercase tracking-widest font-bold">Query Parameters</h4>
            </div>

            <div className="space-y-6">
              {/* Mandatory Filters */}
              <div className="space-y-5">
                {mandatoryFilters.map(f => (
                  <FilterInput key={f.id} filter={f} value={filterValues[f.id] || ''} onChange={handleFilterChange} />
                ))}
              </div>

              {/* Advanced Filters Toggle */}
              {optionalFilters.length > 0 && (
                <div className="pt-4 border-t border-[#141414]/5">
                  <button 
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center justify-between w-full text-[10px] uppercase tracking-widest font-bold opacity-50 hover:opacity-100 transition-opacity"
                  >
                    Advanced Filters
                    <ChevronDown className={`w-3 h-3 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {showAdvanced && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden space-y-5 pt-6"
                      >
                        {optionalFilters.map(f => (
                          <FilterInput key={f.id} filter={f} value={filterValues[f.id] || ''} onChange={handleFilterChange} />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <div className="pt-6">
                <button 
                  onClick={generateReport}
                  disabled={!isFormValid || isGenerating}
                  className="w-full bg-[#141414] text-[#E4E3E0] py-5 text-[10px] uppercase tracking-[0.3em] font-bold hover:opacity-90 disabled:opacity-20 transition-all flex items-center justify-center gap-3 shadow-lg"
                >
                  {isGenerating ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                  Run Report
                </button>
                <button 
                  onClick={() => setFilterValues({})}
                  className="w-full mt-4 text-[10px] uppercase tracking-widest font-bold opacity-40 hover:opacity-100 transition-opacity"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[#141414] text-[#E4E3E0] p-8 rounded-sm">
            <div className="flex items-center gap-2 mb-4 opacity-50">
              <Info className="w-4 h-4" />
              <h4 className="text-[10px] uppercase tracking-widest font-bold">Usage Note</h4>
            </div>
            <p className="text-xs leading-relaxed opacity-80">
              All reports are generated in real-time from the <span className="font-bold underline">{BRAND_CONFIG[brand].db}</span> database. 
              Ensure your date ranges are within the last 24 months for optimal performance.
            </p>
          </div>
        </aside>

        {/* Results Area */}
        <div className="lg:col-span-8 space-y-12">
          {error && (
            <div className="bg-rose-50 border border-rose-200 p-6 rounded-sm flex items-start gap-4 text-rose-800">
              <AlertCircle className="w-5 h-5 mt-0.5" />
              <div>
                <h4 className="text-xs uppercase tracking-widest font-bold mb-1">Execution Error</h4>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Results Table */}
          <div className="bg-white border border-[#141414] overflow-hidden shadow-[8px_8px_0px_0px_rgba(20,20,20,0.05)]">
            <div className="bg-[#141414] text-[#E4E3E0] px-8 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <TableIcon className="w-4 h-4 opacity-50" />
                <span className="text-[10px] uppercase tracking-widest font-bold">Report Results</span>
              </div>
              <span className="text-[9px] uppercase tracking-widest opacity-40">
                {reportData ? `Showing ${reportData.rows.length} records` : 'No data loaded'}
              </span>
            </div>
            
            <div className="overflow-x-auto">
              {!reportData && !isGenerating && (
                <div className="h-96 flex flex-col items-center justify-center bg-[#141414]/5 space-y-4">
                  <div className="p-4 bg-white border border-[#141414]/10 rounded-full">
                    <Search className="w-8 h-8 opacity-10" />
                  </div>
                  <p className="text-xs font-serif italic opacity-40">Configure filters and run the report to see results.</p>
                </div>
              )}

              {isGenerating && (
                <div className="h-96 flex flex-col items-center justify-center bg-[#141414]/5 space-y-4">
                  <RefreshCcw className="w-8 h-8 animate-spin opacity-20" />
                  <p className="text-xs font-serif italic opacity-40">Fetching live data from SQL Server...</p>
                </div>
              )}

              {reportData && reportData.rows.length === 0 && (
                <div className="h-96 flex flex-col items-center justify-center bg-[#141414]/5 space-y-4">
                  <Info className="w-8 h-8 opacity-10" />
                  <p className="text-xs font-serif italic opacity-40">No data found for the selected criteria.</p>
                </div>
              )}

              {reportData && reportData.rows.length > 0 && (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#141414]/10 bg-[#141414]/5">
                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold opacity-50">Group / Item</th>
                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold opacity-50 text-right">Sales</th>
                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold opacity-50 text-right">Cost</th>
                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold opacity-50 text-right">Profit</th>
                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold opacity-50 text-right">Margin %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#141414]/5">
                    {reportData.rows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-[#141414]/5 transition-colors group">
                        <td className="px-6 py-4">
                          <p className="text-sm font-serif italic">{row.group}</p>
                          {row.InvoiceNumber && <span className="text-[9px] uppercase tracking-tighter opacity-30">#{row.InvoiceNumber}</span>}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-mono">{formatValue(row.totalSaleAmount, 'currency')}</td>
                        <td className="px-6 py-4 text-right text-sm font-mono opacity-50">{formatValue(row.totalCostValue, 'currency')}</td>
                        <td className="px-6 py-4 text-right text-sm font-mono">{formatValue(row.totalProfit, 'currency')}</td>
                        <td className={`px-6 py-4 text-right text-sm font-mono ${getMarginColor(row.totalMargin)}`}>
                          {formatValue(row.totalMargin, 'percent')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ label, value, format, loading }: { label: string; value: number; format: string; loading: boolean }) {
  return (
    <div className="bg-white border border-[#141414] p-8 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] group hover:-translate-y-1 transition-transform">
      <p className="text-[10px] uppercase tracking-widest font-bold opacity-40 mb-2">{label}</p>
      {loading ? (
        <div className="h-9 w-24 bg-[#141414]/5 animate-pulse rounded-sm" />
      ) : (
        <p className="text-3xl font-serif italic">
          {format === 'currency' ? 
            new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value) : 
            format === 'percent' ? `${value.toFixed(2)}%` : value}
        </p>
      )}
      <div className="mt-4 h-1 w-full bg-[#141414]/5 rounded-full overflow-hidden">
        <div className={`h-full bg-[#141414] transition-all duration-1000 ${loading ? 'w-1/3 animate-shimmer' : 'w-0 group-hover:w-full'}`} />
      </div>
    </div>
  );
}

function FilterInput({ filter, value, onChange }: { filter: any; value: string; onChange: any }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] uppercase tracking-widest font-bold opacity-70 flex justify-between">
        {filter.label}
        {filter.mandatory && <span className="text-rose-500">*</span>}
      </label>
      
      {filter.type === 'select' ? (
        <div className="relative">
          <select 
            value={value}
            onChange={(e) => onChange(filter.id, e.target.value)}
            className="w-full bg-[#E4E3E0]/30 border border-[#141414]/20 p-3 text-sm appearance-none focus:outline-none focus:border-[#141414] transition-colors"
          >
            <option value="">Select {filter.label}...</option>
            {filter.options?.map((opt: any) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 pointer-events-none" />
        </div>
      ) : (
        <input 
          type={filter.type}
          value={value}
          placeholder={`Enter ${filter.label.toLowerCase()}...`}
          onChange={(e) => onChange(filter.id, e.target.value)}
          className="w-full bg-[#E4E3E0]/30 border border-[#141414]/20 p-3 text-sm focus:outline-none focus:border-[#141414] transition-colors placeholder:opacity-20"
        />
      )}
    </div>
  );
}
