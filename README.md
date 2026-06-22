# Shelf Web

Frontend for the **Shelf** marketplace — a platform where supermarkets list their shelf space in an interactive 3D hall editor and product owners/brands browse and book premium shelf positions.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| 3D rendering | React Three Fiber + Drei (Three.js) |
| Auth | NextAuth.js (Google OAuth + credentials) |
| Forms | React Hook Form + Zod |
| HTTP client | Axios |
| Notifications | Sonner |
| State | Zustand |

## Prerequisites

- Node.js 18+
- The [shelf-api](https://github.com/ShelfSphere/shelf-api) backend running locally on port 4000
- Google OAuth2 credentials (same app as the backend, or a separate one)

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in each value:

```env
# NextAuth — base URL of this app
NEXTAUTH_URL=http://localhost:3000

# NextAuth secret — generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your-nextauth-secret-here

# Google OAuth2 — same credentials as shelf-api, or a separate web client
# Authorized redirect URI to add in Google Cloud Console:
#   http://localhost:3000/api/auth/callback/google
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Backend API base URL
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

### 3. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project structure

```
src/
├── app/
│   ├── page.tsx                          # Landing page (/)
│   ├── layout.tsx                        # Root layout + providers
│   ├── globals.css
│   ├── api/auth/[...nextauth]/route.ts   # NextAuth handler
│   ├── (auth)/
│   │   ├── layout.tsx                    # Centered auth card layout
│   │   ├── sign-in/page.tsx              # Sign-in form + Google
│   │   └── sign-up/page.tsx              # Sign-up form + role picker + Google
│   └── dashboard/
│       ├── layout.tsx                    # Auth guard + nav
│       ├── page.tsx                      # Role-based redirect
│       ├── supermarket/
│       │   ├── page.tsx                  # Supermarket overview
│       │   ├── bookings/page.tsx         # Incoming booking list
│       │   └── halls/
│       │       ├── page.tsx              # Hall list
│       │       ├── new/page.tsx          # Create hall form
│       │       └── [hallId]/page.tsx     # 3D hall editor
│       └── product-owner/
│           ├── page.tsx                  # Product owner overview
│           ├── browse/page.tsx           # Browse + filter available shelves
│           └── bookings/page.tsx         # My bookings
├── components/
│   ├── 3d/
│   │   └── hall-editor.tsx              # React Three Fiber 3D hall editor
│   ├── auth/
│   │   └── google-button.tsx
│   ├── landing/
│   │   ├── hero-section.tsx
│   │   ├── how-it-works.tsx
│   │   ├── features-section.tsx
│   │   ├── pricing-teaser.tsx
│   │   └── cta-section.tsx
│   ├── layout/
│   │   ├── navbar.tsx
│   │   ├── dashboard-nav.tsx
│   │   └── footer.tsx
│   ├── shelves/
│   │   ├── shelf-card.tsx
│   │   └── booking-modal.tsx
│   ├── ui/
│   │   └── divider.tsx
│   └── providers.tsx
├── lib/
│   ├── api.ts                           # Axios instance (auto-attaches JWT)
│   └── auth.ts                          # NextAuth options
└── types/
    ├── index.ts                         # Shared domain types
    └── next-auth.d.ts                   # Session type augmentation
```

## Key features

### Landing page (`/`)
- Hero section with CTA for both user types
- How it works (3-step explainer)
- Features grid
- Shelf tier pricing table
- Footer

### Auth (`/sign-in`, `/sign-up`)
- Email + password form with Zod validation
- One-click Google sign-in via NextAuth
- Role selection on sign-up: **Supermarket** or **Product Owner / Brand**

### Supermarket dashboard
- **My Halls** — list of 3D halls with shelf counts
- **Create Hall** — set hall name and 3D dimensions (width × depth × height in metres)
- **3D Hall Editor** — interactive Three.js scene:
  - Available shelves rendered in **green**
  - Booked shelves rendered in **red**
  - Click a shelf to see its details and toggle availability
  - Orbit controls (drag to rotate, scroll to zoom)
- **Bookings** — view all incoming bookings across all halls

### Product owner dashboard
- **Browse Shelves** — filterable grid of available shelf listings
  - Filter by tier (Bottom / Middle / Eye-level / Top)
  - Filter by max daily price
- **Book a shelf** — date picker modal with automatic total price calculation and overlap prevention
- **My Bookings** — booking history with status badges and cancel button

## User roles

| Role | What they do |
|---|---|
| `SUPERMARKET` | Create halls, place shelves in 3D, set pricing, view incoming bookings |
| `PRODUCT_OWNER` | Browse available shelves, book by date range, manage own bookings |

Role is chosen at sign-up and stored in the JWT. The dashboard automatically routes each user to their relevant section.

## 3D hall editor

The editor is built with [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) and [Drei](https://github.com/pmndrs/drei).

- Each shelf is a 3D box positioned by `(positionX, positionY, positionZ)` from the API
- Green = `isAvailable: true`, Red = `isAvailable: false`
- Clicking a shelf opens a side panel to toggle its availability (supermarket owners only)
- Shelf name and price labels are rendered as 3D text above each box
- Orbit controls allow free camera movement around the hall

## Scripts

```bash
npm run dev          # Start dev server with hot reload
npm run build        # Production build
npm start            # Serve production build
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
```

## Google OAuth setup (frontend)

In [Google Cloud Console](https://console.cloud.google.com) → Credentials → your OAuth client:

Add to **Authorized redirect URIs**:
```
http://localhost:3000/api/auth/callback/google
```

For production, replace `localhost:3000` with your deployed domain.

## Connecting to the backend

All API calls go through `src/lib/api.ts` which creates an Axios instance pointed at `NEXT_PUBLIC_API_URL`. The request interceptor automatically attaches the user's `accessToken` from the NextAuth session as a Bearer token on every request.

Make sure `shelf-api` is running before starting `shelf-web`.

## Environment variables reference

| Variable | Required | Description |
|---|---|---|
| `NEXTAUTH_URL` | Yes | Full URL of this app (e.g. `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | Yes | Random secret for signing NextAuth JWTs |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth2 client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth2 client secret |
| `NEXT_PUBLIC_API_URL` | Yes | Backend API base URL |
