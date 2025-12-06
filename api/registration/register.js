// Vercel serverless function for registration
// This allows the Express backend to work on Vercel
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { name, email } = req.body

    // Validate input
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    // Initialize Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    )

    // Insert into registrations table
    const { data, error } = await supabase
      .from('registrations')
      .insert([{ name, email }])
      .select()

    if (error) {
      console.error('Supabase error:', JSON.stringify(error, null, 2))
      const errorMessage = error.message || error.details || error.hint || 'Database error'
      const errorCode = error.code || error.statusCode

      // Check if table doesn't exist
      if (!error || Object.keys(error).length === 0 || 
          errorCode === '42P01' || errorCode === 'P0001' || 
          (errorMessage && (errorMessage.includes('does not exist') || errorMessage.includes('relation')))) {
        return res.status(500).json({ 
          error: 'Database table not found. Please create the registrations table in Supabase.',
          hint: 'Run the SQL from supabase_migration.sql in your Supabase SQL Editor'
        })
      }

      // Check if it's a duplicate email error
      if (errorCode === '23505' || (errorMessage && errorMessage.includes('duplicate'))) {
        return res.status(409).json({ error: 'This email is already registered' })
      }

      return res.status(400).json({ 
        error: errorMessage || 'Database error occurred',
        code: errorCode
      })
    }

    res.status(201).json({ 
      success: true, 
      message: 'Registration successful!',
      data: data[0] 
    })
  } catch (error) {
    console.error('Error registering user:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

