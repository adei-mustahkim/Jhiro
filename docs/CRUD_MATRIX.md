# CRUD MATRIX — Jhiro Digital Lab

**Date:** 2026-06-18  
**Purpose:** Document CRUD status for all modules  

---

## Format

| Module | Model | List | Detail | Create | Update | Delete/Archive | Validation | RBAC | Activity Log | Notification | Status |
|--------|-------|------|--------|--------|--------|----------------|------------|------|--------------|--------------|--------|

**Status Values:**
- `COMPLETE` - Full CRUD working end-to-end
- `PARTIAL` - Some operations missing or incomplete
- `MISSING` - CRUD not implemented
- `BROKEN` - Implementation exists but not working

---

## 1. Authentication & User Management

| Feature | Status | Notes |
|---------|--------|-------|
| Login | COMPLETE | NextAuth Credentials, bcrypt validation |
| Logout | COMPLETE | NextAuth signOut() |
| Session Management | COMPLETE | JWT with role in token |
| Password Hashing | COMPLETE | bcryptjs, 12 rounds |
| Password Reset | PARTIAL | Component exists, email not sent |
| Session Refresh | COMPLETE | NextAuth handles automatically |

| Module | Model | List | Detail | Create | Update | Delete | Validation | RBAC | Activity Log | Notification | Status |
|--------|-------|:-----:|:------:|:------:|:------:|:------:|:----------:|:----:|:-------------:|:------------:|:-------|
| Auth | Session | - | ✓ | - | - | - | ✓ | ✓ | ✓ | - | COMPLETE |
| Auth | Login | - | ✓ | ✓ | - | - | ✓ | ✓ | ✓ | - | COMPLETE |
| Auth | Logout | - | - | - | - | ✓ | - | ✓ | ✓ | - | COMPLETE |

---

## 2. User & Client Management

| Module | Model | List | Detail | Create | Update | Delete/Archive | Validation | RBAC | Activity Log | Notification | Status |
|--------|-------|:-----:|:------:|:------:|:------:|:--------------:|:----------:|:----:|:-------------:|:------------:|:-------|
| User | User | ✓ | ✓ | - | PARTIAL | PARTIAL | ✓ | ✓ | - | - | PARTIAL |
| Client | Client | ✓ | ✓ | ✓ | PARTIAL | PARTIAL | ✓ | ✓ | ✓ | - | PARTIAL |

**User CRUD Details:**
- List: ✓ Via `GET /api/v1/clients` (clients have user relation)
- Create: ✓ Transaction creates User + Client + ActivityLog
- Update: ⚠ UpdateClientSchema exists, but no PUT/PATCH endpoint
- Delete: ⚠ Soft delete not implemented in API (deletedAt not set)

**Notes:**
- User password reset: Component exists but email not integrated
- Client soft delete: Need to add `deletedAt` handling

---

## 3. Project Management

| Module | Model | List | Detail | Create | Update | Delete/Archive | Validation | RBAC | Activity Log | Notification | Status |
|--------|-------|:-----:|:------:|:------:|:------:|:--------------:|:----------:|:----:|:-------------:|:------------:|:-------|
| Project | Project | ✓ | ✓ | ✓ | ✓ | PARTIAL | ✓ | ✓ | ✓ | PARTIAL | PARTIAL |
| Project | RequirementTracker | - | ✓ | MISSING | MISSING | - | MISSING | ✓ | MISSING | MISSING | MISSING |

**Project CRUD Details:**
- List: ✓ `GET /api/v1/projects` with pagination, status filter, RBAC scoping
- Detail: ✓ `GET /api/v1/projects/:id` with all relations
- Create: ✓ `POST /api/v1/projects` - creates Project + ChatThread in transaction
- Update: ✓ `PATCH /api/v1/projects/:id` - status, progress, deadline, etc.
- Delete: ⚠ Soft delete not implemented (deletedAt not set)
- Notification: ⚠ Project updates don't notify client

**RequirementTracker Issues:**
- No API routes for RequirementTracker
- Can't create, update, or lock requirements
- Locking workflow (DRAFT → APPROVED → LOCKED) not implemented

---

## 4. Revision & Change Request

| Module | Model | List | Detail | Create | Update | Delete | Validation | RBAC | Activity Log | Notification | Status |
|--------|-------|:-----:|:------:|:------:|:------:|:------:|:----------:|:----:|:-------------:|:------------:|:-------|
| Revision | Revision | ✓ | ✓ | ✓ | PARTIAL | - | ✓ | ✓ | ✓ | ✓ | PARTIAL |
| ChangeRequest | ChangeRequest | ✓ | ✓ | MISSING | MISSING | - | MISSING | ✓ | MISSING | MISSING | MISSING |

**Revision CRUD Details:**
- List: ✓ Via project include
- Create: ✓ Client can submit via `POST /api/v1/projects/:id/revisions`
- Update Status: ✓ `PATCH /api/v1/revisions/:id`
- Assign Handler: ⚠ Handler ID not sent in update
- Notification: ✓ `notifyRevisionSubmitted()` called on create

**ChangeRequest Issues:**
- No API routes exist for ChangeRequest
- Model exists with all fields
- UI shows CR count but can't create/manage CRs
- Status workflow (SUBMITTED → APPROVED/REJECTED) not implemented

---

## 5. File Management

| Module | Model | List | Detail | Create | Update | Delete | Validation | RBAC | Activity Log | Notification | Status |
|--------|-------|:-----:|:------:|:------:|:------:|:------:|:----------:|:----:|:-------------:|:------------:|:-------|
| File | ProjectFile | ✓ | ✓ | ✓ | - | MISSING | ✓ | ✓ | ✓ | ✓ | PARTIAL |

**File CRUD Details:**
- List: ✓ Via project include
- Create: ✓ `POST /api/v1/projects/:id/files`
- Download: ⚠ Direct URL, no signed URL or authorization check
- Delete: ✗ No DELETE endpoint

---

## 6. Chat System

| Module | Model | List | Detail | Create | Update | Delete | Validation | RBAC | Activity Log | Notification | Status |
|--------|-------|:-----:|:------:|:------:|:------:|:------:|:----------:|:----:|:-------------:|:------------:|:-------|
| Chat | ChatThread | - | ✓ | ✓ | - | - | - | ✓ | - | - | PARTIAL |
| Chat | ChatMessage | ✓ | - | ✓ | - | - | ✓ | ✓ | ✓ | ✓ | PARTIAL |

**Chat CRUD Details:**
- Thread: Auto-created on project create
- List Messages: ✓ Via thread include
- Send Message: ✓ `POST /api/v1/projects/:id/messages`
- Polling: ⚠ Manual refresh only, no polling implementation
- Mentions: ⚠ Stored but not parsed/displayed differently

---

## 7. Invoice Management

| Module | Model | List | Detail | Create | Update | Delete | Validation | RBAC | Activity Log | Notification | Status |
|--------|-------|:-----:|:------:|:------:|:------:|:------:|:----------:|:----:|:-------------:|:------------:|:-------|
| Invoice | Invoice | ✓ | ✓ | ✓ | PARTIAL | - | ✓ | ✓ | ✓ | PARTIAL | PARTIAL |

**Invoice CRUD Details:**
- List: ✓ `GET /api/v1/invoices` (admin), scoped (client)
- Create: ✓ `POST /api/v1/invoices` with auto-numbering
- Detail: ✓ Full invoice view with PDF
- Update Status: ⚠ No PATCH endpoint for status changes
- Mark Paid: ⚠ No dedicated endpoint
- Mark Overdue: ✗ No implementation (needs cron)
- PDF: ⚠ Component exists, not triggered via API
- Notification: ⚠ `notifyInvoiceCreated()` not called

**Missing Invoice Operations:**
- `PATCH /api/v1/invoices/:id` - Update amount, due date
- `PATCH /api/v1/invoices/:id/paid` - Mark as paid
- `PATCH /api/v1/invoices/:id/overdue` - Mark as overdue
- PDF generation trigger

---

## 8. CMS Content

| Module | Model | List | Detail | Create | Update | Delete | Validation | RBAC | Activity Log | Notification | Status |
|--------|-------|:-----:|:------:|:------:|:------:|:------:|:----------:|:----:|:-------------:|:------------:|:-------|
| CMS | CMSContent | ✓ | ✓ | - | ✓ | - | ✓ | ✓ | ✓ | - | COMPLETE |
| CMS | SEOMeta | - | PARTIAL | - | PARTIAL | - | - | ✓ | - | - | PARTIAL |

**CMS CRUD Details:**
- List: ✓ Via `getCMSSections()`
- Get: ✓ Via `getCMSSection()`
- Update: ✓ `PATCH /api/v1/cms/:section`
- Create: ✓ Upsert (creates if not exists)
- Locale: ⚠ Only ID configured, EN not implemented

**CMS Sections Configured:**
- homepage (hero) ✓
- services ✓
- about ✓
- contact ✓
- footer ✓
- branding ✓

**SEOMeta Issues:**
- No dedicated CRUD
- Not managed in article/portfolio forms
- No public page metadata fetching

---

## 9. Blog & Articles

| Module | Model | List | Detail | Create | Update | Delete | Validation | RBAC | Activity Log | Notification | Status |
|--------|-------|:-----:|:------:|:------:|:------:|:------:|:----------:|:----:|:-------------:|:------------:|:-------|
| Blog | Article | ✓ | ✓ | ✓ | PARTIAL | PARTIAL | ✓ | ✓ | ✓ | - | PARTIAL |
| Blog | SEOMeta | - | - | - | MISSING | - | - | - | - | - | MISSING |

**Article CRUD Details:**
- List: ✓ Public (published only) + Admin (all)
- Create: ✓ `POST /api/v1/articles`
- Update: ⚠ No PUT/PATCH endpoint (only create)
- Delete: ⚠ Soft delete not in API
- SEO: ✗ Not managed in article CRUD

---

## 10. Portfolio

| Module | Model | List | Detail | Create | Update | Delete | Validation | RBAC | Activity Log | Notification | Status |
|--------|-------|:-----:|:------:|:------:|:------:|:------:|:----------:|:----:|:-------------:|:------------:|:-------|
| Portfolio | Portfolio | ✓ | ✓ | ✓ | PARTIAL | PARTIAL | ✓ | ✓ | ✓ | - | PARTIAL |
| Portfolio | SEOMeta | - | - | - | MISSING | - | - | - | - | - | MISSING |

**Portfolio CRUD Details:**
- List: ✓ Public + Admin
- Create: ✓ `POST /api/v1/portfolios`
- Update: ⚠ No PUT/PATCH endpoint
- Delete: ⚠ Soft delete not in API
- Featured: ✗ isFeatured not editable

---

## 11. Case Study

| Module | Model | List | Detail | Create | Update | Delete | Validation | RBAC | Activity Log | Notification | Status |
|--------|-------|:-----:|:------:|:------:|:------:|:------:|:----------:|:----:|:-------------:|:------------:|:-------|
| CaseStudy | CaseStudy | MISSING | MISSING | MISSING | MISSING | MISSING | - | - | - | - | MISSING |
| CaseStudy | SEOMeta | - | - | - | MISSING | - | - | - | - | - | MISSING |

**Case Study - ENTIRELY MISSING:**
- No API routes
- No admin pages
- No public pages
- Model exists but unused

---

## 12. Resources

| Module | Model | List | Detail | Create | Update | Delete | Validation | RBAC | Activity Log | Notification | Status |
|--------|-------|:-----:|:------:|:------:|:------:|:------:|:----------:|:----:|:-------------:|:------------:|:-------|
| Resource | Resource | ✓ | ✓ | ✓ | PARTIAL | MISSING | ✓ | ✓ | ✓ | - | PARTIAL |

**Resource CRUD Details:**
- List: ✓ Public + Admin
- Create: ✓ `POST /api/v1/resources`
- Update: ⚠ No PUT/PATCH endpoint
- Delete: ✗ No DELETE endpoint
- Download Count: ✗ Not incremented on download

---

## 13. Lead / Contact

| Module | Model | List | Detail | Create | Update | Delete | Validation | RBAC | Activity Log | Notification | Status |
|--------|-------|:-----:|:------:|:------:|:------:|:------:|:----------:|:----:|:-------------:|:------------:|:-------|
| Lead | Lead | ✓ | ✓ | ✓ | - | MISSING | ✓ | ✓ | ✓ | - | PARTIAL |

**Lead CRUD Details:**
- List: ✓ Admin only
- Create: ✓ `POST /api/v1/leads`
- Delete: ✗ No DELETE endpoint
- Validation: ✓ Zod schema with honeypot field

---

## 14. Notification

| Module | Model | List | Detail | Create | Update | Delete | Validation | RBAC | Activity Log | Notification | Status |
|--------|-------|:-----:|:------:|:------:|:------:|:------:|:----------:|:----:|:-------------:|:------------:|:-------|
| Notification | Notification | ✓ | - | ✓ | ✓ | MISSING | - | ✓ | - | - | PARTIAL |

**Notification CRUD Details:**
- List: ✓ User's notifications
- Create: ✓ Via notify helpers (not direct)
- Mark Read: ✓ Single + All
- Delete: ✗ No DELETE endpoint

---

## 15. Activity Log

| Module | Model | List | Detail | Create | Update | Delete | Validation | RBAC | Activity Log | Notification | Status |
|--------|-------|:-----:|:------:|:------:|:------:|:------:|:----------:|:----:|:-------------:|:------------:|:-------|
| ActivityLog | ActivityLog | ✓ | - | ✓ | - | - | - | ✓ | ✓ | - | COMPLETE |

**ActivityLog CRUD Details:**
- List: ✓ `getActivityLogs()` helper
- Create: ✓ `logActivity()` helper
- Filters: ✓ userId, projectId, activity, date range

---

## Summary Table

| Module | Status | Priority |
|--------|--------|----------|
| Authentication | COMPLETE | - |
| User & Client | PARTIAL | High |
| Project | PARTIAL | High |
| RequirementTracker | MISSING | Critical |
| Revision | PARTIAL | High |
| ChangeRequest | MISSING | Critical |
| Project Files | PARTIAL | Medium |
| Chat | PARTIAL | Medium |
| Invoice | PARTIAL | High |
| CMS | COMPLETE | - |
| Article | PARTIAL | Medium |
| Portfolio | PARTIAL | Medium |
| CaseStudy | MISSING | Critical |
| Resource | PARTIAL | Medium |
| Lead | PARTIAL | Low |
| Notification | PARTIAL | Low |
| ActivityLog | COMPLETE | - |

---

## Critical Path for Fixes

### Phase 1: Critical Missing APIs
1. ChangeRequest CRUD (`/api/v1/change-requests`)
2. RequirementTracker CRUD (`/api/v1/requirements/[projectId]`)
3. Case Study CRUD + Pages

### Phase 2: Incomplete CRUD
4. Invoice status management
5. Article Update/Delete
6. Portfolio Update/Delete
7. Resource Update/Delete
8. Client Update (add soft delete)
9. Project Delete (add soft delete)

### Phase 3: Polish
10. Notification on project updates
11. Chat polling implementation
12. Locale fallback (EN)
13. SEO meta management
14. Download count increment

---

*End of CRUD Matrix*
