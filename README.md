# Board the Z - Custom Onboarding Flow Platform

A modern, full-stack application built with Next.js 15 and TypeScript that enables dynamic user onboarding flows with admin-configurable components. Built for the Zealthy Full Stack Engineering Exercise.

[![Next.js](https://img.shields.io/badge/Next.js-15.5.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38B2AC)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB)](https://reactjs.org/)

## Live Demo

- **Application**: [Deploy URL Here]
- **Admin Panel**: [Deploy URL]/admin
- **Data View**: [Deploy URL]/data

## Features

### Core Functionality
- **Dynamic Onboarding Flow**: 3-step wizard with customizable components
- **Admin Configuration**: Real-time component placement management
- **Data Persistence**: Full database integration with Supabase
- **Responsive Design**: Modern glassmorphic UI with mobile support
- **Type Safety**: 100% TypeScript implementation

### Enterprise Features
- **Input Validation & Sanitization**: Comprehensive security measures
- **Error Handling**: Robust error management with user feedback
- **Session Management**: Users resume where they left off

# Onboarding flow pages
## Architecture

### Project Structure
```
board_the_z-main/
├── src/                          # Frontend application
│   ├── app/                      # Next.js 15 App Router
│   │   ├── page.tsx             # Landing page
│   │   ├── admin/               # Admin configuration panel
│   │   ├── data/                # User data table view
│   │   └── onboarding/          # Multi-step onboarding flow
│   ├── components/              # Reusable React components
│   │   ├── Forms/               # Form components & validation
│   │   ├── Navigation/          # Step indicators & navigation
│   │   ├── Toast/               # Notification system
│   │   └── ui/                  # Base UI components
│   ├── config/                  # Application configuration
│   └── constants/               # Centralized constants
├── server/                       # Backend services
│   ├── actions/                 # Next.js Server Actions
│   ├── repositories/            # Data access layer
│   ├── services/                # Business logic layer
│   └── types/                   # Server-side type definitions
├── shared/                       # Shared utilities
│   ├── validations/             # Input validation & sanitization
│   └── utils/                   # Logging & utilities
└── tests/                       # Test suites
```

## Technology Stack

### Frontend
- **Next.js 15.5.0** - React framework with App Router
- **React 19** - Latest React with Concurrent Features
- **TypeScript 5.7** - Full type safety
- **Tailwind CSS 3.4** - Utility-first styling
- **Zod** - Runtime type validation

### Backend
- **Next.js Server Actions** - Type-safe server functions
- **Supabase** - PostgreSQL database with real-time features
- **Repository Pattern** - Clean data access architecture
- **Service Layer** - Business logic separation

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
```bash
git clone [repository-url]
cd board_the_z-main
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env.local
```

4. **Configure environment variables**
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

5. **Start development server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Application Flow

### User Journey
1. **Landing Page** (`/`) - Email and password registration
2. **Onboarding Step 2** (`/onboarding/2`) - Admin-configured components
3. **Onboarding Step 3** (`/onboarding/3`) - Admin-configured components
4. **Completion** - User data saved and flow completed

### Admin Configuration
1. **Admin Panel** (`/admin`) - Configure component placement
2. **Drag & Drop** - Move components between Step 2 and Step 3
3. **Real-time Updates** - Changes apply immediately to new users
4. **Validation** - Ensures each step has at least one component

### Data Management
1. **Data Table** (`/data`) - View all registered users
2. **Real-time Updates** - Automatically refreshes with new data
3. **Export Ready** - Structured data display

## Testing

### Run Tests
```bash
# Run all tests
npm test

# Run specific test suites
npm run test:admin
npm run test:auth
npm run test:onboarding

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Coverage
- **Unit Tests**: Component and utility functions
- **Integration Tests**: API endpoints and data flows
- **Validation Tests**: Input sanitization and validation
- **Business Logic Tests**: Service layer functionality

## Build & Deployment

### Production Build
```bash
# Build for production
npm run build

# Start production server
npm start

# Build and export static files
npm run export
```

### Deployment Options

#### Vercel (Recommended)
```bash
# Deploy to Vercel
npm run deploy

# Or use Vercel CLI
vercel --prod
```


### Test Coverage
- **88 Tests Passing** - Comprehensive test suite
- **API Routes** - Full endpoint testing
- **Components** - UI component testing
- **Business Logic** - Core functionality testing
- **Validation** - Form validation testing

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Supabase for the backend infrastructure
- Tailwind CSS for the utility-first CSS framework
- The open-source community for inspiration and tools
- GitHub Copilot