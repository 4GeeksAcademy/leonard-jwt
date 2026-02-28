// Import React Router components for creating and configuring routes
import {
  createBrowserRouter,  // Creates a router instance for browser-based routing
  createRoutesFromElements,  // Converts JSX route definitions into route objects
  Route,  // Component to define individual routes
} from "react-router-dom";

// Import page components that represent different pages/views in the application
import { Layout } from "./pages/Layout";  // Main layout wrapper with header/footer
import { Home } from "./pages/Home";  // Home page component
import { Single } from "./pages/Single";  // Single item detail page component
import { Demo } from "./pages/Demo";  // Demo page component
import { Login } from "./pages/Login";  // Login/authentication page component
import { Signup } from "./pages/Signup";  // User registration/signup page component
import { Private } from "./pages/Private";  // Protected/private page (requires authentication)
import ProtectedRoute from ".//components/ProtectedRoute";  // Component that protects routes with authentication

// Create and export the router instance with all route definitions
export const router = createBrowserRouter(
  // Create routes from JSX Route elements
  createRoutesFromElements(
    // Root route (/) with Layout component as the main wrapper for all pages
    // The Layout component persists across all route changes
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>

      {/* Index route - renders Home component when path is exactly "/" */}
      <Route index element={<Home />} />

      {/* Route for viewing a single item with dynamic ID parameter (:theId) */}
      {/* URL pattern: /single/123, /single/abc, etc. */}
      <Route path="/single/:theId" element={<Single />} />

      {/* Route for demo page - showcases application features */}
      <Route path="/demo" element={<Demo />} />

      {/* Route for user login page - public route */}
      <Route path="/login" element={<Login />} />

      {/* Route for user registration/signup page - public route */}
      <Route path="/signup" element={<Signup />} />

      {/* Protected route that requires JWT authentication */}
      {/* Wrapped with ProtectedRoute component that checks for valid token */}
      <Route
        path="/private"
        element={
          // ProtectedRoute checks if user has valid JWT token in sessionStorage
          // Redirects to /login if token doesn't exist
          <ProtectedRoute>
            <Private />
          </ProtectedRoute>
        }
      />
    </Route>
  )
);












