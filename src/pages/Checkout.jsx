import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { CreditCard, Truck, ArrowLeft, CheckCircle2 } from 'lucide-react';

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Checkout() {
  const { cartItems, subtotal, clearCart, loadCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    addressLine: '',
    city: '',
    zipCode: '',
    phone: ''
  });

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const { fullName, addressLine, city, zipCode, phone } = shippingAddress;

    if (!fullName || !addressLine || !city || !zipCode || !phone) {
      toast.warning("Please fill all the shipping details");
      return;
    }

    if (!paymentMethod) {
      toast.warning("Please select a payment method.");
      return;
    }

    setLoading(true);

    if (paymentMethod === 'COD') {
      try {
        const response = await axios.post('http://localhost:8080/api/payment/cod', {}, {
          headers: getHeaders()
        });

        if (response.data.success) {
          toast.success("Order placed successfully with Cash on Delivery!");
          clearCart();
          loadCart();
          navigate('/order-success', {
            state: {
              orderId: response.data.orderId,
              paymentId: response.data.paymentId,
              amount: (subtotal + 250)
            }
          });
        } else {
          toast.error("Failed to place COD order.");
        }
      } catch (err) {
        console.error("COD checkout failed", err);
        toast.error(err.response?.data?.message || "Failed to place COD order. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const sdkLoaded = await loadRazorpayScript();
        if (!sdkLoaded) {
          toast.error("Failed to load payment gateway. Please check your network connection.");
          setLoading(false);
          return;
        }

        // Step 1: Create order on backend
        const orderRes = await axios.post('http://localhost:8080/api/payment/create-order', {}, {
          headers: getHeaders()
        });

        const { orderId, amount, currency } = orderRes.data;

        // Step 2: Open Razorpay checkout options
        const options = {
          key: "rzp_test_TK6J9KYJRj12mg",
          amount: amount,
          currency: currency,
          name: "Nova Nest",
          description: "Bespoke Luxury Accents Checkout",
          order_id: orderId,
          handler: async function (response) {
            setLoading(true);
            try {
              const verifyRes = await axios.post('http://localhost:8080/api/payment/verify', {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              }, {
                headers: getHeaders()
              });

              if (verifyRes.data.success) {
                toast.success("Payment verified successfully!");
                clearCart();
                loadCart();
                navigate('/order-success', {
                  state: {
                    orderId: verifyRes.data.orderId,
                    paymentId: response.razorpay_payment_id,
                    amount: (subtotal + 250)
                  }
                });
              } else {
                toast.error("Verification failed. Please contact customer support.");
              }
            } catch (err) {
              console.error("Signature verification failed", err);
              toast.error(err.response?.data?.message || "Payment verification failed. Please try again.");
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: fullName,
            contact: phone
          },
          theme: {
            color: "#D4AF37"
          },
          modal: {
            ondismiss: function() {
              setLoading(false);
              toast.info("Payment cancelled.");
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          console.error("Payment failed", response.error);
          toast.error("Payment transaction failed: " + response.error.description);
          setLoading(false);
        });
        rzp.open();
      } catch (err) {
        console.error("Checkout process failed", err);
        toast.error(err.response?.data?.message || "Failed to initiate payment. Please try again.");
        setLoading(false);
      }
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="py-32 px-8 text-center bg-decor-ivory min-h-[70vh] flex flex-col justify-center items-center">
        <h2 className="font-serif text-3xl text-decor-black uppercase font-light tracking-widest">No Items to Checkout</h2>
        <div className="w-12 h-[1px] bg-decor-gold/30 my-4" />
        <Link to="/products" className="text-decor-gold hover:underline text-xs uppercase tracking-widest mt-2">
          Return to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-decor-ivory text-decor-charcoal py-20 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
      
      {/* Back to Cart link */}
      <Link to="/cart" className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-widest text-decor-stone hover:text-decor-black transition-colors">
        <ArrowLeft size={12} />
        <span>Return to Shopping Bag</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Checkout Shipping Form */}
        <div className="lg:col-span-2 space-y-8 bg-decor-beige border border-decor-cream rounded-sm p-6 md:p-10 decor-shadow-soft">
          <div className="space-y-2 border-b border-decor-cream pb-4">
            <span className="text-[9px] uppercase tracking-[0.4em] text-decor-gold font-medium block">
              Residential Details
            </span>
            <h2 className="font-serif text-2xl text-decor-black uppercase tracking-wider">
              Shipping Information
            </h2>
          </div>

          <form onSubmit={handlePlaceOrder} className="space-y-6">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-widest text-decor-stone font-medium block">Recipient Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="e.g. Rahul Sharma"
                value={shippingAddress.fullName}
                onChange={handleInputChange}
                className="bg-transparent border-b border-decor-cream focus:border-decor-gold text-xs text-decor-black placeholder-decor-stone/40 focus:outline-none w-full py-1.5 transition-colors tracking-wide"
                required
              />
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-widest text-decor-stone font-medium block">Delivery Address</label>
              <input
                type="text"
                name="addressLine"
                placeholder="Flat / House no, Building, Street"
                value={shippingAddress.addressLine}
                onChange={handleInputChange}
                className="bg-transparent border-b border-decor-cream focus:border-decor-gold text-xs text-decor-black placeholder-decor-stone/40 focus:outline-none w-full py-1.5 transition-colors tracking-wide"
                required
              />
            </div>

            {/* City & Zip Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-widest text-decor-stone font-medium block">City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="e.g. New Delhi"
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  className="bg-transparent border-b border-decor-cream focus:border-decor-gold text-xs text-decor-black placeholder-decor-stone/40 focus:outline-none w-full py-1.5 transition-colors tracking-wide"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-widest text-decor-stone font-medium block">Zip Code / PIN</label>
                <input
                  type="text"
                  name="zipCode"
                  placeholder="e.g. 110001"
                  value={shippingAddress.zipCode}
                  onChange={handleInputChange}
                  className="bg-transparent border-b border-decor-cream focus:border-decor-gold text-xs text-decor-black placeholder-decor-stone/40 focus:outline-none w-full py-1.5 transition-colors tracking-wide"
                  required
                />
              </div>
            </div>

            {/* Contact Phone */}
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-widest text-decor-stone font-medium block">Contact Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="e.g. 9876543210"
                value={shippingAddress.phone}
                onChange={handleInputChange}
                maxLength="12"
                className="bg-transparent border-b border-decor-cream focus:border-decor-gold text-xs text-decor-black placeholder-decor-stone/40 focus:outline-none w-full py-1.5 transition-colors tracking-wide"
                required
              />
            </div>

            {/* Payment Method selection */}
            <div className="pt-4 border-t border-decor-cream space-y-4">
              <h3 className="text-[10px] uppercase tracking-widest text-decor-stone font-medium">Payment Method</h3>
              
              <div className="space-y-4">
                {/* Cash on Delivery option */}
                <div 
                  onClick={() => setPaymentMethod('COD')}
                  className={`flex items-start space-x-4 bg-decor-cream/20 border p-5 rounded-sm cursor-pointer transition-all duration-300 ${
                    paymentMethod === 'COD' ? 'border-decor-gold ring-1 ring-decor-gold/20' : 'border-decor-cream/80 hover:border-decor-stone/40'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="mt-1 text-decor-gold focus:ring-0 cursor-pointer" 
                  />
                  <div className="space-y-1 text-left">
                    <span className="text-xs text-decor-black font-semibold uppercase tracking-wider block">Cash on Delivery</span>
                    <span className="text-[10px] text-decor-stone font-light leading-relaxed block">Pay after your order is delivered.</span>
                  </div>
                </div>

                {/* Razorpay option */}
                <div 
                  onClick={() => setPaymentMethod('RAZORPAY')}
                  className={`flex items-start space-x-4 bg-decor-cream/20 border p-5 rounded-sm cursor-pointer transition-all duration-300 ${
                    paymentMethod === 'RAZORPAY' ? 'border-decor-gold ring-1 ring-decor-gold/20' : 'border-decor-cream/80 hover:border-decor-stone/40'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="RAZORPAY"
                    checked={paymentMethod === 'RAZORPAY'}
                    onChange={() => setPaymentMethod('RAZORPAY')}
                    className="mt-1 text-decor-gold focus:ring-0 cursor-pointer" 
                  />
                  <div className="space-y-1 text-left">
                    <span className="text-xs text-decor-black font-semibold uppercase tracking-wider block">Razorpay</span>
                    <span className="text-[10px] text-decor-stone font-light leading-relaxed block">Pay securely using UPI, Credit Card, Debit Card, Net Banking or Wallet.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-decor-black hover:bg-decor-stone text-decor-ivory text-[10px] tracking-[0.25em] uppercase py-4 mt-6 font-medium transition-colors duration-300 rounded-sm shadow-sm flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <CheckCircle2 size={14} />
                  <span>Place Order</span>
                </>
              )}
            </button>

          </form>
        </div>

        {/* Invoice side panel */}
        <div className="bg-decor-beige border border-decor-cream rounded-sm p-6 md:p-8 space-y-6 h-fit decor-shadow-soft">
          <h3 className="font-serif text-lg text-decor-black uppercase tracking-wider border-b border-decor-cream pb-3">
            In Your Bag
          </h3>

          <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-xs text-decor-stone font-light border-b border-decor-cream/30 pb-3">
                <div className="space-y-0.5 max-w-[70%]">
                  <span className="font-medium text-decor-black line-clamp-1">{item.product?.name}</span>
                  <span className="text-[10px] text-decor-stone/80">Qty: {item.quantity}</span>
                </div>
                <span className="font-serif text-decor-gold font-medium whitespace-nowrap">
                  {inrFormatter.format(item.product?.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-4 text-xs font-light text-decor-stone border-t border-decor-cream pt-4">
            <div className="flex justify-between">
              <span>Bag Subtotal</span>
              <span className="font-medium text-decor-black">{inrFormatter.format(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span className="font-medium text-decor-black">{inrFormatter.format(250)}</span>
            </div>
          </div>

          <div className="border-t border-decor-cream pt-4 flex justify-between items-baseline">
            <span className="font-serif text-sm text-decor-black uppercase tracking-wider">Grand Total</span>
            <span className="font-serif text-lg text-decor-gold">{inrFormatter.format(subtotal + 250)}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
