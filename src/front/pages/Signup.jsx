// Import useState hook for managing component-level state
import { useState } from "react";
// Import useNavigate hook for programmatic navigation between routes
import { useNavigate } from "react-router-dom";

// Export Signup component for user registration
export const Signup = () => {
  // State for email input field
  const [email, setEmail] = useState("");
  // State for password input field
  const [password, setPassword] = useState("");
  // State for error message display
  const [error, setError] = useState("");
  // State for loading indicator during API request
  const [isLoading, setIsLoading] = useState(false);
  // Hook for programmatically navigating to different routes
  const navigate = useNavigate();

  // Get backend API URL from Vite environment variables or default to localhost
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

  // Email validation function using regex pattern matching
  const validateEmail = (email) => {
    // Regex pattern: [not @space]+@[not @space]+.[not @space]+
    // Matches basic email format: something@something.something
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);  // Return true if email matches pattern
  };

  // Password validation function to enforce strong passwords
  const validatePassword = (password) => {
    // Check if password contains at least one digit (0-9)
    const hasNumber = /\d/;
    // Check if password contains at least one uppercase letter (A-Z)
    const hasUpperCase = /[A-Z]/;
    // Password must be 8+ characters AND have number AND have uppercase letter
    return password.length >= 8 && hasNumber.test(password) && hasUpperCase.test(password);
  };

  // Handle form submission for user registration
  const handleSignup = async (e) => {
    // Prevent default form submission behavior (page reload)
    e.preventDefault();
    // Clear any previous error messages
    setError("");
    // Trim whitespace from email input
    const trimmedEmail = email.trim();
    // Trim whitespace from password input
    const trimmedPassword = password.trim();

    // Validate email format
    if (!validateEmail(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;  // Exit function without making API request
    }

    // Validate password meets strength requirements
    if (!validatePassword(trimmedPassword)) {
      setError("Password must be at least 8 characters long, include a number and an uppercase letter.");
      return;  // Exit function without making API request
    }

    // Set loading state to show indicator and disable submit button
    setIsLoading(true);

    try {
      // Make POST request to backend signup endpoint with credentials
      const response = await fetch(`${backendUrl}/api/signup`, {
        method: "POST",  // HTTP POST method for form submission
        headers: {
          "Content-Type": "application/json",  // Specify JSON content type
        },
        body: JSON.stringify({
          email: trimmedEmail,
          password: trimmedPassword,
        }),
      });

      // Parse JSON response from server
      const data = await response.json();

      // Check if response status indicates failure (not 200-299 range)
      if (!response.ok) {
        throw new Error(data.msg || "Registration failed. Please try again.");
      }

      // Show success alert to user
      alert("Registration successful! Please login.");
      // Navigate to login page so user can authenticate
      navigate("/login");
    } catch (err) {
      // Set error message to display to user
      setError(err.message);
      // Log error to console for debugging
      console.error("Signup error:", err);
    } finally {
      // Always clear loading state when request completes
      setIsLoading(false);
    }
  };

  return (
    // Main container with Bootstrap styling
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      {/* Page heading */}
      <h2 className="mb-4">Sign Up</h2>

      {/* Display error alert if error message exists */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Registration form */}
      <form onSubmit={handleSignup}>
        {/* Email input field */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"  // HTML5 email input type
            className="form-control"  // Bootstrap styling
            id="email"
            value={email}  // Controlled input
            onChange={(e) => setEmail(e.target.value)}  // Update state on input
            required  // HTML5 required attribute
            placeholder="Enter your email"
          />
        </div>

        {/* Password input field */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"  // Masks password input for security
            className="form-control"  // Bootstrap styling
            id="password"
            value={password}  // Controlled input
            onChange={(e) => setPassword(e.target.value)}  // Update state on input
            required  // HTML5 required attribute
            minLength="8"  // HTML5 validation for minimum length
            placeholder="At least 8 characters"
          />
          {/* Help text showing password requirements */}
          <div className="form-text">
            Must contain at least 1 number and 1 uppercase letter
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="btn btn-primary w-100"  // Bootstrap styling, full width
          disabled={isLoading}  // Disable while request in progress
        >
          {isLoading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      {/* Link to login page for existing users */}
      <div className="mt-3 text-center">
        Already have an account?{" "}
        <a href="/login" className="text-decoration-none">
          Login here
        </a>
      </div>
    </div>
  );
};









