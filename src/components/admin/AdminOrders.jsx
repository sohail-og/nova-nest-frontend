

export default function AdminOrders({ stats }) {
  const inrFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  });

  const safeStats = stats || {};
  const todayRevenue = safeStats.todayRevenue || 0;
  const totalProducts = safeStats.totalProducts || 0;
  // totalOrders removed
  // These are derived from recent orders if available in stats
  const recentOrders = Array.isArray(safeStats.recentOrders) ? safeStats.recentOrders : [];
  
  const deliveredOrders = recentOrders.filter(o => o.status === 'SUCCESS').length;
  const cancelledOrders = recentOrders.filter(o => o.status === 'FAILED').length;

  return (
    <div className="bg-black/40 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-sm space-y-8 max-w-4xl mx-auto">
      <div className="border-b border-white/10 pb-4 text-center">
        <span className="text-[9px] uppercase tracking-[0.3em] text-decor-gold font-medium block">Live Log Feed</span>
        <h3 className="font-serif text-2xl text-white uppercase tracking-wider">Daily Trading Flow</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h4 className="font-serif text-sm uppercase tracking-wider text-white font-medium border-b border-white/10 pb-1.5">Today's Transactions</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-decor-ivory p-4 rounded-sm border border-white/10">
              <span className="text-[8px] uppercase tracking-widest text-decor-gold">Today's Revenue</span>
              <p className="text-base font-serif font-medium text-white mt-1">{inrFormatter.format(todayRevenue)}</p>
            </div>
            <div className="bg-decor-ivory p-4 rounded-sm border border-white/10">
              <span className="text-[8px] uppercase tracking-widest text-zinc-400">Total Products</span>
              <p className="text-base font-serif font-medium text-white mt-1">{totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-serif text-sm uppercase tracking-wider text-white font-medium border-b border-white/10 pb-1.5">Checkout Funnels</h4>
          <div className="space-y-3 pt-1">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-400">Successful Orders</span>
              <span className="font-semibold text-green-500 font-mono">{deliveredOrders}</span>
            </div>
            <div className="w-full bg-decor-ivory h-1.5 rounded-full overflow-hidden">
              <div 
                style={{ width: `${recentOrders.length > 0 ? (deliveredOrders / recentOrders.length) * 100 : 0}%` }}
                className="bg-green-500 h-full rounded-full transition-all duration-500" 
              />
            </div>

            <div className="flex justify-between text-xs pt-1">
              <span className="text-zinc-400">Failed / Cancelled</span>
              <span className="font-semibold text-red-500 font-mono">{cancelledOrders}</span>
            </div>
            <div className="w-full bg-decor-ivory h-1.5 rounded-full overflow-hidden">
              <div 
                style={{ width: `${recentOrders.length > 0 ? (cancelledOrders / recentOrders.length) * 100 : 0}%` }}
                className="bg-red-500 h-full rounded-full transition-all duration-500" 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-white/10">
        <h4 className="font-serif text-xs uppercase tracking-wider text-white font-semibold">Live Order Flow</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-light text-zinc-300">
            <thead>
              <tr className="border-b border-white/10 text-[9px] uppercase tracking-widest text-zinc-500 font-semibold">
                <th className="py-2">Order ID</th>
                <th className="py-2">Client Name</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Method</th>
                <th className="py-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order, i) => (
                  <tr key={i} className="border-b border-white/10/40 text-zinc-400 hover:bg-[#1C1C1E]/50 transition-colors">
                    <td className="py-2.5 font-mono text-[10px] text-white font-medium">{order.orderId}</td>
                    <td className="py-2.5">{order.user?.username || order.user?.email || 'Client'}</td>
                    <td className="py-2.5 text-decor-gold font-medium font-mono">{inrFormatter.format(order.totalAmount)}</td>
                    <td className="py-2.5 font-mono text-[9px] uppercase">{order.paymentMethod || 'Credit Card'}</td>
                    <td className="py-2.5 text-right">
                      <span className={`px-2 py-0.5 rounded-sm text-[8px] font-bold ${
                        order.status === 'SUCCESS' ? 'text-green-500 bg-green-950/20' : order.status === 'FAILED' ? 'text-red-500 bg-red-950/20' : 'text-orange-500 bg-orange-950/20'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-600 italic">No daily logs parsed.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
