# Elatho Jewels - E-commerce Platform

## Overview

Elatho Jewels is a complete e-commerce platform for selling semi-fine jewelry (semijoias). The application features a customer-facing storefront with product browsing, shopping cart, multi-step checkout, and an admin panel for managing products and orders. The design follows luxury e-commerce aesthetics with a pink/purple/gold color palette and elegant typography.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: React Context for cart state, TanStack React Query for server state
- **Styling**: TailwindCSS with custom CSS variables for theming
- **UI Components**: shadcn/ui component library (Radix UI primitives)
- **Build Tool**: Vite with React plugin

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Pattern**: RESTful JSON API at `/api/*` endpoints
- **Storage**: In-memory storage (MemStorage class) with interface abstraction for future database migration
- **Schema Validation**: Zod for runtime validation with drizzle-zod integration

### Key Design Patterns
- **Monorepo Structure**: Client code in `/client`, server code in `/server`, shared types in `/shared`
- **Type Sharing**: Shared schema definitions between frontend and backend via `/shared/schema.ts`
- **Component Architecture**: Reusable UI components in `/client/src/components/ui/`, feature components in `/client/src/components/`
- **Path Aliases**: `@/` maps to client source, `@shared/` maps to shared folder

### Data Flow
1. Products and orders are managed through the storage interface
2. Cart state persists to localStorage on the client
3. Checkout process collects customer info, address (with ViaCEP integration for Brazilian addresses), shipping selection, and payment method
4. Orders are submitted via API and redirect to WhatsApp for confirmation

### Page Structure
- **Home** (`/`): Hero section + filterable product grid
- **Product Detail** (`/produto/:id`): Full product view with variation selector and add-to-cart
- **Cart** (`/carrinho`): Shopping cart management
- **Checkout** (`/checkout`): 3-step checkout flow (customer info → address/shipping → payment)
- **Success** (`/sucesso`): Order confirmation page
- **Admin** (`/painel-elatho-2025`): Password-protected admin dashboard

## External Dependencies

### Database
- **Drizzle ORM**: Configured for PostgreSQL (schema in `/shared/schema.ts`, config in `/drizzle.config.ts`)
- **Current State**: Using in-memory storage; database connection requires `DATABASE_URL` environment variable

### Third-Party Services
- **ViaCEP API**: Brazilian postal code lookup for address autofill during checkout
- **WhatsApp Integration**: Order confirmation messages sent via WhatsApp web link

### Key NPM Packages
- **UI/UX**: Radix UI primitives, Lucide React icons, Embla Carousel, React Hook Form
- **Data**: TanStack React Query, Zod validation
- **Styling**: TailwindCSS, class-variance-authority, tailwind-merge
- **Server**: Express, connect-pg-simple (session store ready for Postgres)

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string (required for database operations)

### Design System
- **Typography**: Playfair Display (serif headings), DM Sans/Inter (body text)
- **Colors**: Pink (#ec4899) primary, Purple (#a855f7) secondary, Gold (#fbbf24) accents
- **Component Style**: shadcn/ui "new-york" style with CSS variables for theming