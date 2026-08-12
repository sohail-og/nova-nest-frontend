import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { useCart } from '../context/CartContext';
import { User, Mail, Phone, Calendar, ShoppingBag, LogOut, Edit2, MapPin, Camera, Save, Heart, AlertCircle, Key } from 'lucide-react';
import { toast } from 'react-toastify';
import API from '../services/api';
import AddressModal from '../components/AddressModal';
import ChangePasswordModal from '../components/ChangePasswordModal';

const renderPremiumAddress = (addr) => {
  if (!addr || !addr.houseNo) {
    return <span className="text-decor-stone font-light italic">No physical delivery address specified yet.</span>;
  }

  return (
    <div className="mt-1.5 font-sans text-xs tracking-wide text-decor-stone space-y-0.5">
      {addr.fullName && <p className="font-serif text-sm font-semibold text-decor-black uppercase tracking-wider mb-1">{addr.fullName}</p>}
      <p>{addr.houseNo}, {addr.street}</p>
      {addr.area && <p>{addr.area}</p>}
      <p>{addr.city}, {addr.district}</p>
      <p>{addr.state}</p>
      <p>{addr.country} - {addr.pincode}</p>
    </div>
  );
};

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  
  // Form states for profile edit (excluding address)
  const [editForm, setEditForm] = useState({
    email: '',
    phone: '',
    gender: '',
    profileImage: '',
    password: ''
  });

  const navigate = useNavigate();
  const { loadCart } = useCart();

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await API.get('/api/home');
      const data = response.data;
      setProfile(data);

      setEditForm({
        email: data.email || '',
        phone: data.phone || '',
        gender: data.gender || 'Not Specified',
        profileImage: data.profileImage || '',
        password: ''
      });
    } catch (err) {
      console.error("Failed to load user profile API", err);
      toast.error("Failed to retrieve profile details. Please login again.");
      authService.logout();
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const username = localStorage.getItem('username') || localStorage.getItem('token');
    if (!username) {
      navigate('/login');
      return;
    }
    setTimeout(() => fetchProfile(), 0);
  }, [navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        email: editForm.email,
        phone: editForm.phone,
        gender: editForm.gender,
        profileImage: editForm.profileImage,
        password: editForm.password
      };

      await API.put('/api/user/profile', payload);
      toast.success("Profile details updated successfully");
      setIsEditing(false);
      setTimeout(() => fetchProfile(), 0);
    } catch (err) {
      console.error("Failed to update profile", err);
      toast.error(err.response?.data || "Failed to update profile. Please try again.");
    }
  };

  const handleSaveAddress = async (addressData) => {
    try {
      await API.put('/api/user/profile/address', addressData);
      toast.success("Address updated successfully");
      setIsAddressModalOpen(false);
      setTimeout(() => fetchProfile(), 0);
    } catch (err) {
      console.error("Failed to save address", err);
      toast.error("Failed to update address. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      loadCart(); 
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

  const hasAddress = profile.address && profile.address.houseNo;

  return (
    <div className="min-h-screen bg-decor-ivory text-decor-charcoal py-20 px-6 md:px-12 max-w-4xl mx-auto space-y-8">
      
      {/* Missing Address Banner */}
      {!hasAddress && (
        <div className="bg-decor-gold/10 border border-decor-gold/30 p-4 rounded-sm flex items-center justify-between">
          <div className="flex items-center space-x-3 text-decor-gold">
            <AlertCircle size={20} />
            <div>
              <h4 className="text-[11px] uppercase tracking-widest font-bold">Incomplete Profile</h4>
              <p className="text-xs font-medium opacity-80 mt-0.5">Please complete your delivery address to enable checkout.</p>
            </div>
          </div>
          <button 
            onClick={() => setIsAddressModalOpen(true)}
            className="px-4 py-2 bg-decor-gold text-white text-[9px] uppercase tracking-[0.2em] font-medium rounded-sm hover:bg-decor-gold-light transition-colors"
          >
            Add Address
          </button>
        </div>
      )}

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

      {/* Profile Area Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Detail Panel */}
        <div className="md:col-span-2 bg-decor-beige border border-decor-cream rounded-sm p-6 md:p-8 space-y-6 decor-shadow-soft">
          
          <div className="flex justify-between items-center border-b border-decor-cream pb-3">
            <h2 className="font-serif text-xl text-decor-black uppercase tracking-wider">
              {isEditing ? "Modify Profile" : "Profile Details"}
            </h2>
            
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-1.5 text-[9px] uppercase tracking-widest text-decor-gold hover:text-decor-gold-light transition-colors font-semibold cursor-pointer"
              >
                <Edit2 size={11} />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-decor-stone font-semibold block">Email Address</label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full bg-transparent border-b border-decor-cream focus:border-decor-gold text-xs py-1.5 focus:outline-none text-decor-black"
                  />
                </div>

                {/* Contact Phone */}
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-decor-stone font-semibold block">Contact Number</label>
                  <input
                    type="text"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    className="w-full bg-transparent border-b border-decor-cream focus:border-decor-gold text-xs py-1.5 focus:outline-none text-decor-black font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Gender */}
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-decor-stone font-semibold block">Gender</label>
                  <select
                    value={editForm.gender}
                    onChange={(e) => setEditForm({...editForm, gender: e.target.value})}
                    className="w-full bg-transparent border-b border-decor-cream focus:border-decor-gold text-xs py-1.5 focus:outline-none text-decor-black bg-decor-beige"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Not Specified">Not Specified</option>
                  </select>
                </div>

                {/* Profile Photo */}
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-decor-stone font-semibold block">Profile Photo URL</label>
                  <input
                    type="url"
                    value={editForm.profileImage}
                    onChange={(e) => setEditForm({...editForm, profileImage: e.target.value})}
                    className="w-full bg-transparent border-b border-decor-cream focus:border-decor-gold text-xs py-1.5 focus:outline-none text-decor-black"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>

              {/* Password update section */}
              <div className="space-y-1 border-t border-decor-cream pt-4">
                <label className="text-[9px] uppercase tracking-widest text-red-500 font-semibold block">Change Password (Optional)</label>
                <input
                  type="password"
                  value={editForm.password}
                  onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                  className="w-full bg-transparent border-b border-decor-cream focus:border-decor-gold text-xs py-1.5 focus:outline-none text-decor-black"
                  placeholder="Leave blank to keep current password"
                />
              </div>

              <div className="flex space-x-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-decor-black hover:bg-decor-stone text-white text-xs tracking-widest uppercase py-2.5 font-bold transition-colors rounded-sm cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Save size={12} />
                  <span className="text-white">Save Changes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-transparent border border-decor-cream text-decor-stone hover:text-decor-black hover:border-decor-black text-[9px] tracking-widest uppercase py-2.5 font-medium transition-colors rounded-sm cursor-pointer"
                >
                  Cancel
                </button>
              </div>

            </form>
          ) : (
            <div className="space-y-6">
              
              {/* Profile Image & Summary */}
              <div className="flex items-center space-x-5 pb-4 border-b border-decor-cream/40">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-decor-gold/20 flex items-center justify-center border-2 border-decor-gold relative group">
                  {profile.profileImage ? (
                    <img src={profile.profileImage} alt={profile.username} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-serif text-decor-black uppercase">{profile.username.charAt(0)}</span>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => setIsEditing(true)}>
                    <Camera size={14} className="text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium text-decor-black">{profile.username}</h3>
                  <span className="text-[9px] uppercase tracking-widest text-decor-gold font-medium">Bespoke Client</span>
                </div>
              </div>

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
                <div className="flex items-center space-x-3 py-1 border-b border-decor-cream/30">
                  <Calendar size={14} className="text-decor-gold/80" />
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-decor-stone block">Gender</span>
                    <span className="font-medium text-decor-black uppercase tracking-wider">{profile.gender || 'Not Specified'}</span>
                  </div>
                </div>

                 {/* Physical/Delivery Address */}
                 <div className="flex items-start space-x-3 py-1 relative">
                   <MapPin size={14} className="text-decor-gold/80 mt-0.5" />
                   <div className="w-full pr-10">
                     <span className="text-[9px] uppercase tracking-widest text-decor-stone block mb-1">Default Delivery Address</span>
                     <div className="font-medium text-decor-black leading-relaxed block">
                       {renderPremiumAddress(profile.address)}
                     </div>
                   </div>
                   <button 
                     onClick={() => setIsAddressModalOpen(true)}
                     className="absolute top-1 right-0 text-[9px] uppercase tracking-widest text-decor-gold hover:text-decor-gold-light font-bold flex items-center transition-colors"
                   >
                     <Edit2 size={11} className="mr-1" /> Edit
                   </button>
                 </div>

              </div>

            </div>
          )}

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

          <Link
            to="/wishlist"
            className="bg-decor-beige border border-decor-cream hover:border-decor-gold text-decor-black p-6 rounded-sm text-center flex flex-col items-center justify-center space-y-2 group transition-all duration-300 decor-shadow-soft"
          >
            <Heart size={20} className="text-decor-stone group-hover:text-decor-gold transition-colors duration-300" />
            <span className="text-[10px] uppercase tracking-widest font-medium">Wishlist Collections</span>
          </Link>

          <button
            onClick={() => setIsChangePasswordModalOpen(true)}
            className="bg-decor-cream/30 border border-decor-cream hover:border-decor-gold text-decor-black p-6 rounded-sm text-center flex flex-col items-center justify-center space-y-2 group transition-all duration-300 shadow-sm cursor-pointer"
          >
            <Key size={20} className="text-decor-stone group-hover:text-decor-gold transition-colors duration-300" />
            <span className="text-[10px] uppercase tracking-widest font-medium">Change Password</span>
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-50/10 border border-red-200/50 hover:border-red-400 text-red-600 p-6 rounded-sm text-center flex flex-col items-center justify-center space-y-2 group transition-all duration-300 shadow-sm cursor-pointer"
          >
            <LogOut size={20} className="text-red-400 group-hover:text-red-600 transition-colors duration-300" />
            <span className="text-[10px] uppercase tracking-widest font-medium">Sign Out</span>
          </button>
        </div>

      </div>

      <AddressModal 
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSave={handleSaveAddress}
        initialData={profile.address}
        title="Edit Profile Address"
      />

      <ChangePasswordModal 
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      />
    </div>
  );
}
