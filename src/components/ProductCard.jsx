
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id || product.productId, 1);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  const isLiked = isInWishlist(product.id || product.productId);

  return (
    <div className="group flex flex-col space-y-4 text-left relative bg-decor-beige border border-decor-cream rounded-sm p-3 transition-all duration-300 hover:shadow-md">
      
      {/* Image Container with Luxury Hover and Overlays */}
      <div className="relative overflow-hidden aspect-[4/5] bg-decor-beige rounded-sm">
        <Link to={`/products/${product.id || product.productId}`} className="w-full h-full block">
          <img 
            src={product.imageUrl || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=400&auto=format&fit=crop"} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        
        {/* Wishlist Icon top right */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-20 p-2 bg-decor-beige/85 hover:bg-decor-black border border-decor-cream text-decor-stone hover:text-white rounded-full transition-all duration-300 shadow-sm cursor-pointer"
        >
          <Heart size={13} className={isLiked ? "fill-red-500 text-red-500" : ""} />
        </button>

        {/* Quick View and Add to Cart Hover overlay */}
        <div className="absolute inset-0 bg-decor-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3 z-10">
          <button 
            onClick={handleQuickView}
            className="p-3 bg-white/95 hover:bg-decor-gold border border-decor-cream text-decor-black hover:text-white rounded-full transition-all duration-300 shadow-md cursor-pointer"
            title="Quick View"
          >
            <Eye size={14} />
          </button>
          <button 
            onClick={handleAddToCart}
            className="p-3 bg-white/95 hover:bg-decor-gold border border-decor-cream text-decor-black hover:text-white rounded-full transition-all duration-300 shadow-md cursor-pointer"
            title="Add To Cart"
          >
            <ShoppingBag size={14} />
          </button>
        </div>
      </div>

      {/* Info Block */}
      <div className="space-y-1 mt-1">
        <div className="flex justify-between items-baseline">
          <span className="text-[8px] uppercase tracking-widest text-decor-stone font-light">
            {product.category?.categoryName || product.categoryName || 'Bespoke Accent'}
          </span>
          
          {/* Rating stars */}
          <div className="text-decor-gold text-[9px] tracking-widest">★★★★★</div>
        </div>
        <Link to={`/products/${product.id || product.productId}`}>
          <h3 className="font-serif text-sm tracking-wide text-decor-black group-hover:text-decor-gold transition-colors font-medium line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs font-serif text-decor-gold font-semibold">{inrFormatter.format(product.price)}</p>
      </div>
    </div>
  );
}
