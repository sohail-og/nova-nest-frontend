import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, Eye, ShoppingBag, SlidersHorizontal, Star, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import axios from 'axios';

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Quick View Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quickViewImages, setQuickViewImages] = useState([]);
  const [quickViewActiveImage, setQuickViewActiveImage] = useState('');
  const [quickViewQty, setQuickViewQty] = useState(1);

  const handleQuickView = async (product) => {
    setSelectedProduct(product);
    setQuickViewQty(1);
    setQuickViewActiveImage(product.imageUrl || '/api/placeholder/600/700');
    setQuickViewImages([]);
    try {
      const response = await axios.get(`http://localhost:8080/api/productimages/product/${product.id}`);
      const imageList = response.data || [];
      setQuickViewImages(imageList);
      if (imageList.length > 0) {
        setQuickViewActiveImage(imageList[0].imageUrl);
      }
    } catch (err) {
      console.error("Failed to load quick view images", err);
    }
  };

  const handleBuyNow = async (product) => {
    const success = await addToCart(product.id, quickViewQty);
    if (success) {
      setSelectedProduct(null);
      navigate('/cart');
    }
  };

  // API State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default'); // 'default', 'price-asc', 'price-desc'

  // Sync state if search params category changes
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'All');
  }, [searchParams]);

  // Log API Errors explicitly in browser console
  const logApiError = (error) => {
    if (error.response) {
      console.error(
        "API Request Failed!",
        `\nURL: ${error.config?.url}`,
        `\nStatus Code: ${error.response.status}`,
        `\nResponse Data:`, error.response.data
      );
    } else {
      console.error("API Request Failed with network error!", `\nURL: ${error.config?.url}`, error.message);
    }
  };

  // Fetch Category, Product & Image data from backend and join them
  useEffect(() => {
    const fetchECommerceData = async () => {
      setLoading(true);
      try {
        // Fetch Categories
        const catRes = await axios.get('http://localhost:8080/api/categories')
          .catch(err => {
            logApiError(err);
            throw err;
          });

        // Fetch Products
        const prodRes = await axios.get('http://localhost:8080/api/products')
          .catch(err => {
            logApiError(err);
            throw err;
          });

        // Fetch Product Images
        const imgRes = await axios.get('http://localhost:8080/api/productimages')
          .catch(err => {
            logApiError(err);
            throw err;
          });

        const rawCategories = catRes.data || [];
        const rawProducts = prodRes.data || [];
        const rawImages = imgRes.data || [];

        // Join Category and Product Images onto the Product Object
        const joined = rawProducts.map(prod => {
          // Find matching images for this product
          const matchedImages = rawImages.filter(img => img.product && img.product.id === prod.id);
          const firstImage = matchedImages.length > 0 ? matchedImages[0].imageUrl : '/api/placeholder/450/560';

          return {
            ...prod,
            imageUrl: firstImage,
            allImages: matchedImages.map(img => img.imageUrl),
            // Fallback category resolution if needed
            resolvedCategoryName: prod.category?.categoryName || 'Home Accessories'
          };
        });

        setCategories(rawCategories);
        setProducts(joined);
      } catch (err) {
        console.error("Error building products data layer:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchECommerceData();
  }, []);

  // Filter & Sort Logic
  const filteredProducts = products
    .filter(prod => {
      const matchCat = selectedCategory === 'All' || prod.resolvedCategoryName === selectedCategory;
      const matchSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (prod.description && prod.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0; // default order
    });

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    if (categoryName === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', categoryName);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="w-full min-h-screen bg-decor-ivory text-decor-charcoal pt-12 pb-24 px-6 md:px-8 selection:bg-decor-gold/20">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Page Header */}
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <span className="text-[10px] uppercase tracking-[0.45em] text-decor-gold font-medium block">
            Bespoke Living
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-decor-black uppercase tracking-wider">
            The Collections
          </h1>
          <div className="w-12 h-[1px] bg-decor-gold/30 mx-auto" />
          <p className="text-xs text-decor-stone font-light leading-relaxed tracking-wide">
            Browse our hand-curated catalog of architectural sideboards, minimalist travertine tables, modular bouclé sofas, and artisanal lighting fixtures.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center border-y border-decor-cream/40 py-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <button
              onClick={() => handleCategorySelect('All')}
              className={`px-4 py-2 text-[10px] uppercase tracking-widest transition-all duration-300 rounded-sm font-medium ${
                selectedCategory === 'All'
                  ? 'bg-decor-black text-decor-ivory'
                  : 'bg-transparent text-decor-stone hover:text-decor-black hover:bg-decor-beige'
              }`}
            >
              All Spaces
            </button>
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => handleCategorySelect(cat.categoryName)}
                className={`px-4 py-2 text-[10px] uppercase tracking-widest transition-all duration-300 rounded-sm font-medium ${
                  selectedCategory === cat.categoryName
                    ? 'bg-decor-black text-decor-ivory'
                    : 'bg-transparent text-decor-stone hover:text-decor-black hover:bg-decor-beige'
                }`}
              >
                {cat.categoryName}
              </button>
            ))}
          </div>

          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex items-center w-full sm:w-64 border-b border-decor-cream focus-within:border-decor-gold transition-colors py-1.5">
              <input
                type="text"
                placeholder="Search collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-xs text-decor-black placeholder-decor-stone/55 focus:outline-none w-full pr-8 tracking-wide"
              />
              <Search size={14} className="absolute right-0 text-decor-stone" />
            </div>

            {/* Sort Selector */}
            <div className="relative border-b border-decor-cream py-1.5 min-w-44">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none text-xs text-decor-black focus:outline-none w-full uppercase tracking-wider pr-4 cursor-pointer"
              >
                <option value="default">Sort: Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-32 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-decor-gold"></div>
          </div>
        ) : (
          /* Products Grid */
          <div className="space-y-12">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-24 border border-dashed border-decor-cream rounded-sm space-y-4">
                <SlidersHorizontal className="mx-auto text-decor-stone stroke-[1.2]" size={36} />
                <p className="text-xs text-decor-stone font-light tracking-wide uppercase">No items found matching your filters.</p>
              </div>
            ) : (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12"
              >
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      key={product.id}
                      className="group flex flex-col space-y-4 relative"
                    >
                      {/* Product Card Image Container */}
                      <div className="relative overflow-hidden aspect-[4/5] bg-decor-beige border border-decor-cream rounded-sm group decor-shadow-soft">
                        
                        {/* Hover Zoom Image */}
                        <img
                          src={product.imageUrl || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=400&auto=format&fit=crop"}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-[1.2s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=400&auto=format&fit=crop";
                          }}
                        />

                        {/* Transient Discount Tag */}
                        {product.discount && parseFloat(product.discount.toString()) > 0 && (
                          <div className="absolute top-4 left-4 bg-decor-gold text-decor-ivory text-[9px] uppercase tracking-widest px-2 py-0.5 z-20">
                            -{product.discount}%
                          </div>
                        )}
                        {/* Wishlist Button Overlay */}
                          <button 
                            onClick={() => toggleWishlist(product)}
                            className={`absolute top-4 right-4 bg-decor-beige/85 hover:bg-decor-beige p-2 rounded-full z-20 transition-colors duration-300 shadow-sm ${
                              isInWishlist(product.id) ? 'text-red-500' : 'text-decor-stone hover:text-red-500'
                            }`}
                          >
                            <Heart size={14} fill={isInWishlist(product.id) ? "currentColor" : "none"} className="stroke-[1.5]" />
                          </button>
 
                         {/* Action Overlays on Hover */}
                         <div className="absolute inset-0 bg-decor-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex flex-col justify-end p-4 space-y-2">
                           <div className="flex gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                        {/* Quick View Button */}
                             <button 
                               onClick={() => handleQuickView(product)}
                               className="flex-1 bg-decor-ivory hover:bg-decor-beige text-decor-black text-[9px] uppercase tracking-widest py-2.5 font-medium flex items-center justify-center space-x-1.5 transition-colors duration-300 rounded-sm shadow-sm"
                             >
                               <Eye size={12} />
                               <span>Quick View</span>
                             </button>
 
                             {/* Add To Cart Button */}
                             <button 
                               onClick={() => addToCart(product.id, 1)}
                               disabled={product.stock <= 0}
                               className="bg-decor-black hover:bg-decor-stone disabled:bg-decor-cream text-decor-ivory p-2.5 transition-colors duration-300 rounded-sm shadow-sm"
                             >
                               <ShoppingBag size={14} />
                             </button>
                            
                           </div>
                         </div>
                      </div>

                      {/* Product Card Details */}
                      <div className="space-y-1.5 text-center">
                        {/* Category Label */}
                        <span className="text-[9px] uppercase tracking-[0.2em] text-decor-stone font-medium block">
                          {product.resolvedCategoryName}
                        </span>

                        {/* Product Title */}
                        <h3 className="font-serif text-base text-decor-black hover:text-decor-gold transition-colors duration-300 tracking-wide font-light">
                          {product.name}
                        </h3>

                        {/* Ratings */}
                        <div className="flex justify-center items-center space-x-1 text-decor-gold">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={10} 
                              fill={i < Math.round(product.rating || 4.5) ? "currentColor" : "none"} 
                              className="stroke-[1.5]"
                            />
                          ))}
                          <span className="text-[9px] text-decor-stone font-light pl-1 font-sans">
                            ({product.rating || '4.5'})
                          </span>
                        </div>

                        {/* Pricing */}
                        <div className="flex items-center justify-center space-x-2 text-xs">
                          <span className="font-medium text-decor-black">{inrFormatter.format(product.price)}</span>
                        </div>
                      </div>

                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        )}

      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-decor-black/60 backdrop-blur-sm">
            {/* Modal Backdrop click to close */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-4xl bg-decor-beige border border-decor-cream rounded-sm p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 z-10 max-h-[90vh] overflow-y-auto decor-shadow-soft text-decor-charcoal"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 text-decor-stone hover:text-decor-black transition-colors"
              >
                <X size={18} className="stroke-[1.5]" />
              </button>

              {/* Left Column: Image Slider */}
              <div className="space-y-4">
                <div className="aspect-[4/5] bg-decor-cream rounded-sm overflow-hidden relative">
                  <img 
                    src={quickViewActiveImage} 
                    alt={selectedProduct.name} 
                    className="w-full h-full object-cover"
                  />
                  {selectedProduct.discount > 0 && (
                    <span className="absolute top-3 left-3 bg-decor-gold text-decor-ivory text-[9px] uppercase tracking-widest px-2 py-0.5">
                      -{selectedProduct.discount}%
                    </span>
                  )}
                </div>

                {quickViewImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto py-1">
                    {quickViewImages.map((img) => (
                      <button
                        key={img.imageId}
                        onClick={() => setQuickViewActiveImage(img.imageUrl)}
                        className={`w-14 aspect-[4/5] rounded-sm overflow-hidden border transition-all ${
                          quickViewActiveImage === img.imageUrl ? 'border-decor-gold' : 'border-decor-cream opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img.imageUrl} alt="thumb" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Details Info */}
              <div className="space-y-5 flex flex-col justify-center">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-widest text-decor-gold block">
                    {selectedProduct.resolvedCategoryName}
                  </span>
                  <h2 className="font-serif text-2xl text-decor-black uppercase tracking-wide">
                    {selectedProduct.name}
                  </h2>
                  <div className="flex items-center space-x-1.5 text-decor-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={10} 
                        fill={i < Math.round(selectedProduct.rating || 4.5) ? "currentColor" : "none"} 
                        className="stroke-[1.5]"
                      />
                    ))}
                    <span className="text-[9px] text-decor-stone pl-0.5">({selectedProduct.rating || 4.5})</span>
                  </div>
                </div>

                <div className="text-sm font-medium text-decor-gold border-t border-b border-decor-cream/50 py-3">
                  {inrFormatter.format(selectedProduct.price)}
                </div>

                <div className="space-y-1">
                  <h4 className="text-[9px] uppercase tracking-widest text-decor-stone font-medium">Description</h4>
                  <p className="text-xs text-decor-stone font-light leading-relaxed">
                    {selectedProduct.description || "Crafted to capture a delicate balance between function and form. This luxury architectural element is designed with select materials to add subtle design accents and texture depth inside modern residential spaces."}
                  </p>
                </div>

                {/* Qty Selector & stock check */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-[9px] uppercase tracking-widest text-decor-stone font-medium">Qty</span>
                    <div className="flex items-center border border-decor-cream rounded-sm">
                      <button 
                        onClick={() => setQuickViewQty(prev => Math.max(1, prev - 1))}
                        className="px-2.5 py-1 text-decor-stone hover:text-decor-black"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-medium text-decor-black">{quickViewQty}</span>
                      <button 
                        onClick={() => setQuickViewQty(prev => Math.min(selectedProduct.stock || 99, prev + 1))}
                        className="px-2.5 py-1 text-decor-stone hover:text-decor-black"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-[9px] text-decor-stone font-light">
                      {selectedProduct.stock > 0 ? `${selectedProduct.stock} available` : 'Out of stock'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => addToCart(selectedProduct.id, quickViewQty)}
                      disabled={selectedProduct.stock <= 0}
                      className="flex-1 bg-decor-black hover:bg-decor-stone disabled:bg-decor-cream text-decor-ivory text-[9px] tracking-widest uppercase py-3 font-medium transition-colors duration-300 rounded-sm shadow-sm flex items-center justify-center space-x-1.5"
                    >
                      <ShoppingBag size={12} />
                      <span>Add to bag</span>
                    </button>

                    <button
                      onClick={() => handleBuyNow(selectedProduct)}
                      disabled={selectedProduct.stock <= 0}
                      className="flex-1 bg-decor-gold hover:bg-decor-gold-light disabled:bg-decor-cream text-decor-ivory text-[9px] tracking-widest uppercase py-3 font-medium transition-colors duration-300 rounded-sm shadow-sm flex items-center justify-center"
                    >
                      <span>Buy Now</span>
                    </button>

                    <button
                      onClick={() => toggleWishlist(selectedProduct)}
                      className={`p-3 rounded-sm border transition-colors ${
                        isInWishlist(selectedProduct.id) 
                          ? 'border-red-400 text-red-500 bg-red-50/10' 
                          : 'border-decor-cream text-decor-stone hover:text-decor-black'
                      }`}
                    >
                      <Heart size={12} fill={isInWishlist(selectedProduct.id) ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
