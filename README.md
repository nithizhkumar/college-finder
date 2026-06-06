# CollegeFinder — India's College Discovery Platform

> **Internship Assignment | Frontend Engineer | Track B**

A production-grade college discovery MVP built with Next.js 15, TypeScript, TailwindCSS, and Prisma. Implements 4 of the specified features with clean architecture and reliable state management.

---

## Live Features

| Feature | Status | Notes |
|---|---|---|
| College Listing + Search | ✅ | Full-text search, multi-filter, sort |
| College Detail Page | ✅ | 5-tab layout: overview, courses, placements, reviews, Q&A |
| Compare Colleges | ✅ | Side-by-side table, up to 3 colleges, best-value highlighting |
| Auth + Saved Items | ✅ | Sign in/up modal, save colleges, persistent per-session |

---

## Architecture Decisions

### Frontend Architecture
- **Next.js App Router** (v15) — chosen for file-system routing, server components, and built-in API routes
- **React Context** for client state (compare list, saved items, auth) — avoids prop drilling without the complexity of Redux for this scale
- **Server Components** for college listing/detail pages — data fetched at build/request time, no client-side waterfall
- **Client Components** only where interactivity is needed (filters, compare actions, auth modal)
- **API Routes** in `/app/api/` — clean REST interface that a real Prisma-backed DB can drop into without touching frontend

### State Management Strategy
```
AuthContext   → user session (login/logout)
CompareContext → compare list [id, id, id] (max 3, global floating bar)
SavedContext   → saved college IDs (persists within session)
```

### Component Hierarchy
```
layout.tsx (Providers: Auth, Compare, Saved)
├── Navbar (reads all 3 contexts)
├── CompareBar (floating, reads CompareContext)
├── AuthModal (reads/writes AuthContext)
└── page.tsx / colleges/[id] / compare / saved
    ├── SearchFilters (URL-driven, uses useRouter)
    ├── CollegeCard (reads all 3 contexts for actions)
    └── CollegeDetailClient (tabs, Q&A posting, detail view)
```

### Routing
- `/` — Discovery with search + filters (URL params = shareable state)
- `/colleges/[id]` — Detail page, statically generated for all 8 colleges
- `/compare` — Dynamic comparison view (client-side, driven by CompareContext)
- `/saved` — Auth-gated saved list

### API Design
```
GET  /api/colleges          → list with filtering, sorting, pagination meta
GET  /api/colleges/:id      → single college + reviews + questions
GET  /api/compare?ids=1,2,3 → validated comparison fetch
GET  /api/saved             → user's saved college IDs (auth-scoped)
POST /api/saved             → toggle save/unsave
GET  /api/questions?collegeId=X → Q&A thread
POST /api/questions         → post new question
```

---

## Tech Stack

| Layer | Tech | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | Server components, API routes, static gen |
| Language | TypeScript (strict mode) | Type safety across API ↔ components |
| Styling | TailwindCSS v4 | Utility-first, no CSS file clutter |
| ORM | Prisma + PostgreSQL | Type-safe DB queries, easy migrations |
| State | React Context API | Right-sized for this scope |
| Deployment | Vercel + Neon (DB) | Zero-config Next.js, serverless PG |

---

## Database Schema (Prisma)

Key models: `College`, `User`, `SavedCollege` (join), `Review`, `Question`, `Answer`

The schema is designed to swap the in-memory mock data for real Prisma queries with **no frontend changes** — the API routes are the only layer that changes.

---

## Setup & Run

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon free tier recommended)

### Local Development

```bash
git clone <your-repo>
cd college-finder
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local: set DATABASE_URL and NEXTAUTH_SECRET

# Generate Prisma client & push schema
npx prisma generate
npx prisma db push

# Seed database (optional - app works with mock data by default)
npx prisma db seed

npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Deployment (Vercel + Neon)

1. Create database at [neon.tech](https://neon.tech) — free tier
2. Push to GitHub
3. Import repo at [vercel.com](https://vercel.com)
4. Set environment variables in Vercel dashboard:
   - `DATABASE_URL` — from Neon connection string
   - `NEXTAUTH_SECRET` — `openssl rand -base64 32`
   - `NEXTAUTH_URL` — your Vercel domain
5. Deploy — Vercel auto-runs `prisma generate` via postinstall

---

## Edge Cases Handled

| Case | Handling |
|---|---|
| Save while logged out | Auth modal opens automatically |
| Compare 4th college | Silently ignored (max 3) |
| Unknown college ID | `notFound()` → custom 404 page |
| Empty search results | Friendly empty state with CTA |
| Q&A post while logged out | Auth modal prompt |
| Mobile layout | Responsive grid, horizontal scroll on compare table |
| Invalid API params | Validated with early 400 returns |

---

## Tradeoffs & What I'd Add

**Tradeoffs made:**
- In-memory mock data instead of seeded DB — keeps setup zero-friction for evaluation while the schema + API contract is production-ready
- React Context over Zustand — sufficient for this feature set, avoids unnecessary dependency
- No optimistic updates on save — simpler error handling path

**Given more time:**
- Predictor tool (exam rank → college matches)
- Real NextAuth session with Google OAuth
- Infinite scroll on the listing page
- College search with Algolia or Postgres full-text search
- Comparison permalink sharing via URL
