import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import LandingPage from '../pages/LandingPage';
import Products from '../pages/Products';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import VerifyOtp from '../pages/VerifyOtp';
import ResetPassword from '../pages/ResetPassword';
import Cart from '../pages/Cart';
import Wishlist from '../pages/Wishlist';
import Profile from '../pages/Profile';
import ProductDetails from '../pages/ProductDetails';
import Checkout from '../pages/Checkout';
import Orders from '../pages/Orders';
import OrderDetails from '../pages/OrderDetails';
import Search from '../pages/Search';
import OrderSuccess from '../pages/OrderSuccess';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <LandingPage />
      },
      {
        path: '/products',
        element: <Products />
      },
      {
        path: '/products/:id',
        element: <ProductDetails />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/register',
        element: <Register />
      },
      {
        path: '/forgot-password',
        element: <ForgotPassword />
      },
      {
        path: '/verify-otp',
        element: <VerifyOtp />
      },
      {
        path: '/reset-password',
        element: <ResetPassword />
      },
      {
        path: '/cart',
        element: <Cart />
      },
      {
        path: '/wishlist',
        element: <Wishlist />
      },
      {
        path: '/profile',
        element: <Profile />
      },
      {
        path: '/checkout',
        element: <Checkout />
      },
      {
        path: '/orders',
        element: <Orders />
      },
      {
        path: '/orders/:id',
        element: <OrderDetails />
      },
      {
        path: '/search',
        element: <Search />
      },
      {
        path: '/order-success',
        element: <OrderSuccess />
      }
    ]
  }
]);
