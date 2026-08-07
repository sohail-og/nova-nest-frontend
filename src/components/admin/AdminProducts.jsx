import { Search, ArrowUpDown, Edit, Trash2, PlusCircle, ArrowLeft } from 'lucide-react';

export default function AdminProducts({
  activeView,
  setActiveView,
  products,
  safeCategories,
  productForm,
  setProductForm,
  handleCreateProduct,
  handleUpdateProduct,
  handleDeleteProduct,
  productSearch,
  setProductSearch,
  productCategoryFilter,
  setProductCategoryFilter,
  productStockFilter,
  setProductStockFilter,
  productSortField,
  setProductSortField,
  productSortOrder,
  setProductSortOrder,
  productPage,
  setProductPage
}) {
  const productsPerPage = 8;
  const inrFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  });

  const safeProducts = Array.isArray(products) ? products : [];

  const filteredProducts = safeProducts.filter(p => {
    const matchesSearch = (p.name || '').toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = productCategoryFilter === '' || p.category?.id?.toString() === productCategoryFilter;
    
    let matchesStock = true;
    if (productStockFilter === 'out') matchesStock = p.stock === 0;
    else if (productStockFilter === 'low') matchesStock = p.stock > 0 && p.stock <= 5;
    else if (productStockFilter === 'ok') matchesStock = p.stock > 5;

    return matchesSearch && matchesCategory && matchesStock;
  }).sort((a, b) => {
    let aVal = a[productSortField];
    let bVal = b[productSortField];

    if (productSortField === 'category') {
      aVal = a.category?.categoryName || '';
      bVal = b.category?.categoryName || '';
    }

    if (typeof aVal === 'string') {
      return productSortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return productSortOrder === 'asc' ? aVal - bVal : bVal - aVal;
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice((productPage - 1) * productsPerPage, productPage * productsPerPage);

  if (activeView === 'addProduct' || activeView === 'modifyProduct') {
    const isEdit = activeView === 'modifyProduct';
    return (
      <div className="max-w-2xl mx-auto bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-sm space-y-8">
        <div className="flex items-center space-x-4 border-b border-white/10 pb-4">
          <button onClick={() => setActiveView('products')} className="text-zinc-400 hover:text-decor-gold transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div className="text-left">
            <span className="text-[9px] uppercase tracking-[0.3em] text-decor-gold font-medium block">Inventory Ledger</span>
            <h3 className="font-serif text-xl text-white uppercase tracking-wider">
              {isEdit ? 'Modify Product Details' : 'Add New Product'}
            </h3>
          </div>
        </div>

        <form onSubmit={isEdit ? handleUpdateProduct : handleCreateProduct} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium block">Product Name *</label>
              <input 
                type="text"
                required
                value={productForm.name}
                onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                className="w-full bg-transparent border-b border-white/10 focus:border-decor-gold text-xs py-2 focus:outline-none text-white transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium block">Category *</label>
              <select 
                required
                value={productForm.categoryId}
                onChange={(e) => setProductForm({...productForm, categoryId: e.target.value})}
                className="w-full bg-transparent border-b border-white/10 focus:border-decor-gold text-xs py-2 focus:outline-none text-white bg-black/40 backdrop-blur-md"
              >
                <option value="" disabled>Select Space</option>
                {safeCategories.map((c) => (
                  <option key={c.id} value={c.id}>{c.categoryName}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium block">Price (INR) *</label>
              <input 
                type="number"
                required
                value={productForm.price}
                onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                className="w-full bg-transparent border-b border-white/10 focus:border-decor-gold text-xs py-2 focus:outline-none text-white transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium block">Stock Quantity *</label>
              <input 
                type="number"
                required
                value={productForm.stock}
                onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                className="w-full bg-transparent border-b border-white/10 focus:border-decor-gold text-xs py-2 focus:outline-none text-white transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium block">Image URL</label>
            <input 
              type="url"
              value={productForm.imageUrl || ''}
              onChange={(e) => setProductForm({...productForm, imageUrl: e.target.value})}
              className="w-full bg-transparent border-b border-white/10 focus:border-decor-gold text-xs py-2 focus:outline-none text-white transition-colors"
            />
            {productForm.imageUrl && (
              <div className="mt-3 relative w-32 h-36 border border-zinc-800 rounded-sm overflow-hidden bg-black/40">
                <img src={productForm.imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium block">Product Description</label>
            <textarea 
              rows={3}
              value={productForm.description || ''}
              onChange={(e) => setProductForm({...productForm, description: e.target.value})}
              className="w-full bg-transparent border border-white/10 focus:border-decor-gold text-xs p-3 rounded-sm focus:outline-none text-white transition-colors"
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button 
              type="submit"
              className="flex-1 bg-decor-gold hover:bg-decor-gold-light text-black text-[9px] tracking-widest uppercase py-3 font-semibold transition-colors rounded-sm cursor-pointer"
            >
              {isEdit ? 'Save Modifications' : 'Add to Catalog'}
            </button>
            <button 
              type="button"
              onClick={() => {
                setProductForm({ id: null, name: '', description: '', price: '', stock: '', categoryId: '', imageUrl: '' });
                setActiveView('products');
              }}
              className="flex-1 bg-transparent border border-white/10 text-zinc-400 hover:text-white hover:border-white text-[9px] tracking-widest uppercase py-3 font-medium transition-colors rounded-sm cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-sm space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-[9px] uppercase tracking-widest text-decor-gold font-medium block">Active Catalog</span>
          <h3 className="font-serif text-lg text-white uppercase tracking-wider">Inventory Control</h3>
        </div>
        <button 
          onClick={() => {
            setProductForm({ id: null, name: '', description: '', price: '', stock: '', categoryId: safeCategories[0]?.id || '', imageUrl: '' });
            setActiveView('addProduct');
          }} 
          className="bg-decor-gold text-black hover:bg-decor-gold-light text-[9px] tracking-widest uppercase px-4 py-2 font-semibold transition-colors cursor-pointer self-start flex items-center gap-2"
        >
          <PlusCircle size={14} />
          Create New Product
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name..."
            value={productSearch}
            onChange={(e) => { setProductSearch(e.target.value); setProductPage(1); }}
            className="w-full bg-decor-ivory border border-white/10 focus:border-decor-gold rounded-xs px-3 py-2 text-xs text-white focus:outline-none pl-8"
          />
          <Search size={14} className="absolute left-2.5 top-3 text-zinc-500" />
        </div>

        <div>
          <select
            value={productCategoryFilter}
            onChange={(e) => { setProductCategoryFilter(e.target.value); setProductPage(1); }}
            className="w-full bg-decor-ivory border border-white/10 focus:border-decor-gold rounded-xs px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="">All Categories</option>
            {safeCategories.map(c => (
              <option key={c.id} value={c.id}>{c.categoryName}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={productStockFilter}
            onChange={(e) => { setProductStockFilter(e.target.value); setProductPage(1); }}
            className="w-full bg-decor-ivory border border-white/10 focus:border-decor-gold rounded-xs px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="">All Stock Statuses</option>
            <option value="ok">In Stock (&gt;5 items)</option>
            <option value="low">Low Stock (1-5 items)</option>
            <option value="out">Out of Stock (0 items)</option>
          </select>
        </div>

        <div className="flex space-x-2">
          <select
            value={productSortField}
            onChange={(e) => setProductSortField(e.target.value)}
            className="flex-1 bg-decor-ivory border border-white/10 focus:border-decor-gold rounded-xs px-2 py-2 text-xs text-white focus:outline-none"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="stock">Sort by Stock</option>
            <option value="category">Sort by Category</option>
          </select>
          <button
            onClick={() => setProductSortOrder(productSortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-2.5 bg-decor-ivory border border-white/10 text-zinc-400 hover:text-white rounded-xs flex items-center justify-center cursor-pointer"
            title="Toggle Sort Order"
          >
            <ArrowUpDown size={14} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-white/10 text-[9px] uppercase tracking-widest text-zinc-400 font-semibold bg-decor-ivory/40">
              <th className="py-3 px-3 font-medium">Preview</th>
              <th className="py-3 px-3 font-medium">Name</th>
              <th className="py-3 px-3 font-medium">Category</th>
              <th className="py-3 px-3 font-medium">Price</th>
              <th className="py-3 px-3 font-medium">Stock Status</th>
              <th className="py-3 px-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-xs font-light text-zinc-300">
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((prod) => (
                <tr key={prod.id} className="border-b border-white/10/40 hover:bg-[#1C1C1E]/50 transition-colors group">
                  <td className="py-3 px-3">
                    <div className="relative w-10 h-12 rounded-sm overflow-hidden border border-zinc-800 bg-decor-ivory">
                      <img 
                        src={prod.imageUrl || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=100&auto=format&fit=crop"} 
                        alt={prod.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=100&auto=format&fit=crop"; }}
                      />
                    </div>
                  </td>
                  <td className="py-3 px-3 font-medium text-white max-w-xs truncate">{prod.name}</td>
                  <td className="py-3 px-3 text-zinc-400">{prod.category?.categoryName}</td>
                  <td className="py-3 px-3 text-decor-gold font-medium font-mono">{inrFormatter.format(prod.price)}</td>
                  <td className="py-3 px-3">
                    {prod.stock === 0 ? (
                      <span className="px-2 py-0.5 rounded-sm bg-red-950/40 text-red-500 border border-red-900/30 text-[8px] font-bold tracking-widest uppercase">Out of Stock</span>
                    ) : prod.stock <= 5 ? (
                      <span className="px-2 py-0.5 rounded-sm bg-orange-950/40 text-orange-500 border border-orange-900/30 text-[8px] font-bold tracking-widest uppercase">Low Stock ({prod.stock})</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-sm bg-green-950/40 text-green-500 border border-green-900/30 text-[8px] font-bold tracking-widest uppercase">In Stock ({prod.stock})</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right space-x-2">
                    <button 
                      onClick={() => {
                        setProductForm({
                          id: prod.id,
                          name: prod.name,
                          description: prod.description || '',
                          price: prod.price,
                          stock: prod.stock,
                          categoryId: prod.category?.id || '',
                          imageUrl: prod.imageUrl || ''
                        });
                        setActiveView('modifyProduct');
                      }}
                      className="text-zinc-400 hover:text-decor-gold p-1 transition-colors cursor-pointer"
                      title="Edit Product"
                    >
                      <Edit size={14} />
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="text-zinc-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-zinc-500 italic">No products found matching your criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-4 border-t border-white/10 text-xs">
          <span className="text-zinc-500">Showing page {productPage} of {totalPages}</span>
          <div className="flex space-x-1">
            <button 
              disabled={productPage === 1}
              onClick={() => setProductPage(prev => Math.max(prev - 1, 1))}
              className="px-3 py-1 bg-decor-ivory border border-white/10 text-zinc-400 disabled:opacity-50 hover:text-white rounded-xs transition-colors cursor-pointer"
            >
              Previous
            </button>
            <button 
              disabled={productPage === totalPages}
              onClick={() => setProductPage(prev => Math.min(prev + 1, totalPages))}
              className="px-3 py-1 bg-decor-ivory border border-white/10 text-zinc-400 disabled:opacity-50 hover:text-white rounded-xs transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
