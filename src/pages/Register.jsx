import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Lock, Mail, Phone, User, Users } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    gender: 'MALE',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { username, email, phone, gender, password, confirmPassword } = formData;

    if (!username || !email || !phone || !password || !confirmPassword) {
      toast.warning("Please fill all the fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (phone.length !== 10 || isNaN(phone)) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    setLoading(true);
    try {
      await authService.register(formData);
      toast.success("Account created successfully! Please Sign In.");
      navigate('/login');
    } catch (err) {
      console.error("Registration request failed", err.config?.url, err.response?.status);
      toast.error(err.response?.data?.error || "Registration failed. Username or email may already be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[85vh] bg-decor-ivory text-decor-charcoal flex items-center justify-center py-20 px-6">
      <div className="w-full max-w-md bg-decor-beige border border-decor-cream rounded-sm p-8 md:p-10 decor-shadow-soft">
        
        {/* Form Header */}
        <div className="text-center space-y-3 mb-8">
          <span className="text-[9px] uppercase tracking-[0.4em] text-decor-gold font-medium block">
            Membership Join
          </span>
          <h2 className="font-serif text-3xl font-light text-decor-black uppercase tracking-wider">
            Create Account
          </h2>
          <div className="w-8 h-[1px] bg-decor-gold/30 mx-auto" />
        </div>

        {/* Form Body */}
        <form onSubmit={handleRegister} className="space-y-5">
          
          {/* Username */}
          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-widest text-decor-stone font-medium block">Username</label>
            <div className="relative flex items-center border-b border-decor-cream focus-within:border-decor-gold py-1.5 transition-colors">
              <User size={14} className="text-decor-stone/70 mr-2" />
              <input
                type="text"
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleInputChange}
                className="bg-transparent border-none text-xs text-decor-black placeholder-decor-stone/50 focus:outline-none w-full pr-4 tracking-wide"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-widest text-decor-stone font-medium block">Email Address</label>
            <div className="relative flex items-center border-b border-decor-cream focus-within:border-decor-gold py-1.5 transition-colors">
              <Mail size={14} className="text-decor-stone/70 mr-2" />
              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-transparent border-none text-xs text-decor-black placeholder-decor-stone/50 focus:outline-none w-full pr-4 tracking-wide"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-widest text-decor-stone font-medium block">Phone Number</label>
            <div className="relative flex items-center border-b border-decor-cream focus-within:border-decor-gold py-1.5 transition-colors">
              <Phone size={14} className="text-decor-stone/70 mr-2" />
              <input
                type="tel"
                name="phone"
                placeholder="Enter 10-digit mobile number"
                value={formData.phone}
                onChange={handleInputChange}
                maxLength="10"
                className="bg-transparent border-none text-xs text-decor-black placeholder-decor-stone/50 focus:outline-none w-full pr-4 tracking-wide"
                required
              />
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-1.5">
            <label className="text-[9px] uppercase tracking-widest text-decor-stone font-medium block">Gender</label>
            <div className="relative flex items-center border-b border-decor-cream py-1">
              <Users size={14} className="text-decor-stone/70 mr-2" />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="bg-transparent border-none text-xs text-decor-black focus:outline-none w-full cursor-pointer tracking-wider"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-widest text-decor-stone font-medium block">Password</label>
            <div className="relative flex items-center border-b border-decor-cream focus-within:border-decor-gold py-1.5 transition-colors">
              <Lock size={14} className="text-decor-stone/70 mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create password"
                value={formData.password}
                onChange={handleInputChange}
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
          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-widest text-decor-stone font-medium block">Confirm Password</label>
            <div className="relative flex items-center border-b border-decor-cream focus-within:border-decor-gold py-1.5 transition-colors">
              <Lock size={14} className="text-decor-stone/70 mr-2" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="bg-transparent border-none text-xs text-decor-black placeholder-decor-stone/50 focus:outline-none w-full pr-4 tracking-wide"
                required
              />
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-decor-black hover:bg-decor-stone text-decor-ivory text-[10px] tracking-[0.25em] uppercase py-3.5 mt-2 font-medium transition-all duration-300 rounded-sm shadow-sm flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
            ) : (
              "Register"
            )}
          </button>

        </form>

        {/* Footer Link */}
        <div className="text-center mt-6 text-[11px] text-decor-stone font-light">
          <span>Already have an account? </span>
          <Link to="/login" className="text-decor-gold hover:text-decor-gold-light uppercase tracking-wider font-medium ml-1">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}
