import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Lock, Mail, Phone, User, Users,  } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    gender: 'MALE',
    password: '',
    confirmPassword: '',
    fullName: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const { 
      username, email, phone, password, confirmPassword, fullName
    } = formData;

    if (!username || !email || !phone || !password || !confirmPassword || !fullName) {
      toast.warning("Please fill in all details.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (phone.length !== 10 || isNaN(phone)) {
      toast.error("Phone number must contain exactly 10 digits");
      return;
    }

    setLoading(true);
    try {
      await authService.register(formData);
      toast.success("Registration successful!");
      navigate('/login');
    } catch (err) {
      console.error("Registration request failed", err);
      let errorMessage = "Registration failed. Please check your inputs.";
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (typeof err.response.data === 'object') {
          // Extract first validation error
          const firstError = Object.values(err.response.data)[0];
          if (typeof firstError === 'string') errorMessage = firstError;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="w-full min-h-[90vh] bg-decor-ivory text-decor-charcoal flex items-center justify-center py-20 px-6">
      <div className={`w-full max-w-lg bg-decor-beige border border-decor-cream rounded-sm p-8 md:p-10 decor-shadow-soft transition-all duration-500`}>
        
            {/* Registration Header */}
            <div className="text-center space-y-3 mb-8">
              <span className="text-[9px] uppercase tracking-[0.4em] text-decor-gold font-medium block">
                Membership Join
              </span>
              <h2 className="font-serif text-3xl font-light text-decor-black uppercase tracking-wider">
                Create Account
              </h2>
              <div className="w-8 h-[1px] bg-decor-gold/30 mx-auto" />
            </div>

            {/* Registration Form */}
            <form onSubmit={handleRegisterSubmit} className="space-y-8">
              
              <div className="grid grid-cols-1 gap-8">
                
                {/* Left Column: Account details */}
                <div className="space-y-5">
                  <h3 className="text-[10px] uppercase tracking-widest text-decor-gold font-bold border-b border-decor-cream pb-1">
                    Account Details
                  </h3>

                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-decor-stone font-medium block">Full Name</label>
                    <div className="relative flex items-center border-b border-decor-cream focus-within:border-decor-gold py-1.5 transition-colors">
                      <User size={14} className="text-decor-stone/70 mr-2" />
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Enter full name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="bg-transparent border-none text-xs text-decor-black placeholder-decor-stone/50 focus:outline-none w-full pr-4 tracking-wide"
                        required
                      />
                    </div>
                  </div>

                  {/* Username */}
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest text-decor-stone font-medium block">Username</label>
                    <div className="relative flex items-center border-b border-decor-cream focus-within:border-decor-gold py-1.5 transition-colors">
                      <User size={14} className="text-decor-stone/70 mr-2" />
                      <input
                        type="text"
                        name="username"
                        placeholder="Choose username"
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

                  <div className="grid grid-cols-2 gap-4">
                    {/* Gender */}
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-decor-stone font-medium block">Gender</label>
                      <div className="relative flex items-center border-b border-decor-cream py-1">
                        <Users size={14} className="text-decor-stone/70 mr-2" />
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="bg-transparent border-none text-xs text-decor-black focus:outline-none w-full cursor-pointer tracking-wider bg-decor-beige"
                        >
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                    </div>

                    {/* Password display toggle */}
                    <div className="space-y-1 flex items-end">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-[9px] uppercase tracking-widest text-decor-stone hover:text-decor-gold transition-colors font-medium flex items-center space-x-1 mb-2.5"
                      >
                        {showPassword ? <EyeOff size={11} /> : <Eye size={11} />}
                        <span>{showPassword ? 'Hide Passwords' : 'Show Passwords'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Passwords Input */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                          className="bg-transparent border-none text-xs text-decor-black placeholder-decor-stone/50 focus:outline-none w-full pr-4 tracking-wide"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-decor-stone font-medium block">Confirm Password</label>
                      <div className="relative flex items-center border-b border-decor-cream focus-within:border-decor-gold py-1.5 transition-colors">
                        <Lock size={14} className="text-decor-stone/70 mr-2" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="confirmPassword"
                          placeholder="Confirm password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="bg-transparent border-none text-xs text-decor-black placeholder-decor-stone/50 focus:outline-none w-full pr-4 tracking-wide"
                          required
                        />
                      </div>
                    </div>
                  </div>

                </div>
                </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-decor-black hover:bg-decor-stone text-decor-ivory text-[10px] tracking-[0.25em] uppercase py-3.5 mt-4 font-semibold transition-all duration-300 rounded-sm shadow-sm flex items-center justify-center cursor-pointer"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                ) : (
                  "Create Luxury Account"
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
