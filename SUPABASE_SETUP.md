# Supabase Backend Setup Guide

## Overview

This project uses Supabase as the backend database. The Supabase client is configured server-side to ensure security best practices.

## File Structure

```
server/
├── utils/
│   ├── supabaseClient.js    # Main Supabase client configuration
│   └── validateEnv.js       # Environment variable validation
├── routes/
│   └── example.js           # Example API routes
└── server.js                # Express server entry point
```

## Environment Setup

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Get your Supabase credentials:**
   - Go to your Supabase project dashboard
   - Navigate to Settings → API
   - Copy your `Project URL` (SUPABASE_URL)
   - Copy your `service_role` key (SUPABASE_KEY) for server-side use

3. **Update your `.env` file:**
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your-service-role-key-here
   PORT=3001
   NODE_ENV=development
   ```

## Key Security Practices

### ✅ DO:
- Use **service_role** key for server-side operations (admin access)
- Use **anon** key for client-side operations (with Row Level Security)
- Keep `.env` file in `.gitignore` (already configured)
- Validate environment variables on server startup
- Use environment variables, never hard-code keys

### ❌ DON'T:
- Never commit `.env` file to version control
- Never expose service_role key to frontend
- Never hard-code Supabase credentials in code
- Never use service_role key in client-side code

## Running the Server

```bash
# Development mode (with auto-reload)
npm run dev:server

# Production mode
npm run server
```

## API Route Examples

### Select All Rows
```javascript
// GET /api/example/users
const { data, error } = await supabase
  .from('users')
  .select('*')
```

### Insert a Row
```javascript
// POST /api/example/users
const { data, error } = await supabase
  .from('users')
  .insert([{ name: 'John', email: 'john@example.com' }])
  .select()
```

### Update a Row
```javascript
// PUT /api/example/users/:id
const { data, error } = await supabase
  .from('users')
  .update({ name: 'Jane' })
  .eq('id', id)
  .select()
```

### Delete a Row
```javascript
// DELETE /api/example/users/:id
const { error } = await supabase
  .from('users')
  .delete()
  .eq('id', id)
```

## Using the Supabase Client

### In API Routes
```javascript
import supabase from '../utils/supabaseClient.js'

// Use in your route handlers
router.get('/data', async (req, res) => {
  const { data, error } = await supabase
    .from('your_table')
    .select('*')
  
  if (error) {
    return res.status(400).json({ error: error.message })
  }
  
  res.json({ data })
})
```

### In Other Server Modules
```javascript
import supabase from './utils/supabaseClient.js'

// Use anywhere in your server code
const result = await supabase.from('table').select('*')
```

## Environment Variable Validation

The `validateEnv.js` utility automatically checks for required environment variables:

```javascript
import { validateEnv } from './utils/validateEnv.js'

// Call at server startup
validateEnv()
```

## Troubleshooting

### "Missing SUPABASE_URL environment variable"
- Ensure `.env` file exists in the project root
- Check that `SUPABASE_URL` is set in `.env`
- Verify `dotenv` is loading the file correctly

### "Missing SUPABASE_KEY environment variable"
- Ensure `SUPABASE_KEY` is set in `.env`
- Verify you're using the correct key (service_role for server-side)

### Connection Issues
- Verify your Supabase URL is correct
- Check that your Supabase project is active
- Ensure your network allows connections to Supabase

## Next Steps

1. Create your database tables in Supabase dashboard
2. Set up Row Level Security (RLS) policies
3. Create additional API routes in `server/routes/`
4. Test your API endpoints

