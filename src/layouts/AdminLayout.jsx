
import { LayoutDashboard, Package, Users, FolderTree, LogOut, Menu, X, Sun, Moon, RefreshCw, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function AdminLayout({ 
  children, 
  activeView, 
  setActiveView, 
  sidebarOpen, 
  setSidebarOpen, 
  handleLogout, 
  adminEmail, 
  loadAllData, 
  loading 
}) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-decor-ivory text-decor-black flex font-sans antialiased select-none relative overflow-hidden">
      
      {/* Luxury Background Image for Glassmorphism effect */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Luxury bg" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-[#0B0B0C]/90 to-black/80"></div>
      </div>

      {/* Sidebar Component */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col justify-between shadow-2xl`}>
        
        <div>
          {/* Sidebar Brand Header */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
            <div className="flex flex-col cursor-pointer" onClick={() => setActiveView('dashboard')}>
              <span className="font-serif text-lg tracking-[0.2em] text-white font-light">
                NOVA<span className="text-decor-gold">NEST</span>
              </span>
              <span className="text-[7px] tracking-[0.4em] font-light text-decor-gold uppercase -mt-0.5">
                Luxury Administration
              </span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-zinc-400 hover:text-decor-gold">
              <X size={18} />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-2">
            <div 
              onClick={() => setActiveView('dashboard')}
              className={`flex items-center space-x-3 px-4 py-3 font-medium rounded-sm text-xs tracking-wider cursor-pointer transition-colors ${
                activeView === 'dashboard' ? 'bg-decor-gold/10 text-decor-gold border-l-2 border-decor-gold' : 'text-zinc-400 hover:text-decor-gold'
              }`}
            >
              <LayoutDashboard size={15} />
              <span>Dashboard Overview</span>
            </div>
            
            <div 
              onClick={() => setActiveView('orders')}
              className={`flex items-center space-x-3 px-4 py-3 font-medium rounded-sm text-xs tracking-wider cursor-pointer transition-colors ${
                activeView === 'orders' ? 'bg-decor-gold/10 text-decor-gold border-l-2 border-decor-gold' : 'text-zinc-400 hover:text-decor-gold'
              }`}
            >
              <ShoppingBag size={15} />
              <span>Order Management</span>
            </div>

            <div 
              onClick={() => setActiveView('products')}
              className={`flex items-center space-x-3 px-4 py-3 font-medium rounded-sm text-xs tracking-wider cursor-pointer transition-colors ${
                activeView === 'products' ? 'bg-decor-gold/10 text-decor-gold border-l-2 border-decor-gold' : 'text-zinc-400 hover:text-decor-gold'
              }`}
            >
              <Package size={15} />
              <span>Inventory Control</span>
            </div>

            <div 
              onClick={() => setActiveView('categories')}
              className={`flex items-center space-x-3 px-4 py-3 font-medium rounded-sm text-xs tracking-wider cursor-pointer transition-colors ${
                activeView === 'categories' ? 'bg-decor-gold/10 text-decor-gold border-l-2 border-decor-gold' : 'text-zinc-400 hover:text-decor-gold'
              }`}
            >
              <FolderTree size={15} />
              <span>Category Portfolio</span>
            </div>

            <div 
              onClick={() => setActiveView('users')}
              className={`flex items-center space-x-3 px-4 py-3 font-medium rounded-sm text-xs tracking-wider cursor-pointer transition-colors ${
                activeView === 'users' ? 'bg-decor-gold/10 text-decor-gold border-l-2 border-decor-gold' : 'text-zinc-400 hover:text-decor-gold'
              }`}
            >
              <Users size={15} />
              <span>Client Database</span>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer / User Profile & Logout */}
        <div className="p-4 border-t border-white/10 space-y-4">
          <div className="flex items-center space-x-3 px-2">
            <div className="w-8 h-8 rounded-full bg-decor-gold flex items-center justify-center text-black text-xs font-semibold uppercase">
              {adminEmail?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-medium text-white truncate">{adminEmail}</p>
              <p className="text-[8px] uppercase tracking-widest text-decor-gold">Super Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="relative z-10 flex-1 flex flex-col overflow-x-hidden min-h-screen bg-transparent">
        
        {/* Top Navbar */}
        <header className="h-20 bg-black/40 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 md:px-10 sticky top-0 z-30 shadow-sm">
          
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-zinc-400 hover:text-decor-gold cursor-pointer">
              <Menu size={20} />
            </button>
            
            {activeView !== 'dashboard' ? (
              <button 
                onClick={() => setActiveView('dashboard')} 
                className="flex items-center space-x-2 text-xs text-zinc-400 hover:text-decor-gold uppercase tracking-widest transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Return to Dashboard</span>
              </button>
            ) : (
              <h1 className="font-serif text-lg tracking-wider text-white uppercase hidden md:block">
                Operational Command
              </h1>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-4">
            
            <button 
              onClick={loadAllData}
              disabled={loading}
              className="text-zinc-400 hover:text-decor-gold transition-colors duration-300 cursor-pointer"
              title="Refresh Stats"
            >
              <RefreshCw size={15} className={loading ? "animate-spin text-decor-gold" : ""} />
            </button>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="text-zinc-400 hover:text-decor-gold transition-colors duration-300 cursor-pointer"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            <div className="h-6 w-[1px] bg-white/10" />

            {/* Sign Out Button */}
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-1.5 bg-red-950/20 border border-red-900/30 hover:border-red-700 text-red-500 px-3 py-1.5 rounded-sm text-[9px] tracking-widest uppercase transition-all duration-300 cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={12} />
              <span className="hidden sm:inline">Terminate Session</span>
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="p-6 md:p-10 flex-1">
          {children}
        </main>

      </div>
    </div>
  );
}
