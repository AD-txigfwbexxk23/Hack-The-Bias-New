# Hack The Bias

A modern, animated hackathon website built with React, Vite, and Framer Motion. This site showcases a professional, polished design with smooth animations and a focus on diversity and inclusion in technology.

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

## License

This project is created for the Hack The Bias hackathon event.

