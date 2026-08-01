import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';
import { KeyRound } from 'lucide-react';

export default function VerifyOtp() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get('email') || '';

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Missing email context. Please retry forgot password flow.");
      return;
    }
    if (!otp || otp.length !== 6) {
      toast.warning("Please enter the 6-digit OTP code");
      return;
    }

    setLoading(true);
    try {
      await authService.verifyOtp(email, otp);
      toast.success("OTP verified successfully");
      navigate(`/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`);
    } catch (err) {
      console.error("OTP verification request failed", err.config?.url, err.response?.status);
      toast.error(err.response?.data?.message || "Invalid or expired OTP code");
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
            Verification
          </span>
          <h2 className="font-serif text-3xl font-light text-decor-black uppercase tracking-wider">
            Verify OTP
          </h2>
          <div className="w-8 h-[1px] bg-decor-gold/30 mx-auto" />
          <p className="text-[10px] text-decor-stone font-light leading-relaxed tracking-wider pt-2">
            A 6-digit security code has been sent to <span className="font-medium text-decor-black">{email}</span>. Please enter it below.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleVerify} className="space-y-6">
          
          {/* OTP Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-decor-stone font-medium block">
              Passcode (OTP)
            </label>
            <div className="relative flex items-center border-b border-decor-cream focus-within:border-decor-gold py-1.5 transition-colors">
              <KeyRound size={14} className="text-decor-stone/70 mr-2" />
              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                maxLength="6"
                className="bg-transparent border-none text-xs text-decor-black placeholder-decor-stone/50 focus:outline-none w-full pr-4 tracking-[0.3em] font-mono text-center font-bold"
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
              "Verify Code"
            )}
          </button>

        </form>
      </div>
    </div>
  );
}
