
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/Router';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <WishlistProvider>
          <RouterProvider router={router} />
          <ToastContainer
            position="bottom-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            toastClassName="glass-panel border border-gold-500/20 text-xs tracking-wider"
          />
        </WishlistProvider>
      </CartProvider>
    </ThemeProvider>
  );
}
