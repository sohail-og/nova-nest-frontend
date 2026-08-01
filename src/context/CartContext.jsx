import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const loadCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCartItems([]);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/cart', { headers: getHeaders() });
      setCartItems(response.data || []);
    } catch (err) {
      console.error("Failed to load cart from backend API", err.config?.url, err.response?.status);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const addToCart = async (productId, quantity = 1) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.info("Please login to manage your shopping cart");
      return false;
    }
    try {
      await axios.post('http://localhost:8080/api/cart', { productId, quantity }, { headers: getHeaders() });
      toast.success("Added to shopping bag successfully");
      loadCart();
      return true;
    } catch (err) {
      console.error("Failed to add to cart API", err.config?.url, err.response?.status);
      toast.error("Failed to add to cart");
      return false;
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      return removeFromCart(cartItemId);
    }
    try {
      await axios.put(`http://localhost:8080/api/cart/${cartItemId}`, { quantity: newQuantity }, { headers: getHeaders() });
      loadCart();
      return true;
    } catch (err) {
      console.error("Failed to update cart quantity API", err.config?.url, err.response?.status);
      toast.error("Failed to update quantity");
      return false;
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await axios.delete(`http://localhost:8080/api/cart/${cartItemId}`, { headers: getHeaders() });
      toast.success("Removed from shopping bag");
      loadCart();
      return true;
    } catch (err) {
      console.error("Failed to remove from cart API", err.config?.url, err.response?.status);
      toast.error("Failed to remove item");
      return false;
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete('http://localhost:8080/api/cart/clear', { headers: getHeaders() });
      setCartItems([]);
      return true;
    } catch (err) {
      console.error("Failed to clear cart API", err.config?.url, err.response?.status);
      return false;
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product?.price || 0;
    return acc + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      loadCart,
      cartCount,
      subtotal
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
