import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Compass, MoveRight, Star } from 'lucide-react';
import axios from 'axios';
import heroImage from '../assets/luxury_home_decor_hero.png';

// Import high-quality local category images
import decorativeItemsImg from '../assets/categories/decorative_items.jpg';
import homeAccessoriesImg from '../assets/categories/home_accessories.jpg';
import kitchenDecorImg from '../assets/categories/kitchen_decor.jpg';
import livingRoomImg from '../assets/categories/living_room.jpg';
import bedroomImg from '../assets/categories/bedroom.jpg';
import officeWorkspaceImg from '../assets/categories/office_workspace.jpg';

// Mapping table for category names to their respective local high-quality images
const categoryImageMap = {
  'Decorative Items': decorativeItemsImg,
  'Home Accessories': homeAccessoriesImg,
  'Kitchen Decor': kitchenDecorImg,
  'Living Room': livingRoomImg,
  'Bedroom': bedroomImg,
  'Office / Workspace': officeWorkspaceImg,
  'Office/Workspace': officeWorkspaceImg
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
  const [apiErrors, setApiErrors] = useState({
    categories: false,
    products: false
  });

  // Fetch Categories & Products from backend using Axios
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch Categories
      try {
        const catRes = await axios.get('http://localhost:8080/api/categories');
        setCategories(catRes.data || []);
      } catch (err) {
        console.warn("Categories API (GET /api/categories) failed.", err);
        setApiErrors(prev => ({ ...prev, categories: true }));
      }

      // Fetch Products & Images
      let fetchedProducts = [];
      let fetchedImages = [];

      try {
        const prodRes = await axios.get('http://localhost:8080/api/products');
        fetchedProducts = prodRes.data || [];
      } catch (err) {
        console.warn("Products API (GET /api/products) failed.", err);
        setApiErrors(prev => ({ ...prev, products: true }));
      }

      try {
        const imgRes = await axios.get('http://localhost:8080/api/productimages');
        fetchedImages = imgRes.data || [];
      } catch (err) {
        console.warn("ProductImages API (GET /api/productimages) failed.", err);
      }

      // Map images to products
      const mappedProducts = fetchedProducts.map(prod => {
        const prodImgs = fetchedImages.filter(img => img.product && img.product.id === prod.id);
        return {
          ...prod,
          imageUrl: prodImgs.length > 0 ? prodImgs[0].imageUrl : null
        };
      });

      setProducts(mappedProducts);
      setLoading(false);
    };

    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.25 }
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

  return (
    <div className="w-full min-h-screen bg-decor-ivory text-decor-charcoal selection:bg-decor-gold/20">
      
      {/* 1. Luxury Hero Banner */}
      <section className="relative w-full h-[85vh] flex items-center overflow-hidden">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Luxury Minimalist Interior" 
            className="w-full h-full object-cover object-center filter brightness-[0.82] contrast-[1.02]"
          />
          {/* Subtle Overlay Vignettes */}
          <div className="absolute inset-0 bg-gradient-to-r from-decor-ivory/55 via-decor-ivory/15 to-transparent" />
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
              className="text-[10px] uppercase tracking-[0.45em] text-decor-stone font-medium block"
            >
              Restoration & Balance
            </motion.span>
            
            <motion.h1 
              variants={itemVariants}
              className="font-serif text-5xl md:text-7xl tracking-wide font-extralight text-decor-black uppercase leading-[1.05]"
            >
              Timeless <br />
              <span className="italic text-decor-gold">Interiors</span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-xs md:text-sm font-light text-decor-stone max-w-lg leading-relaxed tracking-wider"
            >
              Discover artisanal home decor and curated architectural accents crafted from natural stone, reclaimed woods, and organic linens. Designed to define spaces with minimalist warmth.
            </motion.p>

            <motion.div variants={itemVariants} className="pt-4">
              <Link 
                to="/products"
                className="inline-flex items-center space-x-4 px-8 py-3.5 bg-decor-black hover:bg-decor-stone text-[10px] tracking-[0.25em] uppercase font-medium text-decor-ivory transition-all duration-300 rounded-sm decor-shadow-soft group"
              >
                <span>Enter The Nest</span>
                <MoveRight size={14} className="transform group-hover:translate-x-1.5 transition-transform duration-300 text-decor-gold-light" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. Featured Categories (Skipped if API fails) */}
      {!apiErrors.categories && categories.length > 0 && (
        <section className="py-24 px-8 max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[10px] uppercase tracking-[0.4em] text-decor-gold font-medium">Shop By Space</span>
            <h2 className="text-3xl font-extralight uppercase tracking-wider text-decor-black">Featured Categories</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat, i) => {
              // Retrieve corresponding local image or fallback to a high-quality royalty-free URL if not matched
              const imageSrc = categoryImageMap[cat.categoryName] || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop';
              return (
                <Link 
                  key={i} 
                  to={`/products?category=${encodeURIComponent(cat.categoryName)}`} 
                  className="group relative h-80 overflow-hidden bg-decor-beige rounded-sm gold-border-hover border border-decor-cream flex items-end p-8 block"
                >
                  {/* Category Image Layer with smooth zoom hover effect */}
                  <div className="absolute inset-0 z-0">
                    <img 
                      src={imageSrc} 
                      alt={cat.categoryName} 
                      className="w-full h-full object-cover transition-transform duration-[1.2s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Subtle dark overlay for premium luxury text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-decor-black/75 via-decor-black/20 to-transparent transition-opacity duration-500 z-10" />
                  </div>
                  
                  {/* Category Title & Explore Link */}
                  <div className="relative z-20 space-y-2 w-full">
                    <h3 className="font-serif text-xl text-white tracking-wider uppercase">{cat.categoryName}</h3>
                    <div className="inline-flex items-center text-[10px] tracking-widest text-decor-gold-light group-hover:text-white transition-colors duration-300">
                      <span>EXPLORE SPACE</span>
                      <ArrowRight size={12} className="ml-1.5 transform group-hover:translate-x-1.5 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 3, 4, 5, 6: Product Grids (Skipped if API fails) */}
      {!apiErrors.products && products.length > 0 && (
        <section className="py-24 px-8 max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <span className="text-[10px] uppercase tracking-[0.4em] text-decor-gold font-medium">New Arrivals</span>
            <h2 className="text-3xl font-extralight uppercase tracking-wider text-decor-black">Trending Products</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {products.slice(0, 8).map((product, idx) => (
              <div key={idx} className="group flex flex-col space-y-4">
                <div className="relative overflow-hidden aspect-[4/5] bg-decor-beige border border-decor-cream rounded-sm">
                  {/* Product Image placeholder logic using productimages mapping if available */}
                  <img 
                    src={product.imageUrl || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=400&auto=format&fit=crop"} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=400&auto=format&fit=crop";
                    }}
                  />
                  <div className="absolute bottom-4 left-4 z-20">
                    <button className="bg-decor-black text-decor-ivory hover:bg-decor-gold text-[9px] uppercase tracking-widest px-4 py-2 transition-colors">
                      Add To Cart
                    </button>
                  </div>
                </div>
                <div className="space-y-1 text-center">
                  <span className="text-[9px] uppercase tracking-widest text-decor-stone">{product.category?.categoryName}</span>
                  <h3 className="font-serif text-base tracking-wide text-decor-black">{product.name}</h3>
                  <p className="text-xs font-medium text-decor-gold">{inrFormatter.format(product.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Premium Collections Banner */}
      {/* <section className="py-28 px-8 bg-decor-beige border-y border-decor-cream/55">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-[10px] uppercase tracking-[0.4em] text-decor-gold font-medium">The Studio Ethos</span>
            <h2 className="font-serif text-4xl md:text-5xl font-extralight text-decor-black uppercase tracking-wide leading-tight">
              ARCHITECTURAL INTEGRITY & HONEST MATERIALS
            </h2>
            <p className="text-xs text-decor-stone font-light leading-relaxed tracking-wide">
              We collaborate with multi-generational quarries and lumber artisans to craft objects of structural clarity. From heavy limestone sideboards to hand-planed oak benches, each design honors the natural grain and geological variations of the earth.
            </p>
            <div className="pt-4">
              <Link 
                to="/products"
                className="inline-flex items-center space-x-3 text-[10px] tracking-[0.25em] uppercase font-medium text-decor-black border-b border-decor-black pb-1 hover:text-decor-gold hover:border-decor-gold transition-all duration-300"
              >
                <span>Read Our Heritage Story</span>
                <MoveRight size={12} />
              </Link>
            </div>
          </div>
          <div className="bg-[#E2DCD2] aspect-video w-full rounded-sm flex items-center justify-center p-8 border border-decor-cream/80 decor-shadow-soft">
            <div className="text-center space-y-4 max-w-sm">
              <Compass className="mx-auto text-decor-stone stroke-[1.2]" size={36} />
              <h3 className="font-serif text-lg tracking-wider text-decor-black">CUSTOM SPATIAL PLANNING</h3>
              <p className="text-[11px] text-decor-stone font-light leading-relaxed">
                Connect with our in-house spatial designers for custom layout blueprints, swatches, and tailored lighting design.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* 8. Room Inspiration */}
      {/* <section className="py-32 px-8 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-3">
          <span className="text-[10px] uppercase tracking-[0.4em] text-decor-gold font-medium">Curated Concepts</span>
          <h2 className="text-3xl font-extralight uppercase tracking-wider text-decor-black">Room Inspiration</h2>
          <div className="w-12 h-[1px] bg-decor-gold/30 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10"> */}
          {/* Room 1 */}
          {/* <div className="flex flex-col space-y-4">
            <div className="h-96 bg-decor-cream rounded-sm overflow-hidden border border-decor-cream gold-border-hover relative group flex items-end p-6">
              <div className="absolute inset-0 bg-gradient-to-t from-decor-black/50 via-transparent to-transparent z-10" />
              <h3 className="font-serif text-xl text-white tracking-wider relative z-20">MODERN LIVING SPACE</h3>
            </div>
            <p className="text-xs text-decor-stone font-light leading-relaxed">
              Clean textures, limestone tables, and low-slung linen sofas forming cozy, conversation-focused areas.
            </p>
          </div> */}

          {/* Room 2 */}
          {/* <div className="flex flex-col space-y-4">
            <div className="h-96 bg-decor-cream rounded-sm overflow-hidden border border-decor-cream gold-border-hover relative group flex items-end p-6">
              <div className="absolute inset-0 bg-gradient-to-t from-decor-black/50 via-transparent to-transparent z-10" />
              <h3 className="font-serif text-xl text-white tracking-wider relative z-20">ELEGANT SLEEP CHAMBER</h3>
            </div>
            <p className="text-xs text-decor-stone font-light leading-relaxed">
              Warm textured oak headboards, ivory linen throws, and custom sconce lighting supporting a restive state.
            </p>
          </div> */}

          {/* Room 3 */}
          {/* <div className="flex flex-col space-y-4">
            <div className="h-96 bg-decor-cream rounded-sm overflow-hidden border border-decor-cream gold-border-hover relative group flex items-end p-6">
              <div className="absolute inset-0 bg-gradient-to-t from-decor-black/50 via-transparent to-transparent z-10" />
              <h3 className="font-serif text-xl text-white tracking-wider relative z-20">MINIMAL WORKSPACE</h3>
            </div>
            <p className="text-xs text-decor-stone font-light leading-relaxed">
              Functional travertine desks, ergonomic seating, and warm lighting setups promoting mental focus.
            </p>
          </div> */}
        {/* </div>
      </section> */}

      {/* 9. Customer Reviews */}
      {/* <section className="py-24 bg-[#EFECE5] px-8 border-t border-decor-cream/55">
        <div className="max-w-5xl mx-auto space-y-12 text-center">
          <span className="text-[10px] uppercase tracking-[0.4em] text-decor-gold font-medium">Praise from our Collectors</span>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-6">
            <div className="space-y-4 text-center">
              <div className="flex justify-center text-decor-gold">
                {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
              </div>
              <p className="font-serif text-sm italic text-decor-black leading-relaxed">
                "The limestone dining table is a sculpture in itself. The shipping team unboxed it and styled it in place. Pure white-glove luxury."
              </p>
              <p className="text-[10px] uppercase tracking-[0.25em] text-decor-stone font-medium">— Marcus G., Chicago</p>
            </div>

            <div className="space-y-4 text-center">
              <div className="flex justify-center text-decor-gold">
                {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
              </div>
              <p className="font-serif text-sm italic text-decor-black leading-relaxed">
                "Their linen sheet sets are the softest I have ever experienced. Outstanding customer service and beautiful eco-packaging."
              </p>
              <p className="text-[10px] uppercase tracking-[0.25em] text-decor-stone font-medium">— Clara L., San Francisco</p>
            </div>

            <div className="space-y-4 text-center">
              <div className="flex justify-center text-decor-gold">
                {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
              </div>
              <p className="font-serif text-sm italic text-decor-black leading-relaxed">
                "The brass and marble desk lamp fits my minimal study perfectly. It casts a warm, relaxing tone that makes working a joy."
              </p>
              <p className="text-[10px] uppercase tracking-[0.25em] text-decor-stone font-medium">— Daniel K., New York</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* 10. Newsletter Subscribe */}
      {/* <section className="py-32 px-8 bg-decor-black text-decor-ivory border-t border-zinc-900">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <span className="text-[10px] uppercase tracking-[0.45em] text-decor-gold font-medium">Join the List</span>
          <h2 className="font-serif text-3xl md:text-4xl font-extralight text-white tracking-wider uppercase leading-tight">
            BECOME A CO-DESIGNER
          </h2>
          <p className="text-xs text-[#a39f99] leading-relaxed max-w-xl mx-auto tracking-wider">
            Subscribe to receive private invitations to runway room launches, bespoke collections, and early archival collection sales.
          </p>
          <div className="max-w-md mx-auto pt-4">
            <form className="flex border-b border-decor-gold/30 pb-2 focus-within:border-decor-gold transition-colors">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="bg-transparent border-none text-xs text-white placeholder-zinc-600 focus:outline-none w-full"
              />
              <button type="submit" className="text-decor-gold hover:text-decor-gold-light text-[10px] uppercase tracking-widest pl-4">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section> */}

    </div>
  );
}
