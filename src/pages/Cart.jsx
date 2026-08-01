import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

export default function Cart() {
  const { cartItems, loading, updateQuantity, removeFromCart, subtotal } = useCart();

  if (loading && cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-decor-ivory">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-decor-gold"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="py-32 px-8 text-center bg-decor-ivory min-h-[70vh] flex flex-col justify-center items-center">
        <span className="text-[10px] uppercase tracking-[0.4em] text-decor-gold block mb-3">Shopping Bag</span>
        <h2 className="font-serif text-3xl text-decor-black uppercase font-light tracking-widest">Bag is Empty</h2>
        <div className="w-12 h-[1px] bg-decor-gold/30 my-6" />
        <p className="text-decor-stone text-xs uppercase tracking-wider font-light mb-8 max-w-sm leading-relaxed">
          You currently have no luxury accents inside your shopping bag.
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
          Order Summary
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-light text-decor-black uppercase tracking-wider">
          Shopping Bag
        </h1>
        <div className="w-12 h-[1px] bg-decor-gold/30 mx-auto" />
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex space-x-4 md:space-x-6 bg-decor-beige border border-decor-cream rounded-sm p-4 md:p-6 hover:shadow-sm transition-shadow duration-300">
              
              {/* Product Cover image */}
              <div className="w-20 md:w-28 aspect-[4/5] bg-decor-cream rounded-sm overflow-hidden flex-shrink-0">
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

              {/* Item Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-decor-stone block">
                        {item.product?.category?.categoryName || 'Home Accents'}
                      </span>
                      <Link to={`/products/${item.product?.id || item.product?.productId}`} className="hover:text-decor-gold transition-colors">
                        <h3 className="font-serif text-base md:text-lg tracking-wide text-decor-black line-clamp-1">{item.product?.name}</h3>
                      </Link>
                    </div>
                    <span className="text-sm font-serif text-decor-gold whitespace-nowrap">
                      {inrFormatter.format(item.product?.price * item.quantity)}
                    </span>
                  </div>
                  <p className="text-[10px] text-decor-stone font-light">
                    Unit Price: {inrFormatter.format(item.product?.price)}
                  </p>
                </div>

                {/* Edit options */}
                <div className="flex justify-between items-center pt-4">
                  <div className="flex items-center border border-decor-cream rounded-sm">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 text-decor-stone hover:text-decor-black transition-colors"
                    >
                      <Minus size={10} />
                    </button>
                    <span className="px-3 text-xs font-medium text-decor-black">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 text-decor-stone hover:text-decor-black transition-colors"
                    >
                      <Plus size={10} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-decor-stone hover:text-red-500 transition-colors flex items-center space-x-1.5 text-[10px] uppercase tracking-widest"
                  >
                    <Trash2 size={12} />
                    <span className="hidden md:inline">Remove</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Sidebar Invoice Calculation Panel */}
        <div className="bg-decor-beige border border-decor-cream rounded-sm p-6 md:p-8 space-y-6 h-fit decor-shadow-soft">
          <h2 className="font-serif text-xl text-decor-black uppercase tracking-wider border-b border-decor-cream pb-4">
            Order Summary
          </h2>

          <div className="space-y-4 text-xs font-light text-decor-stone">
            <div className="flex justify-between">
              <span>Bag Subtotal</span>
              <span className="font-medium text-decor-black">{inrFormatter.format(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span className="font-medium text-decor-black">{inrFormatter.format(250)}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated GST</span>
              <span className="font-medium text-decor-black">Included</span>
            </div>
          </div>

          <div className="border-t border-decor-cream pt-4 flex justify-between items-baseline">
            <span className="font-serif text-base text-decor-black uppercase tracking-wider">Grand Total</span>
            <span className="font-serif text-xl text-decor-gold">{inrFormatter.format(subtotal + 250)}</span>
          </div>

          <Link
            to="/checkout"
            className="w-full bg-decor-black hover:bg-decor-stone text-decor-ivory text-[10px] tracking-[0.25em] uppercase py-4 font-medium transition-colors duration-300 rounded-sm shadow-sm flex items-center justify-center space-x-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={12} />
          </Link>
        </div>

      </div>
    </div>
  );
}
