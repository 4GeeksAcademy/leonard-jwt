// Import Navigate component for redirecting to different routes
import { Navigate } from "react-router-dom";

// Component that protects routes by requiring JWT authentication
// Wraps components to check if user has valid JWT token before allowing access
const ProtectedRoute = ({ children }) => {
  // Retrieve JWT token from sessionStorage (stored during login)
  const token = sessionStorage.getItem("token");

  // If no token exists, user is not authenticated
  if (!token) {
    // Redirect user to login page using Navigate component
    // Navigate replaces current route in history (similar to redirect, not push)
    return <Navigate to="/login" />;
  }

  // If token exists, user is authenticated, render the protected component
  return children;
};

// Export component as default for use in route definitions
export default ProtectedRoute;