# Testing Checklist — Jhiro Digital Lab

This checklist should be completed after each phase before moving to the next.

---

## Phase 0 — Setup & Foundation

### Authentication
- [ ] Can create account with email/password
- [ ] Login redirects to correct role dashboard
- [ ] Invalid credentials show error message
- [ ] Session persists across page refresh
- [ ] Logout clears session
- [ ] Protected routes redirect to login
- [ ] Role-based route protection works

### Database
- [ ] All migrations run successfully
- [ ] Seed data creates test users
- [ ] Prisma Studio accessible
- [ ] Soft delete works (deletedAt set)

### Infrastructure
- [ ] Lint passes with no errors
- [ ] TypeScript typecheck passes
- [ ] Build completes without errors
- [ ] Dev server starts

---

## Phase 1 — CMS & Public Website

### Public Pages
- [ ] Home page loads correctly
- [ ] All hero content displays
- [ ] Services grid renders
- [ ] Portfolio page shows items
- [ ] Case Study pages work
- [ ] Blog listing and detail work
- [ ] Contact form submits
- [ ] Navigation works on all pages
- [ ] Mobile responsive on all pages

### Admin CMS Editor
- [ ] Can edit Hero section
- [ ] Can edit About section
- [ ] Can edit Services section
- [ ] Can edit FAQ section
- [ ] Can edit Footer section
- [ ] Can switch locale (ID/EN)
- [ ] Changes reflect on public pages
- [ ] SEO fields save correctly

### SEO
- [ ] Meta title and description set
- [ ] Open Graph image displays
- [ ] Canonical URL correct
- [ ] Sitemap generates

---

## Phase 2 — Client Onboarding & Project Core

### Client Management
- [ ] Can create new client
- [ ] Client user account created
- [ ] Client receives invitation email
- [ ] Client listing shows all clients
- [ ] Can search clients
- [ ] Can edit client details
- [ ] Can soft-delete client

### Project Management
- [ ] Can create new project
- [ ] Can assign PM to project
- [ ] Can assign client to project
- [ ] Can update project status
- [ ] Can update progress percentage
- [ ] Project listing filtered by role
- [ ] Client sees only own projects
- [ ] Project detail shows all info
- [ ] Can archive project

### Requirement Tracker
- [ ] Can create requirement doc
- [ ] Can edit requirement (Draft)
- [ ] Can approve requirement
- [ ] Can lock requirement
- [ ] Locked = read-only (no edit)
- [ ] Locked = no new items

### Client Portal
- [ ] Dashboard loads with stats
- [ ] Stats show correct numbers
- [ ] My Projects lists projects
- [ ] Project detail shows tabs
- [ ] Overview tab shows details
- [ ] Timeline tab shows history
- [ ] Profile page shows user info
- [ ] Can update profile

### Notifications
- [ ] Notification bell shows badge
- [ ] Click opens notification list
- [ ] Notifications appear for events
- [ ] Can mark as read
- [ ] Can mark all as read

---

## Phase 3 — Revision, Change Request, Files, Chat

### Revision System
- [ ] Client can submit revision
- [ ] Revision appears in list
- [ ] PM can view revision
- [ ] PM can change status
- [ ] PM can assign handler
- [ ] Client sees status update
- [ ] Can attach files to revision
- [ ] History shows status changes

### Change Request
- [ ] Can submit CR
- [ ] CR type selectable
- [ ] Cost estimation field works
- [ ] PM can approve/reject
- [ ] Client sees decision
- [ ] AI scope detector suggests type

### File Delivery
- [ ] Can upload file
- [ ] File size limit enforced
- [ ] File type validated
- [ ] Version can be selected
- [ ] Files grouped by version
- [ ] Can download file
- [ ] Download count increments

### Chat
- [ ] Chat thread exists per project
- [ ] Can send message
- [ ] Messages appear in thread
- [ ] Mentions highlight
- [ ] File attachments work
- [ ] Polling updates messages
- [ ] Scrolls to newest message

### Email
- [ ] Resend API connected
- [ ] Email templates render
- [ ] Revision submitted email sent
- [ ] Status change email sent
- [ ] Email unsubscribe works

---

## Phase 4 — Invoicing & Analytics

### Invoice
- [ ] Can create invoice
- [ ] Invoice number auto-generates
- [ ] Can link to client
- [ ] Can link to project
- [ ] Can set due date
- [ ] Can set amount
- [ ] Status workflow works
- [ ] Overdue auto-calculated
- [ ] Client sees own invoices

### PDF
- [ ] PDF generates correctly
- [ ] PDF layout professional
- [ ] PDF contains all data
- [ ] PDF downloadable
- [ ] PDF emailable

### Analytics
- [ ] Dashboard loads
- [ ] Total clients count correct
- [ ] Total projects count correct
- [ ] Revenue chart shows data
- [ ] Project status distribution
- [ ] Filters work
- [ ] Export works

### Global Search
- [ ] Search bar in admin
- [ ] Can search projects
- [ ] Can search clients
- [ ] Can search invoices
- [ ] Results ranked
- [ ] No results state shown

---

## Phase 5 — AI Features

### Translation
- [ ] Can translate ID to EN
- [ ] Can translate EN to ID
- [ ] CMS content translates
- [ ] Article translates
- [ ] Translation saves

### Requirement Analyzer
- [ ] Can paste brief text
- [ ] Returns structured requirement
- [ ] Format is usable
- [ ] Saves to requirement doc

### Scope Detector
- [ ] Revision analyzed
- [ ] Returns suggestion
- [ ] Suggestion visible
- [ ] Can accept/reject

### Project Assistant
- [ ] Chat interface works
- [ ] Responses are contextual
- [ ] Knows project info
- [ ] Handles unknown queries

---

## Phase 6 — Hardening & SaaS-readiness

### Security
- [ ] All inputs validated
- [ ] RBAC enforced everywhere
- [ ] Rate limiting active
- [ ] XSS prevention works
- [ ] SQL injection blocked
- [ ] CSRF tokens present
- [ ] Sessions secure

### Performance
- [ ] LCP < 2.5s
- [ ] INP < 200ms
- [ ] CLS < 0.1
- [ ] Images optimized
- [ ] Code split properly

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader reads content
- [ ] Color contrast passes
- [ ] Focus states visible
- [ ] Skip links present

### i18n
- [ ] All strings translated
- [ ] Date formats localized
- [ ] Number formats localized
- [ ] RTL not needed (ID/EN)
- [ ] Locale switch works

---

## Cross-Cutting Tests

### Responsive Design
- [ ] Mobile (375px) — all pages
- [ ] Tablet (768px) — all pages
- [ ] Desktop (1280px) — all pages
- [ ] Wide (1920px) — all pages

### Browser Testing
- [ ] Chrome latest
- [ ] Firefox latest
- [ ] Safari latest
- [ ] Edge latest

### Error States
- [ ] 404 page styled
- [ ] 500 page styled
- [ ] Network error shows message
- [ ] Form validation errors clear

### Loading States
- [ ] Skeleton loaders match layout
- [ ] Loading spinners appropriate size
- [ ] Progress indicators for uploads

### Empty States
- [ ] No projects message helpful
- [ ] No invoices message helpful
- [ ] No search results message

### Dark Mode (if implemented)
- [ ] All pages render correctly
- [ ] Contrast maintained
- [ ] No pure white/black

---

## Pre-Launch Checklist

### Functionality
- [ ] All features tested
- [ ] All forms work
- [ ] All links work
- [ ] All images load
- [ ] All PDFs generate

### Security
- [ ] Penetration testing done
- [ ] Dependencies audited
- [ ] Secrets not committed
- [ ] Env vars set correctly

### Performance
- [ ] Lighthouse score > 90
- [ ] No memory leaks
- [ ] Database queries optimized

### SEO
- [ ] Sitemap submitted
- [ ] Robots.txt correct
- [ ] Analytics installed
- [ ] Error tracking installed

### Legal
- [ ] Privacy policy present
- [ ] Terms of service present
- [ ] Cookie consent (if needed)
- [ ] Data retention policy

### Documentation
- [ ] Admin guide written
- [ ] User guide written
- [ ] API docs generated
- [ ] Deployment docs complete
