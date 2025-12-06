import express from 'express'
import supabase from '../utils/supabaseClient.js'

const router = express.Router()

/**
 * Example: Select all rows from a table
 * GET /api/example/users
 */
router.get('/users', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json({ data, count: data?.length || 0 })
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * Example: Insert a row into a table
 * POST /api/example/users
 * Body: { name: string, email: string, ... }
 */
router.post('/users', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([req.body])
      .select()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.status(201).json({ data: data[0] })
  } catch (error) {
    console.error('Error creating user:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * Example: Select with filters
 * GET /api/example/users?email=example@email.com
 */
router.get('/users/filtered', async (req, res) => {
  try {
    let query = supabase.from('users').select('*')

    // Add filters based on query parameters
    if (req.query.email) {
      query = query.eq('email', req.query.email)
    }

    if (req.query.status) {
      query = query.eq('status', req.query.status)
    }

    const { data, error } = await query

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json({ data, count: data?.length || 0 })
  } catch (error) {
    console.error('Error fetching filtered users:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * Example: Update a row
 * PUT /api/example/users/:id
 */
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase
      .from('users')
      .update(req.body)
      .eq('id', id)
      .select()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({ data: data[0] })
  } catch (error) {
    console.error('Error updating user:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * Example: Delete a row
 * DELETE /api/example/users/:id
 */
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router

