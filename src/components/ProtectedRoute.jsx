
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const username = localStorage.getItem('username') || localStorage.getItem('token');
  
  if (!username) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}
