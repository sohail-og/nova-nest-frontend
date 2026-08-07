import { useState, useEffect } from 'react';
import { X, MapPin, Building, Globe, Mail } from 'lucide-react';

export default function AddressModal({ isOpen, onClose, onSave, initialData, title }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    houseNo: '',
    street: '',
    area: '',
    city: '',
    district: '',
    state: '',
    country: '',
    pincode: '',
    saveAsDefault: true
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        houseNo: initialData.houseNo || '',
        street: initialData.street || '',
        area: initialData.area || '',
        city: initialData.city || '',
        district: initialData.district || '',
        state: initialData.state || '',
        country: initialData.country || '',
        pincode: initialData.pincode || '',
        saveAsDefault: initialData.saveAsDefault ?? true
      });
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-decor-ivory w-full max-w-2xl rounded-sm shadow-xl border border-decor-cream flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-decor-cream bg-decor-beige/50">
          <div>
            <h2 className="font-serif text-2xl font-light text-decor-black">{title || "Delivery Address"}</h2>
            <p className="text-[10px] uppercase tracking-widest text-decor-gold mt-1">Complete Your Details</p>
          </div>
          <button onClick={onClose} className="p-2 text-decor-stone hover:text-decor-black transition-colors rounded-full hover:bg-black/5">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="addressForm" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Personal Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-decor-stone font-medium block">Full Name</label>
                <div className="relative flex items-center border-b border-decor-cream focus-within:border-decor-gold py-1.5 transition-colors">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="bg-transparent border-none text-xs text-decor-black placeholder-decor-stone/50 focus:outline-none w-full pr-4 tracking-wide"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-decor-stone font-medium block">Phone Number</label>
                <div className="relative flex items-center border-b border-decor-cream focus-within:border-decor-gold py-1.5 transition-colors">
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-transparent border-none text-xs text-decor-black placeholder-decor-stone/50 focus:outline-none w-full pr-4 tracking-wide"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-decor-stone font-medium block">Email</label>
              <div className="relative flex items-center border-b border-decor-cream focus-within:border-decor-gold py-1.5 transition-colors">
                <Mail size={14} className="text-decor-stone/70 mr-2" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-transparent border-none text-xs text-decor-black placeholder-decor-stone/50 focus:outline-none w-full pr-4 tracking-wide"
                  required
                />
              </div>
            </div>

            {/* House & Street */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-decor-stone font-medium block">House / Flat No.</label>
                <div className="relative flex items-center border-b border-decor-cream focus-within:border-decor-gold py-1.5 transition-colors">
                  <Building size={14} className="text-decor-stone/70 mr-2" />
                  <input
                    type="text"
                    name="houseNo"
                    placeholder="e.g. H.No 12-45"
                    value={formData.houseNo}
                    onChange={handleChange}
                    className="bg-transparent border-none text-xs text-decor-black placeholder-decor-stone/50 focus:outline-none w-full pr-4 tracking-wide"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-decor-stone font-medium block">Street Name</label>
                <div className="relative flex items-center border-b border-decor-cream focus-within:border-decor-gold py-1.5 transition-colors">
                  <MapPin size={14} className="text-decor-stone/70 mr-2" />
                  <input
                    type="text"
                    name="street"
                    placeholder="e.g. MG Road"
                    value={formData.street}
                    onChange={handleChange}
                    className="bg-transparent border-none text-xs text-decor-black placeholder-decor-stone/50 focus:outline-none w-full pr-4 tracking-wide"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Area & City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-decor-stone font-medium block">Area / Locality</label>
                <div className="relative flex items-center border-b border-decor-cream focus-within:border-decor-gold py-1.5 transition-colors">
                  <MapPin size={14} className="text-decor-stone/70 mr-2" />
                  <input
                    type="text"
                    name="area"
                    placeholder="e.g. Near Metro Station"
                    value={formData.area}
                    onChange={handleChange}
                    className="bg-transparent border-none text-xs text-decor-black placeholder-decor-stone/50 focus:outline-none w-full pr-4 tracking-wide"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-decor-stone font-medium block">City</label>
                <div className="relative flex items-center border-b border-decor-cream focus-within:border-decor-gold py-1.5 transition-colors">
                  <Building size={14} className="text-decor-stone/70 mr-2" />
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    className="bg-transparent border-none text-xs text-decor-black placeholder-decor-stone/50 focus:outline-none w-full pr-4 tracking-wide"
                    required
                  />
                </div>
              </div>
            </div>

            {/* District & State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-decor-stone font-medium block">District</label>
                <div className="relative flex items-center border-b border-decor-cream focus-within:border-decor-gold py-1.5 transition-colors">
                  <MapPin size={14} className="text-decor-stone/70 mr-2" />
                  <input
                    type="text"
                    name="district"
                    placeholder="District"
                    value={formData.district}
                    onChange={handleChange}
                    className="bg-transparent border-none text-xs text-decor-black placeholder-decor-stone/50 focus:outline-none w-full pr-4 tracking-wide"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-decor-stone font-medium block">State</label>
                <div className="relative flex items-center border-b border-decor-cream focus-within:border-decor-gold py-1.5 transition-colors">
                  <Globe size={14} className="text-decor-stone/70 mr-2" />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                    className="bg-transparent border-none text-xs text-decor-black placeholder-decor-stone/50 focus:outline-none w-full pr-4 tracking-wide"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Country & Pincode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-decor-stone font-medium block">Country</label>
                <div className="relative flex items-center border-b border-decor-cream focus-within:border-decor-gold py-1.5 transition-colors">
                  <Globe size={14} className="text-decor-stone/70 mr-2" />
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={handleChange}
                    className="bg-transparent border-none text-xs text-decor-black placeholder-decor-stone/50 focus:outline-none w-full pr-4 tracking-wide"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-decor-stone font-medium block">Pincode</label>
                <div className="relative flex items-center border-b border-decor-cream focus-within:border-decor-gold py-1.5 transition-colors">
                  <Mail size={14} className="text-decor-stone/70 mr-2" />
                  <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="bg-transparent border-none text-xs text-decor-black placeholder-decor-stone/50 focus:outline-none w-full pr-4 tracking-wide"
                    required
                  />
                </div>
              </div>
            </div>
            
            {title !== "Edit Profile Address" && (
              <div className="pt-2">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      name="saveAsDefault"
                      checked={formData.saveAsDefault}
                      onChange={handleChange}
                      className="peer appearance-none w-4 h-4 border border-decor-gold/50 rounded-sm checked:bg-decor-gold checked:border-decor-gold transition-colors cursor-pointer" 
                    />
                    <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="text-[11px] text-decor-stone group-hover:text-decor-black transition-colors select-none">
                    Save this as my default profile address
                  </span>
                </label>
              </div>
            )}
            
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-decor-cream bg-decor-beige/30 flex justify-end space-x-4">
          <button 
            type="button" 
            onClick={onClose}
            className="px-6 py-2 border border-decor-cream text-[10px] uppercase tracking-[0.2em] font-medium text-decor-stone hover:text-decor-black hover:border-decor-stone transition-all rounded-sm"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="addressForm"
            className="px-8 py-2 bg-decor-black text-[10px] uppercase tracking-[0.2em] font-medium text-decor-ivory hover:bg-decor-gold transition-all rounded-sm"
          >
            Save Address
          </button>
        </div>

      </div>
    </div>
  );
}
