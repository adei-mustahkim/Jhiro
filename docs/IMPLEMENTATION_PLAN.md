# Implementation Plan — Jhiro Digital Lab

## Overview

This plan follows the PRD roadmap with adaptations for efficient development.

## Phase 0 — Setup & Foundation (Week 1-2)

### 0.1 Project Initialization
- [x] Create Next.js 15 project with TypeScript
- [x] Configure Tailwind CSS v4
- [x] Setup shadcn/ui
- [x] Configure ESLint and Prettier
- [x] Setup absolute imports

### 0.2 Database Setup
- [ ] Create Prisma schema from PRD
- [ ] Setup PostgreSQL connection
- [ ] Run initial migration
- [ ] Create seed script with sample data

### 0.3 Authentication
- [ ] Configure NextAuth v5
- [ ] Implement Credentials provider
- [ ] Create JWT session strategy
- [ ] Setup RBAC middleware
- [ ] Create login/logout pages

### 0.4 Infrastructure
- [ ] Setup environment variables
- [ ] Configure Vercel deployment
- [ ] Setup logging (ActivityLog model)
- [ ] CI pipeline (lint, typecheck)

### Deliverables
- Running dev server with auth working
- Database migrations applied
- Basic project structure

---

## Phase 1 — CMS & Public Website (Week 3-5)

### 1.1 CMS Backend
- [ ] CMSContent model CRUD
- [ ] Generic CMS editor service
- [ ] Locale-aware content fetching
- [ ] SEO meta service

### 1.2 Admin CMS Editor
- [ ] Page: CMS Editor interface
- [ ] Sections: Hero, About, Services, Footer, FAQ, Contact
- [ ] Locale toggle (ID/EN)
- [ ] Rich content editor
- [ ] Image upload support

### 1.3 Public Pages - Core
- [ ] Home page with all sections
- [ ] Services listing page
- [ ] Contact form with lead capture

### 1.4 Public Pages - Portfolio & Blog
- [ ] Portfolio listing and detail pages
- [ ] Case Study listing and detail pages
- [ ] Blog listing and detail pages
- [ ] Resource center listing

### 1.5 SEO & Performance
- [ ] Meta tags per page
- [ ] Open Graph images
- [ ] Sitemap generation
- [ ] RSS feed for blog
- [ ] Image optimization

### Deliverables
- Full public website
- Admin CMS editor
- Lead capture functional

---

## Phase 2 — Client Onboarding & Project Core (Week 6-8)

### 2.1 Client Management
- [ ] Client model CRUD (Admin)
- [ ] Client creation with user account
- [ ] Client listing and search
- [ ] Client detail view

### 2.2 Project Management
- [ ] Project CRUD (Admin/PM)
- [ ] Project listing (admin: all, client: own)
- [ ] Project detail with tabs
- [ ] Status workflow
- [ ] Progress tracking

### 2.3 Requirement Tracker
- [ ] Requirement document creation
- [ ] Approval workflow (Draft → Approved → Locked)
- [ ] Locked = read-only (edits blocked)
- [ ] Integration with project view

### 2.4 Client Portal - Core
- [ ] Dashboard with stats
- [ ] My Projects listing
- [ ] Project detail (Overview, Timeline)
- [ ] Profile management

### 2.5 Notifications
- [ ] Notification service
- [ ] In-app notification list
- [ ] Notification bell with badge
- [ ] Mark as read functionality

### Deliverables
- Client onboarding flow
- Project management system
- Client portal dashboard

---

## Phase 3 — Revision, Change Request, Files, Chat (Week 9-11)

### 3.1 Revision System
- [ ] Revision submission (Client)
- [ ] Revision listing per project
- [ ] Status workflow (Open → In Review → In Progress → Completed → Approved)
- [ ] Handler assignment (PM)
- [ ] Attachment support

### 3.2 Change Request System
- [ ] CR submission form
- [ ] CR listing per project
- [ ] Cost estimation field
- [ ] Approval workflow
- [ ] Integration with AI Scope Detector

### 3.3 File Delivery
- [ ] File upload service
- [ ] Version grouping (V1, V2, ..., Final)
- [ ] File listing by version
- [ ] Download functionality
- [ ] File categories

### 3.4 Chat System
- [ ] Chat thread per project
- [ ] Message sending/receiving
- [ ] Mention support (@user)
- [ ] File attachment in chat
- [ ] Polling-based updates

### 3.5 Email Notifications
- [ ] Resend integration
- [ ] Email templates
- [ ] Triggers for key events

### Deliverables
- Complete revision workflow
- File versioning system
- Project chat
- Email notifications

---

## Phase 4 — Invoicing & Analytics (Week 12-13)

### 4.1 Invoice System
- [ ] Invoice CRUD
- [ ] Invoice numbering
- [ ] Status workflow (Draft → Unpaid → Partial → Paid → Overdue)
- [ ] Client/project association
- [ ] Due date tracking

### 4.2 PDF Generation
- [ ] Invoice PDF template
- [ ] PDF generation service
- [ ] PDF download
- [ ] Professional layout

### 4.3 Analytics Dashboard
- [ ] Total clients count
- [ ] Total projects (active/completed)
- [ ] Revenue tracking
- [ ] Project status distribution
- [ ] Charts (Recharts)

### 4.4 Global Search
- [ ] Search across entities
- [ ] Projects, Clients, Invoices, Articles
- [ ] Admin-only access

### Deliverables
- Invoice generation with PDF
- Analytics dashboard
- Global search

---

## Phase 5 — AI Features (Week 14-16)

### 5.1 AI Translation
- [ ] Translation service wrapper
- [ ] ID ↔ EN translation
- [ ] Integration in CMS editor
- [ ] Integration in Article editor

### 5.2 AI Requirement Analyzer
- [ ] Brief → structured requirement
- [ ] PM/Admin tool
- [ ] Template-based prompts

### 5.3 AI Scope Detector
- [ ] Analyze submitted revision/CR
- [ ] Classify: Revision vs Change Request
- [ ] Auto-suggest on submission

### 5.4 AI Project Assistant
- [ ] RAG-based Q&A
- [ ] Client-facing chat
- [ ] Knowledge: project data, documents
- [ ] Context-aware responses

### Deliverables
- 4 AI features operational
- Translation in CMS workflow

---

## Phase 6 — Hardening & SaaS-readiness (Week 17-18)

### 6.1 Security Audit
- [ ] Zod validation review
- [ ] RBAC audit
- [ ] Rate limiting implementation
- [ ] Input sanitization
- [ ] CSRF protection

### 6.2 Performance
- [ ] ISR for public pages
- [ ] Query optimization
- [ ] Image optimization
- [ ] Bundle size analysis

### 6.3 QA & Testing
- [ ] Full i18n testing
- [ ] Cross-browser testing
- [ ] Accessibility audit
- [ ] Manual QA checklist

### 6.4 Documentation
- [ ] API documentation
- [ ] Deployment guide
- [ ] User guides
- [ ] Onboarding documentation

### Deliverables
- Production-ready application
- Complete documentation

---

## Phase 7 — Launch & Post-launch (Week 19+)

### 7.1 Launch
- [ ] Production deployment
- [ ] DNS configuration
- [ ] SSL verification
- [ ] Monitoring setup (Sentry)

### 7.2 Onboarding
- [ ] First client onboarding
- [ ] Training materials
- [ ] Feedback collection

### 7.3 Post-launch
- [ ] Bug fixes
- [ ] Performance monitoring
- [ ] User feedback integration

---

## Development Priorities

### Critical Path (Must Have)
1. Auth + RBAC
2. Project CRUD
3. Client Portal (basic)
4. Public Website (Home, Services, Contact)
5. Invoice (basic)

### High Priority
1. Requirement Tracker
2. Revision System
3. CMS Editor
4. File Delivery
5. Analytics

### Medium Priority
1. Chat
2. Change Requests
3. AI Features
4. Global Search

### Nice to Have (v1.1)
1. Real-time Chat (WebSocket)
2. Payment Gateway Integration
3. Mobile App
4. Advanced AI Features

---

## Dependencies

### Before Phase 1
- Phase 0 complete

### Before Phase 2
- Phase 1 (CMS basics)
- Auth working

### Before Phase 3
- Phase 2 complete
- Project model stable

### Before Phase 4
- Phase 3 complete
- File upload working

### Before Phase 5
- Phase 4 complete
- Core features stable

### Before Phase 6
- All phases complete
- Feature freeze
