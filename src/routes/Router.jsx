/* eslint-disable react-refresh/only-export-components */

import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import LandingPage from '../pages/LandingPage';
import Categories from '../pages/Categories';
import Products from '../pages/Products';
import Login from '../pages/Login';
import Register from '../pages/Register';


import Cart from '../pages/Cart';
import Wishlist from '../pages/Wishlist';
import Profile from '../pages/Profile';
import ProductDetails from '../pages/ProductDetails';
import Checkout from '../pages/Checkout';
import Orders from '../pages/Orders';
import OrderDetails from '../pages/OrderDetails';
import Search from '../pages/Search';
import OrderSuccess from '../pages/OrderSuccess';

// Route Protection Guards
import ProtectedRoute from '../components/ProtectedRoute';
import AdminProtectedRoute from '../components/AdminProtectedRoute';

// Admin View Pages
import AdminLogin from '../pages/AdminLogin';
import AdminDashboard from '../pages/AdminDashboard';

import { Navigate } from 'react-router-dom';

function DefaultRoute() {
  const username = localStorage.getItem('username') || localStorage.getItem('token');
  if (username) {
    return <Navigate to="/home" replace />;
  }
  return <Login />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <DefaultRoute />
      },
      {
        path: '/home',
        element: <ProtectedRoute><LandingPage /></ProtectedRoute>
      },
      {
        path: '/categories',
        element: <ProtectedRoute><Categories /></ProtectedRoute>
      },
      {
        path: '/products',
        element: <ProtectedRoute><Products /></ProtectedRoute>
      },
      {
        path: '/products/:id',
        element: <ProtectedRoute><ProductDetails /></ProtectedRoute>
      },
      {
        path: '/login',
        element: <DefaultRoute />
      },
      {
        path: '/register',
        element: <Register />
      },
      {
        path: '/cart',
        element: <ProtectedRoute><Cart /></ProtectedRoute>
      },
      {
        path: '/wishlist',
        element: <ProtectedRoute><Wishlist /></ProtectedRoute>
      },
      {
        path: '/profile',
        element: <ProtectedRoute><Profile /></ProtectedRoute>
      },
      {
        path: '/checkout',
        element: <ProtectedRoute><Checkout /></ProtectedRoute>
      },
      {
        path: '/orders',
        element: <ProtectedRoute><Orders /></ProtectedRoute>
      },
      {
        path: '/orders/:id',
        element: <ProtectedRoute><OrderDetails /></ProtectedRoute>
      },
      {
        path: '/search',
        element: <ProtectedRoute><Search /></ProtectedRoute>
      },
      {
        path: '/order-success',
        element: <ProtectedRoute><OrderSuccess /></ProtectedRoute>
      },
      {
        path: '/admin/login',
        element: <AdminLogin />
      }
    ]
  },
  {
    path: '/admin/dashboard',
    element: <AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>
  }
]);

