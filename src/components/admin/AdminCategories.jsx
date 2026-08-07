
import { Trash, Save } from 'lucide-react';

export default function AdminCategories({
  safeCategories,
  categoryForm,
  setCategoryForm,
  handleSaveCategory,
  handleDeleteCategory
}) {

  const selectCategoryForEdit = (c) => {
    setCategoryForm({
      id: c.id,
      categoryName: c.categoryName,
      categoryImage: c.categoryImage || '',
      description: c.description || '',
      bannerImage: c.bannerImage || '',
      displayOrder: c.displayOrder || 0,
      visibility: c.visibility !== false
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Categories List */}
      <div className="lg:col-span-2 bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-sm space-y-6">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <div>
            <span className="text-[9px] uppercase tracking-widest text-decor-gold font-medium block">Spatial Spaces</span>
            <h3 className="font-serif text-lg text-white uppercase tracking-wider">Store Categories</h3>
          </div>
          <button 
            onClick={() => {
              setCategoryForm({ id: null, categoryName: '', categoryImage: '', description: '', bannerImage: '', displayOrder: 0, visibility: true });
            }} 
            className="bg-decor-gold text-black hover:bg-decor-gold-light text-[9px] tracking-widest uppercase px-3 py-1.5 font-semibold transition-colors cursor-pointer"
          >
            Add Category
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {safeCategories.map((c) => (
            <div 
              key={c.id}
              onClick={() => selectCategoryForEdit(c)}
              className={`border p-4 rounded-sm cursor-pointer transition-all flex items-center justify-between group ${
                categoryForm.id === c.id ? 'border-decor-gold bg-decor-gold/5' : 'border-white/10 hover:border-decor-gold'
              }`}
            >
              <div className="flex items-center space-x-4 min-w-0 flex-1">
                <img 
                  src={c.categoryImage || "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=150&auto=format&fit=crop"} 
                  alt={c.categoryName}
                  className="w-12 h-12 object-cover rounded-sm border border-zinc-800 bg-decor-ivory"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=150&auto=format&fit=crop";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold uppercase text-white truncate">{c.categoryName}</h4>
                  <p className="text-[10px] text-zinc-500 truncate font-light leading-relaxed mt-0.5">{c.description || 'No description added'}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-[8px] uppercase tracking-widest text-decor-gold font-mono">Order: {c.displayOrder || 0}</span>
                    <span className="text-[8px] text-zinc-500">•</span>
                    <span className={`text-[8px] uppercase tracking-widest font-semibold ${c.visibility !== false ? 'text-green-500' : 'text-red-500'}`}>
                      {c.visibility !== false ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCategory(c.id);
                }}
                className="text-zinc-500 hover:text-red-500 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ml-2"
                title="Delete Category"
              >
                <Trash size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Category Designer Form */}
      <div className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-sm self-start sticky top-24">
        <h3 className="font-serif text-base text-white uppercase tracking-wider border-b border-white/10 pb-3 text-center">
          Category Designer
        </h3>

        <form onSubmit={handleSaveCategory} className="space-y-4 pt-4">
          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-widest text-decor-gold block">Category Name *</label>
            <input 
              type="text"
              required
              value={categoryForm.categoryName}
              onChange={(e) => setCategoryForm({...categoryForm, categoryName: e.target.value})}
              className="w-full bg-decor-ivory border border-white/10 focus:border-decor-gold text-xs py-1.5 px-3 focus:outline-none text-white font-medium"
              placeholder="e.g., Living Room"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-widest text-decor-gold block">Thumbnail Image URL</label>
            <input 
              type="url"
              value={categoryForm.categoryImage}
              onChange={(e) => setCategoryForm({...categoryForm, categoryImage: e.target.value})}
              className="w-full bg-decor-ivory border border-white/10 focus:border-decor-gold text-xs py-1.5 px-3 focus:outline-none text-white font-light"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-widest text-decor-gold block">Banner Image URL</label>
            <input 
              type="url"
              value={categoryForm.bannerImage}
              onChange={(e) => setCategoryForm({...categoryForm, bannerImage: e.target.value})}
              className="w-full bg-decor-ivory border border-white/10 focus:border-decor-gold text-xs py-1.5 px-3 focus:outline-none text-white font-light"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-decor-gold block">Display Order</label>
              <input 
                type="number"
                min="0"
                value={categoryForm.displayOrder}
                onChange={(e) => setCategoryForm({...categoryForm, displayOrder: parseInt(e.target.value) || 0})}
                className="w-full bg-decor-ivory border border-white/10 focus:border-decor-gold text-xs py-1.5 px-3 focus:outline-none text-white font-mono"
              />
            </div>

            <div className="space-y-1 flex flex-col justify-end pb-1">
              <div className="flex items-center space-x-2 h-10">
                <input 
                  type="checkbox"
                  id="category-visibility"
                  checked={categoryForm.visibility}
                  onChange={(e) => setCategoryForm({...categoryForm, visibility: e.target.checked})}
                  className="w-4 h-4 bg-decor-ivory border border-white/10 accent-decor-gold focus:ring-0 focus:outline-none rounded-xs"
                />
                <label htmlFor="category-visibility" className="text-[9px] uppercase tracking-widest text-zinc-400 cursor-pointer font-medium">Visible to Users</label>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-widest text-decor-gold block">Description</label>
            <textarea 
              rows={3}
              value={categoryForm.description}
              onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
              className="w-full bg-decor-ivory border border-white/10 focus:border-decor-gold text-xs p-2.5 rounded-sm focus:outline-none text-white font-light leading-relaxed"
              placeholder="Write short description for the collection page..."
            />
          </div>

          {categoryForm.bannerImage && (
            <div className="space-y-1">
              <span className="text-[8px] uppercase tracking-widest text-zinc-500 block">Banner Preview</span>
              <div className="w-full h-24 border border-zinc-800 rounded-sm overflow-hidden bg-decor-ivory">
                <img src={categoryForm.bannerImage} alt="Banner Preview" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-2">
            <button 
              type="submit"
              className="flex-1 bg-decor-gold hover:bg-decor-gold-light text-black text-[9px] tracking-widest uppercase py-2.5 font-bold transition-colors rounded-sm cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <Save size={12} />
              <span>{categoryForm.id ? "Update Space" : "Save Space"}</span>
            </button>
            <button 
              type="button"
              onClick={() => setCategoryForm({ id: null, categoryName: '', categoryImage: '', description: '', bannerImage: '', displayOrder: 0, visibility: true })}
              className="flex-1 bg-transparent border border-white/10 text-zinc-400 hover:text-white text-[9px] tracking-widest uppercase py-2.5 font-medium transition-colors rounded-sm cursor-pointer"
            >
              Clear / Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
