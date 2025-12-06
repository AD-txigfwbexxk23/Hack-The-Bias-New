import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

/**
 * Validates that all required environment variables are present
 * Call this at the start of your server to ensure proper configuration
 */
export function validateEnv() {
  const required = ['SUPABASE_URL', 'SUPABASE_KEY']
  const missing = []

  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key)
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    )
  }

  // Validate URL format
  try {
    new URL(process.env.SUPABASE_URL)
  } catch (error) {
    throw new Error('SUPABASE_URL must be a valid URL')
  }

  console.log('✅ Environment variables validated successfully')
  return true
}

// Auto-validate on import (optional - remove if you want manual validation)
// validateEnv()

