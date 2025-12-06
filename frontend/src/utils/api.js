/**
 * API Configuration
 * 
 * Determines the backend API URL based on environment:
 * - Development: Uses relative URL (proxied by Vite)
 * - Production: Uses VITE_API_URL environment variable or falls back to relative URL
 */

// Get API base URL from environment variable
// In production, set VITE_API_URL to your backend URL (e.g., https://api.hackthebias.dev)
const API_BASE_URL = import.meta.env.VITE_API_URL || ''

/**
 * Get the full API URL for a given endpoint
 * @param {string} endpoint - The API endpoint (e.g., '/preregister')
 * @returns {string} The full API URL
 */
export const getApiUrl = (endpoint) => {
  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  
  // If API_BASE_URL is set, use it (production)
  if (API_BASE_URL) {
    // Ensure API_BASE_URL doesn't end with a slash
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL
    return `${baseUrl}/api/${cleanEndpoint}`
  }
  
  // Otherwise, use relative URL (development - will be proxied by Vite)
  return `/api/${cleanEndpoint}`
}

/**
 * Default export for convenience
 */
export default getApiUrl


