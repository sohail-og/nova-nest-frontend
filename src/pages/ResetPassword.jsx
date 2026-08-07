import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Lock } from 'lucide-react';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get('email') || '';

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email context is missing. Please restart recovery flow.");
      return;
    }
    if (!newPassword || !confirmPassword) {
      toast.warning("Please enter your new passwords");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({ email, newPassword, confirmPassword });
      toast.success("Password reset successfully! Please sign in with your new credentials.");
      navigate('/login');
    } catch (err) {
      console.error("Password reset request failed", err.config?.url, err.response?.status);
      toast.error(err.response?.data?.message || "Failed to reset password. Link or OTP might be invalid.");
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
            Reset Credentials
          </span>
          <h2 className="font-serif text-3xl font-light text-decor-black uppercase tracking-wider">
            New Password
          </h2>
          <div className="w-8 h-[1px] bg-decor-gold/30 mx-auto" />
          <p className="text-[10px] text-decor-stone font-light leading-relaxed tracking-wider pt-2">
            Set a new password for <span className="font-medium text-decor-black">{email}</span>.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleReset} className="space-y-6">
          
          {/* New Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-decor-stone font-medium block">
              New Password
            </label>
            <div className="relative flex items-center border-b border-decor-cream focus-within:border-decor-gold py-1.5 transition-colors">
              <Lock size={14} className="text-decor-stone/70 mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-decor-stone font-medium block">
              Confirm Password
            </label>
            <div className="relative flex items-center border-b border-decor-cream focus-within:border-decor-gold py-1.5 transition-colors">
              <Lock size={14} className="text-decor-stone/70 mr-2" />
              <input
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              "Reset Password"
            )}
          </button>

        </form>
      </div>
    </div>
  );
}
