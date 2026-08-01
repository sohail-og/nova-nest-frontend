import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'react-toastify';
import { Heart, ShoppingBag, ArrowLeft, Star, Shield, Truck, RotateCcw } from 'lucide-react';

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [activeImage, setActiveImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const prodRes = await axios.get(`http://localhost:8080/api/products/${id}`);
        setProduct(prodRes.data);

        // Fetch matching product images
        try {
          const imgRes = await axios.get(`http://localhost:8080/api/productimages/product/${id}`);
          const imageList = imgRes.data || [];
          setImages(imageList);
          if (imageList.length > 0) {
            setActiveImage(imageList[0].imageUrl);
          } else {
            setActiveImage('/api/placeholder/600/700');
          }
        } catch (imgErr) {
          console.error("Failed to load product images details", imgErr);
          setActiveImage('/api/placeholder/600/700');
        }
      } catch (err) {
        console.error("Failed to fetch product details", err);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    const success = await addToCart(product.id || product.productId, quantity);
    if (success) {
      toast.success(`${product.name} added to your bag`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-decor-ivory">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-decor-gold"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] bg-decor-ivory flex flex-col justify-center items-center space-y-4">
        <h3 className="font-serif text-2xl text-decor-black uppercase tracking-wider">Product Not Found</h3>
        <Link to="/products" className="text-xs uppercase tracking-widest text-decor-gold hover:underline">
          Back to Index
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-decor-ivory text-decor-charcoal py-20 px-6 md:px-12 max-w-7xl mx-auto">
      
      {/* Back Link */}
      <button 
        onClick={() => navigate(-1)} 
        className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-widest text-decor-stone hover:text-decor-black transition-colors mb-12"
      >
        <ArrowLeft size={12} />
        <span>Back to Collection</span>
      </button>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        
        {/* Images Component */}
        <div className="space-y-4">
          <div className="aspect-[4/5] bg-decor-beige border border-decor-cream rounded-sm overflow-hidden relative">
            <img 
              src={activeImage} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
            {product.discount > 0 && (
              <span className="absolute top-4 left-4 bg-decor-gold text-decor-ivory text-[9px] uppercase tracking-widest px-2 py-0.5 z-10">
                -{product.discount}% OFF
              </span>
            )}
          </div>
          
          {/* Thumbnails slider */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto py-1">
              {images.map((img) => (
                <button
                  key={img.imageId}
                  onClick={() => setActiveImage(img.imageUrl)}
                  className={`w-20 aspect-[4/5] rounded-sm overflow-hidden border transition-all ${
                    activeImage === img.imageUrl ? 'border-decor-gold' : 'border-decor-cream opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.imageUrl} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Column */}
        <div className="space-y-6 flex flex-col justify-center">
          
          {/* Tag & Name */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-decor-gold block">
              {product.category?.categoryName || 'Bespoke Item'}
            </span>
            <h1 className="font-serif text-3xl md:text-4xl text-decor-black uppercase tracking-wide leading-tight">
              {product.name}
            </h1>
            
            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex text-decor-gold">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={12} 
                    fill={i < Math.round(product.rating || 4.5) ? "currentColor" : "none"} 
                    className="stroke-[1.5]"
                  />
                ))}
              </div>
              <span className="text-[10px] text-decor-stone font-light font-sans mt-0.5">({product.rating || 4.5} rating)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline space-x-3 border-t border-b border-decor-cream/50 py-4">
            <span className="text-2xl font-serif text-decor-gold">
              {inrFormatter.format(product.price * (1 - (product.discount || 0) / 100))}
            </span>
            {product.discount > 0 && (
              <span className="text-sm text-decor-stone line-through font-light">
                {inrFormatter.format(product.price)}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-[10px] uppercase tracking-widest text-decor-stone font-medium">Description</h3>
            <p className="text-xs text-decor-stone font-light leading-relaxed tracking-wide">
              {product.description || "Crafted to capture a delicate balance between function and form. This luxury architectural element is designed with select materials to add subtle design accents and texture depth inside modern residential spaces."}
            </p>
          </div>

          {/* Quantity Selector & Stock check */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-4">
              <span className="text-[10px] uppercase tracking-widest text-decor-stone font-medium">Quantity</span>
              <div className="flex items-center border border-decor-cream rounded-sm">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="px-3 py-1.5 text-decor-stone hover:text-decor-black transition-colors"
                >
                  -
                </button>
                <span className="px-4 text-xs font-medium text-decor-black">{quantity}</span>
                <button 
                  onClick={() => setQuantity(prev => Math.min(product.stock || 99, prev + 1))}
                  className="px-3 py-1.5 text-decor-stone hover:text-decor-black transition-colors"
                >
                  +
                </button>
              </div>
              <span className="text-[10px] text-decor-stone font-light">
                {product.stock > 0 ? `${product.stock} units available` : 'Out of stock'}
              </span>
            </div>

            {/* CTA Action Buttons */}
            <div className="flex space-x-4 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 bg-decor-black hover:bg-decor-stone disabled:bg-decor-cream text-decor-ivory text-[10px] tracking-[0.25em] uppercase py-3.5 font-medium transition-all duration-300 rounded-sm shadow-sm flex items-center justify-center space-x-2"
              >
                <ShoppingBag size={14} />
                <span>Add To Shopping Bag</span>
              </button>
              
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-sm border transition-all ${
                  isInWishlist(product.id || product.productId) 
                    ? 'border-red-400 text-red-500 bg-red-50/10' 
                    : 'border-decor-cream text-decor-stone hover:text-decor-black hover:bg-decor-beige'
                }`}
              >
                <Heart size={14} fill={isInWishlist(product.id || product.productId) ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          {/* Luxury benefits list */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-decor-cream/50">
            <div className="flex flex-col items-center text-center space-y-1.5">
              <Truck size={14} className="text-decor-gold" />
              <span className="text-[8px] uppercase tracking-widest text-decor-stone font-medium">Express Delivery</span>
            </div>
            <div className="flex flex-col items-center text-center space-y-1.5">
              <Shield size={14} className="text-decor-gold" />
              <span className="text-[8px] uppercase tracking-widest text-decor-stone font-medium">Bespoke Quality</span>
            </div>
            <div className="flex flex-col items-center text-center space-y-1.5">
              <RotateCcw size={14} className="text-decor-gold" />
              <span className="text-[8px] uppercase tracking-widest text-decor-stone font-medium">30-Day Exchange</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
