import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';
import { Mail, Lock, KeyRound, Eye, EyeOff } from 'lucide-react';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.warning("Please enter your registered email");
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(email);
      toast.success("OTP sent to your email. Please check your inbox.");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || "Failed to send OTP. Please verify your email.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.warning("Please enter the OTP");
      return;
    }

    setLoading(true);
    try {
      await authService.verifyOtp(email, otp);
      toast.success("OTP verified successfully.");
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to verify OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
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
      toast.success("Password changed successfully.");
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password.");
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
            {step === 1 ? 'Forgot Password' : step === 2 ? 'Verify OTP' : 'New Password'}
          </h2>
          <div className="w-8 h-[1px] bg-decor-gold/30 mx-auto" />
          <p className="text-[10px] text-decor-stone font-light leading-relaxed tracking-wider pt-2">
            {step === 1 && "Enter your registered email address below, and we will send you an OTP."}
            {step === 2 && `Enter the 6-digit OTP sent to ${email}.`}
            {step === 3 && "Create a new strong password for your account."}
          </p>
        </div>

        {/* Form Body */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-6">
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
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-decor-black hover:bg-decor-stone text-decor-ivory text-[10px] tracking-[0.25em] uppercase py-3.5 font-medium transition-all duration-300 rounded-sm shadow-sm flex items-center justify-center"
            >
              {loading ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div> : "SEND OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-decor-stone font-medium block">
                ENTER OTP
              </label>
              <div className="relative flex items-center border-b border-decor-cream focus-within:border-decor-gold py-1.5 transition-colors">
                <KeyRound size={14} className="text-decor-stone/70 mr-2" />
                <input
                  type="text"
                  maxLength="6"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="bg-transparent border-none text-xs text-decor-black placeholder-decor-stone/50 focus:outline-none w-full pr-4 tracking-wide tracking-[0.5em]"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-decor-black hover:bg-decor-stone text-decor-ivory text-[10px] tracking-[0.25em] uppercase py-3.5 font-medium transition-all duration-300 rounded-sm shadow-sm flex items-center justify-center"
            >
              {loading ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div> : "VERIFY OTP"}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-decor-stone font-medium block">
                NEW PASSWORD
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

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-decor-stone font-medium block">
                CONFIRM PASSWORD
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-decor-black hover:bg-decor-stone text-decor-ivory text-[10px] tracking-[0.25em] uppercase py-3.5 font-medium transition-all duration-300 rounded-sm shadow-sm flex items-center justify-center"
            >
              {loading ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div> : "RESET PASSWORD"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
