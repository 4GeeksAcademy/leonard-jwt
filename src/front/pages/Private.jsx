// Import React hooks for state management and side effects
import { useEffect, useState } from "react";
// Import useNavigate hook for programmatic routing
import { useNavigate } from "react-router-dom";

// Export Private component - a protected page only accessible to authenticated users
export const Private = () => {
  // State to store user data fetched from protected backend endpoint
  const [userData, setUserData] = useState(null);
  // State to track whether data is still being fetched from server
  const [loading, setLoading] = useState(true);
  // State to store error messages if API request fails
  const [error, setError] = useState("");
  // Hook for programmatically navigating between routes
  const navigate = useNavigate();

  // Get backend API URL from Vite environment variables or default to localhost
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

  // useEffect hook runs once when component mounts (empty dependency array means once)
  useEffect(() => {
    // Retrieve JWT token from sessionStorage (stored during login)
    const token = sessionStorage.getItem("token");

    // If no token exists, user is not authenticated
    if (!token) {
      // Redirect to login page immediately
      navigate("/login");
      return;  // Exit early without making API request
    }

    // Make GET request to protected backend endpoint
    // Include JWT token in Authorization header for authentication
    fetch(`${backendUrl}/api/private`, {
      headers: {
        // Send JWT token in standard Authorization header format
        Authorization: `Bearer ${token}`,
      },
    })
      // Handle the response promise
      .then((response) => {
        // Check if response status indicates error
        if (!response.ok) {
          // Parse error response as JSON and throw error with server message
          return response.json().then((data) => {
            throw new Error(data.msg || "Unauthorized");
          });
        }
        // If OK, parse and return JSON data
        return response.json();
      })
      // Handle successful response data
      .then((data) => {
        // Store user data from response in component state
        setUserData(data);
      })
      // Handle any errors (network, auth, etc.)
      .catch((err) => {
        // Store error message in state for display to user
        setError(err.message);
        // Clear invalid token from storage
        sessionStorage.removeItem("token");
        // Redirect to login page
        navigate("/login");
      })
      // Always execute finally block
      .finally(() => {
        // Stop loading indicator regardless of success or failure
        setLoading(false);
      });
  }, [navigate, backendUrl]);  // Re-run effect if navigate or backendUrl change

  // Handle logout button click
  const handleLogout = () => {
    // Remove JWT token from session storage
    sessionStorage.removeItem("token");
    // Redirect to login page
    navigate("/login");
  };

  // Show loading indicator while fetching protected data
  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      {/* Page heading */}
      <h2>Private Page</h2>

      {/* Display error alert if API request failed */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Display user data card if successfully fetched */}
      {userData && (
        <div className="card">
          <div className="card-body">
            {/* Card heading */}
            <h5 className="card-title">Welcome!</h5>
            {/* Display message from backend API response */}
            <p className="card-text">{userData.msg}</p>
            {/* Display user email from response data */}
            <p>Email: {userData.user.email}</p>

            {/* Logout button */}
            <button onClick={handleLogout} className="btn btn-danger">
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};









