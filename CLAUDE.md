# CLAUDE.md — Ristorante Al Gobbo di Rialto

This file provides AI assistants with a comprehensive overview of the codebase structure, conventions, and workflows for this project.

---

## Project Overview

A full-stack restaurant management web application for **Ristorante Al Gobbo di Rialto** (Venice, Italy). It provides:

- Customer-facing reservation booking with real-time availability
- Admin dashboard for managing reservations, menus, messages, and closures
- Bilingual UI (English/Italian)
- Dark mode support
- Email notification system for reservations and contact messages

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 18.3.1 |
| Build Tool | Vite 5.4.2 |
| Styling | Tailwind CSS 3.4.1 |
| Routing | React Router DOM 6.22.2 |
| Animations | Framer Motion 11.0.8 |
| Icons | Lucide React 0.344.0 |
| Date Utilities | date-fns 3.3.1 |
| Validation | Zod 3.22.4 |
| Notifications | React Hot Toast 2.4.1 |
| Database / Auth | Supabase (PostgreSQL + RLS) |
| Backend | Express 4.21.2 + Node.js |
| Email | Resend 3.5.0 |
| Language | TypeScript 5.5.3 (strict mode) |
| Linting | ESLint 9.9.1 |

---

## Repository Structure

```
sb1-sncywbv4/
├── public/                   # Static assets, redirects
├── src/
│   ├── components/           # Reusable UI components (12 files)
│   ├── pages/                # Full page components (9 files)
│   ├── lib/                  # Core utilities and business logic (7 files)
│   ├── scripts/              # CLI scripts (createAdmin.ts)
│   ├── Img/                  # Image assets (food + gallery)
│   ├── App.tsx               # Router and top-level layout
│   └── main.tsx              # React entry point
├── supabase/
│   └── migrations/           # 13 SQL migration files (source of truth for schema)
├── server.js                 # Express backend — email service only
├── .env                      # Environment variables (not committed to source)
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.app.json
├── eslint.config.js
└── package.json
```

---

## Source Code Details

### Components (`src/components/`)

| File | Purpose |
|---|---|
| `AuthProvider.tsx` | Supabase auth context; exposes `useAuth()` hook |
| `ThemeProvider.tsx` | Dark/light mode context; exposes `useTheme()` hook |
| `LanguageProvider.tsx` | i18n context (English/Italian); exposes `useLanguage()` |
| `LanguageSwitcher.tsx` | Language toggle button |
| `ThemeToggle.tsx` | Dark/light mode toggle button |
| `Navbar.tsx` | Responsive navigation bar |
| `Logo.tsx` | Restaurant logo component |
| `Hero.tsx` | Landing page hero section |
| `Gallery.tsx` | Image gallery with grouped photos |
| `Menu.tsx` | Full menu display component |
| `Button.tsx` | Reusable button component |
| `CookieConsent.tsx` | GDPR cookie consent banner |
| `PageTransition.tsx` | Framer Motion page animation wrapper |

### Pages (`src/pages/`)

| File | Purpose |
|---|---|
| `Home.tsx` | Landing page (Hero + Gallery) |
| `MenuPage.tsx` | Full menu display page |
| `ReservePage.tsx` | Reservation booking form (~25 KB, complex) |
| `AdminPage.tsx` | Admin dashboard (~51 KB, most complex) |
| `LoginPage.tsx` | Admin authentication |
| `ContactPage.tsx` | Contact form |
| `AboutPage.tsx` | Restaurant info page |
| `MyReservationsPage.tsx` | Customer's reservation history |
| `MessagesPage.tsx` | Admin message management |
| `PrivacyPage.tsx` | Privacy policy |

### Libraries (`src/lib/`)

| File | Purpose |
|---|---|
| `supabase.ts` | Supabase client initialization |
| `api.ts` | All database operations — reservation CRUD, time slots, closures (~398 lines) |
| `validators.ts` | Zod schemas for form validation |
| `notifications.ts` | Email sending via Express backend |
| `i18n.ts` | Translation strings (English/Italian) and context |
| `ThemeProvider.tsx` | Theme context (also listed under components) |
| `utils.ts` | `cn()` class name helper (clsx + tailwind-merge) |
| `database.types.ts` | TypeScript types auto-generated from Supabase schema |

---

## Database Schema (Supabase / PostgreSQL)

Managed via migration files in `supabase/migrations/`. Always update migrations — do not alter tables directly in the Supabase dashboard.

### Tables

**`time_slots`** — Available booking times
- `id`, `time` (HH:MM:SS), `max_capacity`, `is_lunch` (bool), `is_active` (bool), `created_at`
- Seeded with lunch slots (12:00–14:30) and dinner slots (19:00–21:30)

**`reservations`** — Customer bookings
- `id`, `date` (YYYY-MM-DD), `time`, `guests`, `occasion`, `special_requests`
- `status`: `pending | confirmed | cancelled | completed`
- `user_id`, `name`, `email`, `phone`
- Unique constraint on `(date, time, email)`

**`closed_dates`** — Specific dates the restaurant is closed
- `id`, `date` (unique), `created_at`

**`recurring_closures`** — Weekly recurring closures
- `id`, `day_of_week`, `start_time`, `end_time`, `active`, `created_at`

**`contact_messages`** — Messages from contact form
- `id`, `first_name`, `last_name`, `email`, `subject`, `message`
- `status`: `unread | read | replied | archived`

**`menu_items`** — Restaurant menu
- `id`, `name`, `translation`, `description`, `price`
- `category`: `mare | terra | pizza`
- `subcategory`: `antipasti | primi | secondi | classic | special | vegetali`
- `is_special`, `min_persons`, `active`

### Row-Level Security (RLS) Policies

- Public users can **create reservations** and **view active time slots**
- Public users can **view their own reservations** by email (no login required)
- **Authenticated users** (admins) have full read/write access to all tables
- Menu items are **publicly readable**, admin-writable

---

## Environment Variables

```
VITE_SUPABASE_URL=      # Supabase project URL
VITE_SUPABASE_ANON_KEY= # Supabase anonymous/public key
VITE_RESEND_API_KEY=    # Resend email API key (also used server-side)
```

- All frontend-accessible variables must be prefixed with `VITE_`
- The Express backend reads from the same `.env` file via `dotenv`
- **Never commit `.env` to source control**

---

## Development Workflows

### Setup

```bash
npm install
# Configure .env with Supabase and Resend credentials
```

### Running Locally

Two processes must run concurrently:

```bash
# Terminal 1 — Frontend (Vite dev server, port 5173)
npm run dev

# Terminal 2 — Backend (Express email server, port 3000)
node server.js
```

> **Note:** The email API endpoint in `src/lib/notifications.ts` is currently hardcoded to the production URL. Change it to `http://localhost:3000` for local development.

### Available Scripts

```bash
npm run dev          # Start Vite dev server
npm run build        # Production build
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
npm run create-admin # Create initial admin user (run once)
```

### Creating an Admin User

```bash
npm run create-admin
```

This runs `src/scripts/createAdmin.ts` which creates a Supabase auth user with admin privileges.

---

## Code Conventions

### TypeScript

- **Strict mode** is enabled (`tsconfig.app.json`)
- No unused locals or parameters allowed
- Use `z.infer<typeof schema>` for type inference from Zod validators
- Database types come from `src/lib/database.types.ts` (auto-generated)

### Naming

- `PascalCase` — React components, type aliases, interfaces
- `camelCase` — functions, variables, hooks
- `SCREAMING_SNAKE_CASE` — environment variable names
- Descriptive names for API functions: `createReservation`, `getAvailableTimeSlots`, `markMessageAsRead`

### Components

- Functional components with hooks only (no class components)
- Wrap animated pages in `<PageTransition>` for consistent entry animations
- Use the `cn()` utility from `src/lib/utils.ts` for conditional class names
- Use `useAuth()`, `useTheme()`, `useLanguage()` hooks — never access context directly

### Styling

- Utility-first with Tailwind CSS
- Dark mode uses the `dark:` prefix (class strategy, not media query)
- Use the custom Venetian color palette defined in `tailwind.config.js`:
  - Brown: `#5C4033` — primary brand color
  - Gold: `#D4AF37` — accents and highlights
  - Sandstone: `#E6D5B8` — secondary backgrounds
  - Green: `#708D81` — tertiary elements
  - Terracotta: `#9E4638`
- Responsive breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px)
- Serif fonts: `Veneziana`, `Playfair Display` — use for headings
- Sans font: `Inter` — use for body text

### State Management

- Use React Context API (no Redux or Zustand)
- Global state lives in context providers wrapped in `App.tsx`
- Local component state uses `useState` and `useReducer`

### API / Database Calls

- All Supabase calls go through `src/lib/api.ts` — do not call Supabase directly from components
- Use `async/await` for all async operations
- Always include try-catch with user-facing error messages via `react-hot-toast`
- Validate all user input with Zod before calling any API function
- Prevent duplicate reservations — the unique constraint on `(date, time, email)` enforces this at DB level

### Email Notifications

- Email sending goes through `src/lib/notifications.ts` → Express server → Resend API
- Email failures should never block the primary action (e.g., reservation creation)
- Log email results with emoji prefixes: `📧`, `✅`, `❌`

### Error Handling

- Toast notifications (`react-hot-toast`) for user-facing errors and success messages
- `console.error` for developer-facing errors
- Graceful degradation: non-critical failures (email) are logged but don't throw to the user

### Date and Time

- Dates: ISO 8601 format `YYYY-MM-DD`
- Times: `HH:MM:SS` format
- Use `date-fns` for all date manipulation — do not use raw `Date` math
- Availability checking is always server-side to prevent race conditions

### Internationalization

- All UI strings must be added to the translation map in `src/lib/i18n.ts`
- Supported languages: `en` (English), `it` (Italian)
- Access translations via `useLanguage()` hook — never hardcode user-visible strings

---

## Testing

There is currently **no automated test suite** in this project. ESLint is the only automated code quality tool.

When adding tests, the recommended setup would be:
- **Unit tests:** Vitest (compatible with Vite)
- **Component tests:** React Testing Library
- **E2E tests:** Playwright

---

## Key Architectural Decisions

1. **No global state library** — Context API is sufficient for this app's complexity
2. **Supabase RLS** handles authorization at the database level — admin checks use Supabase auth session
3. **Express backend is email-only** — all other business logic is in the frontend calling Supabase directly
4. **No test suite** — prioritize adding Vitest before expanding the codebase significantly
5. **Bilingual by design** — all new UI text must go through `i18n.ts`

---

## Common Pitfalls

- The email endpoint URL in `src/lib/notifications.ts` is hardcoded to production — update to `localhost:3000` for local testing
- The `.env` file is required to run — the app will not start without Supabase credentials
- Admin access requires a Supabase auth user created via `npm run create-admin`
- Menu item prices are stored as numbers — display with locale formatting (`toFixed(2)`)
- Reservation status transitions should be: `pending → confirmed → completed` or `pending/confirmed → cancelled`
