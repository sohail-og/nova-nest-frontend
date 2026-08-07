import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../services/api';
import { Search as SearchIcon,Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

export default function Search() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await API.get('/api/products');
        setProducts(response.data || []);
      } catch (err) {
        console.error("Failed to load products API in search", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearchChange = (e) => {
    const q = e.target.value;
    if (q) {
      setSearchParams({ q });
    } else {
      setSearchParams({});
    }
  };

  const filteredProducts = products.filter(product => {
    if (!query) return true;
    const nameMatch = product.name?.toLowerCase().includes(query.toLowerCase());
    const descMatch = product.description?.toLowerCase().includes(query.toLowerCase());
    const catMatch = product.category?.categoryName?.toLowerCase().includes(query.toLowerCase());
    return nameMatch || descMatch || catMatch;
  });

  return (
    <div className="min-h-screen bg-decor-ivory text-decor-charcoal py-20 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
      
      {/* Search Header Input */}
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <span className="text-[10px] uppercase tracking-[0.45em] text-decor-gold font-medium block">
          Design Directory
        </span>
        <h1 className="font-serif text-3xl md:text-4xl font-light text-decor-black uppercase tracking-wider">
          Search Products
        </h1>
        
        {/* Search bar container */}
        <div className="relative flex items-center bg-decor-beige border border-decor-cream rounded-sm px-4 py-3 decor-shadow-soft">
          <SearchIcon size={16} className="text-decor-stone mr-3" />
          <input
            type="text"
            placeholder="Type spacing, lighting, table, decor..."
            value={query}
            onChange={handleSearchChange}
            className="bg-transparent border-none text-xs text-decor-black placeholder-decor-stone/50 focus:outline-none w-full tracking-wider"
          />
        </div>
      </div>

      {/* Grid listing */}
      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-decor-gold"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-decor-stone text-xs uppercase tracking-wider font-light">
            No bespoke designs matched "{query}". Please revise keywords.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id || product.productId} className="group flex flex-col space-y-4 bg-decor-beige border border-decor-cream rounded-sm p-4 hover:shadow-sm transition-shadow duration-300 relative">
              
              {/* Cover Image */}
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
                
                {/* Wishlist Button Overlay */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`absolute top-3 right-3 p-2 rounded-full shadow-sm transition-all z-20 ${
                    isInWishlist(product.id || product.productId) 
                      ? 'bg-red-50 text-red-500 border border-red-200' 
                      : 'bg-decor-beige/90 hover:bg-decor-beige text-decor-stone hover:text-decor-black'
                  }`}
                >
                  <Heart size={12} fill={isInWishlist(product.id || product.productId) ? "currentColor" : "none"} />
                </button>
              </div>

              {/* Info Details */}
              <div className="flex-1 flex flex-col space-y-1.5 text-center">
                <span className="text-[9px] uppercase tracking-widest text-decor-stone">{product.category?.categoryName}</span>
                <Link to={`/products/${product.id || product.productId}`} className="hover:text-decor-gold transition-colors">
                  <h3 className="font-serif text-sm tracking-wide text-decor-black line-clamp-1">{product.name}</h3>
                </Link>
                <p className="text-xs font-medium text-decor-gold">{inrFormatter.format(product.price)}</p>
              </div>

              {/* Add to Bag CTA */}
              <button
                onClick={() => addToCart(product.id || product.productId, 1)}
                className="w-full bg-decor-black hover:bg-decor-stone text-decor-ivory text-[9px] tracking-widest uppercase py-2.5 font-medium transition-colors duration-300 rounded-sm flex items-center justify-center space-x-1.5"
              >
                <ShoppingBag size={12} />
                <span>Add to bag</span>
              </button>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
