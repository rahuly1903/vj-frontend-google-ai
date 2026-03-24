export type Brand = 'Jean Dousset' | 'With Clarity' | 'Verigold';

export const BRAND_CONFIG: Record<Brand, { db: string; color: string }> = {
  'Jean Dousset': { db: 'JDSystem', color: '#141414' },
  'With Clarity': { db: 'WCSystem', color: '#0055FF' },
  'Verigold': { db: 'VERIGOLDDB', color: '#D4AF37' },
};

export interface FilterConfig {
  id: string;
  label: string;
  type: 'text' | 'date' | 'select' | 'number';
  options?: { label: string; value: string }[];
  mandatory?: boolean;
  sqlParam: string;
}

export interface ReportConfig {
  id: string;
  title: string;
  description: string;
  sp: string;
  category: string;
  icon: string;
  filters: FilterConfig[];
  kpis: { label: string; key: string; format: 'currency' | 'percent' | 'number' }[];
}

export const REPORTS: ReportConfig[] = [
  {
    id: 'gross-margin',
    title: 'Gross Margin Analysis',
    description: 'Profitability analysis by department, customer, or salesperson.',
    sp: 'GrossMarginReportTEMP',
    category: 'Performance',
    icon: 'TrendingUp',
    filters: [
      { id: 'key', label: 'View By', type: 'select', sqlParam: '@key', mandatory: true, options: [
        { label: 'Department', value: 'department' },
        { label: 'Customer', value: 'customer' },
        { label: 'Salesperson', value: 'salesperson' },
        { label: 'Division', value: 'division' },
        { label: 'Summary', value: 'summary' },
        { label: 'All', value: 'all' },
      ]},
      { id: 'startdate', label: 'Start Date', type: 'date', sqlParam: '@startdate', mandatory: true },
      { id: 'enddate', label: 'End Date', type: 'date', sqlParam: '@enddate', mandatory: true },
      { id: 'customerindex', label: 'Customer', type: 'text', sqlParam: '@customerindex' },
      { id: 'department', label: 'Department', type: 'text', sqlParam: '@department' },
      { id: 'division', label: 'Division', type: 'text', sqlParam: '@division' },
      { id: 'salescode', label: 'Salesperson', type: 'text', sqlParam: '@salescode' },
      { id: 'skuindex', label: 'SKU', type: 'text', sqlParam: '@skuindex' },
      { id: 'styleindex', label: 'Style', type: 'text', sqlParam: '@styleindex' },
      { id: 'Stktype', label: 'Stock Type', type: 'text', sqlParam: '@Stktype' },
      { id: 'tratype', label: 'Transaction Type', type: 'text', sqlParam: '@tratype' },
    ],
    kpis: [
      { label: 'Total Revenue', key: 'revenue', format: 'currency' },
      { label: 'Gross Margin', key: 'margin', format: 'currency' },
      { label: 'Margin %', key: 'margin_pct', format: 'percent' },
    ]
  },
  {
    id: 'inventory-snapshot',
    title: 'Inventory Snapshot',
    description: 'Current stock levels and valuation across locations.',
    sp: 'InventorySummarySP',
    category: 'Inventory',
    icon: 'Box',
    filters: [
      { id: 'key', label: 'Group By', type: 'select', sqlParam: '@key', mandatory: true, options: [
        { label: 'Location', value: 'location' },
        { label: 'Department', value: 'department' },
        { label: 'Category', value: 'category' },
      ]},
      { id: 'department', label: 'Department', type: 'text', sqlParam: '@department' },
      { id: 'division', label: 'Division', type: 'text', sqlParam: '@division' },
      { id: 'itemType', label: 'Item Type', type: 'select', sqlParam: '@ItemType', options: [
        { label: 'SKU', value: 'SKU' },
        { label: 'Style', value: 'Style' },
      ]},
    ],
    kpis: [
      { label: 'Total Qty', key: 'qty', format: 'number' },
      { label: 'Inventory Value', key: 'value', format: 'currency' },
      { label: 'Avg Cost', key: 'avg_cost', format: 'currency' },
    ]
  },
  {
    id: 'open-sales-orders',
    title: 'Open Sales Orders',
    description: 'Pending customer orders awaiting fulfillment.',
    sp: 'OpenSOReport',
    category: 'Orders',
    icon: 'ShoppingCart',
    filters: [
      { id: 'startDate', label: 'From Date', type: 'date', sqlParam: '@startdate' },
      { id: 'endDate', label: 'To Date', type: 'date', sqlParam: '@enddate' },
      { id: 'customer', label: 'Customer', type: 'text', sqlParam: '@customer' },
    ],
    kpis: [
      { label: 'Open Orders', key: 'count', format: 'number' },
      { label: 'Pending Value', key: 'value', format: 'currency' },
    ]
  },
  {
    id: 'open-purchase-orders',
    title: 'Open Purchase Orders',
    description: 'Active procurement orders from vendors.',
    sp: 'rptOpenPO',
    category: 'Orders',
    icon: 'Truck',
    filters: [
      { id: 'startDate', label: 'From Date', type: 'date', sqlParam: '@startdate' },
      { id: 'endDate', label: 'To Date', type: 'date', sqlParam: '@enddate' },
      { id: 'vendor', label: 'Vendor', type: 'text', sqlParam: '@vendor' },
    ],
    kpis: [
      { label: 'Open POs', key: 'count', format: 'number' },
      { label: 'Committed Value', key: 'value', format: 'currency' },
    ]
  }
];

export const NAVIGATION = [
  {
    section: 'Performance',
    items: [
      { id: 'gross-margin', label: 'Gross Margin', icon: 'TrendingUp' },
      { id: 'sales-overview', label: 'Sales Overview', icon: 'BarChart3' },
    ]
  },
  {
    section: 'Inventory',
    items: [
      { id: 'inventory-snapshot', label: 'Inventory Snapshot', icon: 'Box' },
    ]
  },
  {
    section: 'Orders',
    items: [
      { id: 'open-sales-orders', label: 'Open Sales Orders', icon: 'ShoppingCart' },
      { id: 'open-purchase-orders', label: 'Open Purchase Orders', icon: 'Truck' },
    ]
  }
];
