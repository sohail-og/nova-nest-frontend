
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

export default function Wishlist() {
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = async (product) => {
    const success = await addToCart(product.id || product.productId, 1);
    if (success) {
      toggleWishlist(product); // Remove from wishlist on successful add
    }
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="py-32 px-8 text-center bg-decor-ivory min-h-[70vh] flex flex-col justify-center items-center">
        <span className="text-[10px] uppercase tracking-[0.4em] text-decor-gold block mb-3">Your Curation</span>
        <h2 className="font-serif text-3xl text-decor-black uppercase font-light tracking-widest">Wishlist is Empty</h2>
        <div className="w-12 h-[1px] bg-decor-gold/30 my-6" />
        <p className="text-decor-stone text-xs uppercase tracking-wider font-light mb-8 max-w-sm leading-relaxed">
          Save your favorite bespoke furniture, lighting fixtures, and accents to review them here later.
        </p>
        <Link 
          to="/products"
          className="inline-flex items-center space-x-3 px-6 py-3 bg-decor-black hover:bg-decor-stone text-[10px] tracking-widest uppercase font-medium text-decor-ivory transition-colors duration-300 rounded-sm"
        >
          <span>Browse Collection</span>
          <ArrowRight size={12} />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-decor-ivory text-decor-charcoal py-20 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-xl mx-auto">
        <span className="text-[10px] uppercase tracking-[0.45em] text-decor-gold font-medium block">
          Private Curation
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-light text-decor-black uppercase tracking-wider">
          Wishlist
        </h1>
        <div className="w-12 h-[1px] bg-decor-gold/30 mx-auto" />
        <p className="text-xs text-decor-stone font-light leading-relaxed tracking-wide">
          Bespoke items and luxury home designs you have selected for your architectural spaces.
        </p>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {wishlistItems.map((product) => (
          <div key={product.id || product.productId} className="group flex flex-col space-y-4 bg-decor-beige border border-decor-cream rounded-sm p-4 hover:shadow-sm transition-shadow duration-300 relative">
            
            {/* Image Layer */}
            <div className="relative aspect-[4/5] bg-decor-cream rounded-sm overflow-hidden">
              <img
                src={product.imageUrl || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=400&auto=format&fit=crop"}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=400&auto=format&fit=crop";
                }}
              />
              <button 
                onClick={() => toggleWishlist(product)}
                className="absolute top-3 right-3 bg-decor-beige/90 hover:bg-decor-beige text-red-400 hover:text-red-600 p-2 rounded-full z-20 shadow-sm transition-colors duration-300"
                title="Remove Item"
              >
                <Trash2 size={12} />
              </button>
            </div>

            {/* Info details */}
            <div className="flex-1 flex flex-col space-y-2 text-center pt-2">
              <span className="text-[9px] uppercase tracking-widest text-decor-stone">{product.category?.categoryName}</span>
              <Link to={`/products/${product.id || product.productId}`} className="hover:text-decor-gold transition-colors">
                <h3 className="font-serif text-base tracking-wide text-decor-black line-clamp-1">{product.name}</h3>
              </Link>
              <p className="text-xs font-medium text-decor-gold">{inrFormatter.format(product.price)}</p>
            </div>

            {/* CTA add to shopping bag */}
            <button
              onClick={() => handleMoveToCart(product)}
              className="w-full bg-decor-black hover:bg-decor-stone text-decor-ivory text-[9px] tracking-widest uppercase py-2.5 font-medium transition-colors duration-300 rounded-sm flex items-center justify-center space-x-1.5"
            >
              <ShoppingBag size={12} />
              <span>Add to bag</span>
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}
