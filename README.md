# Jhiro Digital Lab

Digital product studio dan agency operating system untuk melayani pembuatan website, web application, dashboard, automation, dan solusi digital berbasis AI.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Database:** PostgreSQL + Prisma ORM
- **Authentication:** NextAuth.js v5
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui (Radix Primitives)
- **Charts:** Recharts
- **Email:** Resend (coming soon)
- **AI:** Anthropic Claude API (coming soon)

## Features

### Public Website
- Home page with hero, services, portfolio
- Services listing
- Portfolio showcase
- Blog articles
- Resource center
- Contact form with lead capture

### Admin Panel
- Dashboard with analytics
- Client management
- Project management
- Invoice tracking
- CMS editor
- Activity logs

### Client Portal
- Dashboard with project overview
- Project detail with tabs (Overview, Files, Revisions, Chat)
- Invoice viewing
- Revision submission

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Copy environment variables:

```bash
cp .env.example .env
```

4. Update `.env` with your database URL and secrets:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/jhiro_digital_lab"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

5. Generate Prisma client and run migrations:

```bash
npm run db:generate
npm run db:migrate
```

6. Seed the database with sample data:

```bash
npm run db:seed
```

7. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Credentials

After seeding, you can use these accounts to log in:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@jhiro.id | admin123 |
| Project Manager | ahmad@jhiro.id | pm123456 |
| Project Manager | sarah@jhiro.id | pm123456 |
| Client | budi@techvision.co.id | client123 |
| Client | diana@greencircle.id | client123 |
| Client | rizky@fashionhub.co.id | client123 |

## Scripts

```bash
# Development
npm run dev          # Start development server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
npm run test         # Run tests

# Database
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run migrations
npm run db:push      # Push schema changes
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database
npm run db:reset     # Reset database

# Build
npm run build        # Production build
npm run start        # Start production server
```

## Project Structure

```
JHIRO/
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Database seed script
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── (public)/    # Public website pages
│   │   ├── (portal)/   # Client portal pages
│   │   ├── (admin)/    # Admin panel pages
│   │   ├── api/        # API routes
│   │   └── page.tsx    # Home page
│   ├── components/     # React components
│   │   ├── ui/        # shadcn/ui components
│   │   ├── admin/     # Admin components
│   │   └── portal/    # Portal components
│   ├── lib/             # Utilities and services
│   │   ├── prisma.ts   # Prisma client
│   │   ├── auth.ts     # NextAuth config
│   │   ├── utils.ts    # Helper functions
│   │   └── ...
│   ├── hooks/           # Custom React hooks
│   └── i18n/            # Translations
└── docs/                # Documentation
```

## Documentation

- [CLAUDE.md](./CLAUDE.md) - Development guidelines
- [DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md) - Design system
- [PRD_EXTRACTED.md](./docs/PRD_EXTRACTED.md) - Product requirements
- [IMPLEMENTATION_PLAN.md](./docs/IMPLEMENTATION_PLAN.md) - Development roadmap
- [ASSUMPTIONS.md](./docs/ASSUMPTIONS.md) - Implementation assumptions
- [TESTING_CHECKLIST.md](./docs/TESTING_CHECKLIST.md) - QA checklist

## License

Private - All rights reserved
