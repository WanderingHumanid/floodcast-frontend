# FloodCast Frontend

## Overview

The FloodCast frontend is a modern, responsive web application that visualizes flood prediction data with interactive maps and dashboards. It provides users with location-specific flood risk information, historical trends, and early warnings to help communities prepare for and respond to potential flooding events.

Built with Next.js and React, this application connects to the FloodCast backend API to retrieve real-time flood prediction data and presents it in an intuitive and accessible interface designed for both emergency management professionals and the general public.

## Features

### Interactive Flood Risk Map
- **Ward-level Visualization**: Color-coded flood risk indicators for different city wards
- **Real-time Updates**: Live data refreshing as new predictions become available
- **Address Search**: Ability to search for specific locations to view local risk
- **Layer Controls**: Toggle between different data visualization layers (prediction, historical, rainfall, etc.)

### Dashboard Components
- **Risk Summary Panel**: At-a-glance flood risk information for selected areas
- **Time-series Forecasts**: Prediction trends over the next 24-72 hours
- **Historical Comparison**: Current risk compared to historical patterns
- **Weather Context**: Current and forecasted weather conditions affecting flood risk

### Alert System
- **Risk Level Indicators**: Clear visual representation of risk severity
- **Notification Settings**: User-configurable alert preferences
- **Mobile Responsiveness**: Optimized for viewing on smartphones during emergencies

### User Experience
- **Accessibility**: WCAG compliant for users with disabilities
- **Dark/Light Mode**: Theme switching for different lighting conditions
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Progressive Web App**: Installable on devices with offline capabilities

## Technologies

### Core Framework
- **Next.js 15.5**: React framework providing server-side rendering, static site generation, and API routes
- **React 19.1**: JavaScript library for building user interfaces with reusable components
- **TypeScript**: Strongly typed programming language that builds on JavaScript for improved developer experience

### UI Components & Styling
- **Tailwind CSS**: Utility-first CSS framework for rapidly building custom designs
- **Shadcn/UI**: Collection of reusable components built with Radix UI and Tailwind CSS
- **Framer Motion**: Production-ready motion library for React for creating animations
- **React Icons**: Comprehensive library of icons for React applications

### Mapping & Visualization
- **Leaflet/React-Leaflet**: Open-source JavaScript library for mobile-friendly interactive maps
- **Chart.js/React-Chartjs-2**: Simple yet flexible JavaScript charting for designers & developers
- **Recharts**: Redefined chart library built with React and D3

### State Management
- **React Context API**: For global state management across components
- **SWR**: React Hooks library for data fetching, caching, and revalidation
- **Zustand**: Small, fast and scalable state-management solution using simplified flux principles

### API Communication
- **Axios**: Promise-based HTTP client for browser and Node.js
- **React Query**: Data fetching, caching, synchronization and server state management library

### Form Handling
- **React Hook Form**: Performant, flexible and extensible forms with easy-to-use validation
- **Zod**: TypeScript-first schema validation with static type inference

### Testing
- **Jest**: JavaScript testing framework focused on simplicity
- **React Testing Library**: Testing utilities encouraging good testing practices
- **Cypress**: End-to-end testing framework for web applications

### Build & Development Tools
- **ESLint**: Static code analysis tool for identifying problematic patterns
- **Prettier**: Opinionated code formatter for consistent code style
- **PostCSS**: Tool for transforming CSS with JavaScript plugins

## Project Structure

```
frontend/
├── public/                  # Static assets
│   ├── images/              # Image resources
│   ├── icons/               # Icon resources
│   └── favicon.ico          # Browser favicon
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx         # Home page
│   │   ├── layout.tsx       # Root layout
│   │   ├── api/             # API routes
│   │   └── [ward]/page.tsx  # Ward-specific page
│   ├── components/          # Reusable React components
│   │   ├── ui/              # UI components (buttons, cards, etc.)
│   │   ├── map/             # Map-related components
│   │   ├── charts/          # Data visualization components
│   │   ├── layout/          # Layout components
│   │   └── forms/           # Form components
│   ├── lib/                 # Utility functions and libraries
│   │   ├── api.ts           # API client
│   │   ├── utils.ts         # Helper functions
│   │   └── types.ts         # TypeScript type definitions
│   ├── hooks/               # Custom React hooks
│   ├── context/             # React context providers
│   ├── styles/              # Global styles
│   └── config/              # Configuration files
├── next.config.ts           # Next.js configuration
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── tailwind.config.js       # Tailwind CSS configuration
```

## Architecture

### State Management
The application uses a combination of React Context API for global state and React Query for server state management. This approach separates UI state from data fetching concerns.

### API Integration
The frontend communicates with the FloodCast backend API using Axios for HTTP requests within React Query for caching and state synchronization.

### Component Organization
Components follow an atomic design methodology, with primitive UI components in the `ui` directory and more complex composite components built from these primitives.

### Map Implementation
The map functionality is implemented using React-Leaflet, which provides React components for Leaflet maps. GeoJSON data from the backend is processed and rendered as map layers.

## Component Overview

### Map Component
The interactive map is the central feature of the application, displaying flood risk levels by geographical area. It includes controls for:
- Zooming and panning
- Layer selection
- Time-based data filtering
- Location search

### Dashboard Component
The dashboard displays detailed information about selected areas, including:
- Current risk level
- Prediction timeline
- Contributing factors
- Historical context

### Alert Panel
The alert system shows high-priority warnings based on:
- Risk threshold settings
- User location preferences
- Prediction confidence levels

## Development

### Prerequisites
- Node.js 20.x or higher
- npm 10.x or higher

### Setup
1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env.local` file based on `.env.example`
4. Run the development server:
   ```
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Environment Variables
- `NEXT_PUBLIC_API_URL`: URL of the FloodCast backend API
- `NEXT_PUBLIC_MAPBOX_TOKEN`: Mapbox API token (if using Mapbox)
- `NEXT_PUBLIC_GA_ID`: Google Analytics ID (optional)

## Testing

### Unit Tests
```
npm run test
```

### End-to-End Tests
```
npm run cypress
```

### Linting
```
npm run lint
```

## Deployment

The application can be deployed to any platform that supports Next.js applications, including:

### Vercel (Recommended)
```
npm run deploy
```

### Self-Hosted
```
npm run build
npm run start
```

## Contributing
Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License
This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
