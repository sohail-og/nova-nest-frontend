import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { useCart } from '../context/CartContext';
import { User, Mail, Phone, Calendar, ShoppingBag, LogOut } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { loadCart } = useCart();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      setLoading(true);
      try {
        const data = await authService.getProfile();
        setProfile(data);
      } catch (err) {
        console.error("Failed to load user profile API", err);
        toast.error("Failed to retrieve profile details. Please login again.");
        authService.logout();
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      loadCart(); // Clear local context cart state
      toast.success("Signed out successfully");
      navigate('/login');
    } catch (err) {
      console.error("Logout request failed", err);
      toast.error("Logout request failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-decor-ivory">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-decor-gold"></div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-decor-ivory text-decor-charcoal py-20 px-6 md:px-12 max-w-4xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-xl mx-auto">
        <span className="text-[10px] uppercase tracking-[0.45em] text-decor-gold font-medium block">
          Client Workspace
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-light text-decor-black uppercase tracking-wider">
          My Account
        </h1>
        <div className="w-12 h-[1px] bg-decor-gold/30 mx-auto" />
      </div>

      {/* Profile Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Detail Panel */}
        <div className="md:col-span-2 bg-decor-beige border border-decor-cream rounded-sm p-6 md:p-8 space-y-6 decor-shadow-soft">
          <h2 className="font-serif text-xl text-decor-black uppercase tracking-wider border-b border-decor-cream pb-3">
            Profile Details
          </h2>

          <div className="space-y-4 text-xs font-light text-decor-stone">
            {/* Username */}
            <div className="flex items-center space-x-3 py-1 border-b border-decor-cream/30">
              <User size={14} className="text-decor-gold/80" />
              <div>
                <span className="text-[9px] uppercase tracking-widest text-decor-stone block">Username</span>
                <span className="font-medium text-decor-black">{profile.username}</span>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center space-x-3 py-1 border-b border-decor-cream/30">
              <Mail size={14} className="text-decor-gold/80" />
              <div>
                <span className="text-[9px] uppercase tracking-widest text-decor-stone block">Email Address</span>
                <span className="font-medium text-decor-black">{profile.email}</span>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center space-x-3 py-1 border-b border-decor-cream/30">
              <Phone size={14} className="text-decor-gold/80" />
              <div>
                <span className="text-[9px] uppercase tracking-widest text-decor-stone block">Contact Number</span>
                <span className="font-medium text-decor-black">{profile.phone || 'Not Specified'}</span>
              </div>
            </div>

            {/* Gender */}
            <div className="flex items-center space-x-3 py-1">
              <Calendar size={14} className="text-decor-gold/80" />
              <div>
                <span className="text-[9px] uppercase tracking-widest text-decor-stone block">Gender</span>
                <span className="font-medium text-decor-black uppercase tracking-wider">{profile.gender || 'Not Specified'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation Options */}
        <div className="flex flex-col space-y-4">
          <Link
            to="/orders"
            className="bg-decor-beige border border-decor-cream hover:border-decor-gold text-decor-black p-6 rounded-sm text-center flex flex-col items-center justify-center space-y-2 group transition-all duration-300 decor-shadow-soft"
          >
            <ShoppingBag size={20} className="text-decor-stone group-hover:text-decor-gold transition-colors duration-300" />
            <span className="text-[10px] uppercase tracking-widest font-medium">Order History</span>
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-50/10 border border-red-200/50 hover:border-red-400 text-red-600 p-6 rounded-sm text-center flex flex-col items-center justify-center space-y-2 group transition-all duration-300 shadow-sm"
          >
            <LogOut size={20} className="text-red-400 group-hover:text-red-600 transition-colors duration-300" />
            <span className="text-[10px] uppercase tracking-widest font-medium">Sign Out</span>
          </button>
        </div>

      </div>

    </div>
  );
}
