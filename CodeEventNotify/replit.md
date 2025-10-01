# Overview

This is a modern web application for managing coding events, built with a React frontend and Express.js backend. The application allows users to create, view, and manage programming-related events with features like RSVP management, interactive calendar views, and email notifications. It's designed as a platform where developers can organize and discover coding meetups, workshops, and tech events.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Styling**: Tailwind CSS with custom CSS variables for theming, featuring a dark theme with sky blue accents
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent, accessible design
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Animations**: Framer Motion for smooth animations and transitions
- **Forms**: React Hook Form with Zod validation for type-safe form handling

## Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API structure with organized route handlers
- **Email Service**: Nodemailer for sending event confirmation emails
- **Session Management**: Express sessions with PostgreSQL session store

## Data Storage
- **Primary Database**: PostgreSQL hosted on Neon Database
- **ORM**: Drizzle ORM with Zod integration for schema validation
- **Schema Design**: 
  - Events table with fields for title, description, date, time, technology, and attendee count
  - RSVPs table linked to events with attendee information
  - Users table for potential authentication (structure defined but not fully implemented)
- **Migrations**: Drizzle Kit for database schema migrations

## Development Workflow
- **Build Tool**: Vite for fast development and optimized production builds
- **Development Server**: Concurrent frontend (Vite) and backend (Express) servers
- **TypeScript**: Shared types between frontend and backend via shared schema definitions
- **Hot Reloading**: Vite HMR for frontend, tsx for backend development

## Key Features
- **Event Management**: Create, view, edit, and delete coding events
- **RSVP System**: Allow users to register for events with email collection
- **Interactive Calendar**: Visual calendar view showing events by date
- **Email Notifications**: Automatic confirmation emails sent to RSVPed attendees
- **Search and Filter**: Event discovery through search functionality
- **Statistics Dashboard**: Overview of total events, attendees, and monthly metrics
- **Responsive Design**: Mobile-first design with glass morphism effects

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL database provider for data persistence
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect

## Email Services
- **Nodemailer**: Email sending capability for RSVP confirmations
- **SMTP Configuration**: Configurable email service (defaults to Gmail SMTP)

## UI and Styling
- **Radix UI**: Primitive components for accessibility and consistency
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Framer Motion**: Animation library for smooth user interactions
- **Lucide React**: Icon library for consistent iconography

## Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the entire application
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management and validation
- **Zod**: Runtime type validation and schema definition