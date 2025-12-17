# Elatho Jewels - Design Guidelines

## Design Approach
**Reference-Based: Luxury E-commerce**
Drawing inspiration from premium jewelry retailers like Mejuri, Pandora, and luxury fashion e-commerce (NET-A-PORTER), combined with modern SaaS aesthetics for the admin panel. Focus on elegant minimalism that lets products shine while maintaining accessibility.

## Core Design Principles
- **Product-First Photography**: Large, high-quality product images are the hero
- **Elegant Restraint**: Luxury through simplicity, not ornamentation
- **Trust & Transparency**: Clear pricing, shipping, and checkout flows
- **Mobile Commerce**: Thumb-friendly tap targets, streamlined mobile checkout

## Typography System
- **Headings**: Playfair Display (serif) - adds luxury elegance for H1/H2
- **Body/UI**: Inter or DM Sans - clean, readable for all interface text
- **Hierarchy**: 
  - H1: 3xl-4xl (logo, page titles)
  - H2: 2xl-3xl (section headers)
  - H3: xl-2xl (product names)
  - Body: base-lg (descriptions)
  - Small: sm-xs (metadata, labels)

## Layout & Spacing System
**Tailwind Units**: 2, 4, 6, 8, 12, 16, 20 (use 4 and 8 as primary rhythm)
- Section padding: py-16 to py-24 on desktop, py-8 to py-12 on mobile
- Component spacing: gap-6 to gap-8 for grids
- Card padding: p-6 on desktop, p-4 on mobile
- Container max-width: max-w-7xl with px-4 to px-8

## Color Implementation
**Primary Palette** (as specified):
- Pink #ec4899: Primary CTA buttons, active states, accents
- Purple #a855f7: Secondary actions, hover states, badges
- Gold #fbbf24: Premium highlights, sale tags, trust indicators

**Supporting Colors**:
- Neutrals: Slate-50 (backgrounds), Slate-900 (text), Slate-200/300 (borders)
- Use gradients sparingly: pink-to-purple for special CTAs or hero overlays

## Component Library

### Navigation
**Fixed Navbar**: 
- Height: h-16 to h-20
- Logo left-aligned, cart icon right with badge count
- Transparent on scroll with backdrop-blur, solid on mobile
- Hamburger menu on mobile with slide-in drawer

### Product Cards (Home Grid)
- 3 columns desktop (grid-cols-3), 2 tablet (md:grid-cols-2), 1 mobile
- Aspect ratio: 4:5 for product images (portrait)
- Hover: subtle scale-105 transform, shadow increase
- Layout: Image → Name (font-semibold) → Price (text-xl, pink accent) → CTA button

### Product Detail Page
- Two-column layout: 60% image, 40% details (single column mobile)
- Image gallery: Large hero + thumbnail strip below
- Variation selector: Pill buttons (Dourado/Prateado/Rosé) with border-2 active state
- Quantity: Number input with +/- buttons, w-24
- Add to cart: Full-width button, bg-pink-500 with hover:bg-pink-600

### Shopping Cart
- Card-based list items: Image (thumbnail 80x80) + Details + Quantity + Remove
- Sticky sidebar on desktop showing summary (Total, Shipping, Checkout CTA)
- Empty state: Icon + message + "Continue Shopping" link

### Checkout Flow
**Stepper Progress**: 
- 3 steps with connecting lines
- Active: pink fill, Completed: purple fill, Inactive: slate-200

**Forms**:
- Input fields: border-2 border-slate-200, focus:border-pink-500, rounded-lg, h-12
- Labels: text-sm font-medium mb-2
- Spacing between fields: space-y-4
- Shipping options: Radio cards with pricing displayed prominently
- Payment methods: Icon cards (PIX with 5% badge in gold)

### Admin Dashboard
- Sidebar navigation (fixed left, 240px width)
- Stats cards: 4-column grid with icons, large numbers, trend indicators
- Tables: Striped rows, sticky headers, action buttons in last column
- Login: Centered card (max-w-md) with gradient background

## Images

**Hero Section (Home Page)**:
- Full-width hero (h-96 to h-[600px])
- Background: Lifestyle image of jewelry being worn or elegant product flat lay
- Overlay: gradient-to-b from-transparent to-slate-900/50
- Content: Centered logo, tagline "Elegância que Brilha", CTA with blurred bg (backdrop-blur-sm bg-white/20)

**Product Images**:
- High-quality photography on clean white or subtle gradient backgrounds
- Lifestyle shots showing jewelry worn when available
- Detail shots showing craftsmanship for product pages
- All images: aspect-square or aspect-[4/5], object-cover, rounded-lg

**Category Headers**: 
- Each category filter can have subtle icon or small banner image

## Interactions & Animations
**Minimal Motion Strategy**:
- Product hover: transform scale-105, duration-300
- Button hover: subtle shadow increase
- Cart slide-in: translate-x animation
- Checkout stepper: progress bar fill animation
- NO page transitions, NO complex scroll animations

## Mobile Optimizations
- Bottom navigation bar for key actions (Home, Categories, Cart)
- Sticky "Add to Cart" button on product pages
- Single-column layouts throughout
- Touch-friendly: min-h-12 for all interactive elements
- Simplified checkout: one field per row, large tap targets

## Trust & Conversion Elements
- Free shipping badge above fold
- Customer review stars (if implementing later)
- Secure checkout badges (payment icons)
- WhatsApp contact always visible (floating button bottom-right)
- Clear return policy link in footer

This design balances luxury aesthetics with e-commerce conversion best practices, ensuring both beauty and functionality across all devices.