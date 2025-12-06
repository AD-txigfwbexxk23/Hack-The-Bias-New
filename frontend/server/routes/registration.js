import express from 'express'
import supabase from '../utils/supabaseClient.js'

const router = express.Router()

/**
 * Register a new user for Hack the Bias
 * POST /api/registration/register
 * Body: { name: string, email: string }
 */
router.post('/register', async (req, res) => {
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

    // Insert into registrations table
    // Note: Make sure you have a 'registrations' table in Supabase with columns: name, email, created_at
    const { data, error } = await supabase
      .from('registrations')
      .insert([{ name, email }])
      .select()

    if (error) {
      console.error('Supabase error:', JSON.stringify(error, null, 2))
      console.error('Error keys:', Object.keys(error))
      
      // Handle empty error object (likely means table doesn't exist)
      if (!error || Object.keys(error).length === 0) {
        return res.status(500).json({ 
          error: 'Database table not found. Please create the registrations table in Supabase.',
          hint: 'Run the SQL from supabase_migration.sql in your Supabase SQL Editor',
          action: 'Go to Supabase Dashboard > SQL Editor and run the migration SQL'
        })
      }
      
      const errorMessage = error.message || error.details || error.hint || 'Database error'
      const errorCode = error.code || error.statusCode
      
      // Check if table doesn't exist (PostgreSQL error code 42P01)
      if (errorCode === '42P01' || errorCode === 'P0001' || 
          (errorMessage && (errorMessage.includes('does not exist') || errorMessage.includes('relation')))) {
        return res.status(500).json({ 
          error: 'Database table not found. Please create the registrations table in Supabase.',
          details: errorMessage,
          hint: 'Run the SQL from supabase_migration.sql in your Supabase SQL Editor'
        })
      }
      
      // Check if it's a duplicate email error (PostgreSQL error code 23505)
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
    console.error('Error stack:', error.stack)
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

export default router

