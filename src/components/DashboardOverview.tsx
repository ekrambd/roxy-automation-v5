import { useState, useMemo } from 'react';
import { 
  ShoppingBag, DollarSign, Package, Users, ArrowRight, 
  Search, Truck, Clock, CheckCircle2, XCircle, RefreshCw, Calendar, Filter
} from 'lucide-react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Product, BookOrder, Customer, ActiveTab } from '../types';

interface DashboardOverviewProps {
  products: Product[];
  orders: BookOrder[];
  customers: Customer[];
  onNavigateTab: (tab: ActiveTab) => void;
}

type DateFilterType = 'today' | 'this_week' | 'this_month' | 'custom' | 'all';

export default function DashboardOverview({ 
  products = [], 
  orders = [], 
  customers = [], 
  onNavigateTab 
}: DashboardOverviewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('all');
  const [customStart, setCustomStart] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().slice(0, 10);
  });
  const [customEnd, setCustomEnd] = useState<string>(() => {
    return new Date().toISOString().slice(0, 10);
  });

  // Calculate active timestamp window
  const timeRange = useMemo(() => {
    const now = new Date();
    if (dateFilter === 'today') {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime();
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
      return { start, end, label: 'Today' };
    }
    if (dateFilter === 'this_week') {
      const start = new Date(now);
      const day = start.getDay();
      const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Monday as start of week
      start.setDate(diff);
      start.setHours(0, 0, 0, 0);
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
      return { start: start.getTime(), end, label: 'This Week' };
    }
    if (dateFilter === 'this_month') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0).getTime();
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).getTime();
      return { start, end, label: 'This Month' };
    }
    if (dateFilter === 'custom') {
      const start = customStart ? new Date(customStart + 'T00:00:00').getTime() : 0;
      const end = customEnd ? new Date(customEnd + 'T23:59:59.999').getTime() : Date.now();
      return { start, end, label: `${customStart || 'Start'} to ${customEnd || 'End'}` };
    }
    return { start: 0, end: Infinity, label: 'All Time' };
  }, [dateFilter, customStart, customEnd]);

  // Filter orders according to active date window
  const filteredByDateOrders = useMemo(() => {
    if (dateFilter === 'all') return orders;
    return orders.filter(o => {
      const t = o.createdAt ? new Date(o.createdAt).getTime() : (o.orderDate ? new Date(o.orderDate).getTime() : 0);
      if (!t) return true;
      return t >= timeRange.start && t <= timeRange.end;
    });
  }, [orders, dateFilter, timeRange]);

  // Compute key metrics on filtered orders
  const totalRevenue = useMemo(() => {
    return filteredByDateOrders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + (Number(o.totalPrice || o.totalAmount) || 0), 0);
  }, [filteredByDateOrders]);

  const pendingOrdersCount = useMemo(() => {
    return filteredByDateOrders.filter(o => o.status === 'Pending').length;
  }, [filteredByDateOrders]);

  const deliveredOrdersCount = useMemo(() => {
    return filteredByDateOrders.filter(o => o.status === 'Delivered').length;
  }, [filteredByDateOrders]);

  const cancelledOrdersCount = useMemo(() => {
    return filteredByDateOrders.filter(o => o.status === 'Cancelled').length;
  }, [filteredByDateOrders]);

  const returnedOrdersCount = useMemo(() => {
    return filteredByDateOrders.filter(o => o.status === 'Return').length;
  }, [filteredByDateOrders]);

  const lowStockProductsCount = useMemo(() => {
    return products.filter(p => (Number(p.stock) || 0) <= 5 || !p.isAvailable).length;
  }, [products]);

  // Generate responsive chart data based on date selection
  const chartData = useMemo(() => {
    const data = [];

    if (dateFilter === 'today') {
      // 6 time buckets across 24h
      const buckets = [
        { label: '00-04h', startH: 0, endH: 4 },
        { label: '04-08h', startH: 4, endH: 8 },
        { label: '08-12h', startH: 8, endH: 12 },
        { label: '12-16h', startH: 12, endH: 16 },
        { label: '16-20h', startH: 16, endH: 20 },
        { label: '20-24h', startH: 20, endH: 24 }
      ];
      const today = new Date();
      for (const b of buckets) {
        const bStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), b.startH, 0, 0).getTime();
        const bEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), b.endH - 1, 59, 59).getTime();
        const bucketOrders = filteredByDateOrders.filter(o => {
          const t = o.createdAt ? new Date(o.createdAt).getTime() : 0;
          return t >= bStart && t <= bEnd;
        });
        const rev = bucketOrders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + (Number(o.totalPrice || o.totalAmount) || 0), 0);
        data.push({ name: b.label, orders: bucketOrders.length, revenue: rev });
      }
      return data;
    }

    if (dateFilter === 'this_month') {
      // 4 weekly buckets
      for (let w = 1; w <= 4; w++) {
        const name = `Week ${w}`;
        const dataStartDay = (w - 1) * 7 + 1;
        const dataEndDay = w === 4 ? 31 : w * 7;
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), dataStartDay, 0, 0, 0).getTime();
        const end = new Date(now.getFullYear(), now.getMonth(), dataEndDay, 23, 59, 59).getTime();
        const weekOrders = filteredByDateOrders.filter(o => {
          const t = o.createdAt ? new Date(o.createdAt).getTime() : 0;
          return t >= start && t <= end;
        });
        const rev = weekOrders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + (Number(o.totalPrice || o.totalAmount) || 0), 0);
        data.push({ name, orders: weekOrders.length, revenue: rev });
      }
      return data;
    }

    // Default & This Week: 7 Days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      
      const dayStart = new Date(d.setHours(0,0,0,0)).getTime();
      const dayEnd = new Date(d.setHours(23,59,59,999)).getTime();
      
      const dayOrders = filteredByDateOrders.filter(o => {
        const orderTime = o.createdAt ? new Date(o.createdAt).getTime() : (o.orderDate ? new Date(o.orderDate).getTime() : 0);
        return orderTime >= dayStart && orderTime <= dayEnd;
      });
      
      const dayRevenue = dayOrders
        .filter(o => o.status !== 'Cancelled')
        .reduce((sum, o) => sum + (Number(o.totalPrice || o.totalAmount) || 0), 0);
        
      data.push({
        name: dateStr,
        orders: dayOrders.length,
        revenue: dayRevenue
      });
    }
    return data;
  }, [filteredByDateOrders, dateFilter]);

  // Filtered orders for table
  const filteredOrders = useMemo(() => {
    return filteredByDateOrders.filter(o => {
      const matchesSearch = 
        !searchTerm || 
        o.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.phone?.includes(searchTerm) ||
        o.id?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [filteredByDateOrders, searchTerm, statusFilter]);

  const getStatusBadge = (status: BookOrder['status']) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="h-3 w-3 mr-1 text-amber-500" />
            Pending
          </span>
        );
      case 'Confirmed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
            <CheckCircle2 className="h-3 w-3 mr-1 text-sky-500" />
            Confirmed
          </span>
        );
      case 'Packaging':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <Package className="h-3 w-3 mr-1 text-purple-500" />
            Packaging
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Truck className="h-3 w-3 mr-1 text-indigo-500" />
            Shipped
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-500" />
            Delivered
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="h-3 w-3 mr-1 text-rose-500" />
            Cancelled
          </span>
        );
      case 'Return':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
            <RefreshCw className="h-3 w-3 mr-1 text-orange-500" />
            Returned
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-50 text-slate-700 border border-slate-200">
            {status || 'Unknown'}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Date Filter Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">Date Range</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {timeRange.label}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Showing metrics for {filteredByDateOrders.length} orders</p>
          </div>
        </div>

        {/* Filter Quick Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'today', label: 'Today' },
            { id: 'this_week', label: 'This Week' },
            { id: 'this_month', label: 'This Month' },
            { id: 'all', label: 'All Time' },
            { id: 'custom', label: 'Custom' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setDateFilter(tab.id as DateFilterType)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                dateFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Custom Date Pickers */}
        {dateFilter === 'custom' && (
          <div className="flex items-center gap-2 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
            <span className="text-xs text-slate-400 font-medium">to</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
        )}
      </div>

      {/* Row 1: Primary Soft Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between transition-all"
        >
          <div className="space-y-1">
            <span className="text-emerald-800 font-bold text-xs block">Total Revenue</span>
            <h3 className="text-2xl font-black text-emerald-950 tracking-tight">৳ {totalRevenue.toLocaleString()}</h3>
            <span className="text-[11px] text-emerald-700/80 font-medium block">
              {filteredByDateOrders.length} orders in period
            </span>
          </div>
          <div className="h-11 w-11 rounded-xl bg-emerald-100/90 text-emerald-700 flex items-center justify-center border border-emerald-200/60 shadow-2xs">
            <DollarSign className="h-5 w-5" />
          </div>
        </motion.div>

        {/* Total Orders */}
        <motion.div 
          whileHover={{ y: -2 }}
          onClick={() => onNavigateTab('orders')}
          className="bg-violet-50/70 border border-violet-200/80 rounded-2xl p-5 shadow-xs cursor-pointer flex items-center justify-between transition-all hover:border-violet-300"
        >
          <div className="space-y-1">
            <span className="text-violet-800 font-bold text-xs block">Total Orders</span>
            <h3 className="text-2xl font-black text-violet-950 tracking-tight">{filteredByDateOrders.length}</h3>
            <span className="text-[11px] text-violet-700/80 font-medium block">
              Pending: {pendingOrdersCount}
            </span>
          </div>
          <div className="h-11 w-11 rounded-xl bg-violet-100/90 text-violet-700 flex items-center justify-center border border-violet-200/60 shadow-2xs">
            <ShoppingBag className="h-5 w-5" />
          </div>
        </motion.div>

        {/* Stock / Products */}
        <motion.div 
          whileHover={{ y: -2 }}
          onClick={() => onNavigateTab('products')}
          className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-5 shadow-xs cursor-pointer flex items-center justify-between transition-all hover:border-indigo-300"
        >
          <div className="space-y-1">
            <span className="text-indigo-800 font-bold text-xs block">Total Products</span>
            <h3 className="text-2xl font-black text-indigo-950 tracking-tight">{products.length}</h3>
            <span className="text-[11px] font-medium block text-indigo-700/80">
              {lowStockProductsCount > 0 ? `Stockout/Low: ${lowStockProductsCount}` : 'All items in stock'}
            </span>
          </div>
          <div className="h-11 w-11 rounded-xl bg-indigo-100/90 text-indigo-700 flex items-center justify-center border border-indigo-200/60 shadow-2xs">
            <Package className="h-5 w-5" />
          </div>
        </motion.div>

        {/* Total Customers */}
        <motion.div 
          whileHover={{ y: -2 }}
          onClick={() => onNavigateTab('customers')}
          className="bg-sky-50/70 border border-sky-200/80 rounded-2xl p-5 shadow-xs cursor-pointer flex items-center justify-between transition-all hover:border-sky-300"
        >
          <div className="space-y-1">
            <span className="text-sky-800 font-bold text-xs block">Total Customers</span>
            <h3 className="text-2xl font-black text-sky-950 tracking-tight">{customers.length}</h3>
            <span className="text-[11px] text-sky-700/80 font-medium block">
              Delivered: {deliveredOrdersCount}
            </span>
          </div>
          <div className="h-11 w-11 rounded-xl bg-sky-100/90 text-sky-700 flex items-center justify-center border border-sky-200/60 shadow-2xs">
            <Users className="h-5 w-5" />
          </div>
        </motion.div>
      </div>

      {/* Row 2: Secondary Soft Status Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Orders */}
        <motion.div 
          whileHover={{ y: -2 }}
          onClick={() => onNavigateTab('orders')}
          className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 shadow-xs cursor-pointer flex items-center justify-between transition-all hover:border-amber-300"
        >
          <div className="space-y-0.5">
            <span className="text-amber-800 font-bold text-xs block">Pending Orders</span>
            <h3 className="text-2xl font-black text-amber-950">{pendingOrdersCount}</h3>
            <span className="text-[10px] text-amber-700 font-medium block">Awaiting confirmation</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center border border-amber-200/60">
            <Clock className="h-5 w-5" />
          </div>
        </motion.div>

        {/* Delivered Orders */}
        <motion.div 
          whileHover={{ y: -2 }}
          onClick={() => onNavigateTab('orders')}
          className="bg-teal-50/70 border border-teal-200/80 rounded-2xl p-4 shadow-xs cursor-pointer flex items-center justify-between transition-all hover:border-teal-300"
        >
          <div className="space-y-0.5">
            <span className="text-teal-800 font-bold text-xs block">Delivered Orders</span>
            <h3 className="text-2xl font-black text-teal-950">{deliveredOrdersCount}</h3>
            <span className="text-[10px] text-teal-700 font-medium block">Completed delivery</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center border border-teal-200/60">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </motion.div>

        {/* Cancelled Orders */}
        <motion.div 
          whileHover={{ y: -2 }}
          onClick={() => onNavigateTab('orders')}
          className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-4 shadow-xs cursor-pointer flex items-center justify-between transition-all hover:border-rose-300"
        >
          <div className="space-y-0.5">
            <span className="text-rose-800 font-bold text-xs block">Cancelled Orders</span>
            <h3 className="text-2xl font-black text-rose-950">{cancelledOrdersCount}</h3>
            <span className="text-[10px] text-rose-700 font-medium block">Cancelled or rejected</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center border border-rose-200/60">
            <XCircle className="h-5 w-5" />
          </div>
        </motion.div>

        {/* Returned Orders */}
        <motion.div 
          whileHover={{ y: -2 }}
          onClick={() => onNavigateTab('orders')}
          className="bg-orange-50/70 border border-orange-200/80 rounded-2xl p-4 shadow-xs cursor-pointer flex items-center justify-between transition-all hover:border-orange-300"
        >
          <div className="space-y-0.5">
            <span className="text-orange-800 font-bold text-xs block">Returned Orders</span>
            <h3 className="text-2xl font-black text-orange-950">{returnedOrdersCount}</h3>
            <span className="text-[10px] text-orange-700 font-medium block">Courier parcel return</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center border border-orange-200/60">
            <RefreshCw className="h-5 w-5" />
          </div>
        </motion.div>
      </div>

      {/* Row 3: Soft Clean Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Orders Trend */}
        <div className="w-full min-w-0 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Orders Trend</h3>
              <p className="text-[11px] text-slate-400">Order count breakdown for {timeRange.label}</p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              {filteredByDateOrders.length} Orders
            </span>
          </div>
          <div className="h-60 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={200}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }} />
                <Bar dataKey="orders" name="Orders" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="w-full min-w-0 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Revenue Trend</h3>
              <p className="text-[11px] text-slate-400">Gross sales breakdown for {timeRange.label}</p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              ৳ {totalRevenue.toLocaleString()}
            </span>
          </div>
          <div className="h-60 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={200}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSoftRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `৳${val}`} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }} formatter={(val) => [`৳${val}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#059669" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSoftRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 4: Recent Orders in Period */}
      <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Orders in Selected Period</h3>
            <p className="text-[11px] text-slate-500">Filtered by {timeRange.label} ({filteredOrders.length} matching)</p>
          </div>
          
          <button 
            onClick={() => onNavigateTab('orders')}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-bold inline-flex items-center group cursor-pointer"
          >
            Manage all in Orders Tab
            <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Quick Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by order ID, name or phone..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Packaging">Packaging</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Return">Returned</option>
          </select>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-y border-slate-100 text-[11px]">
                <th className="py-2.5 px-3 font-bold">Order ID & Date</th>
                <th className="py-2.5 px-3 font-bold">Customer & Mobile</th>
                <th className="py-2.5 px-3 font-bold">Product</th>
                <th className="py-2.5 px-3 font-bold">Total</th>
                <th className="py-2.5 px-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.slice(0, 8).map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 font-mono block">{ord.id}</span>
                    <span className="text-[10px] text-slate-500 block">
                      {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 block">{ord.customerName}</span>
                    <a href={`tel:${ord.phone}`} className="text-[10px] font-mono text-indigo-600 hover:underline block">{ord.phone}</a>
                  </td>
                  <td className="py-3 px-3 max-w-[200px] truncate">
                    <span className="text-slate-800 font-medium block truncate" title={ord.productTitle || ord.productName}>
                      {ord.productTitle || ord.productName || 'Order Items'}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Qty: {ord.quantity || 1}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-emerald-700">৳ {ord.totalPrice || ord.totalAmount}</span>
                    <span className="text-[10px] text-slate-500 block">{ord.paymentMethod || 'COD'}</span>
                  </td>
                  <td className="py-3 px-3">
                    {getStatusBadge(ord.status)}
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                    No orders match your filter criteria in this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
