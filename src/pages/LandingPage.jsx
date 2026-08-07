import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MoveRight, Star, X, Heart, ShoppingBag } from 'lucide-react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

// Fallback images map for categories to ensure uniqueness
const categoryFallbackImages = {
  'living room': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop',
  'bedroom': 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=800&auto=format&fit=crop',
  'dining room': 'https://images.unsplash.com/photo-1617806118233-18e1db207f62?q=80&w=800&auto=format&fit=crop',
  'dining': 'https://images.unsplash.com/photo-1617806118233-18e1db207f62?q=80&w=800&auto=format&fit=crop',
  'kitchen': 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop',
  'office': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop',
  'workspace': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop',
  'office / workspace': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop',
  'outdoor': 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800&auto=format&fit=crop',
  'lighting': 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=800&auto=format&fit=crop',
  'furniture': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop',
  'decorative items': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop',
  'home accessories': 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?q=80&w=800&auto=format&fit=crop'
};

const getCategoryImage = (cat) => {
  if (cat.categoryImage && cat.categoryImage.trim() !== '') {
    return cat.categoryImage;
  }
  const name = cat.categoryName?.toLowerCase() || '';
  for (const [key, value] of Object.entries(categoryFallbackImages)) {
    if (name.includes(key)) {
      return value;
    }
  }
  // Generic fallback based on category ID to keep it deterministic and unique
  const index = (cat.id || 0) % 5;
  const fallbacks = [
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1617806118233-18e1db207f62?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800&auto=format&fit=crop'
  ];
  return fallbacks[index];
};

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

export default function LandingPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  // Fetch Categories & Products from backend
  const [showAddressPrompt, setShowAddressPrompt] = useState(false);

  // Quick View states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quickViewQty, setQuickViewQty] = useState(1);
  const [quickViewImages, setQuickViewImages] = useState([]);
  const [quickViewActiveImage, setQuickViewActiveImage] = useState('');

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const handleQuickView = async (product) => {
    setSelectedProduct(product);
    setQuickViewQty(1);
    setQuickViewActiveImage(product.imageUrl);
    try {
      const res = await API.get(`/api/products/${product.id}`);
      if (res.data && res.data.images) {
        setQuickViewImages(res.data.images);
        if (res.data.images.length > 0) {
          setQuickViewActiveImage(res.data.images[0].imageUrl);
        }
      } else {
        setQuickViewImages([{ imageId: 1, imageUrl: product.imageUrl }]);
      }
    } catch {
      setQuickViewImages([{ imageId: 1, imageUrl: product.imageUrl }]);
    }
  };

  const handleBuyNow = async (product) => {
    await addToCart(product.id, quickViewQty);
    navigate('/checkout');
  };

  // Fetch Categories & Products from backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const catRes = await API.get('/api/categories');
        setCategories(catRes.data || []);
      } catch (err) {
        console.warn("Categories API failed.", err);
      }

      try {
        const prodRes = await API.get('/api/products');
        setProducts(prodRes.data || []);
      } catch (err) {
        console.warn("Products API failed.", err);
      }
      setLoading(false);
    };

    const checkUserAddress = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await API.get('/api/home');
          const data = res.data;
          let hasAddress = false;
          if (data.address && data.address.houseNo && data.address.street && data.address.city) {
            hasAddress = true;
          }
          if (!hasAddress) {
            const alreadyPrompted = sessionStorage.getItem('address_prompt_shown');
            if (!alreadyPrompted) {
              setShowAddressPrompt(true);
              sessionStorage.setItem('address_prompt_shown', 'true');
            }
          }
        } catch (err) {
          console.error("Failed to check user address", err);
        }
      }
    };

    fetchData();
    checkUserAddress();
  }, []);


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-decor-ivory">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-decor-gold mx-auto"></div>
          <p className="text-[10px] tracking-[0.25em] uppercase text-decor-stone font-medium">Entering The Nest...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-decor-ivory text-decor-charcoal selection:bg-decor-gold/20 space-y-24 md:space-y-36 pb-20">
      
      {showAddressPrompt && (
        <div className="bg-decor-gold text-white text-xs py-3 px-8 flex justify-between items-center tracking-wider uppercase font-semibold">
          <span>Please complete your profile by adding your delivery address.</span>
          <div className="flex items-center space-x-6">
            <Link to="/profile" className="underline hover:text-decor-black transition-colors">Go to Profile</Link>
            <button onClick={() => setShowAddressPrompt(false)} className="text-white hover:text-decor-black bg-transparent border-none font-bold text-sm cursor-pointer">×</button>
          </div>
        </div>
      )}
      
      {/* 1. Luxury Hero Banner */}
      <section className="relative w-full h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600&auto=format&fit=crop" 
            alt="Luxury Minimalist Interior" 
            className="w-full h-full object-cover object-center filter brightness-[0.78]"
          />
          {/* Subtle Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-decor-black/60 via-decor-black/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-decor-ivory via-transparent to-transparent/10" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl space-y-6"
          >
            <motion.span 
              variants={itemVariants} 
              className="text-[10px] uppercase tracking-[0.45em] text-decor-gold-light font-medium block"
            >
              Restoration & Architectural Design
            </motion.span>
            
            <motion.h1 
              variants={itemVariants}
              className="font-serif text-5xl md:text-7xl tracking-wide font-extralight text-white uppercase leading-[1.05]"
            >
              Timeless <br />
              <span className="italic text-decor-gold-light font-light normal-case">Architectural</span> Spaces
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-xs md:text-sm font-light text-zinc-300 max-w-lg leading-relaxed tracking-wider"
            >
              Experience home decor elevated to fine art. Hand-finished travertine, hand-planed oak woods, and organic French linens designed for spaces of minimalist warmth.
            </motion.p>

            <motion.div variants={itemVariants} className="pt-4">
              <Link 
                to="/products"
                className="inline-flex items-center space-x-4 px-8 py-3.5 bg-decor-gold hover:bg-decor-gold-light text-[10px] tracking-[0.25em] uppercase font-semibold text-black transition-all duration-300 rounded-sm shadow-md group"
              >
                <span>Enter The Collection</span>
                <MoveRight size={14} className="transform group-hover:translate-x-1.5 transition-transform duration-300 text-black" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. Featured Collections */}
      {categories.length > 0 && (
        <section className="px-8 max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[10px] uppercase tracking-[0.4em] text-decor-gold font-medium block">Shop By Space</span>
            <h2 className="text-3xl md:text-4xl font-extralight uppercase tracking-wider text-decor-black">Featured Categories</h2>
            <div className="w-12 h-[1px] bg-decor-gold/30 mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.slice(0, 6).map((cat, i) => {
              const imageSrc = getCategoryImage(cat);
              return (
                <Link 
                  key={i} 
                  to={`/products?category=${encodeURIComponent(cat.id)}`} 
                  className="group relative h-96 overflow-hidden bg-decor-beige rounded-sm border border-decor-cream flex items-end p-8 transition-all duration-500 hover:border-decor-gold/40 hover:shadow-lg block"
                >
                  <div className="absolute inset-0 z-0">
                    <img 
                      src={imageSrc} 
                      alt={cat.categoryName} 
                      className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-decor-black/80 via-decor-black/35 to-transparent transition-opacity duration-500 z-10" />
                  </div>
                  
                  <div className="relative z-20 space-y-2.5 w-full text-left">
                    <h3 className="font-serif text-xl text-white tracking-wider uppercase">{cat.categoryName}</h3>
                    {cat.description && (
                      <p className="text-[10px] text-zinc-300 font-light tracking-wide line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>
                    )}
                    <div className="inline-flex items-center text-[9px] tracking-widest uppercase font-semibold text-decor-gold-light group-hover:text-white transition-colors duration-300 pt-1">
                      <span>Explore Collection</span>
                      <ArrowRight size={12} className="ml-1.5 transform group-hover:translate-x-1.5 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. Trending Products */}
      {products.length > 0 && (
        <section className="px-8 max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <span className="text-[10px] uppercase tracking-[0.4em] text-decor-gold font-medium block">Curated Focus</span>
            <h2 className="text-3xl md:text-4xl font-extralight uppercase tracking-wider text-decor-black">Trending Products</h2>
            <div className="w-12 h-[1px] bg-decor-gold/30 mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {products.slice(0, 4).map((product, idx) => (
              <ProductCard key={idx} product={product} onQuickView={handleQuickView} />
            ))}
          </div>
        </section>
      )}

      {/* 4. Best Sellers */}
      {products.length > 4 && (
        <section className="px-8 max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <span className="text-[10px] uppercase tracking-[0.4em] text-decor-gold font-medium block">Collectors Choice</span>
            <h2 className="text-3xl md:text-4xl font-extralight uppercase tracking-wider text-decor-black">Best Sellers</h2>
            <div className="w-12 h-[1px] bg-decor-gold/30 mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {products.slice(4, 8).map((product, idx) => (
              <ProductCard key={idx} product={product} onQuickView={handleQuickView} />
            ))}
          </div>
        </section>
      )}

      {/* Room Inspirations: Split screen room banners */}
      {/* <section className="space-y-24 md:space-y-36"> */}
        
        {/* Living Room */}
        {/* <div className="w-full bg-[#EFECE5] py-20 px-8 border-y border-decor-cream/55">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="relative aspect-video md:aspect-[4/3] rounded-sm overflow-hidden border border-decor-cream shadow-sm">
              <img 
                src={livingHighlight.image} 
                alt={livingHighlight.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-6">
              <span className="text-[10px] uppercase tracking-[0.4em] text-decor-gold font-medium block">Room Highlight</span>
              <h2 className="font-serif text-3xl md:text-5xl font-extralight text-decor-black uppercase tracking-wide leading-tight">
                {livingHighlight.title}
              </h2>
              <p className="text-xs text-decor-stone font-light leading-relaxed tracking-wide">
                {livingHighlight.description}
              </p>
              <div className="pt-2">
                <Link 
                  to={livingHighlight.id ? `/products?category=${livingHighlight.id}` : "/products"}
                  className="inline-flex items-center space-x-3 text-[10px] tracking-[0.25em] uppercase font-semibold text-decor-black border-b border-decor-black pb-1 hover:text-decor-gold hover:border-decor-gold transition-all duration-300"
                >
                  <span>Shop {livingHighlight.title}</span>
                  <MoveRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div> */}

        {/* Bedroom */}
        {/* <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="space-y-6 order-2 md:order-1">
            <span className="text-[10px] uppercase tracking-[0.4em] text-decor-gold font-medium block">Room Highlight</span>
            <h2 className="font-serif text-3xl md:text-5xl font-extralight text-decor-black uppercase tracking-wide leading-tight">
              {bedroomHighlight.title}
            </h2>
            <p className="text-xs text-decor-stone font-light leading-relaxed tracking-wide">
              {bedroomHighlight.description}
            </p>
            <div className="pt-2">
              <Link 
                to={bedroomHighlight.id ? `/products?category=${bedroomHighlight.id}` : "/products"}
                className="inline-flex items-center space-x-3 text-[10px] tracking-[0.25em] uppercase font-semibold text-decor-black border-b border-decor-black pb-1 hover:text-decor-gold hover:border-decor-gold transition-all duration-300"
              >
                <span>Shop {bedroomHighlight.title}</span>
                <MoveRight size={12} />
              </Link>
            </div>
          </div>
          <div className="relative aspect-video md:aspect-[4/3] rounded-sm overflow-hidden border border-decor-cream shadow-sm order-1 md:order-2">
            <img 
              src={bedroomHighlight.image} 
              alt={bedroomHighlight.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div> */}

        {/* Dining */}
        {/* <div className="w-full bg-[#E5E1D8] py-20 px-8 border-y border-decor-cream/55">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="relative aspect-video md:aspect-[4/3] rounded-sm overflow-hidden border border-decor-cream shadow-sm">
              <img 
                src={diningHighlight.image} 
                alt={diningHighlight.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-6">
              <span className="text-[10px] uppercase tracking-[0.4em] text-decor-gold font-medium block">Room Highlight</span>
              <h2 className="font-serif text-3xl md:text-5xl font-extralight text-decor-black uppercase tracking-wide leading-tight">
                {diningHighlight.title}
              </h2>
              <p className="text-xs text-decor-stone font-light leading-relaxed tracking-wide">
                {diningHighlight.description}
              </p>
              <div className="pt-2">
                <Link 
                  to={diningHighlight.id ? `/products?category=${diningHighlight.id}` : "/products"}
                  className="inline-flex items-center space-x-3 text-[10px] tracking-[0.25em] uppercase font-semibold text-decor-black border-b border-decor-black pb-1 hover:text-decor-gold hover:border-decor-gold transition-all duration-300"
                >
                  <span>Shop {diningHighlight.title}</span>
                  <MoveRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div> */}

        {/* Office & Workspaces */}
        {/* <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="space-y-6 order-2 md:order-1">
            <span className="text-[10px] uppercase tracking-[0.4em] text-decor-gold font-medium block">Room Highlight</span>
            <h2 className="font-serif text-3xl md:text-5xl font-extralight text-decor-black uppercase tracking-wide leading-tight">
              {officeHighlight.title}
            </h2>
            <p className="text-xs text-decor-stone font-light leading-relaxed tracking-wide">
              {officeHighlight.description}
            </p>
            <div className="pt-2">
              <Link 
                to={officeHighlight.id ? `/products?category=${officeHighlight.id}` : "/products"}
                className="inline-flex items-center space-x-3 text-[10px] tracking-[0.25em] uppercase font-semibold text-decor-black border-b border-decor-black pb-1 hover:text-decor-gold hover:border-decor-gold transition-all duration-300"
              >
                <span>Shop {officeHighlight.title}</span>
                <MoveRight size={12} />
              </Link>
            </div>
          </div>
          <div className="relative aspect-video md:aspect-[4/3] rounded-sm overflow-hidden border border-decor-cream shadow-sm order-1 md:order-2">
            <img 
              src={officeHighlight.image} 
              alt={officeHighlight.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div> */}

        {/* Outdoor */}
        {/* <div className="w-full bg-[#EAE3D8] py-20 px-8 border-y border-decor-cream/55">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="relative aspect-video md:aspect-[4/3] rounded-sm overflow-hidden border border-decor-cream shadow-sm">
              <img 
                src={outdoorHighlight.image} 
                alt={outdoorHighlight.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-6">
              <span className="text-[10px] uppercase tracking-[0.4em] text-decor-gold font-medium block">Room Highlight</span>
              <h2 className="font-serif text-3xl md:text-5xl font-extralight text-decor-black uppercase tracking-wide leading-tight">
                {outdoorHighlight.title}
              </h2>
              <p className="text-xs text-decor-stone font-light leading-relaxed tracking-wide">
                {outdoorHighlight.description}
              </p>
              <div className="pt-2">
                <Link 
                  to={outdoorHighlight.id ? `/products?category=${outdoorHighlight.id}` : "/products"}
                  className="inline-flex items-center space-x-3 text-[10px] tracking-[0.25em] uppercase font-semibold text-decor-black border-b border-decor-black pb-1 hover:text-decor-gold hover:border-decor-gold transition-all duration-300"
                >
                  <span>Shop {outdoorHighlight.title}</span>
                  <MoveRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>

      </section> */}

      {/* 9. Testimonials */}
      {/* <section className="py-24 bg-[#EFECE5] px-8 border-t border-decor-cream/55">
        <div className="max-w-5xl mx-auto space-y-12 text-center">
          <span className="text-[10px] uppercase tracking-[0.4em] text-decor-gold font-medium">Praise from our Collectors</span>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-6">
            <div className="space-y-4 text-center">
              <div className="flex justify-center text-decor-gold space-x-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="currentColor" className="stroke-none" />)}
              </div>
              <p className="font-serif text-sm italic text-decor-black leading-relaxed">
                "The travertine coffee table is a sculpture in itself. The white-glove setup team handled it with extreme care. Pure luxury."
              </p>
              <p className="text-[9px] uppercase tracking-[0.25em] text-decor-stone font-semibold">— Marcus G., Chicago</p>
            </div>

            <div className="space-y-4 text-center">
              <div className="flex justify-center text-decor-gold space-x-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="currentColor" className="stroke-none" />)}
              </div>
              <p className="font-serif text-sm italic text-decor-black leading-relaxed">
                "Their linen sheets are the softest I've ever experienced. Remarkable service and beautiful sustainable packaging."
              </p>
              <p className="text-[9px] uppercase tracking-[0.25em] text-decor-stone font-semibold">— Clara L., San Francisco</p>
            </div>

            <div className="space-y-4 text-center">
              <div className="flex justify-center text-decor-gold space-x-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="currentColor" className="stroke-none" />)}
              </div>
              <p className="font-serif text-sm italic text-decor-black leading-relaxed">
                "The hand-turned brass and stone study lamp elevates my workspace. Outstanding texture and warm, relaxing illumination."
              </p>
              <p className="text-[9px] uppercase tracking-[0.25em] text-decor-stone font-semibold">— Daniel K., New York</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* 10. Newsletter Subscribe */}
      {/* <section className="py-24 px-8 bg-decor-black text-decor-ivory border-t border-zinc-900 rounded-sm max-w-5xl mx-auto">
        <div className="max-w-xl mx-auto text-center space-y-6">
          <span className="text-[10px] uppercase tracking-[0.45em] text-decor-gold font-medium block">Join the List</span>
          <h2 className="font-serif text-3xl font-light text-white tracking-wider uppercase leading-tight">
            BECOME A CO-DESIGNER
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed tracking-wide">
            Subscribe to receive private invitations to runway room launches, early archival collection access, and bespoke spatial layout ideas.
          </p>
          <div className="pt-4">
            <form onSubmit={handleSubscribe} className="flex border-b border-decor-gold/30 pb-2 focus-within:border-decor-gold transition-colors duration-300">
              <input 
                type="email" 
                required
                value={emailSub}
                onChange={(e) => setEmailSub(e.target.value)}
                placeholder="Enter your email address" 
                className="bg-transparent border-none text-xs text-white placeholder-zinc-700 focus:outline-none w-full tracking-wider"
              />
              <button type="submit" className="text-decor-gold hover:text-decor-gold-light text-[10px] uppercase tracking-widest pl-4 font-semibold cursor-pointer">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section> */}

      {/* Quick View Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-decor-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-4xl bg-decor-beige border border-decor-cream rounded-sm p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 z-10 max-h-[90vh] overflow-y-auto decor-shadow-soft text-decor-charcoal"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 text-decor-stone hover:text-decor-black transition-colors cursor-pointer"
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
              <div className="space-y-5 flex flex-col justify-center text-left">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-widest text-decor-gold block">
                    {selectedProduct.category?.categoryName || selectedProduct.categoryName || 'Bespoke Accent'}
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
                      className="flex-1 bg-decor-black hover:bg-decor-stone disabled:bg-decor-cream text-decor-ivory text-[9px] tracking-widest uppercase py-3 font-medium transition-colors duration-300 rounded-sm shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <ShoppingBag size={12} />
                      <span>Add to bag</span>
                    </button>

                    <button
                      onClick={() => handleBuyNow(selectedProduct)}
                      disabled={selectedProduct.stock <= 0}
                      className="flex-1 bg-decor-gold hover:bg-decor-gold-light disabled:bg-decor-cream text-decor-ivory text-[9px] tracking-widest uppercase py-3 font-medium transition-colors duration-300 rounded-sm shadow-sm flex items-center justify-center cursor-pointer"
                    >
                      <span>Buy Now</span>
                    </button>

                    <button
                      onClick={() => toggleWishlist(selectedProduct)}
                      className={`p-3 rounded-sm border transition-colors cursor-pointer ${
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
