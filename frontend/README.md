# Hack The Bias

A modern, animated hackathon website built with **React**, **Vite**, and **Framer Motion**. This site showcases a professional, polished design with smooth animations and a focus on diversity and inclusion in technology.

## 🚀 Tech Stack

This is a **React application** (not pure HTML/JS/CSS) built with:
- **React 18** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **Framer Motion** - Animation library
- **Express.js** - Backend API server
- **Supabase** - Database and backend services
- **React Icons** - Icon library

## Features

- ✨ **Smooth Animations**: Entrance animations, scroll-triggered effects, and micro-interactions throughout
- 🎨 **Modern Design**: Clean, professional aesthetic with a light blue and white color palette
- 📱 **Fully Responsive**: Optimized for all screen sizes and devices
- ⚡ **Fast Performance**: Built with Vite for optimal build times and HMR
- ♿ **Accessible**: Semantic HTML and accessibility-aware components
- 🌊 **Fluid UX**: Smooth scrolling, hover effects, and interactive elements

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Framer Motion** - Animation library
- **React Icons** - Icon library
- **CSS Modules** - Scoped styling

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn/pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── Navigation.jsx   # Main navigation with smooth scroll
│   ├── Hero.jsx         # Animated hero section
│   ├── About.jsx        # About section with mission & vision
│   ├── Timeline.jsx     # Event schedule/timeline
│   ├── Prizes.jsx       # Prizes and awards section
│   ├── Judges.jsx       # Judges and mentors section
│   ├── Sponsors.jsx     # Sponsors and partners section
│   ├── FAQ.jsx          # FAQ accordion section
│   └── Footer.jsx       # Footer with contact info
├── styles/              # Global styles and themes
│   ├── index.css        # Main stylesheet with CSS variables
│   └── animations.css   # Animation utilities and keyframes
├── App.jsx              # Main app component
└── main.jsx             # Entry point
```

## Design System

### Colors

- **Primary Blue**: `#87CEEB` (Sky Blue)
- **Accent Blue**: `#4A90E2` (Bright Blue)
- **Primary Blue Dark**: `#6BB6D6`
- **Primary Blue Light**: `#B0E0E6`
- **Primary Blue Ultra Light**: `#E0F4F8`

### Typography

- **Headings**: Poppins (bold, 700-800 weight)
- **Body**: Inter (regular, 400-500 weight)

### Spacing

Uses a consistent spacing scale: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`

### Animations

- Entrance animations with staggered delays
- Scroll-triggered animations using Intersection Observer
- Hover effects and micro-interactions
- Smooth page transitions
- GPU-accelerated transforms

## Customization

The design system uses CSS custom properties defined in `src/styles/index.css`. You can easily customize:

- Colors: Modify the `--primary-blue`, `--accent-blue`, etc. variables
- Typography: Change font families and sizes
- Spacing: Adjust the spacing scale
- Animations: Modify animation durations and easing functions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🚢 Deployment

### Vercel Deployment

**Yes, this can be deployed on Vercel!** The project is configured for Vercel deployment:

1. **Frontend (React/Vite)**: Deploys automatically to Vercel
2. **Backend API**: Uses Vercel serverless functions (see `api/registration/register.js`)

#### Steps to Deploy:

1. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository: `AD-txigfwbexxk23/Hack-The-Bias-New`
   - Vercel will auto-detect Vite and configure it

2. **Set Environment Variables**:
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add:
     - `VITE_API_URL` - Your backend API URL (e.g., `https://api.hackthebias.dev`)
     - `VITE_RECAPTCHA_SITE_KEY` - Your reCAPTCHA site key (optional)
     - `SUPABASE_URL` - Your Supabase project URL (for serverless functions)
     - `SUPABASE_KEY` - Your Supabase service role key (for serverless functions)

3. **Deploy**:
   - Vercel will automatically deploy on every push to `main`
   - Or click "Deploy" in the dashboard

#### Important Notes:

- The Express server (`server/server.js`) is for local development
- For production on Vercel, the API routes use serverless functions in the `api/` folder
- Make sure you've created the `registrations` table in Supabase (see `supabase_migration.sql`)

### Alternative Deployment Options:

- **Frontend only**: Netlify, GitHub Pages, Cloudflare Pages
- **Full stack**: Railway, Render, Fly.io (for the Express server)

## 📝 Environment Setup

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory (or set in your deployment platform):

```env
# Backend API URL (required for production)
# In development, this is optional - Vite proxy will be used
VITE_API_URL=https://your-backend-api-url.com

# reCAPTCHA (optional)
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
```

**How it works:**
- **Development**: If `VITE_API_URL` is not set, the frontend uses relative URLs (`/api/...`) which are proxied to `http://localhost:8000` by Vite
- **Production**: Set `VITE_API_URL` to your deployed backend URL (e.g., `https://api.hackthebias.dev`)

### Backend Setup

See `SUPABASE_SETUP.md` for detailed Supabase configuration instructions.

## License

This project is created for the Hack The Bias hackathon event.

