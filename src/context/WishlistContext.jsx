/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { toast } from 'react-toastify';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadWishlist = async () => {
    const username = localStorage.getItem('username') || localStorage.getItem('token');
    if (!username) {
      setWishlistItems([]);
      return;
    }
    setLoading(true);
    try {
      const response = await API.get('/api/wishlist');
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
    const username = localStorage.getItem('username') || localStorage.getItem('token');
    if (!username) {
      toast.info("Please login to manage your wishlist");
      return;
    }
    try {
      const response = await API.post(
        '/api/wishlist/toggle',
        { productId: product.id || product.productId }
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
