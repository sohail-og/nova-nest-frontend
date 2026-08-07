import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning("Please enter your email and password");
      return;
    }

    setLoading(true);
    try {
      const response = await API.post('/api/admin/login', { email, password });
      if (response.data && response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminEmail', response.data.username);
        toast.success("Welcome, Administrator. Login successful.");
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error("Admin login request failed", err);
      toast.error(err.response?.data?.error || err.response?.data?.message || "Invalid administrator credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-decor-ivory text-decor-charcoal flex items-center justify-center py-20 px-6">
      <div className="w-full max-w-md bg-decor-beige border border-decor-cream rounded-sm p-8 md:p-10 decor-shadow-soft">
        
        {/* Form Header */}
        <div className="text-center space-y-3 mb-8">
          <span className="text-[9px] uppercase tracking-[0.4em] text-decor-gold font-medium block">
            Security Gateway
          </span>
          <h2 className="font-serif text-3xl font-light text-decor-black uppercase tracking-wider">
            Admin Sign In
          </h2>
          <div className="w-8 h-[1px] bg-decor-gold/30 mx-auto" />
        </div>

        {/* Form Body */}
        <form onSubmit={handleAdminLogin} className="space-y-6">
          
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-decor-stone font-medium block">
              Email Address
            </label>
            <div className="relative flex items-center border-b border-decor-cream focus-within:border-decor-gold py-1.5 transition-colors">
              <Mail size={14} className="text-decor-stone/70 mr-2" />
              <input
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-none text-xs text-decor-black placeholder-decor-stone/50 focus:outline-none w-full pr-4 tracking-wide"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-decor-stone font-medium block">
              Password
            </label>
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
              "Login as Admin"
            )}
          </button>

        </form>

        {/* Footer Link */}
        <div className="text-center mt-8 text-[11px] text-decor-stone font-light">
          <Link to="/login" className="text-decor-gold hover:text-decor-gold-light uppercase tracking-wider font-medium">
            Customer Login
          </Link>
        </div>

      </div>
    </div>
  );
}
