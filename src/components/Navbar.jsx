import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Heart, User, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { cartCount } = useCart();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('username') || !!localStorage.getItem('token');

  const authRoutes = ['/login', '/register', '/forgot-password', '/verify-otp', '/reset-password', '/admin/login'];
  const isAuthPage = authRoutes.includes(location.pathname);

  return (
    <header className="sticky top-0 z-50 w-full glass-panel-light border-b border-decor-cream/50 decor-shadow-soft">
      <div className={`max-w-7xl mx-auto px-6 h-22 flex items-center ${isAuthPage ? 'justify-center' : 'justify-between'}`}>
        
        {/* Mobile Menu Button */}
        {!isAuthPage && (
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-decor-stone hover:text-decor-gold transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}

        {/* Brand Logo - Serif and High End */}
        <Link to="/" className="flex flex-col items-center">
          <span className="font-serif text-2xl tracking-[0.25em] font-light text-decor-black hover:text-decor-gold transition-colors duration-300">
            NOVA<span className="text-decor-gold">NEST</span>
          </span>
          <span className="text-[8px] tracking-[0.45em] font-light text-decor-stone uppercase -mt-1">
            Bespoke Living
          </span>
        </Link>

        {/* Home Decor Oriented Navigation Links */}
        {!isAuthPage && (
          <nav className="hidden md:flex items-center space-x-12">
            <Link to="/" className="text-[11px] tracking-[0.25em] uppercase text-decor-stone hover:text-decor-gold font-medium transition-all duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-decor-gold after:transition-all after:duration-300 hover:after:w-full">
              Home
            </Link>
            <Link to="/products" className="text-[11px] tracking-[0.25em] uppercase text-decor-stone hover:text-decor-gold font-medium transition-all duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-decor-gold after:transition-all after:duration-300 hover:after:w-full">
              Collections
            </Link>
            <Link to="/categories" className="text-[11px] tracking-[0.25em] uppercase text-decor-stone hover:text-decor-gold font-medium transition-all duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-decor-gold after:transition-all after:duration-300 hover:after:w-full">
              Categories
            </Link>
          </nav>
        )}

        {/* Utility Icons */}
        {!isAuthPage && (
          <div className="flex items-center space-x-6 text-decor-stone">
            
            {/* Theme Toggle Placeholder */}
            <button 
              onClick={toggleTheme}
              className="hover:text-decor-gold transition-colors duration-300"
            >
              {theme === 'dark' ? <Sun size={18} className="stroke-[1.5]" /> : <Moon size={18} className="stroke-[1.5]" />}
            </button>

            {/* Animated Search Indicator */}
            <div className="relative flex items-center">
              <AnimatePresence>
                {searchOpen && (
                  <motion.input
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 180, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    type="text"
                    placeholder="Search collections..."
                    className="bg-decor-ivory border border-decor-cream text-xs tracking-wider text-decor-black px-3 py-1.5 rounded-full focus:outline-none focus:border-decor-gold/50 mr-2"
                  />
                )}
              </AnimatePresence>
              <button 
                onClick={() => setSearchOpen(!searchOpen)} 
                className="hover:text-decor-gold transition-colors duration-300"
              >
                <Search size={18} className="stroke-[1.5]" />
              </button>
            </div>

            <Link to="/wishlist" className="hover:text-decor-gold transition-colors duration-300 relative">
              <Heart size={18} className="stroke-[1.5]" />
            </Link>

            <Link to="/cart" className="hover:text-decor-gold transition-colors duration-300 relative">
              <ShoppingBag size={18} className="stroke-[1.5]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-decor-gold text-[9px] text-white w-4.5 h-4.5 flex items-center justify-center rounded-full font-sans font-medium">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link to={isLoggedIn ? "/profile" : "/login"} className="hover:text-decor-gold transition-colors duration-300">
              <User size={18} className="stroke-[1.5]" />
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && !isAuthPage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden w-full bg-decor-beige/95 border-b border-decor-cream px-6 py-8 flex flex-col space-y-6"
          >
            <Link 
              to="/" 
              onClick={() => setIsOpen(false)}
              className="text-xs tracking-[0.25em] uppercase text-decor-stone hover:text-decor-gold"
            >
              Home
            </Link>
            <Link 
              to="/products" 
              onClick={() => setIsOpen(false)}
              className="text-xs tracking-[0.25em] uppercase text-decor-stone hover:text-decor-gold"
            >
              Collections
            </Link>
            <Link 
              to="/categories" 
              onClick={() => setIsOpen(false)}
              className="text-xs tracking-[0.25em] uppercase text-decor-stone hover:text-decor-gold"
            >
              Categories
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
