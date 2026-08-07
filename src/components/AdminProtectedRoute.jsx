
import { Navigate } from 'react-router-dom';

export default function AdminProtectedRoute({ children }) {
  const adminEmail = localStorage.getItem('adminEmail') || localStorage.getItem('adminToken');
  
  if (!adminEmail) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
}
