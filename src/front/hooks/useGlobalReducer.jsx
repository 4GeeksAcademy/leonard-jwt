// Import necessary React hooks for context and state management
import { useContext, useReducer, createContext } from "react";
// Import the reducer function and initial state factory from the store module
import storeReducer, { initialStore } from "../store"
// Create a React Context object to hold and distribute global application state
// Context allows data to be passed through component tree without prop drilling
const StoreContext = createContext()
// Provider component that wraps the application and provides global state to all children
// This component encapsulates the store (global state) and makes it accessible throughout the app
export function StoreProvider({ children }) {
    // Initialize useReducer hook with:
    // 1. storeReducer - the function that handles state updates
    // 2. initialStore() - the initial state value
    // Returns [currentState, dispatchFunction]
    const [store, dispatch] = useReducer(storeReducer, initialStore())
    // Return context provider that wraps all children components
    // The value prop exposes store and dispatch to all descendants
    return <StoreContext.Provider value={{ store, dispatch }}>
        {/* Render child components that have access to the context */}
        {children}
    </StoreContext.Provider>
}
// Custom hook for components to access and use global state
// This hook simplifies accessing the context in any component
export default function useGlobalReducer() {
    // Use useContext hook to retrieve the store and dispatch from StoreContext
    const { dispatch, store } = useContext(StoreContext)
    // Return both store (for reading state) and dispatch (for updating state)
    return { dispatch, store };
}


