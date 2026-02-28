// Import useState hook for managing component-level state
import { useState } from "react";
// Import useNavigate hook for programmatic navigation between routes
import { useNavigate } from "react-router-dom";

// Export Login component for user authentication
export const Login = () => {
  // State for email input field value
  const [email, setEmail] = useState("");
  // State for password input field value
  const [password, setPassword] = useState("");
  // State for displaying error messages to the user
  const [error, setError] = useState("");
  // State for showing loading indicator during API request
  const [isLoading, setIsLoading] = useState(false);
  // Hook for programmatically navigating to different routes
  const navigate = useNavigate();

  // Get backend API URL from Vite environment variables or default to localhost:3001
  // Environment variables are defined in .env file as VITE_BACKEND_URL
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

  // Async function to handle form submission and login process
  const handleLogin = async (e) => {
    // Prevent default form submission behavior (page reload)
    e.preventDefault();
    // Clear any previous error messages
    setError("");
    // Set loading state to true to disable submit button and show loading indicator
    setIsLoading(true);

    try {
      // Normalize email: trim whitespace and convert to lowercase for consistency
      const normalizedEmail = email.trim().toLowerCase();
      // Trim whitespace from password
      const trimmedPassword = password.trim();

      // Basic validation - check that both email and password are not empty
      if (!normalizedEmail || !trimmedPassword) {
        throw new Error("Email and password are required");
      }

      // Make POST request to backend login endpoint
      const response = await fetch(`${backendUrl}/api/login`, {
        method: "POST",  // HTTP POST method for sending login credentials
        headers: {
          "Content-Type": "application/json",  // Specify JSON content type
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password: trimmedPassword
        }),
      });

      // Parse JSON response from server
      const data = await response.json();

      // Check if response status code indicates failure (not 200-299 range)
      if (!response.ok) {
        throw new Error(data.msg || "Invalid credentials");
      }

      // Check if authentication token is included in response (required for security)
      if (!data.token) {
        throw new Error("Authentication token missing");
      }

      // Store JWT token in sessionStorage for use in future API requests
      // sessionStorage is cleared when browser tab closes (more secure than localStorage)
      sessionStorage.setItem("token", data.token);

      // Store user data in sessionStorage for quick access without API calls
      if (data.user) {
        sessionStorage.setItem("user", JSON.stringify(data.user));
      }

      // Navigate to protected /private page after successful login
      navigate("/private");

    } catch (err) {
      // Set error message to display to user in alert box
      setError(err.message);
      // Log error to browser console for debugging purposes
      console.error("Login error:", err);
    } finally {
      // Always set loading state to false when request completes (success or failure)
      setIsLoading(false);
    }
  };

  return (
    // Main container with Bootstrap styling
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      {/* Page heading */}
      <h2 className="mb-4">Login</h2>

      {/* Display error alert if error message exists */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Login form */}
      <form onSubmit={handleLogin}>
        {/* Email input field */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"  // HTML5 email input type
            className="form-control"  // Bootstrap styling
            id="email"
            value={email}  // Controlled input - value comes from state
            onChange={(e) => setEmail(e.target.value)}  // Update state on user input
            required  // HTML5 required attribute
            autoComplete="username"  // Browser hint for autocomplete
            placeholder="Enter your email"
          />
        </div>

        {/* Password input field */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"  // Input type masks characters for security
            className="form-control"  // Bootstrap styling
            id="password"
            value={password}  // Controlled input
            onChange={(e) => setPassword(e.target.value)}  // Update state on user input
            required  // HTML5 required attribute
            autoComplete="current-password"  // Browser hint for autocomplete
            placeholder="Your password"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="btn btn-primary w-100"  // Bootstrap button styling, full width
          disabled={isLoading}  // Disable button while request is in progress
        >
          {isLoading ? (
            <>
              {/* Show loading spinner while request is being processed */}
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>

      {/* Link to signup page for new users */}
      <p className="mt-3 text-center">
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>
    </div>
  );
};









