import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';
import { Mail } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.warning("Please enter your registered email");
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(email);
      toast.success("OTP sent to your email successfully");
      navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error("Forgot password OTP request failed", err.config?.url, err.response?.status);
      toast.error(err.response?.data?.error || err.response?.data?.message || "Failed to send OTP. Please verify your email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[75vh] bg-decor-ivory text-decor-charcoal flex items-center justify-center py-20 px-6">
      <div className="w-full max-w-md bg-decor-beige border border-decor-cream rounded-sm p-8 md:p-10 decor-shadow-soft">
        
        {/* Form Header */}
        <div className="text-center space-y-3 mb-8">
          <span className="text-[9px] uppercase tracking-[0.4em] text-decor-gold font-medium block">
            Reset Password
          </span>
          <h2 className="font-serif text-3xl font-light text-decor-black uppercase tracking-wider">
            Forgot Password
          </h2>
          <div className="w-8 h-[1px] bg-decor-gold/30 mx-auto" />
          <p className="text-[10px] text-decor-stone font-light leading-relaxed tracking-wider pt-2">
            Enter your registered email address below, and we will send you a one-time passcode to reset your credentials.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleForgotPassword} className="space-y-6">
          
          {/* Email */}
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-decor-black hover:bg-decor-stone text-decor-ivory text-[10px] tracking-[0.25em] uppercase py-3.5 font-medium transition-all duration-300 rounded-sm shadow-sm flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
            ) : (
              "Send OTP"
            )}
          </button>

        </form>
      </div>
    </div>
  );
}
