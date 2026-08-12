import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { loadCart } = useCart();
  const { loadWishlist } = useWishlist();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning("Please enter your email and password");
      return;
    }

    setLoading(true);
    try {
      await authService.login(email, password);
      toast.success("Welcome back! Login successful.");
      loadCart(); // reload user cart
      loadWishlist(); // reload user wishlist
      navigate('/home');
    } catch (err) {
      console.error("Login request failed", err.config?.url, err.response?.status);
      toast.error(err.response?.data?.error || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[80vh] bg-decor-ivory text-decor-charcoal flex items-center justify-center py-20 px-6">
      <div className="w-full max-w-md bg-decor-beige border border-decor-cream rounded-sm p-8 md:p-10 decor-shadow-soft">
        
        {/* Form Header */}
        <div className="text-center space-y-3 mb-8">
          <span className="text-[9px] uppercase tracking-[0.4em] text-decor-gold font-medium block">
            Private Access
          </span>
          <h2 className="font-serif text-3xl font-light text-decor-black uppercase tracking-wider">
            Sign In
          </h2>
          <div className="w-8 h-[1px] bg-decor-gold/30 mx-auto" />
        </div>

        {/* Form Body */}
        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-decor-stone font-medium block">
              Email Address
            </label>
            <div className="relative flex items-center border-b border-decor-cream focus-within:border-decor-gold py-1.5 transition-colors">
              <Mail size={14} className="text-decor-stone/70 mr-2" />
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-none text-xs text-decor-black placeholder-decor-stone/50 focus:outline-none w-full pr-4 tracking-wide"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase tracking-widest text-decor-stone font-medium block">
                Password
              </label>
              <Link to="/forgot-password" className="text-[9px] uppercase tracking-wider text-decor-gold hover:text-decor-gold-light transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative flex items-center border-b border-decor-cream focus-within:border-decor-gold py-1.5 transition-colors">
              <Lock size={14} className="text-decor-stone/70 mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border-none text-xs text-decor-black placeholder-decor-stone/50 focus:outline-none w-full pr-8 tracking-wide"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 text-decor-stone hover:text-decor-gold transition-colors"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-decor-black hover:bg-decor-stone text-decor-ivory text-[10px] tracking-[0.25em] uppercase py-3.5 font-medium transition-all duration-300 rounded-sm shadow-sm flex items-center justify-center cursor-pointer"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
            ) : (
              "Sign In"
            )}
          </button>

          <div className="text-center pt-4 border-t border-decor-cream/40 mt-4">
            <Link to="/admin/login" className="text-decor-gold hover:text-decor-gold-light uppercase tracking-[0.25em] text-[10px] font-medium transition-colors duration-300 inline-block hover:underline underline-offset-4">
              Login as Administrator
            </Link>
          </div>

        </form>

        {/* Footer Link */}
        <div className="text-center mt-8 text-[11px] text-decor-stone font-light">
          <div>
            <span>New to Nova Nest? </span>
            <Link to="/register" className="text-decor-gold hover:text-decor-gold-light uppercase tracking-wider font-medium ml-1 font-semibold">
              Create an Account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
