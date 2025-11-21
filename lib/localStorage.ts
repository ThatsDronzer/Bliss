"use client";

// Helper for safely accessing localStorage in both server and client contexts

/**
 * Detect if we're running in a browser environment
 * This is more reliable than just checking for typeof window !== "undefined"
 */
const isClient = (): boolean => {
  return !!(
    typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
  );
};

/**
 * Safely get an item from localStorage with fallback
 * @param key The key to retrieve from localStorage
 * @param fallback A fallback value if key doesn't exist or localStorage isn't available
 * @returns The stored value or fallback
 */
export function getLocalStorage<T>(key: string, fallback: T): T {
  // Early return for server-side rendering
  if (!isClient()) {
    return fallback;
  }
  
  try {
    const item = window.localStorage.getItem(key);
    if (item === null) {
      return fallback;
    }
    
    // Try to parse JSON if possible
    try {
      return JSON.parse(item);
    } catch {
      // If not JSON, return as is
      return item as unknown as T;
    }
  } catch (e) {
    console.error("Error reading from localStorage:", e);
    return fallback;
  }
}

/**
 * Safely set an item in localStorage
 * @param key The key to set in localStorage
 * @param value The value to store (will be JSON stringified if object)
 * @returns boolean indicating success
 */
export function setLocalStorage<T>(key: string, value: T): boolean {
  // Early return for server-side rendering
  if (!isClient()) {
    return false;
  }
  
  try {
    // Convert objects to JSON strings
    const valueToStore = 
      typeof value === "object" ? JSON.stringify(value) : String(value);
      
    window.localStorage.setItem(key, valueToStore);
    return true;
  } catch (e) {
    console.error("Error writing to localStorage:", e);
    return false;
  }
}

/**
 * Safely remove an item from localStorage
 * @param key The key to remove from localStorage
 * @returns boolean indicating success
 */
export function removeLocalStorage(key: string): boolean {
  // Early return for server-side rendering
  if (!isClient()) {
    return false;
  }
  
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error("Error removing from localStorage:", e);
    return false;
  }
}

/**
 * Safe wrapper for sessionStorage.getItem with fallback
 * @param key The key to retrieve from sessionStorage
 * @param fallback A fallback value if key doesn't exist or sessionStorage isn't available
 * @returns The stored value or fallback
 */
export function getSessionStorage<T>(key: string, fallback: T): T {
  if (!isClient()) {
    return fallback;
  }
  
  try {
    const item = window.sessionStorage.getItem(key);
    if (item === null) {
      return fallback;
    }
    
    // Try to parse JSON if possible
    try {
      return JSON.parse(item);
    } catch {
      // If not JSON, return as is
      return item as unknown as T;
    }
  } catch (e) {
    console.error("Error reading from sessionStorage:", e);
    return fallback;
  }
}

/**
 * Safe wrapper for sessionStorage.setItem
 * @param key The key to set in sessionStorage
 * @param value The value to store
 * @returns boolean indicating success
 */
export function setSessionStorage<T>(key: string, value: T): boolean {
  if (!isClient()) {
    return false;
  }
  
  try {
    // Convert objects to JSON strings
    const valueToStore = 
      typeof value === "object" ? JSON.stringify(value) : String(value);
      
    window.sessionStorage.setItem(key, valueToStore);
    return true;
  } catch (e) {
    console.error("Error writing to sessionStorage:", e);
    return false;
  }
}
