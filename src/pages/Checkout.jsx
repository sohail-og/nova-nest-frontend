import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { ArrowLeft, CheckCircle2, Edit, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import AddressModal from '../components/AddressModal';

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
  
  // Multi-step state: 'address' or 'payment'
  const [checkoutStep, setCheckoutStep] = useState('address');

  // Address
  const [activeAddress, setActiveAddress] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await API.get('/api/home');
        const data = response.data;
        if (data) {
          if (data.address && data.address.houseNo) {
            setActiveAddress({
              fullName: data.address.fullName || data.username || '',
              phone: data.phone || '',
              email: data.email || '',
              houseNo: data.address.houseNo,
              street: data.address.street,
              area: data.address.area,
              city: data.address.city,
              district: data.address.district,
              state: data.address.state,
              country: data.address.country,
              pincode: data.address.pincode,
              saveAsDefault: true
            });
          } else {
            // Prep empty address with user info
            setActiveAddress({
              fullName: data.username || '',
              phone: data.phone || '',
              email: data.email || '',
              houseNo: '', street: '', area: '', city: '', district: '', state: '', country: '', pincode: '',
              saveAsDefault: true
            });
          }
        }
      } catch (err) {
        console.error("Failed to load user profile for prefilling checkout", err);
      }
    };
    fetchProfileData();
  }, []);

  const handleSaveAddress = async (addressData) => {
    setActiveAddress(addressData);
    setIsAddressModalOpen(false);
    
    // If user chose to save as default, update profile address
    if (addressData.saveAsDefault) {
      try {
        await API.put('/api/user/profile/address', addressData);
        toast.success("Address saved to profile!");
      } catch (err) {
        console.error("Failed to save default address", err);
      }
    } else {
      toast.success("Delivery address updated for this order.");
    }
  };

  const handlePlaceOrder = async (e) => {
    if (e) e.preventDefault();
    
    const requiredFields = [
      'fullName', 'phone', 'email', 'houseNo', 'street', 
      'area', 'city', 'district', 'state', 'country', 'pincode'
    ];
    for (let field of requiredFields) {
      if (!activeAddress || !activeAddress[field]) {
        toast.error(`Please provide ${field} before placing your order.`);
        setCheckoutStep('address');
        return;
      }
    }

    const payload = { address: activeAddress };
    console.log("Selected Address:", activeAddress);
    console.log("Payment Payload:", payload);

    setLoading(true);

    if (paymentMethod === 'COD') {
      try {
        const response = await API.post('/api/payment/cod', payload);
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
          toast.error("Failed to place Cash on Delivery order.");
        }
      } catch (err) {
        console.error("COD place order failed", err);
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

        const orderRes = await API.post('/api/payment/create-order', {});
        const { orderId, amount, currency } = orderRes.data;

        const options = {
          key: "rzp_test_TK6J9KYJRj12mg",
          amount: amount,
          currency: currency,
          name: "NovaNest",
          description: "Bespoke Luxury Accents Checkout",
          order_id: orderId,
          handler: async function (response) {
            setLoading(true);
            try {
              const verifyRes = await API.post('/api/payment/verify', {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                address: activeAddress
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
                toast.error("Payment verification failed. Please contact support.");
              }
            } catch (err) {
              console.error("Signature verification failed", err);
              toast.error(err.response?.data?.message || "Payment verification failed. Please try again.");
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: activeAddress.fullName,
            contact: activeAddress.phone,
            email: activeAddress.email
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

  const isAddressComplete = activeAddress && activeAddress.fullName && activeAddress.phone && activeAddress.email && activeAddress.houseNo && activeAddress.street && activeAddress.area && activeAddress.city && activeAddress.district && activeAddress.state && activeAddress.country && activeAddress.pincode;

  return (
    <div className="min-h-screen bg-decor-ivory text-decor-charcoal py-16 px-6 md:px-12 max-w-7xl mx-auto space-y-10">
      
      {/* Progress Steps Indicators */}
      <div className="max-w-3xl mx-auto py-4 border-b border-decor-cream/40 mb-6">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-semibold text-decor-stone">
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle2 size={14} />
            <span>Bag</span>
          </div>
          <div className="flex-1 h-[1px] bg-decor-cream mx-4" />
          
          <div className={`flex items-center space-x-2 ${checkoutStep === 'address' ? 'text-decor-gold border-b-2 border-decor-gold pb-1' : 'text-green-600'}`}>
            {checkoutStep === 'payment' ? <CheckCircle2 size={14} /> : <span className="w-4 h-4 rounded-full border border-decor-gold flex items-center justify-center text-[9px]">2</span>}
            <span>Address</span>
          </div>
          <div className="flex-1 h-[1px] bg-decor-cream mx-4" />

          <div className={`flex items-center space-x-2 ${checkoutStep === 'payment' ? 'text-decor-gold border-b-2 border-decor-gold pb-1' : 'text-decor-stone/40'}`}>
            <span className="w-4 h-4 rounded-full border border-decor-cream flex items-center justify-center text-[9px]">3</span>
            <span>Payment</span>
          </div>
          <div className="flex-1 h-[1px] bg-decor-cream mx-4" />

          <div className="flex items-center space-x-2 text-decor-stone/40">
            <span className="w-4 h-4 rounded-full border border-decor-cream flex items-center justify-center text-[9px]">4</span>
            <span>Confirmation</span>
          </div>
        </div>
      </div>

      {/* Back button */}
      {checkoutStep === 'address' ? (
        <Link to="/cart" className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-widest text-decor-stone hover:text-decor-black transition-colors">
          <ArrowLeft size={12} />
          <span>Return to Shopping Bag</span>
        </Link>
      ) : (
        <button 
          onClick={() => setCheckoutStep('address')}
          className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-widest text-decor-stone hover:text-decor-black transition-colors bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft size={12} />
          <span>Back to Delivery Address</span>
        </button>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        <div className="lg:col-span-2 space-y-8 bg-decor-beige border border-decor-cream rounded-sm p-6 md:p-8 decor-shadow-soft">
          
          {checkoutStep === 'address' ? (
            <div className="space-y-6">
              <div className="border-b border-decor-cream pb-4 flex justify-between items-center">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.4em] text-decor-gold font-medium block">Destination Details</span>
                  <h2 className="font-serif text-xl text-decor-black uppercase tracking-wider mt-1">Delivery Address</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(true)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-decor-gold/10 hover:bg-decor-gold/20 text-decor-gold border border-decor-gold/30 rounded-sm text-[10px] uppercase tracking-wider font-semibold transition-all duration-300 cursor-pointer"
                >
                  <Edit size={12} />
                  <span>{isAddressComplete ? "Change Address" : "Add Address"}</span>
                </button>
              </div>

              {/* Display Active Address Details */}
              {isAddressComplete ? (
                <div className="bg-decor-ivory/50 border border-decor-cream p-6 rounded-sm text-left relative overflow-hidden">
                  <div className="font-sans text-xs tracking-wide text-decor-stone space-y-1.5">
                    {activeAddress.fullName && (
                      <p className="font-serif text-sm font-semibold text-decor-black uppercase tracking-wider mb-2">
                        {activeAddress.fullName}
                      </p>
                    )}
                    {activeAddress.phone && <p>Phone: {activeAddress.phone}</p>}
                    {activeAddress.email && <p>Email: {activeAddress.email}</p>}
                    <p className="mt-2 text-decor-black">{activeAddress.houseNo}, {activeAddress.street}</p>
                    {activeAddress.area && <p>{activeAddress.area}</p>}
                    <p>{activeAddress.city}, {activeAddress.district}</p>
                    <p>{activeAddress.state}</p>
                    <p className="text-decor-black font-medium mt-1">
                      {activeAddress.country} - {activeAddress.pincode}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center bg-decor-cream/10 border border-dashed border-decor-cream rounded-sm flex flex-col items-center">
                   <AlertCircle size={32} className="text-decor-gold/50 mb-3" />
                   <p className="text-sm font-medium text-decor-black">Incomplete Address</p>
                   <p className="text-xs text-decor-stone italic mt-1 max-w-xs">Please provide a complete delivery address to continue checkout.</p>
                   <button 
                     onClick={() => setIsAddressModalOpen(true)}
                     className="mt-4 px-6 py-2 bg-decor-black text-white text-[9px] uppercase tracking-widest font-medium rounded-sm hover:bg-decor-stone transition-colors"
                   >
                     Add Delivery Details
                   </button>
                </div>
              )}

              {/* Continue button */}
              <button
                type="button"
                onClick={() => {
                  const requiredFields = [
                    'fullName', 'phone', 'email', 'houseNo', 'street', 
                    'area', 'city', 'district', 'state', 'country', 'pincode'
                  ];
                  for (let field of requiredFields) {
                    if (!activeAddress || !activeAddress[field]) {
                      toast.error(`Please provide ${field} before continuing.`);
                      return;
                    }
                  }
                  setCheckoutStep('payment');
                }}
                className={`w-full text-[10px] tracking-[0.25em] uppercase py-3.5 mt-4 font-semibold transition-colors duration-300 rounded-sm flex items-center justify-center space-x-2 cursor-pointer
                  ${isAddressComplete 
                    ? 'bg-decor-black hover:bg-decor-stone text-decor-ivory shadow-sm' 
                    : 'bg-decor-cream/50 text-decor-stone/50'
                  }`}
              >
                <span>Continue to Payment</span>
                <ArrowRight size={12} />
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="border-b border-decor-cream pb-4">
                <span className="text-[9px] uppercase tracking-[0.4em] text-decor-gold font-medium block">Payment Options</span>
                <h2 className="font-serif text-xl text-decor-black uppercase tracking-wider mt-1">Secure Checkout</h2>
              </div>

              {/* Address Summary Box */}
              <div className="bg-decor-cream/10 border border-decor-cream p-4 rounded-sm flex items-center justify-between text-xs font-light">
                <div className="text-left space-y-0.5">
                  <span className="text-[9px] uppercase tracking-wider text-decor-stone font-bold block mb-1">Shipping To</span>
                  <span className="font-medium text-decor-black">{activeAddress.fullName}</span>
                  <span className="text-decor-stone/80 ml-2">({activeAddress.city}, {activeAddress.state})</span>
                </div>
                <button 
                  onClick={() => setCheckoutStep('address')}
                  className="text-decor-gold hover:underline text-[9px] uppercase tracking-wider font-semibold cursor-pointer bg-transparent border-none"
                >
                  Edit
                </button>
              </div>

              {/* Payment selector */}
              <div className="space-y-4 text-left">
                {/* Cash on Delivery */}
                <div 
                  onClick={() => setPaymentMethod('COD')}
                  className={`flex items-start space-x-4 bg-decor-cream/20 border p-5 rounded-sm cursor-pointer transition-all duration-300 ${
                    paymentMethod === 'COD' ? 'border-decor-gold ring-1 ring-decor-gold/20' : 'border-decor-cream/85 hover:border-decor-stone/40'
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
                  <div className="space-y-1">
                    <span className="text-xs text-decor-black font-semibold uppercase tracking-wider block">Cash on Delivery</span>
                    <span className="text-[10px] text-decor-stone font-light leading-relaxed block">Pay after your order is delivered.</span>
                  </div>
                </div>

                {/* Razorpay */}
                <div 
                  onClick={() => setPaymentMethod('RAZORPAY')}
                  className={`flex items-start space-x-4 bg-decor-cream/20 border p-5 rounded-sm cursor-pointer transition-all duration-300 ${
                    paymentMethod === 'RAZORPAY' ? 'border-decor-gold ring-1 ring-decor-gold/20' : 'border-decor-cream/85 hover:border-decor-stone/40'
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
                  <div className="space-y-1">
                    <span className="text-xs text-decor-black font-semibold uppercase tracking-wider block">Razorpay Gateway</span>
                    <span className="text-[10px] text-decor-stone font-light leading-relaxed block">UPI, Cards, Netbanking or Wallet payments.</span>
                  </div>
                </div>
              </div>

              {/* Complete Order button */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-decor-black hover:bg-decor-stone text-decor-ivory text-[10px] tracking-[0.25em] uppercase py-4 mt-6 font-semibold transition-colors duration-300 rounded-sm shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <>
                    <ShieldCheck size={13} />
                    <span>Complete Secure Order</span>
                  </>
                )}
              </button>
            </div>
          )}

        </div>

        {/* Cart side panel summary */}
        <div className="bg-decor-beige border border-decor-cream rounded-sm p-6 md:p-8 space-y-6 h-fit decor-shadow-soft">
          <h3 className="font-serif text-lg text-decor-black uppercase tracking-wider border-b border-decor-cream pb-3">
            In Your Bag
          </h3>

          <div className="space-y-4 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-xs text-decor-stone font-light border-b border-decor-cream/30 pb-3">
                <div className="space-y-0.5 max-w-[70%] text-left">
                  <span className="font-medium text-decor-black line-clamp-1">{item.product?.name}</span>
                  <span className="text-[10px] text-decor-stone/80">Qty: {item.quantity}</span>
                </div>
                <span className="font-serif text-decor-gold font-medium whitespace-nowrap">
                  {inrFormatter.format(item.product?.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-4 text-xs font-light text-decor-stone border-t border-decor-cream pt-4 text-left">
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

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSave={handleSaveAddress}
        initialData={activeAddress}
        title="Delivery Address"
      />

    </div>
  );
}
