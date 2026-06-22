# Jhiro Digital Lab — Developer Guide

**Versi:** 1.0  
**Update:** 19 Juni 2026  
**Tujuan:** Dokumentasi lengkap untuk pengembangan dan pemeliharaan project

---

## Daftar Isi

1. [Overview](#1-overview)
2. [Tech Stack](#2-tech-stack)
3. [Lingkungan Development](#3-lingkungan-development)
4. [Struktur Project](#4-struktur-project)
5. [Database (Schema & Models)](#5-database)
6. [Authentication & Authorization](#6-authentication--authorization)
7. [Routing](#7-routing)
8. [API Reference](#8-api-reference)
9. [CMS System](#9-cms-system)
10. [Component Library](#10-component-library)
11. [Design System](#11-design-system)
12. [Validasi & Error Handling](#12-validasi--error-handling)
13. [Deployment](#13-deployment)
14. [Troubleshooting](#14-troubleshooting)
15. [Checklist Pengembangan Baru](#15-checklist-pengembangan-baru)
16. [Lampiran](#16-lampiran)

---

## 1. Overview

Jhiro Digital Lab adalah **agency operating system** yang terdiri dari:

| Layer | Fungsi | URL Pattern |
|-------|--------|-------------|
| **Public Website** | Landing page, portofolio, blog, kontak | `/`, `/services`, `/portfolio`, `/blog`, `/contact` |
| **Admin Panel** | Manajemen proyek, klien, konten, invoice | `/dashboard`, `/clients`, `/projects`, `/cms` |
| **Client Portal** | Portal klien untuk melacak proyek & invoice | `/portal/dashboard`, `/portal/projects` |
| **API** | REST API untuk semua CRUD operations | `/api/v1/...` |

### Alur Data

#### Alur Umum (Request Lifecycle)

```
1. User Action (click, submit form)
       ↓
2. Browser → HTTP Request ke Server
       ↓
3. Next.js Router → Match Route (page.tsx atau route.ts)
       ↓
4. Middleware → Cek auth cookie (jika ada)
       ↓
5. Layout → Render (admin-layout / portal-layout / root)
       ↓
6. Page/Handler → Eksekusi logic
   ├── Server Component → langsung fetch data (Prisma)
   └── API Route → validasi → Prisma → response JSON
       ↓
7. Prisma → Query ke PostgreSQL
       ↓
8. Database → Response data
       ↓
9. React → Render UI dengan data
       ↓
10. Browser → Tampilkan halaman
```

#### Alur Autentikasi

```
1. User → Input email + password di /login
       ↓
2. Client Component → POST ke /api/auth/callback/credentials
       ↓
3. NextAuth Credentials Provider → receive email, password
       ↓
4. auth.ts: authorize() → Cari user di DB (prisma.user.findUnique)
       ↓
5. bcrypt.compare(password, user.passwordHash) → cek valid
       ↓
6. JWT created → { id, email, name, role }
       ↓
7. Session cookie → disimpan di browser (httpOnly, 7 hari)
       ↓
8. Setiap request → session dikirim otomatis ke server
```

#### Alur API Request (CRUD)

```
1. Client → fetch('/api/v1/projects', { method: 'POST', body: ... })
       ↓
2. route.ts → const session = await auth()
   ├── Tidak ada session → return 401 Unauthorized
   └── Ada session → lanjut
       ↓
3. route.ts → Parse body: const body = await request.json()
       ↓
4. Validator → ZodSchema.parse(body)
   ├── Validasi gagal → return 400 + error details
   └── Validasi berhasil → lanjut
       ↓
5. Authorization → Cek role & ownership
   ├── Role tidak cocok → return 403 Forbidden
   └── Role cocok → lanjut
       ↓
6. Prisma → prisma.project.create({ data: validatedData })
       ↓
7. Activity Logger → logActivity({ userId, action: 'project_created', metadata })
       ↓
8. Notification → notify({ userId, title: '...', message: '...' })
       ↓
9. Response → return NextResponse.json({ data: project }, { status: 201 })
```

#### Alur CMS Content

```
1. Admin → Edit form di /cms/homepage
       ↓
2. PATCH /api/v1/cms/hero → { headline: '...', subheadline: '...' }
       ↓
3. CMS Handler → prisma.cMSContent.upsert({
       where: { section_locale: { section: 'hero', locale: 'ID' } },
       update: { content: body },
       create: { section: 'hero', locale: 'ID', content: body }
   })
       ↓
4. Homepage (server component) → getCMSSections(['hero'])
       ↓
5. CMS Content Helper → prisma.cMSContent.findUnique({
       where: { section_locale: { section: 'hero', locale: 'ID' } }
   })
       ↓
6. Content → di-cast ke TypeScript interface → render di UI
```

#### Alur Real-time Chat (Polling)

```
1. User → Buka project detail → /portal/projects/[id]
       ↓
2. Chat Component → GET /api/v1/projects/[id]/messages
       ↓
3. API → prisma.chatThread.findUnique({ include: { messages: true } })
       ↓
4. Response → { messages: [...], lastMessageAt: '...' }
       ↓
5. Polling (setiap 5 detik) → ulang step 2-4
       ↓
6. User → Kirim pesan → POST /api/v1/projects/[id]/messages
       ↓
7. API → prisma.chatMessage.create({ data: { threadId, senderId, message } })
       ↓
8. Notification → notify({ userId: otherParty, title: 'New message' })
       ↓
9. Polling → ambil pesan baru di request berikutnya
```

#### Alur File Upload

```
1. User → Pilih file di form
       ↓
2. Client → FormData → POST /api/v1/uploads
       ↓
3. API → Validate file type & size
       ↓
4. Storage → Simpan file (local / S3)
       ↓
5. Response → { url: '/uploads/file-123.pdf' }
       ↓
6. Client → Simpan URL ke field di form (misal: fileUrl)
       ↓
7. Submit form → PATCH /api/v1/projects/[id] { fileUrl: '...' }
       ↓
8. Prisma → Update project dengan fileUrl
```

#### Alur Invoice PDF

```
1. Admin → Klik "Generate PDF" di /invoices/[id]
       ↓
2. Client → GET /api/v1/invoices/[id]?format=pdf
       ↓
3. API → Fetch invoice + client + company data
       ↓
4. PDF Generator → Render invoice template (React → PDF)
       ↓
5. Response → PDF binary stream
       ↓
6. Browser → Download atau preview PDF
```

#### Alur Server Component vs Client Component

**Server Component (default):**

```
1. Request masuk ke Next.js server
       ↓
2. Component langsung fetch data (await prisma...)
       ↓
3. Data di-serialize ke client (React Server Components payload)
       ↓
4. Client menerima HTML + data (tidak perlu loading state)
       ↓
5. Browser render langsung (SEO-friendly, fast initial load)
```

**Client Component ('use client'):**

```
1. Request masuk ke Next.js server
       ↓
2. Component render di server TANPA data
       ↓
3. HTML dikirim ke client (shell component)
       ↓
4. JavaScript hydrate di browser
       ↓
5. useEffect / event handler → fetch data dari API
       ↓
6. setState → re-render dengan data
       ↓
7. Loading state ditampilkan sambil menunggu
```

**Kapan pakai mana:**

| Component Type | Gunakan Ketika | Contoh |
|----------------|----------------|--------|
| Server | Data fetching di awal, SEO pages | `page.tsx`, `layout.tsx` |
| Client | Interactive forms, real-time updates | `ChatBox.tsx`, `FormSubmit.tsx` |

---

## 2. Tech Stack

### Core

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| Next.js | 15.x | Framework (App Router) |
| TypeScript | 5.6 | Bahasa pemrograman (strict mode) |
| React | 18.x | UI Library |
| Prisma | 5.19 | ORM |
| PostgreSQL | 15+ | Database |

### UI & Styling

| Teknologi | Fungsi |
|-----------|--------|
| Tailwind CSS | Utility-first CSS |
| shadcn/ui | UI component library |
| Radix UI | Primitives (headless) |
| Recharts | Charts & graphs |
| Phosphor Icons | Icon library (admin/portal) |
| Lucide | Icon library (beberapa admin) |
| Framer Motion | Animations |

### Authentication & Security

| Teknologi | Fungsi |
|-----------|--------|
| NextAuth.js v5 | Authentication |
| bcryptjs | Password hashing |
| JWT | Session management |

### Lainnya

| Teknologi | Fungsi |
|-----------|--------|
| Resend | Email service |
| Zod | Schema validation |
| Zustand | Client state management |
| React Hook Form | Form management |

---

## 3. Lingkungan Development

### Prerequisites

- **Node.js** >= 20.0.0
- **PostgreSQL** (Neon, Supabase, atau lokal)
- **npm** atau **yarn**

### Setup

```bash
# 1. Clone repository
git clone <repo-url>
cd JHIRO

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env

# 4. Isi .env dengan credentials yang benar
#    - DATABASE_URL (PostgreSQL connection string)
#    - NEXTAUTH_SECRET (generate: openssl rand -base64 32)
#    - NEXTAUTH_URL (http://localhost:3000)

# 5. Generate Prisma client
npm run db:generate

# 6. Jalankan migrations
npm run db:migrate

# 7. Seed database
npm run db:seed

# 8. Start dev server
npm run dev
```

### Environment Variables

```env
# Database (required)
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

# Auth (required)
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# AI (optional)
ANTHROPIC_API_KEY="sk-ant-..."

# Email (optional)
RESEND_API_KEY="re_..."

# Storage (optional, default: local)
STORAGE_PROVIDER="local"
```

### ⚠️ Catatan Penting

1. **Prisma Generate** tidak bisa jalan saat dev server aktif di Windows (EPERM error)
2. **Selalu matikan dev server** sebelum menjalankan `npx prisma generate` atau `npx prisma migrate`
3. **Gunakan `sslmode=require`** di DATABASE_URL untuk koneksi ke cloud database

---

## 4. Struktur Project

```
JHIRO/
├── prisma/
│   ├── schema.prisma        # Database schema (source of truth)
│   ├── seed.ts              # Seed script untuk sample data
│   └── migrations/          # Migration files
│
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx         # Homepage
│   │   ├── layout.tsx       # Root layout
│   │   ├── error.tsx        # Global error boundary
│   │   ├── loading.tsx      # Global loading state
│   │   ├── not-found.tsx    # 404 page
│   │   │
│   │   ├── (public)/        # Public routes (tanpa layout wrapper)
│   │   │   ├── services/
│   │   │   ├── portfolio/
│   │   │   ├── blog/
│   │   │   ├── case-studies/
│   │   │   ├── resources/
│   │   │   ├── contact/
│   │   │   ├── terms/
│   │   │   └── privacy/
│   │   │
│   │   ├── (admin)/         # Admin routes
│   │   │   ├── dashboard/
│   │   │   ├── clients/
│   │   │   ├── projects/
│   │   │   ├── invoices/
│   │   │   ├── cms/
│   │   │   ├── activity-logs/
│   │   │   ├── settings/
│   │   │   ├── admin/blog/
│   │   │   └── admin/portfolio/
│   │   │
│   │   ├── (portal)/        # Client portal routes
│   │   │   └── portal/
│   │   │       ├── dashboard/
│   │   │       ├── projects/
│   │   │       ├── invoices/
│   │   │       └── profile/
│   │   │
│   │   ├── api/             # API routes
│   │   │   ├── auth/
│   │   │   └── v1/
│   │   │       ├── articles/
│   │   │       ├── case-studies/
│   │   │       ├── change-requests/
│   │   │       ├── clients/
│   │   │       ├── cms/
│   │   │       ├── invoices/
│   │   │       ├── leads/
│   │   │       ├── notifications/
│   │   │       ├── portfolios/
│   │   │       ├── projects/
│   │   │       ├── requirements/
│   │   │       ├── resources/
│   │   │       ├── revisions/
│   │   │       ├── settings/
│   │   │       └── uploads/
│   │   │
│   │   ├── login/
│   │   └── forgot-password/
│   │
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── table.tsx
│   │   │   └── ... (30+ components)
│   │   │
│   │   ├── shared/          # Shared components
│   │   │   ├── app-shell.tsx     # Admin/Portal layout wrapper
│   │   │   └── stat-card.tsx     # Stat card with icon & trend
│   │   │
│   │   ├── admin/           # Admin-specific
│   │   │   ├── admin-layout.tsx  # Admin layout (uses AppShell)
│   │   │   └── sidebar.tsx
│   │   │
│   │   ├── portal/          # Portal-specific
│   │   │   ├── portal-layout.tsx # Portal layout (uses AppShell)
│   │   │   └── sidebar.tsx
│   │   │
│   │   └── public/          # Public website
│   │       ├── site-header.tsx   # Navbar (mobile hamburger)
│   │       └── site-footer.tsx   # Footer
│   │
│   ├── lib/
│   │   ├── prisma.ts        # Prisma client singleton
│   │   ├── auth.ts          # NextAuth configuration
│   │   ├── auth.config.ts   # Auth config (Edge-compatible)
│   │   ├── permissions.ts   # Role-based access control
│   │   ├── utils.ts         # Utility functions (cn, formatCurrency)
│   │   ├── slug.ts          # Slug generation
│   │   ├── email.ts         # Resend client (lazy init)
│   │   ├── notification.ts  # Notification helpers
│   │   ├── activity-logger.ts # Activity logging
│   │   ├── cms-content.ts   # CMS content fetchers
│   │   ├── public-content.ts # Public CMS content
│   │   ├── ai/              # AI service wrappers
│   │   ├── pdf/             # PDF generation
│   │   └── validators/      # Zod schemas
│   │       ├── client.ts
│   │       ├── project.ts
│   │       ├── invoice.ts
│   │       ├── lead.ts
│   │       ├── asset.ts
│   │       └── content-records.ts
│   │
│   ├── hooks/               # Custom React hooks
│   └── types/               # TypeScript types
│
├── public/                  # Static assets
├── docs/                    # Documentation
├── .env.example             # Environment template
├── tailwind.config.ts       # Tailwind config
├── tsconfig.json            # TypeScript config
├── next.config.js           # Next.js config
└── package.json             # Dependencies
```

---

## 5. Database

### ERD (Entity Relationship)

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│    User      │────<│    Client     │────<│   Project    │
│              │     │              │     │              │
│  id          │     │  id          │     │  id          │
│  name        │     │  userId (FK) │     │  name        │
│  email       │     │  companyName │     │  clientId FK │
│  passwordHash│     │  phone       │     │  managerId FK│
│  role        │     │  industry    │     │  status      │
│  isActive    │     │  deletedAt   │     │  priority    │
└─────────────┘     └──────────────┘     │  progress    │
                                         └──────┬──────┘
                                                │
        ┌───────────┬───────────┬───────────┬────┴────┬──────────┐
        ▼           ▼           ▼           ▼         ▼          ▼
 ┌────────────┐ ┌─────────┐ ┌─────────┐ ┌────────┐ ┌──────┐ ┌──────────┐
 │ Requirement│ │ Revision│ │  Chat   │ │  File  │ │Invoice│ │ActivityLog│
 │  Tracker   │ │         │ │ Thread  │ │        │ │       │ │          │
 └────────────┘ └─────────┘ └─────────┘ └────────┘ └──────┘ └──────────┘
```

### Relasi Antar Model

#### User → Client (1:1)

```
User (1) ──────< (1) Client
  │                  │
  │ userId           │ userId (unique)
  │                  │
  │ Setiap Client    │ Setiap Client
  │ punya 1 User     │ punya 1 User
```

- `User` bisa exist tanpa `Client` (admin, PM)
- `Client` WAJIB punya `User` (untuk login)
- Relation: `User.client` ↔ `Client.user`

#### Client → Project (1:N)

```
Client (1) ──────< (N) Project
  │                      │
  │ id                   │ clientId (FK)
  │                      │
  │ 1 Client punya       │ 1 Project punya
  │ banyak Projects      │ 1 Client
```

- `Project.clientId` → `Client.id`
- Client hanya bisa akses project miliknya
- Relation: `Client.projects` ↔ `Project.client`

#### User (PM) → Project (1:N)

```
User/PM (1) ──────< (N) Project
  │                      │
  │ id                   │ managerId (FK, optional)
  │                      │
  │ 1 PM manage          │ 1 Project di-manage
  │ banyak Projects      │ oleh 1 PM (optional)
```

- `Project.managerId` → `User.id` (nullable)
- Bisa null jika belum ditugaskan
- Relation: `User.projectsManaged` ↔ `Project.manager`

#### Project → Sub-models (1:N)

```
Project (1) ──────< (N) Revision
Project (1) ──────< (N) ChangeRequest
Project (1) ──────< (N) ProjectFile
Project (1) ──────< (N) Invoice
Project (1) ──────< (1) RequirementTracker
Project (1) ──────< (1) ChatThread ──────< (N) ChatMessage
```

#### User → ActivityLog (1:N)

```
User (1) ──────< (N) ActivityLog
  │                      │
  │ id                   │ userId (FK, optional)
  │                      │
  │ Setiap action        │ 1 Log punya
  │ log user yang        │ 1 User (nullable)
  │ melakukan action
```

#### User → Notification (1:N)

```
User (1) ──────< (N) Notification
  │                      │
  │ id                   │ userId (FK)
  │                      │
  │ User punya           │ 1 Notification
  │ banyak notifikasi    │ punya 1 User
```

#### CMSContent (Independent)

```
CMSContent
  │
  │ section + locale = unique
  │ (misal: "hero" + "ID")
  │
  │ Content berupa JSON flexible
  │ Bisa berisi field apapun
```

#### SEOMeta → Article/Portfolio/CaseStudy (1:1)

```
SEOMeta (1) ──────> (1) Article
SEOMeta (1) ──────> (1) Portfolio
SEOMeta (1) ──────> (1) CaseStudy
  │
  │ pageKey = unique
  │ metaTitle, metaDescription
  │ ogImage, canonicalUrl
```

### Cara Query Data

#### Mendapatkan Project beserta Relasi

```typescript
const project = await prisma.project.findUnique({
  where: { id: projectId },
  include: {
    client: true,           // Client info
    manager: true,          // PM info
    requirement: true,      // Requirement tracker
    revisions: true,        // Semua revisions
    changeRequests: true,   // Semua change requests
    files: true,            // Semua files
    invoices: true,         // Semua invoices
    chatThread: {           // Chat thread
      include: {
        messages: {
          include: { sender: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    },
  },
});
```

#### Client Data Isolation

```typescript
// Portal: Client hanya bisa akses data miliknya
const projects = await prisma.project.findMany({
  where: {
    client: { userId: session.user.id },  // Filter by client owner
    deletedAt: null,                       // Soft delete check
  },
  include: { client: true },
});
```

#### Dashboard Stats Query

```typescript
const [totalClients, activeProjects, pendingInvoices, totalRevenue] = await Promise.all([
  prisma.client.count({ where: { deletedAt: null } }),
  prisma.project.count({
    where: {
      status: { notIn: ['COMPLETED', 'ARCHIVED'] },
      deletedAt: null,
    },
  }),
  prisma.invoice.count({
    where: { status: { in: ['UNPAID', 'OVERDUE'] } },
  }),
  prisma.invoice.aggregate({
    where: { status: 'PAID' },
    _sum: { amount: true },
  }),
]);
```

### Models Lainnya

| Model | Fungsi | Relasi |
|-------|--------|--------|
| `Article` | Blog posts | → User (author), → SEOMeta |
| `Portfolio` | Portofolio items | → SEOMeta |
| `CaseStudy` | Case studies | → SEOMeta |
| `Resource` | Downloadable resources | - |
| `CMSContent` | CMS key-value storage | - |
| `SEOMeta` | SEO metadata | → Article, Portfolio, CaseStudy |
| `Lead` | Contact form submissions | - |
| `Notification` | User notifications | → User |
| `ChangeRequest` | Project change requests | → Project |

### Enums

```typescript
Role                = SUPER_ADMIN | PROJECT_MANAGER | CLIENT
ProjectStatus       = NEW | REQUIREMENT_GATHERING | DESIGN | DEVELOPMENT | TESTING | REVIEW | REVISION | COMPLETED | ARCHIVED
ProjectPriority     = LOW | MEDIUM | HIGH | URGENT
RequirementStatus   = DRAFT | APPROVED | LOCKED
RevisionStatus      = OPEN | IN_REVIEW | IN_PROGRESS | COMPLETED | APPROVED
RevisionPriority    = LOW | MEDIUM | HIGH
ChangeRequestStatus = SUBMITTED | REVIEWED | APPROVED | REJECTED | IN_PROGRESS | COMPLETED
InvoiceStatus       = DRAFT | UNPAID | PARTIAL | PAID | OVERDUE
FileCategory        = SOURCE_CODE | ZIP | DOCUMENTATION | VIDEO_TUTORIAL | LINK | DATABASE_BACKUP | OTHER
FileVersion         = V1 | V2 | V3 | V4 | V5 | FINAL
ArticleStatus       = DRAFT | PUBLISHED | ARCHIVED
ResourceType        = TEMPLATE | EBOOK | GUIDE | CHECKLIST
Locale              = ID | EN
NotificationChannel = IN_APP | EMAIL | BOTH
```

### Prisma Conventions

1. **ID** selalu `uuid()` dengan `@default(uuid())`
2. **Timestamps** selalu `createdAt @default(now())` dan `updatedAt @updatedAt`
3. **Soft delete** gunakan `deletedAt DateTime?` dengan `@@index([deletedAt])`
4. **Foreign keys** selalu punya `@@index` untuk performa
5. **Decimal** gunakan `@db.Decimal(14, 2)` untuk money fields
6. **Map** gunakan `@@map("snake_case")` untuk nama tabel

---

## 6. Authentication & Authorization

### Flow Login

```
1. User submits email + password
2. NextAuth Credentials provider validates
3. bcrypt.compare() checks password
4. JWT created with: { id, email, name, role }
5. Session stored in httpOnly cookie (7 days)
6. Role refreshed from DB on each request
```

### Roles & Permissions

```typescript
enum Role {
  SUPER_ADMIN    // Full access
  PROJECT_MANAGER // Manage projects, clients, content
  CLIENT         // Access own projects only
}
```

### Permission Guards

```typescript
// src/lib/permissions.ts
import { Role } from "@prisma/client";

// Setiap API route harus cek:
// 1. Is user authenticated? (auth() returns session)
// 2. Does user have required role?
// 3. Does user own/have access to resource?
```

### Protected Routes

| Route Group | Auth Required | Roles |
|-------------|:-------------:|-------|
| `/` (public) | - | - |
| `/dashboard` | ✓ | ADMIN, PM |
| `/clients/*` | ✓ | ADMIN, PM |
| `/projects/*` | ✓ | ADMIN, PM |
| `/invoices/*` | ✓ | ADMIN, PM |
| `/cms/*` | ✓ | ADMIN, PM |
| `/portal/*` | ✓ | CLIENT |
| `/api/v1/*` | ✓ | Varies |

### Client Data Isolation

```typescript
// Portal routes MUST filter by clientId:
const projects = await prisma.project.findMany({
  where: {
    client: { userId: session.user.id },
    deletedAt: null,
  },
});
```

---

## 7. Routing

### Route Groups

```
app/
├── (public)/      # Tidak punya layout wrapper
├── (admin)/       # Menggunakan admin-layout.tsx
├── (portal)/      # Menggunakan portal-layout.tsx
└── api/           # API routes
```

### Layout Hierarchy

```
layout.tsx (root)
├── providers.tsx (SessionProvider, ThemeProvider)
├── site-header.tsx (public)
├── {children}
└── site-footer.tsx (public)

admin-layout.tsx (admin)
├── AppShell (shared)
│   ├── Sidebar (admin nav)
│   ├── TopBar (search, notifications, profile)
│   └── {children}
└── FloatingChat

portal-layout.tsx (portal)
├── AppShell (shared)
│   ├── Sidebar (portal nav)
│   ├── TopBar (search, notifications, profile)
│   └── {children}
└── FloatingChat
```

### Shared AppShell

```typescript
// src/components/shared/app-shell.tsx
// Component gabungan untuk admin & portal layout
// Props:
//   - navigation: Array<{ label, href, icon }>
//   - children: React.ReactNode
```

---

## 8. API Reference

### Base URL

```
Development: http://localhost:3000/api/v1
Production:  https://your-domain.com/api/v1
```

### Authentication

Semua API kecuali `/api/v1/public/*` membutuhkan session cookie.

### Response Format

```typescript
// Success
{ data: T }

// Error
{ error: string, details?: ZodError[] }
```

### Endpoints

#### Articles

| Method | Endpoint | Auth | Role | Description |
|--------|----------|:----:|------|-------------|
| GET | `/api/v1/articles` | - | Public | List published articles |
| POST | `/api/v1/articles` | ✓ | ADMIN, PM | Create article |
| GET | `/api/v1/articles/[id]` | ✓ | ADMIN, PM | Get article by ID |
| PATCH | `/api/v1/articles/[id]` | ✓ | ADMIN, PM | Update article |
| DELETE | `/api/v1/articles/[id]` | ✓ | ADMIN, PM | Soft delete article |

#### Case Studies

| Method | Endpoint | Auth | Role | Description |
|--------|----------|:----:|------|-------------|
| GET | `/api/v1/case-studies` | - | Public | List case studies |
| POST | `/api/v1/case-studies` | ✓ | ADMIN, PM | Create case study |
| GET | `/api/v1/case-studies/[id]` | ✓ | ADMIN, PM | Get case study |
| PATCH | `/api/v1/case-studies/[id]` | ✓ | ADMIN, PM | Update case study |
| DELETE | `/api/v1/case-studies/[id]` | ✓ | ADMIN, PM | Soft delete |

#### Clients

| Method | Endpoint | Auth | Role | Description |
|--------|----------|:----:|------|-------------|
| GET | `/api/v1/clients` | ✓ | ADMIN, PM | List clients |
| POST | `/api/v1/clients` | ✓ | ADMIN, PM | Create client (User + Client) |
| GET | `/api/v1/clients/[id]` | ✓ | ADMIN, PM | Get client detail |
| PATCH | `/api/v1/clients/[id]` | ✓ | ADMIN, PM | Update client |
| DELETE | `/api/v1/clients/[id]` | ✓ | ADMIN, PM | Soft delete client |
| POST | `/api/v1/clients/[id]/credentials` | ✓ | ADMIN | Reset client credentials |

#### Projects

| Method | Endpoint | Auth | Role | Description |
|--------|----------|:----:|------|-------------|
| GET | `/api/v1/projects` | ✓ | ADMIN, PM | List projects (scoped) |
| POST | `/api/v1/projects` | ✓ | ADMIN, PM | Create project + ChatThread |
| GET | `/api/v1/projects/[id]` | ✓ | ADMIN, PM | Get project detail |
| PATCH | `/api/v1/projects/[id]` | ✓ | ADMIN, PM | Update project |
| POST | `/api/v1/projects/[id]/revisions` | ✓ | CLIENT | Submit revision |
| GET | `/api/v1/projects/[id]/files` | ✓ | ALL | List project files |
| POST | `/api/v1/projects/[id]/files` | ✓ | ALL | Upload file |
| POST | `/api/v1/projects/[id]/messages` | ✓ | ALL | Send chat message |

#### Invoices

| Method | Endpoint | Auth | Role | Description |
|--------|----------|:----:|------|-------------|
| GET | `/api/v1/invoices` | ✓ | ADMIN, PM | List invoices |
| POST | `/api/v1/invoices` | ✓ | ADMIN, PM | Create invoice |
| GET | `/api/v1/invoices/[id]` | ✓ | ALL | Get invoice detail |
| PATCH | `/api/v1/invoices/[id]` | ✓ | ADMIN, PM | Update invoice |
| DELETE | `/api/v1/invoices/[id]` | ✓ | ADMIN, PM | Delete invoice |

#### CMS

| Method | Endpoint | Auth | Role | Description |
|--------|----------|:----:|------|-------------|
| GET | `/api/v1/cms/[section]` | - | Public | Get CMS section |
| PATCH | `/api/v1/cms/[section]` | ✓ | ADMIN, PM | Update CMS section |

#### Other

| Method | Endpoint | Auth | Role | Description |
|--------|----------|:----:|------|-------------|
| POST | `/api/v1/leads` | - | Public | Submit contact form |
| GET | `/api/v1/notifications` | ✓ | ALL | List user notifications |
| PATCH | `/api/v1/notifications` | ✓ | ALL | Mark notification read |
| GET | `/api/v1/portfolios` | - | Public | List portfolios |
| POST | `/api/v1/portfolios` | ✓ | ADMIN, PM | Create portfolio |
| GET | `/api/v1/resources` | - | Public | List resources |
| POST | `/api/v1/resources` | ✓ | ADMIN, PM | Create resource |
| POST | `/api/v1/uploads` | ✓ | ALL | Upload file |
| GET | `/api/v1/settings` | ✓ | ADMIN | Get system settings |

---

## 9. CMS System

### Konfigurasi

CMS menggunakan model `CMSContent` dengan structure:

```prisma
model CMSContent {
  id        String   @id @default(uuid())
  section   String   // e.g. "hero", "about", "stats"
  locale    Locale   @default(ID)
  content   Json     // Flexible JSON content
  updatedAt DateTime @updatedAt

  @@unique([section, locale])
}
```

### CMS Sections

| Section | Database Key | Fields |
|---------|-------------|--------|
| Homepage Hero | `hero` | headline, subheadline, ctaPrimary, ctaSecondary, heroImageUrl |
| Services | `services` | title, description |
| About | `about` | title, description, imageUrl |
| Contact | `contact` | email, phone, location, bankName, bankAccount, bankAccountName, invoiceTaxRate, invoicePaymentNote, invoiceFooter |
| Footer | `footer` | description, copyright |
| Branding | `branding` | name, tagline, logoUrl, faviconUrl |
| Stats | `stats` | stat1Value, stat1Label, stat2Value, stat2Label, stat3Value, stat3Label, stat4Value, stat4Label |

### Cara Menambah CMS Section Baru

1. **Tambah di `src/lib/cms-config.ts`:**

```typescript
export const cmsSections: Record<string, CMSSectionConfig> = {
  // ... existing sections
  newSection: {
    title: "Judul Section",
    description: "Deskripsi section",
    databaseSection: "newSection",
    fields: [
      { key: "field1", label: "Label Field 1", placeholder: "Placeholder" },
      { key: "field2", label: "Label Field 2", placeholder: "Placeholder", multiline: true },
      { key: "imageUrl", label: "Gambar", placeholder: "Upload gambar", upload: "image" },
    ],
  },
};
```

2. **Tambah link di `src/app/cms/page.tsx`:**

```typescript
{
  title: "New Section",
  description: "Deskripsi",
  href: "/cms/new-section",
  icon: IconComponent,
},
```

3. **Buat page `src/app/cms/new-section/page.tsx`** (copy dari section lain)

4. **Fetch di public page:**

```typescript
import { getCMSSections } from '@/lib/cms-content';

const sections = await getCMSSections(['newSection']);
const content = sections.newSection?.content;
```

### Upload Images

CMS mendukung upload gambar via `/api/v1/uploads`:

```typescript
// Frontend
const formData = new FormData();
formData.append('file', file);
const res = await fetch('/api/v1/uploads', { method: 'POST', body: formData });
const { url } = await res.json();
```

---

## 10. Component Library

### shadcn/ui Components

Semua UI components ada di `src/components/ui/`:

```
button.tsx    card.tsx      dialog.tsx    input.tsx
select.tsx    table.tsx     badge.tsx     tabs.tsx
accordion.tsx alert-dialog.tsx avatar.tsx  checkbox.tsx
dropdown-menu.tsx label.tsx  popover.tsx   progress.tsx
separator.tsx  switch.tsx    toast.tsx     tooltip.tsx
```

### Shared Components

```typescript
// src/components/shared/app-shell.tsx
<AppShell navigation={adminNav}>
  {children}
</AppShell>

// src/components/shared/stat-card.tsx
<StatCard
  icon={<IconComponent />}
  value="12"
  label="Total Projects"
  trend={{ value: 12, isPositive: true }}
/>
```

### Admin Components

- `admin-layout.tsx` — Admin layout wrapper
- `sidebar.tsx` — Admin sidebar navigation

### Portal Components

- `portal-layout.tsx` — Portal layout wrapper
- `sidebar.tsx` — Portal sidebar navigation

### Public Components

- `site-header.tsx` — Public navbar (mobile hamburger + slide-out sidebar)
- `site-footer.tsx` — Public footer

### Icon Library

**Phosphor Icons** (konsisten untuk admin/portal):

```tsx
import { Folder, CurrencyDollar, SquaresFour, Pulse, SignOut, ChartBar, Files, List } from '@phosphor-icons/react';

<Folder size={20} weight="regular" />
<CurrencyDollar size={20} weight="regular" />
```

**Lucide** (masih digunakan di beberapa tempat):

```tsx
import { Users, Settings, LayoutDashboard } from 'lucide-react';
```

---

## 11. Design System

### Warna

| Token | Light | Dark | Fungsi |
|-------|-------|------|--------|
| Primary | `#10B981` (Emerald 500) | `#10B981` | CTA, links, active |
| Primary Dark | `#064E3B` (Emerald 900) | - | Headings on dark |
| Primary Light | `#D1FAE5` (Emerald 100) | - | Subtle backgrounds |
| Background | `#FFFFFF` | `#0B0F0E` | Main background |
| Surface | `#F9FAFB` | `#111318` | Cards, panels |
| Text Primary | `#111827` | `#F9FAFB` | Headlines, body |
| Text Secondary | `#6B7280` | `#9CA3AF` | Captions, meta |
| Border | `#E5E7EB` | `#1F2937` | Default borders |

### Typography

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| Display | 48px | 700 | 1.1 |
| H1 | 36px | 700 | 1.2 |
| H2 | 28px | 600 | 1.3 |
| H3 | 22px | 600 | 1.4 |
| Body | 16px | 400 | 1.6 |
| Caption | 13px | 400 | 1.4 |

### Spacing

Base: 4px

| Token | Value | Usage |
|-------|-------|-------|
| space-1 | 4px | Tight gaps |
| space-2 | 8px | Small gaps |
| space-4 | 16px | Standard gaps |
| space-6 | 24px | Section gaps |
| space-8 | 32px | Container padding |
| space-12 | 48px | Section padding |
| space-16 | 64px | Hero sections |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| radius-md | 6px | Inputs |
| radius-lg | 8px | Buttons |
| radius-xl | 12px | Cards |
| radius-full | 9999px | Pills, badges |

### Breakpoints

| Name | Min Width | Tailwind |
|------|-----------|----------|
| Mobile | < 640px | `sm:` |
| Tablet | 640px | `md:` |
| Desktop | 1024px | `lg:` |
| Wide | 1280px | `xl:` |

---

## 12. Validasi & Error Handling

### Zod Schemas

Semua validasi ada di `src/lib/validators/`:

```typescript
// src/lib/validators/project.ts
import { z } from 'zod';
import { ProjectStatus, Priority } from '@prisma/client';

export const CreateProjectSchema = z.object({
  name: z.string().min(1, "Nama project harus diisi"),
  description: z.string().optional(),
  clientId: z.string().uuid("Client ID tidak valid"),
  managerId: z.string().uuid().optional(),
  deadline: z.string().datetime().optional(),
  priority: z.nativeEnum(Priority).optional(),
});
```

### Input Validation Order

```
1. Zod parse (type coercion, validation)
2. Business rule validation
3. Authorization check
4. Database operation
```

### Error Response Format

```typescript
// API Error
return NextResponse.json(
  { error: "Validation failed", details: error.errors },
  { status: 400 }
);

// Not Found
return NextResponse.json(
  { error: "Resource not found" },
  { status: 404 }
);

// Unauthorized
return NextResponse.json(
  { error: "Unauthorized" },
  { status: 401 }
);
```

### Activity Logging

```typescript
import { logActivity } from '@/lib/activity-logger';

await logActivity({
  userId: session.user.id,
  action: "project_created",
  metadata: { projectId: project.id, projectName: project.name },
});
```

### Notifications

```typescript
import { notify } from '@/lib/notification';

await notify({
  userId: targetUserId,
  title: "Project Updated",
  message: "Project anda telah diperbarui",
  channel: "IN_APP",
});
```

---

## 13. Deployment

### Vercel (Recommended)

```bash
# 1. Push ke GitHub
git push origin main

# 2. Connect repo di Vercel
# 3. Set environment variables di Vercel dashboard
# 4. Deploy otomatis
```

### Environment Variables (Production)

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="production-secret"
NEXTAUTH_URL="https://your-domain.com"
RESEND_API_KEY="re_..."
```

### Build Commands

```bash
npm run build    # Build production
npm run start    # Start production server
```

### ⚠️ Pre-Deployment Checklist

- [ ] `npm run typecheck` pass
- [ ] `npm run lint` pass
- [ ] `npm run build` pass
- [ ] Semua environment variables ter-set
- [ ] Database migrations ter-run
- [ ] Seed data (jika diperlukan)

---

## 14. Troubleshooting

### Common Issues

#### 1. Prisma Generate EPERM Error (Windows)

**Error:** `EPERM: operation not permitted`

**Cause:** Dev server sedang lock file Prisma

**Solution:**
```bash
# Matikan dev server (Ctrl+C)
npx prisma generate
npm run dev
```

#### 2. Build Error: `createContext is not a function`

**Error:** `(0, m.createContext) is not a function`

**Cause:** Client component menggunakan hooks dari server component

**Solution:** Pastikan `useSiteContent` atau hooks lain tidak dipanggil di Server Component

#### 3. Auth Session Tidak Ada

**Cause:** JWT expired atau NEXTAUTH_SECRET berubah

**Solution:**
```bash
# Clear cookies di browser
# Atau set NEXTAUTH_SECRET yang konsisten
```

#### 4. Database Connection Refused

**Error:** `Can't reach database server`

**Solution:**
- Cek `DATABASE_URL` di `.env`
- Pastikan SSL mode: `?sslmode=require`
- Cek firewall/network settings

#### 5. MongoDB Atlas Slow Response

**Catatan:** Project ini menggunakan **PostgreSQL** (Neon), bukan MongoDB. Jika ada referensi MongoDB, itu sudah di-revert.

---

## 15. Checklist Pengembangan Baru

### Menambah Feature Baru

1. **Database:** Tambah model di `schema.prisma`
2. **Migration:** `npx prisma migrate dev --name add_feature_name`
3. **Validators:** Buat Zod schema di `src/lib/validators/`
4. **API:** Buat route di `src/app/api/v1/[resource]/`
5. **Activity Logger:** Tambah activity type di `src/lib/activity-logger.ts`
6. **Admin Pages:** Buat page di `src/app/[resource]/`
7. **Components:** Buat component di `src/components/`
8. **CMS (optional):** Tambah section di `src/lib/cms-config.ts`
9. **Testing:** Test semua CRUD operations
10. **Documentation:** Update dokumen ini

### Menambah API Route Baru

```typescript
// src/app/api/v1/new-resource/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { CreateResourceSchema } from '@/lib/validators/resource';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await prisma.newResource.findMany();
  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const validated = CreateResourceSchema.parse(body);

  const data = await prisma.newResource.create({ data: validated });
  return NextResponse.json({ data }, { status: 201 });
}
```

### Menambah Admin Page Baru

```typescript
// src/app/new-resource/page.tsx
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function NewResourcePage() {
  const session = await auth();
  if (!session || !['SUPER_ADMIN', 'PROJECT_MANAGER'].includes(session.user.role)) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">New Resource</h1>
      {/* Form content */}
    </div>
  );
}
```

---

## 16. Lampiran

### A. Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@jhiro.id | admin123 |
| PM | ahmad@jhiro.id | pm123456 |
| PM | sarah@jhiro.id | pm123456 |
| Client | budi@techvision.co.id | client123 |
| Client | diana@greencircle.id | client123 |
| Client | rizky@fashionhub.co.id | client123 |

### B. Useful Commands

```bash
# Database
npm run db:generate     # Generate Prisma client
npm run db:migrate      # Run migrations
npm run db:push         # Push schema changes (no migration)
npm run db:studio       # Open Prisma Studio (GUI)
npm run db:seed         # Seed database
npm run db:reset        # Reset database

# Development
npm run dev             # Start dev server
npm run lint            # Run ESLint
npm run typecheck       # TypeScript check
npm run test            # Run tests

# Production
npm run build           # Build for production
npm run start           # Start production server
```

### C. Referensi Dokumen Lain

| Dokumen | Lokasi | Fungsi |
|---------|--------|--------|
| PRD | `Jhiro-Digital-Lab-PRD-v1.0.docx` | Product requirements |
| PRD Extracted | `docs/PRD_EXTRACTED.md` | PRD dalam Markdown |
| Design System | `docs/DESIGN_SYSTEM.md` | Design tokens & guidelines |
| Route Matrix | `docs/ROUTE_API_MATRIX.md` | Semua routes & status |
| CRUD Matrix | `docs/CRUD_MATRIX.md` | CRUD status semua modules |
| CMS Matrix | `docs/ADMIN_CMS_MATRIX.md` | CMS admin features |
| Testing Checklist | `docs/TESTING_CHECKLIST.md` | QA checklist |
| Implementation Status | `docs/IMPLEMENTATION_STATUS.md` | Status implementasi |

---

**Dokumen ini terakhir diupdate:** 19 Juni 2026  
**Maintainer:** Jhiro Digital Lab Team
