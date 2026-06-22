# Implementation Assumptions — Jhiro Digital Lab

This document records all assumptions made during the implementation of Jhiro Digital Lab.

## Business Assumptions

### 1. User Roles
- **SUPER_ADMIN:** Full system access, can manage all clients, projects, and system settings
- **PROJECT_MANAGER:** Can manage assigned projects and clients, access to AI tools
- **CLIENT:** Access only to their own projects and invoices

### 2. Client Onboarding Flow
- Admin creates client account
- Client receives email invitation with credentials
- Client can change password after first login

### 3. Project Lifecycle
1. NEW → REQUIREMENT_GATHERING → DESIGN → DEVELOPMENT → TESTING → REVIEW → REVISION (if needed) → COMPLETED → ARCHIVED

### 4. Revision vs Change Request
- **Revision:** Adjust existing deliverables without additional cost
- **Change Request:** New features/modifications that may incur additional cost

### 5. Invoice Workflow
- Draft → Unpaid → Partial (if payment received partially) → Paid
- Overdue calculated based on dueDate vs current date

## Technical Assumptions

### 6. Authentication Strategy
- NextAuth v5 with Credentials provider
- JWT sessions stored in httpOnly cookies
- Session contains: userId, role, email

### 7. File Storage
- Development: Local disk (./uploads)
- Production: S3-compatible storage (Vercel Blob / Cloudflare R2)
- Files served via signed URLs

### 8. Chat Implementation
- MVP: Polling-based (every 10 seconds)
- Future: WebSocket via Pusher/Ably

### 9. AI Features
- Anthropic Claude API for all AI features
- Rate limiting: 10 requests/minute for AI endpoints
- Fallback: Graceful degradation if API unavailable

### 10. Email
- Resend for transactional emails
- Templates stored as React Email components
- Fallback: Console logging in development

## Design Assumptions

### 11. Typography
- Using Inter for all text (professional, readable)
- JetBrains Mono for code/technical content
- No serif fonts (not needed for this brand)

### 12. Color Application
- Emerald (#10B981) as primary accent only
- Neutrals (slate/zinc) for backgrounds and text
- Status colors used sparingly for badges

### 13. Responsive Strategy
- Mobile-first approach
- Admin sidebar collapses to hamburger on mobile
- Portal uses bottom navigation on mobile

### 14. Animations
- Subtle entrance animations (fade + slide)
- No complex scroll hijacking
- Respect prefers-reduced-motion

## Data Assumptions

### 15. Seed Data
- 1 Super Admin user
- 2 Project Manager users
- 3 Client companies with user accounts
- 5 sample projects (various statuses)
- Sample CMS content for public pages

### 16. Default Locale
- Indonesian (ID) as default
- English (EN) as secondary
- All static strings support both locales

### 17. Soft Deletes
- All main entities use soft delete (deletedAt field)
- Admin views can show/hide deleted items
- Deleted items excluded from normal queries

## Performance Assumptions

### 18. Image Optimization
- Use Next.js Image component
- Lazy loading for below-fold images
- WebP format preferred

### 19. Caching Strategy
- Static pages use ISR (revalidate: 60)
- API responses not cached
- Client-side SWR for data fetching

### 20. Database Indexing
- Index on foreign keys (clientId, projectId, userId)
- Index on status fields for filtering
- Index on slug fields for lookups

## Security Assumptions

### 21. Input Validation
- All API routes validate with Zod
- Server Actions use Zod schemas
- Client-side validation mirrors server validation

### 22. Authorization
- Middleware checks authentication for protected routes
- Each API route checks authorization
- Client isolation enforced at query level

### 23. Rate Limiting
- Public endpoints: 100 requests/minute
- AI endpoints: 10 requests/minute
- Auth endpoints: 5 attempts/minute

## Integration Assumptions

### 24. External Services
- Anthropic API: AI features
- Resend API: Email delivery
- Vercel: Hosting and Postgres

### 25. Future Integrations
- Payment gateway: Midtrans/Xendit (v1.1)
- Push notifications: Firebase (v1.1)
- Real-time: Pusher/Ably (v1.1)

## Known Limitations (v1.0)

1. Chat is polling-based, not real-time
2. No mobile app (PWA-ready architecture)
3. No multi-tenancy (single agency)
4. Limited AI features (4 core features)
5. PDF generation limited to invoices
6. No version history for CMS content

## Questions to Clarify

- [ ] Email domain restrictions for client accounts?
- [ ] Maximum file upload size? (Default: 10MB)
- [ ] Invoice payment methods supported?
- [ ] SLA for response time on revisions?
- [ ] Number of included revisions per project?
