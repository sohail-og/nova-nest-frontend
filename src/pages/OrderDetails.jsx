import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, CheckCircle2, Package, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

export default function OrderDetails() {
  const { id } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/api/orders/${id}`, {
          headers: getHeaders()
        });
        setOrderData(response.data);
      } catch (err) {
        console.error("Failed to load order details API", err.config?.url, err.response?.status);
        toast.error("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-decor-ivory">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-decor-gold"></div>
      </div>
    );
  }

  if (!orderData || !orderData.order) {
    return (
      <div className="min-h-[70vh] bg-decor-ivory flex flex-col justify-center items-center space-y-4">
        <h3 className="font-serif text-2xl text-decor-black uppercase tracking-wider">Order Details Not Found</h3>
        <Link to="/orders" className="text-xs uppercase tracking-widest text-decor-gold hover:underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  const { order, items } = orderData;

  return (
    <div className="min-h-screen bg-decor-ivory text-decor-charcoal py-20 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
      
      {/* Back link */}
      <Link to="/orders" className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-widest text-decor-stone hover:text-decor-black transition-colors">
        <ArrowLeft size={12} />
        <span>Return to Order History</span>
      </Link>

      {/* Invoice Banner */}
      <div className="bg-decor-beige border border-decor-cream rounded-sm p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 decor-shadow-soft">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle2 size={16} />
            <span className="text-[10px] uppercase tracking-widest font-semibold">Confirmed Order</span>
          </div>
          <h1 className="font-serif text-2xl text-decor-black uppercase tracking-wide">
            Invoice: <span className="font-mono">{order.orderId}</span>
          </h1>
          <p className="text-[10px] text-decor-stone font-light">
            Transaction Registered: {new Date(order.createdAt).toLocaleDateString("en-IN", {
              year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-[10px] uppercase tracking-widest text-decor-stone">Status</span>
          <span className="px-3 py-1 bg-green-50 text-green-600 border border-green-200 text-[10px] uppercase tracking-widest font-semibold rounded-full">
            {order.status}
          </span>
        </div>
      </div>

      {/* Split grid details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Purchased Items List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-decor-beige border border-decor-cream rounded-sm p-6 md:p-8 space-y-6">
            <h3 className="font-serif text-lg text-decor-black uppercase tracking-wider border-b border-decor-cream pb-3 flex items-center space-x-2">
              <Package size={16} className="text-decor-gold" />
              <span>Purchased Accents</span>
            </h3>

            <div className="divide-y divide-decor-cream/60">
              {items.map((item) => (
                <div key={item.id} className="flex space-x-4 py-4 first:pt-0 last:pb-0 items-center">
                  <div className="w-16 aspect-[4/5] bg-decor-cream rounded-sm overflow-hidden flex-shrink-0">
                    <img
                      src={item.product?.imageUrl || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=400&auto=format&fit=crop"}
                      alt={item.product?.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=400&auto=format&fit=crop";
                      }}
                    />
                  </div>
                  <div className="flex-1 flex justify-between gap-4">
                    <div className="space-y-0.5">
                      <h4 className="font-serif text-sm tracking-wide text-decor-black">{item.product?.name}</h4>
                      <p className="text-[10px] text-decor-stone font-light">
                        {inrFormatter.format(item.pricePerUnit)} x {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-serif text-decor-gold font-medium">
                      {inrFormatter.format(item.totalPrice)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Invoice Summary Panel */}
        <div className="space-y-6">
          
          {/* Shipping Accents */}
          <div className="bg-decor-beige border border-decor-cream rounded-sm p-6 md:p-8 space-y-4 decor-shadow-soft">
            <h3 className="font-serif text-base text-decor-black uppercase tracking-wider border-b border-decor-cream pb-3 flex items-center space-x-2">
              <MapPin size={14} className="text-decor-gold" />
              <span>Shipping Address</span>
            </h3>
            <div className="text-xs text-decor-stone font-light space-y-1.5">
              <p className="font-medium text-decor-black">{order.user?.username}</p>
              <p>Contact No: {order.user?.phone}</p>
              <p>Email: {order.user?.email}</p>
              <div className="pt-2 border-t border-decor-cream/50 mt-2 text-[10px] uppercase tracking-wider text-decor-stone/85">
                <p>Express Cash on Delivery (COD)</p>
                <p>Status: Dispatched</p>
              </div>
            </div>
          </div>

          {/* Pricing Panel */}
          <div className="bg-decor-beige border border-decor-cream rounded-sm p-6 md:p-8 space-y-4 decor-shadow-soft">
            <h3 className="font-serif text-base text-decor-black uppercase tracking-wider border-b border-decor-cream pb-3">
              Total Invoice Breakdown
            </h3>
            <div className="space-y-3 text-xs font-light text-decor-stone">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-medium text-decor-black">{inrFormatter.format(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-medium text-decor-black">Complementary</span>
              </div>
              <div className="flex justify-between border-t border-decor-cream pt-3 text-sm">
                <span className="font-serif text-decor-black uppercase tracking-wider">Total Paid</span>
                <span className="font-serif text-base text-decor-gold font-semibold">{inrFormatter.format(order.totalAmount)}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
