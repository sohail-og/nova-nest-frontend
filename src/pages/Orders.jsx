import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { Eye, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await API.get('/api/orders');
        setOrders(response.data || []);
      } catch (err) {
        console.error("Failed to load orders API", err.config?.url, err.response?.status);
        toast.error("Failed to fetch order history");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-decor-ivory">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-decor-gold"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="py-32 px-8 text-center bg-decor-ivory min-h-[70vh] flex flex-col justify-center items-center">
        <span className="text-[10px] uppercase tracking-[0.4em] text-decor-gold block mb-3">Order History</span>
        <h2 className="font-serif text-3xl text-decor-black uppercase font-light tracking-widest">No Orders Yet</h2>
        <div className="w-12 h-[1px] bg-decor-gold/30 my-6" />
        <p className="text-decor-stone text-xs uppercase tracking-wider font-light mb-8 max-w-sm leading-relaxed">
          You have not placed any orders yet. Visit our shop directory to add accents to your space.
        </p>
        <Link 
          to="/products"
          className="inline-flex items-center space-x-3 px-6 py-3 bg-decor-black hover:bg-decor-stone text-[10px] tracking-widest uppercase font-medium text-decor-ivory transition-colors duration-300 rounded-sm"
        >
          <span>Explore Design Index</span>
          <ArrowRight size={12} />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-decor-ivory text-decor-charcoal py-20 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-xl mx-auto">
        <span className="text-[10px] uppercase tracking-[0.45em] text-decor-gold font-medium block">
          Client Account
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-light text-decor-black uppercase tracking-wider">
          Order History
        </h1>
        <div className="w-12 h-[1px] bg-decor-gold/30 mx-auto" />
      </div>

      {/* Orders Table/List */}
      <div className="bg-decor-beige border border-decor-cream rounded-sm overflow-hidden decor-shadow-soft">
        <div className="hidden md:grid grid-cols-5 gap-4 px-6 py-4 bg-decor-cream/40 border-b border-decor-cream text-[10px] uppercase tracking-widest text-decor-stone font-semibold">
          <span>Order ID</span>
          <span>Date</span>
          <span>Status</span>
          <span className="text-right">Total Amount</span>
          <span className="text-center">Action</span>
        </div>

        <div className="divide-y divide-decor-cream/60">
          {orders.map((order) => (
            <div key={order.orderId} className="grid grid-cols-1 md:grid-cols-5 gap-4 px-6 py-5 items-center text-xs font-light">
              
              {/* Order ID */}
              <div className="flex md:block justify-between items-center">
                <span className="md:hidden text-[9px] uppercase tracking-widest text-decor-stone font-medium">Order ID</span>
                <span className="font-mono text-decor-black font-medium">{order.orderId}</span>
              </div>

              {/* Date */}
              <div className="flex md:block justify-between items-center">
                <span className="md:hidden text-[9px] uppercase tracking-widest text-decor-stone font-medium">Date</span>
                <span className="text-decor-stone">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                    year: 'numeric', month: 'long', day: 'numeric'
                  }) : 'Processing'}
                </span>
              </div>

              {/* Status */}
              <div className="flex md:block justify-between items-center">
                <span className="md:hidden text-[9px] uppercase tracking-widest text-decor-stone font-medium">Status</span>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-widest font-semibold ${
                  order.status === 'SUCCESS' ? 'bg-green-50 text-green-600 border border-green-200' :
                  order.status === 'FAILED' ? 'bg-red-50 text-red-600 border border-red-200' :
                  'bg-yellow-50 text-yellow-600 border border-yellow-200'
                }`}>
                  {order.status}
                </span>
              </div>

              {/* Total Amount */}
              <div className="flex md:block justify-between items-center md:text-right">
                <span className="md:hidden text-[9px] uppercase tracking-widest text-decor-stone font-medium">Total Amount</span>
                <span className="font-serif text-decor-gold font-medium">{inrFormatter.format(order.totalAmount)}</span>
              </div>

              {/* Action Link */}
              <div className="flex md:block justify-center items-center pt-2 md:pt-0">
                <Link
                  to={`/orders/${order.orderId}`}
                  className="w-full md:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2 border border-decor-cream hover:border-decor-gold rounded-sm text-[9px] uppercase tracking-widest font-medium text-decor-stone hover:text-decor-black transition-colors"
                >
                  <Eye size={12} />
                  <span>Invoice Details</span>
                </Link>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
