// Import React library for JSX compilation and React component functionality
import React from 'react'
// Import ReactDOM for rendering React components into the DOM
import ReactDOM from 'react-dom/client'
// Import global CSS styles that apply to the entire application
import './index.css'
// Import RouterProvider component to enable client-side routing
import { RouterProvider } from "react-router-dom";
// Import the router configuration that defines all application routes
import { router } from "./routes";
// Import StoreProvider to wrap app with global state management
import { StoreProvider } from './hooks/useGlobalReducer';
// Import component that displays setup instructions if backend URL is not configured
import { BackendURL } from './components/BackendURL';

// Main component that conditionally renders based on environment configuration
const Main = () => {
    // Check if VITE_BACKEND_URL environment variable is set and not empty
    // Vite uses import.meta.env to access environment variables defined in .env files
    if (! import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_URL == "")
        // If backend URL is not configured, render setup component instead of the app
        return (
            <React.StrictMode>
                {/* BackendURL component prompts user to configure backend URL */}
                <BackendURL />
            </React.StrictMode>
        );

    // If backend URL is configured, render the complete application
    return (
        <React.StrictMode>
            {/* StrictMode helps identify potential problems in the app during development */}

            {/* StoreProvider wraps the app to provide global state to all child components */}
            <StoreProvider>
                {/* RouterProvider sets up client-side routing for the application */}
                <RouterProvider router={router}>
                </RouterProvider>
            </StoreProvider>
        </React.StrictMode>
    );
}

// Render the Main component into the HTML element with id "root" (defined in index.html)
// ReactDOM.createRoot creates the entry point for React rendering
ReactDOM.createRoot(document.getElementById('root')).render(<Main />)















