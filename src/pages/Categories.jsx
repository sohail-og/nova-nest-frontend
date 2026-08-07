import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import API from '../services/api';

const categoryFallbackImages = {
  'living room': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop',
  'bedroom': 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=800&auto=format&fit=crop',
  'dining room': 'https://images.unsplash.com/photo-1617806118233-18e1db207f62?q=80&w=800&auto=format&fit=crop',
  'dining': 'https://images.unsplash.com/photo-1617806118233-18e1db207f62?q=80&w=800&auto=format&fit=crop',
  'kitchen': 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop',
  'office': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop',
  'workspace': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop',
  'outdoor': 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800&auto=format&fit=crop',
  'lighting': 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=800&auto=format&fit=crop',
  'furniture': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop',
  'decorative items': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop'
};

const getCategoryImage = (cat, products) => {
  // If the category has a dedicated image, use it
  if (cat.categoryImage && cat.categoryImage.trim() !== '') {
    return cat.categoryImage;
  }
  // Otherwise try to get the first product image in this category
  const catProducts = products.filter(p => p.category && p.category.id === cat.id);
  if (catProducts.length > 0) {
    const firstProduct = catProducts[0];
    if (firstProduct.imageUrl && firstProduct.imageUrl.trim() !== '') {
      return firstProduct.imageUrl;
    }
  }
  
  // Fallback to static mapping
  const name = cat.categoryName?.toLowerCase() || '';
  for (const [key, value] of Object.entries(categoryFallbackImages)) {
    if (name.includes(key)) {
      return value;
    }
  }
  // Generic luxury placeholder
  const fallbacks = [
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1617806118233-18e1db207f62?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800&auto=format&fit=crop'
  ];
  return fallbacks[(cat.id || 0) % 5];
};

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [catRes, prodRes] = await Promise.all([
          API.get('/api/categories'),
          API.get('/api/products')
        ]);
        setCategories(catRes.data || []);
        setProducts(prodRes.data || []);
      } catch (err) {
        console.error("Failed to load categories or products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const getProductCount = (categoryId) => {
    return products.filter(p => p.category && p.category.id === categoryId).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-decor-ivory">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-decor-gold mx-auto"></div>
          <p className="text-[10px] tracking-[0.25em] uppercase text-decor-stone font-medium">Loading Collections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-decor-ivory py-24 px-8 selection:bg-decor-gold/20">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header Section */}
        <div className="text-center space-y-4 mb-20">
          <span className="text-[10px] uppercase tracking-[0.4em] text-decor-gold font-medium block">
            Curated Spaces
          </span>
          <h1 className="text-4xl md:text-5xl font-extralight uppercase tracking-widest text-decor-black font-serif">
            All Categories
          </h1>
          <div className="w-16 h-[1px] bg-decor-gold/30 mx-auto mt-6" />
          <p className="text-xs text-decor-stone font-light max-w-xl mx-auto mt-6 leading-relaxed tracking-wide">
            Explore our meticulously curated collections. From hand-crafted living room essentials to bespoke luxury accents, find pieces that define your space.
          </p>
        </div>

        {/* Categories Grid - Luxury Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {categories.map((cat, i) => {
            const imageSrc = getCategoryImage(cat, products);
            const count = getProductCount(cat.id);
            
            return (
              <Link 
                key={i} 
                to={`/products?category=${encodeURIComponent(cat.id)}`}
                className="group relative h-[420px] rounded-2xl overflow-hidden bg-decor-beige flex flex-col justify-end p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 block"
              >
                {/* Background Image & Overlays */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={imageSrc} 
                    alt={cat.categoryName} 
                    className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Soft vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-decor-black/90 via-decor-black/30 to-transparent transition-opacity duration-500 z-10" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                </div>
                
                {/* Content */}
                <div className="relative z-20 w-full text-left flex flex-col space-y-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  
                  {/* Products Count Badge */}
                  <span className="self-start inline-block px-3 py-1 bg-white/10 backdrop-blur-md text-white text-[10px] uppercase tracking-widest rounded-full border border-white/20 mb-2">
                    {count} {count === 1 ? 'Product' : 'Products'}
                  </span>

                  {/* Title */}
                  <h3 className="font-serif text-2xl md:text-3xl text-white tracking-widest uppercase leading-tight drop-shadow-md">
                    {cat.categoryName}
                  </h3>
                  
                  {/* Short Description */}
                  <div className="overflow-hidden transition-all duration-500 max-h-0 group-hover:max-h-24 opacity-0 group-hover:opacity-100 mt-2">
                    <p className="text-xs text-zinc-300 font-light tracking-wide line-clamp-3 leading-relaxed">
                      {cat.description || "Discover our premium selection of highly refined, architecturally inspired pieces crafted for this space."}
                    </p>
                  </div>
                  
                  {/* Call to action */}
                  <div className="inline-flex items-center text-[10px] tracking-widest uppercase font-semibold text-decor-gold-light group-hover:text-white transition-colors duration-300 pt-4 opacity-80 group-hover:opacity-100">
                    <span>Explore Collection</span>
                    <ArrowRight size={14} className="ml-2 transform group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                  
                </div>
              </Link>
            );
          })}
        </div>
        
      </div>
    </div>
  );
}
