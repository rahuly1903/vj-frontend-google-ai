'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Filter, Table as TableIcon, Code, Info, ChevronDown, Download, RefreshCw, Terminal, Search } from 'lucide-react';
import { SqlAnalysis } from '@/lib/gemini';
import { format } from 'date-fns';

interface DashboardViewProps {
  analysis: SqlAnalysis;
  originalSql: string;
}

export default function DashboardView({ analysis, originalSql }: DashboardViewProps) {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [generatedSql, setGeneratedSql] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFilterChange = (id: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [id]: value }));
  };

  const generateReport = () => {
    setIsGenerating(true);
    
    // Simulate SQL generation logic
    setTimeout(() => {
      let finalSql = originalSql;
      const conditions: string[] = [];
      
      Object.entries(filterValues).forEach(([id, value]) => {
        if (!value) return;
        const filter = analysis.filters.find(f => f.id === id);
        if (filter) {
          if (filter.type === 'date' || filter.type === 'date-range') {
            conditions.push(`${filter.sql_column} >= '${value}'`);
          } else if (filter.type === 'number') {
            conditions.push(`${filter.sql_column} = ${value}`);
          } else {
            conditions.push(`${filter.sql_column} = '${value}'`);
          }
        }
      });

      if (conditions.length > 0) {
        if (finalSql.toLowerCase().includes('where')) {
          finalSql += ` AND ${conditions.join(' AND ')}`;
        } else {
          finalSql += ` WHERE ${conditions.join(' AND ')}`;
        }
      }

      setGeneratedSql(finalSql);
      setIsGenerating(false);
    }, 800);
  };

  return (
    <div className="space-y-8">
      {/* Summary Section */}
      <section className="bg-white border border-[#141414] p-8 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
        <div className="flex items-start gap-4">
          <div className="bg-[#141414] text-[#E4E3E0] p-2 rounded-sm">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[10px] uppercase tracking-widest font-bold opacity-50 mb-1">Report Summary</h3>
            <p className="text-xl font-serif italic">{analysis.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-[10px] bg-[#141414]/5 px-2 py-1 rounded-sm border border-[#141414]/10">
                TABLE: <span className="font-mono font-bold">{analysis.tableName}</span>
              </span>
              {analysis.filters.map(f => (
                <span key={f.id} className="text-[10px] bg-[#141414]/5 px-2 py-1 rounded-sm border border-[#141414]/10">
                  FILTER: <span className="font-mono font-bold">{f.label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-[#141414] p-6">
            <div className="flex items-center gap-2 mb-6 border-b border-[#141414]/10 pb-4">
              <Filter className="w-4 h-4" />
              <h4 className="text-xs uppercase tracking-widest font-bold">Report Filters</h4>
            </div>

            <div className="space-y-6">
              {analysis.filters.map((filter) => (
                <div key={filter.id} className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold opacity-70 flex justify-between">
                    {filter.label}
                    {filter.mandatory && <span className="text-red-500">*</span>}
                  </label>
                  
                  {filter.type === 'select' ? (
                    <div className="relative">
                      <select 
                        onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                        className="w-full bg-[#E4E3E0]/30 border border-[#141414]/20 p-3 text-sm appearance-none focus:outline-none focus:border-[#141414]"
                      >
                        <option value="">Select {filter.label}...</option>
                        {filter.options?.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 pointer-events-none" />
                    </div>
                  ) : filter.type === 'date' || filter.type === 'date-range' ? (
                    <input 
                      type="date"
                      onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                      className="w-full bg-[#E4E3E0]/30 border border-[#141414]/20 p-3 text-sm focus:outline-none focus:border-[#141414]"
                    />
                  ) : (
                    <input 
                      type={filter.type === 'number' ? 'number' : 'text'}
                      placeholder={`Enter ${filter.label.toLowerCase()}...`}
                      onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                      className="w-full bg-[#E4E3E0]/30 border border-[#141414]/20 p-3 text-sm focus:outline-none focus:border-[#141414]"
                    />
                  )}
                  <p className="text-[9px] opacity-40 italic">{filter.description}</p>
                </div>
              ))}

              <button 
                onClick={generateReport}
                disabled={isGenerating}
                className="w-full bg-[#141414] text-[#E4E3E0] py-4 text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Run Report
              </button>
            </div>
          </div>

          {/* UX Suggestions */}
          <div className="bg-[#141414] text-[#E4E3E0] p-6 rounded-sm">
            <h4 className="text-[10px] uppercase tracking-widest font-bold opacity-50 mb-4">UX Recommendations</h4>
            <ul className="space-y-3">
              {analysis.uxSuggestions.map((sug, i) => (
                <li key={i} className="text-xs flex gap-2">
                  <span className="opacity-30">0{i+1}</span>
                  <span>{sug}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Results Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Data Grid */}
          <div className="bg-white border border-[#141414] overflow-hidden">
            <div className="bg-[#141414] text-[#E4E3E0] px-6 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <TableIcon className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-widest">Results Preview</span>
              </div>
              <button className="text-[9px] uppercase tracking-widest opacity-50 hover:opacity-100 flex items-center gap-1">
                <Download className="w-3 h-3" /> Export CSV
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#141414]">
                    {analysis.columns.map(col => (
                      <th key={col.id} className="p-4 text-[10px] uppercase tracking-widest font-serif italic opacity-50">
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((row) => (
                    <tr key={row} className="border-b border-[#141414]/5 hover:bg-[#141414]/5 transition-colors group">
                      {analysis.columns.map(col => (
                        <td key={col.id} className="p-4 text-sm font-mono group-hover:text-[#141414]">
                          {col.id.includes('date') ? format(new Date(), 'yyyy-MM-dd') : 
                           col.id.includes('id') ? `ID-${Math.floor(Math.random() * 10000)}` :
                           col.id.includes('amount') || col.id.includes('price') ? `$${(Math.random() * 1000).toFixed(2)}` :
                           '---'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-[#141414]/5 text-center">
              <p className="text-[10px] uppercase tracking-widest opacity-40 italic">Showing 5 of 1,248 records (Simulated Data)</p>
            </div>
          </div>

          {/* Generated SQL Output */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              <h4 className="text-xs uppercase tracking-widest font-bold">Backend Handoff (Generated SQL)</h4>
            </div>
            <div className="bg-[#141414] text-[#E4E3E0] p-6 rounded-sm font-mono text-xs overflow-x-auto relative group">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Code className="w-4 h-4" />
              </div>
              <pre className="whitespace-pre-wrap leading-relaxed">
                {generatedSql || '-- Run the report to see the generated SQL query with filters applied'}
              </pre>
            </div>
            <p className="text-[10px] opacity-50 italic">
              Note: This query is dynamically constructed based on frontend inputs and is ready to be sent to the backend API.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
