
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, Calendar, CreditCard, ChevronRight } from 'lucide-react';

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

export default function OrderSuccess() {
  const location = useLocation();
  const state = location.state || {};
  const { orderId, paymentId, amount } = state;

  // If no orderId is present in state, redirect to products to avoid empty screen
  if (!orderId) {
    return <Navigate to="/products" replace />;
  }

  // Calculate estimated delivery: current date + 4 days formatted elegantly
  const getDeliveryDate = () => {
    const delivery = new Date();
    delivery.setDate(delivery.getDate() + 4);
    return delivery.toLocaleDateString("en-IN", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-decor-ivory text-decor-charcoal py-24 px-6 md:px-12 flex items-center justify-center">
      <div className="max-w-xl w-full bg-decor-beige border border-decor-cream rounded-sm p-8 md:p-12 decor-shadow-soft text-center space-y-8">
        
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-200">
            <CheckCircle className="text-emerald-500 w-8 h-8" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <span className="text-[9px] uppercase tracking-[0.4em] text-decor-gold font-medium block">
            Transaction Complete
          </span>
          <h1 className="font-serif text-3xl md:text-4xl text-decor-black uppercase tracking-wider">
            Payment Successful
          </h1>
          <div className="w-12 h-[1px] bg-decor-gold/30 mx-auto mt-4" />
        </div>

        <p className="text-xs text-decor-stone font-light leading-relaxed max-w-sm mx-auto">
          Thank you for choosing Nova Nest. Your payment has been verified, and your order for luxury bespoke accents has been placed.
        </p>

        {/* Order Details Card */}
        <div className="border border-decor-cream/80 bg-decor-cream/10 rounded-sm p-6 text-left space-y-4 text-xs font-light">
          <div className="flex justify-between items-center pb-3 border-b border-decor-cream/40">
            <span className="text-decor-stone">Order ID</span>
            <span className="font-mono text-decor-black font-semibold tracking-wider select-all">{orderId}</span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-decor-cream/40">
            <span className="text-decor-stone">Payment ID</span>
            <span className="font-mono text-decor-stone select-all">{paymentId || "N/A"}</span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-decor-cream/40">
            <span className="text-decor-stone flex items-center gap-1.5">
              <CreditCard size={12} className="text-decor-gold" />
              <span>Amount Paid</span>
            </span>
            <span className="font-serif text-decor-gold font-semibold text-sm">
              {inrFormatter.format(amount || 0)}
            </span>
          </div>

          <div className="flex justify-between items-start pt-1">
            <span className="text-decor-stone flex items-center gap-1.5 pt-0.5">
              <Calendar size={12} className="text-decor-gold" />
              <span>Estimated Delivery</span>
            </span>
            <span className="text-decor-black font-medium text-right max-w-[60%]">
              {getDeliveryDate()}
            </span>
          </div>
        </div>

        {/* Continue Shopping CTA */}
        <div className="pt-4">
          <Link
            to="/products"
            className="w-full bg-decor-black hover:bg-decor-stone text-decor-ivory text-[10px] tracking-[0.25em] uppercase py-4 font-medium transition-colors duration-300 rounded-sm shadow-sm flex items-center justify-center space-x-2"
          >
            <span>Continue Shopping</span>
            <ChevronRight size={12} />
          </Link>
        </div>

      </div>
    </div>
  );
}
