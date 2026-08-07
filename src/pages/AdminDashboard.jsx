import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-toastify';
import { AlertCircle, RefreshCw } from 'lucide-react';
import * as XLSX from 'xlsx';

// Layout & Components
import AdminLayout from '../layouts/AdminLayout';
import AdminOverview from '../components/admin/AdminOverview';
import AdminProducts from '../components/admin/AdminProducts';
import AdminUsers from '../components/admin/AdminUsers';
import AdminCategories from '../components/admin/AdminCategories';
import AdminOrders from '../components/admin/AdminOrders';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    todayRevenue: 0,
    monthlyRevenue: 0,
    yearlyRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalCategories: 0,
    revenueGrowth: 0,
    salesGrowth: 0,
    recentOrders: [],
    recentUsers: [],
    topSellingProducts: [],
    topCategories: [],
    monthlyAnalytics: [],
    dailyAnalytics: [],
    yearlyAnalytics: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [activeView, setActiveView] = useState('dashboard');
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // Search & Filter for Products
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('');
  const [productStockFilter, setProductStockFilter] = useState('');
  const [productSortField, setProductSortField] = useState('name');
  const [productSortOrder, setProductSortOrder] = useState('asc');
  const [productPage, setProductPage] = useState(1);

  // Search & Filter for Users
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('');

  // Selected Entities
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditingUser, setIsEditingUser] = useState(false);

  // Form states
  const [productForm, setProductForm] = useState({ id: null, name: '', description: '', price: '', stock: '', categoryId: '', imageUrl: '' });
  const [categoryForm, setCategoryForm] = useState({ id: null, categoryName: '', categoryImage: '', description: '', bannerImage: '', displayOrder: 0, visibility: true });
  const [userForm, setUserForm] = useState({ id: null, username: '', email: '', phone: '', gender: 'Not Specified', address: '', role: 'CUSTOMER', status: 'ACTIVE', profileImage: '', password: '' });

  const navigate = useNavigate();
  const adminEmail = localStorage.getItem('adminEmail') || 'admin@novanest.com';

  const fetchStats = async () => {
    try {
      const res = await API.get('/api/admin/dashboard/stats');
      if (res.data) setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch admin stats", err);
      throw new Error("Stats fetch failed", { cause: err });
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await API.get('/api/products');
      if (res.data) setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get('/api/categories');
      if (res.data) setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get('/api/admin/users');
      if (res.data) setAllUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchStats(),
        fetchProducts(),
        fetchCategories(),
        fetchUsers()
      ]);
    } catch (err) {
      setError(err.message || 'System fault while hydrating dashboard data.');
      toast.error('System synchronization failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('adminEmail');
    toast.info("Admin session terminated.");
    navigate('/admin/login');
  };

  // Product CRUD
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/api/admin/products', productForm);
      if (res.status === 200 || res.status === 201) {
        toast.success("Product successfully deployed to catalog.");
        setActiveView('products');
        setProductForm({ id: null, name: '', description: '', price: '', stock: '', categoryId: '', imageUrl: '' });
        fetchProducts();
        fetchStats();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create product.");
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put(`/api/admin/products/${productForm.id}`, productForm);
      if (res.status === 200) {
        toast.success("Product configurations updated.");
        setActiveView('products');
        setProductForm({ id: null, name: '', description: '', price: '', stock: '', categoryId: '', imageUrl: '' });
        fetchProducts();
        fetchStats();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to modify product.");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Confirm termination of this product entry? This action is irrevocable.")) {
      try {
        await API.delete(`/api/admin/products/${id}`);
        toast.success("Product eradicated from catalog.");
        fetchProducts();
        fetchStats();
      } catch {
        toast.error("Failed to delete product.");
      }
    }
  };

  // Category CRUD
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      if (categoryForm.id) {
        await API.put(`/api/admin/categories/${categoryForm.id}`, categoryForm);
        toast.success("Category architecture updated.");
      } else {
        await API.post('/api/admin/categories', categoryForm);
        toast.success("New category node established.");
      }
      setCategoryForm({ id: null, categoryName: '', categoryImage: '', description: '', bannerImage: '', displayOrder: 0, visibility: true });
      fetchCategories();
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to save category.");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to dismantle this category structure? Associated products may be affected.")) {
      try {
        await API.delete(`/api/admin/categories/${id}`);
        toast.success("Category dismantled.");
        fetchCategories();
        fetchStats();
      } catch {
        toast.error("Failed to delete category.");
      }
    }
  };

  // User CRUD
  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      if (userForm.id) {
        const payload = { ...userForm };
        if (!payload.password) delete payload.password;
        await API.put(`/api/admin/users/${userForm.id}`, payload);
        toast.success("System account profile updated.");
      } else {
        if (!userForm.password) {
          toast.error("Password is required for new system accounts.");
          return;
        }
        await API.post('/api/admin/users', userForm);
        toast.success("New system account provisioned.");
      }
      setIsEditingUser(false);
      setSelectedUser(null);
      fetchUsers();
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to manage account parameters.");
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Authorize full deletion of this system account? Order history mapping might be soft-deleted instead depending on business logic.")) {
      try {
        await API.delete(`/api/admin/users/${id}`);
        toast.success("Account operation completed.");
        setSelectedUser(null);
        setIsEditingUser(false);
        fetchUsers();
        fetchStats();
      } catch {
        toast.error("Failed to execute account termination.");
      }
    }
  };

  // Reports
  const downloadDailyReport = async () => {
    try {
      const response = await API.get('/api/admin/reports/daily', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `NovaNest_Daily_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success("Securely downloaded daily financial matrix.");
    } catch {
      // Fallback: Generate generic client-side report if endpoint missing
      toast.info("Generating real-time snapshot via client matrix...");
      const wb = XLSX.utils.book_new();
      const wsData = [
        ["NOVANEST LUXURY COMMERCE - DAILY OPERATIONS REPORT"],
        ["Generated:", new Date().toLocaleString()],
        [],
        ["Metric", "Value"],
        ["Total Users", stats.totalUsers],
        ["Total Products", stats.totalProducts],
        ["Total Revenue", stats.totalRevenue],
        ["Today's Revenue", stats.todayRevenue],
        ["Pending Orders", stats.pendingOrders]
      ];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, "Daily Overview");
      XLSX.writeFile(wb, `NovaNest_Client_Snapshot_${new Date().toISOString().split('T')[0]}.xlsx`);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-decor-ivory p-6 text-center">
        <div className="max-w-md w-full bg-black/40 backdrop-blur-md border border-red-900/30 p-8 rounded-sm text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-red-950/20 border border-red-800/40 flex items-center justify-center mx-auto text-red-500">
            <AlertCircle size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl text-white">System Error</h2>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">{error}</p>
          </div>
          <button 
            onClick={loadAllData}
            className="w-full bg-red-950/50 hover:bg-red-900/60 border border-red-900/50 text-red-400 px-6 py-3 rounded-sm text-[10px] tracking-widest uppercase font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <RefreshCw size={14} />
            <span>Re-initialize Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout 
      activeView={activeView} 
      setActiveView={setActiveView} 
      sidebarOpen={sidebarOpen} 
      setSidebarOpen={setSidebarOpen} 
      handleLogout={handleLogout} 
      adminEmail={adminEmail} 
      loadAllData={loadAllData} 
      loading={loading}
    >
      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-2 border-decor-gold border-t-transparent rounded-full animate-spin"></div>
          <span className="text-[10px] uppercase tracking-widest text-decor-gold animate-pulse">Syncing Database Matrix...</span>
        </div>
      ) : (
        <>
          {activeView === 'dashboard' && (
            <AdminOverview 
              stats={stats} 
              setActiveView={setActiveView} 
              setProductForm={setProductForm} 
              setProductPage={setProductPage} 
              safeCategories={categories}
              downloadDailyReport={downloadDailyReport}
            />
          )}

          {(activeView === 'products' || activeView === 'addProduct' || activeView === 'modifyProduct') && (
            <AdminProducts 
              activeView={activeView}
              setActiveView={setActiveView}
              products={products}
              safeCategories={categories}
              productForm={productForm}
              setProductForm={setProductForm}
              handleCreateProduct={handleCreateProduct}
              handleUpdateProduct={handleUpdateProduct}
              handleDeleteProduct={handleDeleteProduct}
              productSearch={productSearch}
              setProductSearch={setProductSearch}
              productCategoryFilter={productCategoryFilter}
              setProductCategoryFilter={setProductCategoryFilter}
              productStockFilter={productStockFilter}
              setProductStockFilter={setProductStockFilter}
              productSortField={productSortField}
              setProductSortField={setProductSortField}
              productSortOrder={productSortOrder}
              setProductSortOrder={setProductSortOrder}
              productPage={productPage}
              setProductPage={setProductPage}
            />
          )}

          {activeView === 'categories' && (
            <AdminCategories 
              safeCategories={categories}
              categoryForm={categoryForm}
              setCategoryForm={setCategoryForm}
              handleSaveCategory={handleSaveCategory}
              handleDeleteCategory={handleDeleteCategory}
            />
          )}

          {activeView === 'users' && (
            <AdminUsers 
              activeView={activeView}
              setActiveView={setActiveView}
              users={allUsers}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              isEditingUser={isEditingUser}
              setIsEditingUser={setIsEditingUser}
              userForm={userForm}
              setUserForm={setUserForm}
              handleSaveUser={handleSaveUser}
              handleDeleteUser={handleDeleteUser}
              userSearch={userSearch}
              setUserSearch={setUserSearch}
              userRoleFilter={userRoleFilter}
              setUserRoleFilter={setUserRoleFilter}
              userStatusFilter={userStatusFilter}
              setUserStatusFilter={setUserStatusFilter}
            />
          )}

          {activeView === 'orders' && (
            <AdminOrders stats={stats} />
          )}
        </>
      )}
    </AdminLayout>
  );
}
