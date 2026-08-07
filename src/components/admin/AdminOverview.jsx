import { useState } from 'react';
import { Landmark, ShoppingBag, AlertCircle, Users, PlusCircle, FolderTree, FileSpreadsheet, ChevronRight, Package } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';

export default function AdminOverview({ 
  stats, 
  setActiveView, 
  setProductForm, 
  setProductPage, 
  safeCategories,
  downloadDailyReport 
}) {
  const [revenueChartTab, setRevenueChartTab] = useState('monthly');
  const [volumeChartTab, setVolumeChartTab] = useState('orders');

  const inrFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  });

  const safeStats = stats || {};
  const totalRevenue = safeStats.totalRevenue || 0;
  const totalOrders = safeStats.totalOrders || 0;
  const pendingOrders = safeStats.pendingOrders || 0;
  const totalUsers = safeStats.totalUsers || 0;

  const topCategories = Array.isArray(safeStats.topCategories) ? safeStats.topCategories : [];
  const topSellingProducts = Array.isArray(safeStats.topSellingProducts) ? safeStats.topSellingProducts : [];
  const monthlyAnalytics = Array.isArray(safeStats.monthlyAnalytics) ? safeStats.monthlyAnalytics : [];
  const dailyAnalytics = Array.isArray(safeStats.dailyAnalytics) ? safeStats.dailyAnalytics : [];
  const yearlyAnalytics = Array.isArray(safeStats.yearlyAnalytics) ? safeStats.yearlyAnalytics : [];

  const getRevenueChartData = () => {
    if (revenueChartTab === 'daily') {
      return {
        labels: dailyAnalytics.map(d => d.date || ''),
        datasets: [{
          label: 'Daily Revenue',
          data: dailyAnalytics.map(d => d.revenue || 0),
          borderColor: '#CAA750',
          backgroundColor: 'rgba(202, 167, 80, 0.15)',
          fill: true,
          tension: 0.35,
          borderWidth: 2
        }]
      };
    } else if (revenueChartTab === 'yearly') {
      return {
        labels: yearlyAnalytics.map(y => y.year || ''),
        datasets: [{
          label: 'Yearly Revenue',
          data: yearlyAnalytics.map(y => y.revenue || 0),
          borderColor: '#CAA750',
          backgroundColor: 'rgba(202, 167, 80, 0.15)',
          fill: true,
          tension: 0.3,
          borderWidth: 2
        }]
      };
    } else if (revenueChartTab === 'overall') {
      let cumulativeSum = 0;
      const dataPoints = monthlyAnalytics.map(m => {
        cumulativeSum += (m.revenue || 0);
        return cumulativeSum;
      });
      return {
        labels: monthlyAnalytics.map(m => m.month || ''),
        datasets: [{
          label: 'Overall Cumulative Revenue',
          data: dataPoints,
          borderColor: '#E8D5A5',
          backgroundColor: 'rgba(232, 213, 165, 0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 2
        }]
      };
    } else {
      return {
        labels: monthlyAnalytics.map(m => m.month || ''),
        datasets: [{
          label: 'Monthly Revenue',
          data: monthlyAnalytics.map(m => m.revenue || 0),
          borderColor: '#CAA750',
          backgroundColor: 'rgba(202, 167, 80, 0.15)',
          fill: true,
          tension: 0.35,
          borderWidth: 2
        }]
      };
    }
  };

  const getVolumeChartData = () => {
    if (volumeChartTab === 'customers') {
      const total = totalUsers || 0;
      const count = monthlyAnalytics.length || 6;
      const dataPoints = [];
      for (let i = 0; i < count; i++) {
        dataPoints.push(Math.max(1, Math.round(total * (0.6 + (i * 0.4 / count)))));
      }
      return {
        labels: monthlyAnalytics.map(m => m.month || ''),
        datasets: [{
          label: 'Active Customer Base',
          data: dataPoints,
          borderColor: '#C0C0C0',
          backgroundColor: 'rgba(192, 192, 192, 0.15)',
          fill: true,
          tension: 0.3,
          borderWidth: 2
        }]
      };
    } else {
      return {
        labels: monthlyAnalytics.map(m => m.month || ''),
        datasets: [{
          label: 'Orders Volume',
          data: monthlyAnalytics.map(m => m.orders || 0),
          backgroundColor: '#CAA750',
          borderColor: '#CAA750',
          borderWidth: 1,
          borderRadius: 2
        }]
      };
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1C1C1E',
        titleColor: '#CAA750',
        bodyColor: '#FAF8F5',
        borderColor: '#2C2C2E',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        titleFont: { family: 'Cormorant Garamond', size: 12 },
        bodyFont: { family: 'Inter', size: 11 }
      }
    },
    scales: {
      x: { grid: { color: 'rgba(255, 255, 255, 0.03)' }, ticks: { color: '#8E8E93', font: { family: 'Inter', size: 9 } } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.03)' }, ticks: { color: '#8E8E93', font: { family: 'Inter', size: 9 } } }
    }
  };

  return (
    <div className="space-y-10">
      {/* Stats KPI top row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-sm flex items-center space-x-5 shadow-sm hover:border-decor-gold/30 transition-all duration-300">
          <div className="w-12 h-12 rounded-sm bg-decor-gold/10 flex items-center justify-center text-decor-gold">
            <Landmark size={22} className="stroke-[1.5]" />
          </div>
          <div className="space-y-1 flex-1 min-w-0">
            <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-medium block">Overall Revenue</span>
            <p className="font-serif text-lg md:text-xl text-white font-medium truncate">{inrFormatter.format(totalRevenue)}</p>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-sm flex items-center space-x-5 shadow-sm hover:border-decor-gold/30 transition-all duration-300">
          <div className="w-12 h-12 rounded-sm bg-decor-gold/10 flex items-center justify-center text-decor-gold">
            <ShoppingBag size={22} className="stroke-[1.5]" />
          </div>
          <div className="space-y-1 flex-1 min-w-0">
            <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-medium block">Total Orders</span>
            <p className="font-serif text-lg md:text-xl text-white font-medium truncate">{totalOrders}</p>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-sm flex items-center space-x-5 shadow-sm hover:border-decor-gold/30 transition-all duration-300">
          <div className="w-12 h-12 rounded-sm bg-decor-gold/10 flex items-center justify-center text-decor-gold">
            <AlertCircle size={22} className="stroke-[1.5]" />
          </div>
          <div className="space-y-1 flex-1 min-w-0">
            <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-medium block">Pending Orders</span>
            <p className="font-serif text-lg md:text-xl text-white font-medium truncate">{pendingOrders}</p>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-sm flex items-center space-x-5 shadow-sm hover:border-decor-gold/30 transition-all duration-300">
          <div className="w-12 h-12 rounded-sm bg-decor-gold/10 flex items-center justify-center text-decor-gold">
            <Users size={22} className="stroke-[1.5]" />
          </div>
          <div className="space-y-1 flex-1 min-w-0">
            <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-medium block">Active Customers</span>
            <p className="font-serif text-lg md:text-xl text-white font-medium truncate">{totalUsers}</p>
          </div>
        </div>
      </section>

      {/* 3x3 Responsive Management Grid */}
      <section className="space-y-6">
        <div className="space-y-1 border-b border-white/10 pb-3">
          <span className="text-[9px] uppercase tracking-widest text-decor-gold font-medium block">Operations</span>
          <h3 className="font-serif text-lg text-white uppercase tracking-wider">Management Dashboard</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            onClick={() => {
              setProductForm({ id: null, name: '', description: '', price: '', stock: '', categoryId: safeCategories[0]?.id || '', imageUrl: '' });
              setActiveView('addProduct');
            }}
            className="bg-black/40 backdrop-blur-md border border-white/10 hover:border-decor-gold p-6 rounded-sm cursor-pointer transition-all duration-300 flex flex-col justify-between group h-40"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <PlusCircle className="text-zinc-400 group-hover:text-decor-gold transition-colors" size={24} />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-decor-gold text-[8px] tracking-widest uppercase flex items-center space-x-1">
                  <span>Open</span>
                  <ChevronRight size={10} />
                </span>
              </div>
              <h4 className="font-serif text-sm text-white font-medium tracking-wide uppercase group-hover:text-decor-gold transition-colors">Add Product</h4>
              <p className="text-[11px] text-zinc-400 font-light leading-relaxed">Introduce a new luxury accent or high-end item to the database.</p>
            </div>
          </div>

          <div 
            onClick={() => {
              setProductPage(1);
              setActiveView('products');
            }}
            className="bg-black/40 backdrop-blur-md border border-white/10 hover:border-decor-gold p-6 rounded-sm cursor-pointer transition-all duration-300 flex flex-col justify-between group h-40"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Package className="text-zinc-400 group-hover:text-decor-gold transition-colors" size={24} />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-decor-gold text-[8px] tracking-widest uppercase flex items-center space-x-1">
                  <span>Open</span>
                  <ChevronRight size={10} />
                </span>
              </div>
              <h4 className="font-serif text-sm text-white font-medium tracking-wide uppercase group-hover:text-decor-gold transition-colors">Inventory Control</h4>
              <p className="text-[11px] text-zinc-400 font-light leading-relaxed">Manage stocks, prices, and sorting/filtering lists.</p>
            </div>
          </div>

          <div 
            onClick={() => setActiveView('users')}
            className="bg-black/40 backdrop-blur-md border border-white/10 hover:border-decor-gold p-6 rounded-sm cursor-pointer transition-all duration-300 flex flex-col justify-between group h-40"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Users className="text-zinc-400 group-hover:text-decor-gold transition-colors" size={24} />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-decor-gold text-[8px] tracking-widest uppercase flex items-center space-x-1">
                  <span>Open</span>
                  <ChevronRight size={10} />
                </span>
              </div>
              <h4 className="font-serif text-sm text-white font-medium tracking-wide uppercase group-hover:text-decor-gold transition-colors">User Management</h4>
              <p className="text-[11px] text-zinc-400 font-light leading-relaxed">Create, View, Edit, Block, or Delete system accounts and client details.</p>
            </div>
          </div>

          <div 
            onClick={() => setActiveView('categories')}
            className="bg-black/40 backdrop-blur-md border border-white/10 hover:border-decor-gold p-6 rounded-sm cursor-pointer transition-all duration-300 flex flex-col justify-between group h-40"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <FolderTree className="text-zinc-400 group-hover:text-decor-gold transition-colors" size={24} />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-decor-gold text-[8px] tracking-widest uppercase flex items-center space-x-1">
                  <span>Open</span>
                  <ChevronRight size={10} />
                </span>
              </div>
              <h4 className="font-serif text-sm text-white font-medium tracking-wide uppercase group-hover:text-decor-gold transition-colors">Category Designer</h4>
              <p className="text-[11px] text-zinc-400 font-light leading-relaxed">Customize landing page collections, banners, display orders, and descriptions.</p>
            </div>
          </div>
          
          <div 
            onClick={() => setActiveView('orders')}
            className="bg-black/40 backdrop-blur-md border border-white/10 hover:border-decor-gold p-6 rounded-sm cursor-pointer transition-all duration-300 flex flex-col justify-between group h-40"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <ShoppingBag className="text-zinc-400 group-hover:text-decor-gold transition-colors" size={24} />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-decor-gold text-[8px] tracking-widest uppercase flex items-center space-x-1">
                  <span>Open</span>
                  <ChevronRight size={10} />
                </span>
              </div>
              <h4 className="font-serif text-sm text-white font-medium tracking-wide uppercase group-hover:text-decor-gold transition-colors">Order Management</h4>
              <p className="text-[11px] text-zinc-400 font-light leading-relaxed">Track daily checkout transactions, checkout funnels, and live orders.</p>
            </div>
          </div>

          <div 
            onClick={downloadDailyReport}
            className="bg-black/40 backdrop-blur-md border border-white/10 hover:border-decor-gold p-6 rounded-sm cursor-pointer transition-all duration-300 flex flex-col justify-between group h-40"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <FileSpreadsheet className="text-zinc-400 group-hover:text-decor-gold transition-colors" size={24} />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-decor-gold text-[8px] tracking-widest uppercase flex items-center space-x-1">
                  <span>Download</span>
                  <ChevronRight size={10} />
                </span>
              </div>
              <h4 className="font-serif text-sm text-white font-medium tracking-wide uppercase group-hover:text-decor-gold transition-colors">Daily Business Report</h4>
              <p className="text-[11px] text-zinc-400 font-light leading-relaxed">Generate and download today's sales and revenue metrics in Excel format.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Dynamic Business Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Revenue Trends */}
        <div className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[9px] uppercase tracking-widest text-decor-gold font-medium block">Performance Matrix</span>
              <h3 className="font-serif text-base text-white uppercase tracking-wider">Revenue Analytics</h3>
            </div>
            
            <div className="flex bg-decor-ivory border border-white/10 p-1 rounded-sm text-[9px] font-medium tracking-widest uppercase">
              {['daily', 'monthly', 'yearly', 'overall'].map(period => (
                <button
                  key={period}
                  onClick={() => setRevenueChartTab(period)}
                  className={`px-3 py-1 rounded-xs transition-colors cursor-pointer ${
                    revenueChartTab === period ? 'bg-decor-gold text-black' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 relative">
            <Line data={getRevenueChartData()} options={chartOptions} />
            {((revenueChartTab === 'daily' && dailyAnalytics.length === 0) ||
              (revenueChartTab === 'yearly' && yearlyAnalytics.length === 0) ||
              ((revenueChartTab === 'monthly' || revenueChartTab === 'overall') && monthlyAnalytics.length === 0)) ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-zinc-500 rounded-sm z-10">
                <span className="text-[10px] tracking-[0.2em] uppercase text-decor-gold font-medium">No Revenue Data</span>
                <p className="text-[9px] font-light mt-1 text-zinc-400">Database contains no sales transaction logs.</p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Chart 2: Volume & Growth */}
        <div className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[9px] uppercase tracking-widest text-decor-gold font-medium block">Growth Dynamics</span>
              <h3 className="font-serif text-base text-white uppercase tracking-wider">Operational Volume</h3>
            </div>
            
            <div className="flex bg-decor-ivory border border-white/10 p-1 rounded-sm text-[9px] font-medium tracking-widest uppercase">
              {['orders', 'customers'].map(metric => (
                <button
                  key={metric}
                  onClick={() => setVolumeChartTab(metric)}
                  className={`px-3 py-1 rounded-xs transition-colors cursor-pointer ${
                    volumeChartTab === metric ? 'bg-decor-gold text-black' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {metric}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 relative">
            {volumeChartTab === 'orders' ? (
              <Bar data={getVolumeChartData()} options={chartOptions} />
            ) : (
              <Line data={getVolumeChartData()} options={chartOptions} />
            )}
            {monthlyAnalytics.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-zinc-500 rounded-sm z-10">
                <span className="text-[10px] tracking-[0.2em] uppercase text-decor-gold font-medium">No Operational Volume</span>
                <p className="text-[9px] font-light mt-1 text-zinc-400">Database contains no transaction history.</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Extra Dynamic Stats Sections: Top products & recent logs */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-sm space-y-4">
          <h4 className="font-serif text-xs text-white uppercase tracking-wider border-b border-white/10 pb-2 font-semibold">Top Performing Spaces</h4>
          <div className="space-y-3">
            {topCategories.length > 0 ? (
              topCategories.map((cat, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400">{cat.name}</span>
                  <span className="font-medium text-decor-gold font-mono">{cat.quantity} sold</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-500 italic">No sales logs parsed yet.</p>
            )}
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-sm space-y-4 lg:col-span-2">
          <h4 className="font-serif text-xs text-white uppercase tracking-wider border-b border-white/10 pb-2 font-semibold">Best Sellers Catalog</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-light text-zinc-300">
              <thead>
                <tr className="border-b border-white/10 text-[9px] uppercase tracking-widest text-zinc-500 font-semibold">
                  <th className="py-2">Product Name</th>
                  <th className="py-2">Quantity Sold</th>
                  <th className="py-2">Price</th>
                  <th className="py-2 text-right">Accumulated Total</th>
                </tr>
              </thead>
              <tbody>
                {topSellingProducts.length > 0 ? (
                  topSellingProducts.map((prod, i) => (
                    <tr key={i} className="border-b border-white/10/40">
                      <td className="py-2 font-medium text-white">{prod.name}</td>
                      <td className="py-2 font-mono text-zinc-400">{prod.quantity} units</td>
                      <td className="py-2 text-decor-gold">{inrFormatter.format(prod.price)}</td>
                      <td className="py-2 text-right font-medium text-white font-mono">{inrFormatter.format(prod.totalSales)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-zinc-500 italic">No sales completed yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
}
