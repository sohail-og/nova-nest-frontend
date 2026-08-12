import { useState } from 'react';
import { X, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { authService } from '../services/authService';

export default function ChangePasswordModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (formData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.changePassword(formData);
      toast.success(response.message || 'Password updated successfully');
      
      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
      
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md shadow-2xl relative animate-fadeIn rounded-sm">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-decor-stone hover:text-decor-black transition-colors"
        >
          <X size={20} strokeWidth={1.5} />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-decor-gold/10 flex items-center justify-center mx-auto mb-4 rounded-full">
              <Lock size={20} className="text-decor-gold" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl font-light text-decor-black">Change Password</h2>
            <p className="text-xs text-decor-stone mt-2 uppercase tracking-widest">Update your security credentials</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Current Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold tracking-widest text-decor-stone uppercase">Current Password</label>
              <div className="relative">
                <input
                  type={showPassword.current ? 'text' : 'password'}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="w-full bg-decor-cream/30 border border-decor-stone/20 px-4 py-3 text-sm focus:outline-none focus:border-decor-gold transition-colors font-light pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-decor-stone hover:text-decor-black transition-colors"
                >
                  {showPassword.current ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold tracking-widest text-decor-stone uppercase">New Password</label>
              <div className="relative">
                <input
                  type={showPassword.new ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full bg-decor-cream/30 border border-decor-stone/20 px-4 py-3 text-sm focus:outline-none focus:border-decor-gold transition-colors font-light pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-decor-stone hover:text-decor-black transition-colors"
                >
                  {showPassword.new ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold tracking-widest text-decor-stone uppercase">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showPassword.confirm ? 'text' : 'password'}
                  name="confirmNewPassword"
                  value={formData.confirmNewPassword}
                  onChange={handleChange}
                  className="w-full bg-decor-cream/30 border border-decor-stone/20 px-4 py-3 text-sm focus:outline-none focus:border-decor-gold transition-colors font-light pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-decor-stone hover:text-decor-black transition-colors"
                >
                  {showPassword.confirm ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 bg-decor-black text-white text-xs tracking-widest uppercase font-semibold transition-all
                ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-decor-gold'}`}
            >
              {loading ? 'UPDATING...' : 'UPDATE PASSWORD'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
