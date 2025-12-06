import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { validateEnv } from './utils/validateEnv.js'
import exampleRoutes from './routes/example.js'
import registrationRoutes from './routes/registration.js'

// Load environment variables
dotenv.config()

// Validate environment variables on startup
try {
  validateEnv()
} catch (error) {
  console.error('❌ Environment validation failed:', error.message)
  process.exit(1)
}

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API Routes
app.use('/api/example', exampleRoutes)
app.use('/api/registration', registrationRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})

