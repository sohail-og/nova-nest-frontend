import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const loadWishlist = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setWishlistItems([]);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/wishlist', { headers: getHeaders() });
      // Map WishlistItem entities to product list
      const products = (response.data || []).map(item => item.product);
      setWishlistItems(products);
    } catch (err) {
      console.error("Failed to load wishlist from API", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const toggleWishlist = async (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.info("Please login to manage your wishlist");
      return;
    }
    try {
      const response = await axios.post(
        'http://localhost:8080/api/wishlist/toggle',
        { productId: product.id || product.productId },
        { headers: getHeaders() }
      );
      
      const { status, message } = response.data;
      if (status === 'added') {
        toast.success(message || "Added to wishlist");
        setWishlistItems(prev => [...prev, product]);
      } else {
        toast.info(message || "Removed from wishlist");
        setWishlistItems(prev => prev.filter(item => (item.id || item.productId) !== (product.id || product.productId)));
      }
    } catch (err) {
      console.error("Failed to toggle wishlist", err);
      toast.error("Failed to update wishlist");
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => (item.id || item.productId) === productId);
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      loading,
      toggleWishlist,
      isInWishlist,
      loadWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
