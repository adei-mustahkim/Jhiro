# ROUTE & API MATRIX — Jhiro Digital Lab

**Date:** 2026-06-18  
**Purpose:** Document all routes, API endpoints, and their status  

---

## Format

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|

**Auth:** ✓ = Required, - = Not required  
**Role:** SUPER_ADMIN, PM, CLIENT, or Public  
**Ownership:** How resource access is scoped  
**Database:** ✓ = Uses DB, - = No DB  
**Status:** COMPLETE, PARTIAL, MISSING, BROKEN

---

## 1. Public Website Routes

### 1.1 Home & Landing

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| / | GET | Home | - | Public | N/A | - | ✓ | Public | COMPLETE |
| /[locale] | GET | Home | - | Public | N/A | - | - | - | MISSING |

### 1.2 Services

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /services | GET | Services | - | Public | N/A | - | - | Public | COMPLETE |

### 1.3 Portfolio

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /portfolio | GET | Portfolio | - | Public | N/A | - | ✓ | Public | COMPLETE |
| /portfolio/[slug] | GET | Portfolio | - | Public | N/A | - | ✓ | Public | COMPLETE |

### 1.4 Case Study

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /case-studies | GET | CaseStudy | - | Public | N/A | - | - | - | MISSING |
| /case-study/[slug] | GET | CaseStudy | - | Public | N/A | - | - | - | MISSING |

### 1.5 Blog

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /blog | GET | Article | - | Public | N/A | - | ✓ | Public | COMPLETE |
| /blog/[slug] | GET | Article | - | Public | N/A | - | ✓ | Public | COMPLETE |

### 1.6 Resources

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /resources | GET | Resource | - | Public | N/A | - | ✓ | Public | COMPLETE |

### 1.7 Contact

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /contact | GET | Contact | - | Public | N/A | - | ✓ | Public | COMPLETE |
| /contact | POST | Contact | - | Public | N/A | ✓ | ✓ | Public | COMPLETE |

### 1.8 Legal Pages

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /privacy | GET | Legal | - | Public | N/A | - | - | Public | COMPLETE |
| /terms | GET | Legal | - | Public | N/A | - | - | Public | COMPLETE |

---

## 2. Authentication Routes

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /login | GET | Auth | - | Public | N/A | - | - | Public | COMPLETE |
| /login | POST | Auth | - | Public | N/A | ✓ | ✓ | Public | COMPLETE |
| /forgot-password | GET | Auth | - | Public | N/A | - | - | Public | COMPLETE |
| /api/auth/[...nextauth] | ALL | NextAuth | - | All | N/A | ✓ | ✓ | Internal | COMPLETE |

---

## 3. Client Portal Routes

### 3.1 Portal Dashboard

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /portal/dashboard | GET | Portal | ✓ | CLIENT | Own data | - | ✓ | Client | COMPLETE |

### 3.2 Portal Projects

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /portal/projects | GET | Portal | ✓ | CLIENT | Own projects | - | ✓ | Client | COMPLETE |
| /portal/projects/[id] | GET | Portal | ✓ | CLIENT | Own project | - | ✓ | Client | COMPLETE |

### 3.3 Portal Invoices

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /portal/invoices | GET | Portal | ✓ | CLIENT | Own invoices | - | ✓ | Client | COMPLETE |
| /portal/invoices/[id] | GET | Portal | ✓ | CLIENT | Own invoice | - | ✓ | Client | COMPLETE |

### 3.4 Portal Profile

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /portal/profile | GET | Portal | ✓ | CLIENT | Own profile | - | ✓ | Client | COMPLETE |
| /portal/profile | POST | Portal | ✓ | CLIENT | Own profile | ✓ | ✓ | Client | PARTIAL |

---

## 4. Admin Dashboard Routes

### 4.1 Admin Dashboard

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /dashboard | GET | Admin | ✓ | ADMIN, PM | N/A | - | ✓ | Admin | COMPLETE |

### 4.2 Admin Clients

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /clients | GET | Admin | ✓ | ADMIN, PM | N/A | - | ✓ | Admin | COMPLETE |
| /clients | POST | Admin | ✓ | ADMIN, PM | N/A | ✓ | ✓ | Admin | COMPLETE |
| /clients/new | GET | Admin | ✓ | ADMIN, PM | N/A | - | - | Admin | COMPLETE |
| /clients/[id] | GET | Admin | ✓ | ADMIN, PM | N/A | - | ✓ | Admin | COMPLETE |

### 4.3 Admin Projects

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /projects | GET | Admin | ✓ | ADMIN, PM | N/A | - | ✓ | Admin | COMPLETE |
| /projects | POST | Admin | ✓ | ADMIN, PM | N/A | ✓ | ✓ | Admin | COMPLETE |
| /projects/new | GET | Admin | ✓ | ADMIN, PM | N/A | - | ✓ | Admin | COMPLETE |
| /projects/[id] | GET | Admin | ✓ | ADMIN, PM | Assigned | - | ✓ | Admin | COMPLETE |

### 4.4 Admin Invoices

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /invoices | GET | Admin | ✓ | ADMIN, PM | N/A | - | ✓ | Admin | COMPLETE |
| /invoices/new | GET | Admin | ✓ | ADMIN, PM | N/A | - | ✓ | Admin | COMPLETE |
| /invoices/[id] | GET | Admin | ✓ | ADMIN, PM | N/A | - | ✓ | Admin | COMPLETE |

### 4.5 Admin CMS

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /cms | GET | Admin | ✓ | ADMIN, PM | N/A | - | ✓ | Admin | COMPLETE |
| /cms/homepage | GET | Admin | ✓ | ADMIN, PM | N/A | - | ✓ | Admin | COMPLETE |
| /cms/services | GET | Admin | ✓ | ADMIN, PM | N/A | - | ✓ | Admin | COMPLETE |
| /cms/about | GET | Admin | ✓ | ADMIN, PM | N/A | - | ✓ | Admin | COMPLETE |
| /cms/contact | GET | Admin | ✓ | ADMIN, PM | N/A | - | ✓ | Admin | COMPLETE |
| /cms/footer | GET | Admin | ✓ | ADMIN, PM | N/A | - | ✓ | Admin | COMPLETE |
| /cms/branding | GET | Admin | ✓ | ADMIN, PM | N/A | - | ✓ | Admin | COMPLETE |

### 4.6 Admin Blog

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /admin/blog | GET | Admin | ✓ | ADMIN, PM | N/A | - | ✓ | Admin | COMPLETE |
| /admin/blog/new | GET | Admin | ✓ | ADMIN, PM | N/A | - | - | Admin | COMPLETE |
| /admin/blog/[id]/edit | GET | Admin | ✓ | ADMIN, PM | Own article | - | ✓ | Admin | PARTIAL |

### 4.7 Admin Portfolio

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /admin/portfolio | GET | Admin | ✓ | ADMIN, PM | N/A | - | ✓ | Admin | COMPLETE |
| /admin/portfolio/new | GET | Admin | ✓ | ADMIN, PM | N/A | - | - | Admin | COMPLETE |
| /admin/portfolio/[id]/edit | GET | Admin | ✓ | ADMIN, PM | Own portfolio | - | ✓ | Admin | PARTIAL |

### 4.8 Admin Resources

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /admin/resources | GET | Admin | ✓ | ADMIN, PM | N/A | - | ✓ | Admin | COMPLETE |
| /admin/resources/new | GET | Admin | ✓ | ADMIN, PM | N/A | - | - | Admin | COMPLETE |
| /admin/resources/[id]/edit | GET | Admin | ✓ | ADMIN, PM | Own resource | - | ✓ | Admin | PARTIAL |

### 4.9 Admin Case Study

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /admin/case-study | GET | Admin | - | - | - | - | - | - | MISSING |
| /admin/case-study/new | GET | Admin | - | - | - | - | - | - | MISSING |
| /admin/case-study/[id]/edit | GET | Admin | - | - | - | - | - | - | MISSING |

### 4.10 Admin Activity Logs

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /activity-logs | GET | Admin | ✓ | ADMIN | N/A | - | ✓ | Admin | COMPLETE |

### 4.11 Admin Settings

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /settings | GET | Admin | ✓ | ADMIN | N/A | - | ✓ | Admin | COMPLETE |

---

## 5. API Routes

### 5.1 Authentication APIs

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /api/auth/[...nextauth] | ALL | NextAuth | - | All | N/A | ✓ | ✓ | Internal | COMPLETE |

### 5.2 Client APIs

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /api/v1/clients | GET | Client | ✓ | ADMIN, PM | N/A | - | ✓ | Admin | COMPLETE |
| /api/v1/clients | POST | Client | ✓ | ADMIN, PM | N/A | ✓ | ✓ | Admin | COMPLETE |
| /api/v1/clients/[id] | GET | Client | ✓ | ADMIN, PM | Own client | - | ✓ | Admin | COMPLETE |
| /api/v1/clients/[id] | PATCH | Client | ✓ | ADMIN | Own client | ✓ | ✓ | Admin | PARTIAL |
| /api/v1/clients/[id]/credentials | POST | Client | ✓ | ADMIN | Own client | ✓ | ✓ | Admin | COMPLETE |

### 5.3 Project APIs

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /api/v1/projects | GET | Project | ✓ | All | Scoped | ✓ | ✓ | Admin, Portal | COMPLETE |
| /api/v1/projects | POST | Project | ✓ | ADMIN, PM | N/A | ✓ | ✓ | Admin | COMPLETE |
| /api/v1/projects/[id] | GET | Project | ✓ | All | Scoped | - | ✓ | Admin, Portal | COMPLETE |
| /api/v1/projects/[id] | PATCH | Project | ✓ | ADMIN, PM | Assigned | ✓ | ✓ | Admin | COMPLETE |
| /api/v1/projects/[id]/files | GET | ProjectFile | ✓ | All | Scoped | - | ✓ | Admin, Portal | COMPLETE |
| /api/v1/projects/[id]/files | POST | ProjectFile | ✓ | ADMIN, PM | Assigned | ✓ | ✓ | Admin | COMPLETE |
| /api/v1/projects/[id]/revisions | GET | Revision | ✓ | All | Scoped | - | ✓ | Admin, Portal | COMPLETE |
| /api/v1/projects/[id]/revisions | POST | Revision | ✓ | CLIENT | Own project | ✓ | ✓ | Portal | COMPLETE |
| /api/v1/projects/[id]/messages | GET | ChatMessage | ✓ | All | Scoped | - | ✓ | Admin, Portal | COMPLETE |
| /api/v1/projects/[id]/messages | POST | ChatMessage | ✓ | All | Scoped | ✓ | ✓ | Admin, Portal | COMPLETE |

### 5.4 Revision APIs

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /api/v1/revisions/[id] | PATCH | Revision | ✓ | ADMIN, PM | Assigned | ✓ | ✓ | Admin | COMPLETE |

### 5.5 Change Request APIs

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /api/v1/change-requests | GET | ChangeRequest | ✓ | All | Scoped | - | ✓ | Admin, Portal | PARTIAL |
| /api/v1/change-requests | POST | ChangeRequest | ✓ | CLIENT, ADMIN | Own project | - | ✓ | Portal | MISSING |
| /api/v1/change-requests/[id] | PATCH | ChangeRequest | ✓ | ADMIN, PM | Assigned | - | ✓ | Admin | MISSING |

### 5.6 Requirement APIs

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /api/v1/projects/[id]/requirement | GET | Requirement | ✓ | All | Scoped | - | ✓ | Admin, Portal | PARTIAL |
| /api/v1/projects/[id]/requirement | POST | Requirement | ✓ | ADMIN, PM | Assigned | - | ✓ | Admin | MISSING |
| /api/v1/projects/[id]/requirement | PATCH | Requirement | ✓ | ADMIN, PM | Assigned | - | ✓ | Admin | MISSING |

### 5.7 Invoice APIs

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /api/v1/invoices | GET | Invoice | ✓ | All | Scoped | ✓ | ✓ | Admin, Portal | COMPLETE |
| /api/v1/invoices | POST | Invoice | ✓ | ADMIN, PM | N/A | ✓ | ✓ | Admin | COMPLETE |
| /api/v1/invoices/[id] | GET | Invoice | ✓ | All | Scoped | - | ✓ | Admin, Portal | COMPLETE |

### 5.8 Article APIs

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /api/v1/articles | GET | Article | - | Public | N/A | - | ✓ | Public | COMPLETE |
| /api/v1/articles | POST | Article | ✓ | ADMIN, PM | N/A | ✓ | ✓ | Admin | COMPLETE |
| /api/v1/articles/[id] | GET | Article | ✓ | ADMIN, PM | N/A | - | ✓ | Admin | MISSING |
| /api/v1/articles/[id] | PATCH | Article | ✓ | ADMIN, PM | Own article | - | ✓ | Admin | MISSING |
| /api/v1/articles/[id] | DELETE | Article | ✓ | ADMIN | Own article | - | ✓ | Admin | MISSING |

### 5.9 Portfolio APIs

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /api/v1/portfolios | GET | Portfolio | - | Public | N/A | - | ✓ | Public | COMPLETE |
| /api/v1/portfolios | POST | Portfolio | ✓ | ADMIN, PM | N/A | ✓ | ✓ | Admin | COMPLETE |
| /api/v1/portfolios/[id] | GET | Portfolio | ✓ | ADMIN, PM | N/A | - | ✓ | Admin | MISSING |
| /api/v1/portfolios/[id] | PATCH | Portfolio | ✓ | ADMIN, PM | Own portfolio | - | ✓ | Admin | MISSING |
| /api/v1/portfolios/[id] | DELETE | Portfolio | ✓ | ADMIN | Own portfolio | - | ✓ | Admin | MISSING |

### 5.10 Case Study APIs

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /api/v1/case-studies | GET | CaseStudy | - | Public | N/A | - | - | - | MISSING |
| /api/v1/case-studies | POST | CaseStudy | ✓ | ADMIN, PM | N/A | - | - | - | MISSING |
| /api/v1/case-studies/[id] | GET | CaseStudy | ✓ | ADMIN, PM | N/A | - | - | - | MISSING |
| /api/v1/case-studies/[id] | PATCH | CaseStudy | ✓ | ADMIN, PM | Own case study | - | - | - | MISSING |
| /api/v1/case-studies/[id] | DELETE | CaseStudy | ✓ | ADMIN | Own case study | - | - | - | MISSING |

### 5.11 Resource APIs

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /api/v1/resources | GET | Resource | - | Public | N/A | - | ✓ | Public | COMPLETE |
| /api/v1/resources | POST | Resource | ✓ | ADMIN, PM | N/A | ✓ | ✓ | Admin | COMPLETE |
| /api/v1/resources/[id] | GET | Resource | ✓ | ADMIN, PM | N/A | - | ✓ | Admin | MISSING |
| /api/v1/resources/[id] | PATCH | Resource | ✓ | ADMIN, PM | Own resource | - | ✓ | Admin | MISSING |
| /api/v1/resources/[id] | DELETE | Resource | ✓ | ADMIN | Own resource | - | ✓ | Admin | MISSING |

### 5.12 CMS APIs

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /api/v1/cms/[section] | GET | CMS | - | Public | N/A | - | ✓ | Public | PARTIAL |
| /api/v1/cms/[section] | PATCH | CMS | ✓ | ADMIN, PM | N/A | ✓ | ✓ | Admin | COMPLETE |

### 5.13 Lead APIs

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /api/v1/leads | GET | Lead | ✓ | ADMIN, PM | N/A | - | ✓ | Admin | COMPLETE |
| /api/v1/leads | POST | Lead | - | Public | N/A | ✓ | ✓ | Public | COMPLETE |

### 5.14 Notification APIs

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /api/v1/notifications | GET | Notification | ✓ | All | Own notifications | - | ✓ | Admin, Portal | COMPLETE |
| /api/v1/notifications | PATCH | Notification | ✓ | All | Own notification | ✓ | ✓ | Admin, Portal | COMPLETE |

### 5.15 Upload APIs

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /api/v1/uploads | POST | Upload | ✓ | ADMIN, PM | N/A | ✓ | - | Admin | COMPLETE |

### 5.16 Settings APIs

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /api/v1/settings | GET | Settings | ✓ | ADMIN | N/A | - | ✓ | Admin | COMPLETE |
| /api/v1/settings | PATCH | Settings | ✓ | ADMIN | N/A | ✓ | ✓ | Admin | PARTIAL |

### 5.17 Public Site Content APIs

| Route | Method | Module | Auth | Role | Ownership | Validation | Database | UI Consumer | Status |
|-------|--------|--------|:----:|:----:|:---------:|:----------:|:--------:|:----------:|:------:|
| /api/v1/public/site-content | GET | CMS | - | Public | N/A | - | ✓ | Public | COMPLETE |

---

## 6. API Response Format

### Success Response
```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

**Status:** Most APIs return data directly, not wrapped in this format.

### Error Response
```json
{
  "error": "Error message",
  "details": []
}
```

**Status:** Consistent error format exists.

---

## 7. Missing Routes Summary

### Critical Missing Routes
1. **Change Request CRUD** - POST, PATCH endpoints
2. **Requirement Tracker CRUD** - POST, PATCH endpoints
3. **Case Study CRUD** - All routes missing
4. **Article Update/Delete** - PATCH, DELETE endpoints
5. **Portfolio Update/Delete** - PATCH, DELETE endpoints
6. **Resource Update/Delete** - PATCH, DELETE endpoints
7. **Invoice Status Update** - PATCH endpoint
8. **Client Update** - PATCH endpoint

### Missing Pages
1. **/admin/case-study** - Admin case study list
2. **/admin/case-study/new** - Create case study
3. **/admin/case-study/[id]/edit** - Edit case study
4. **/case-studies** - Public case study list
5. **/case-study/[slug]** - Public case study detail
6. **/[locale]/...** - i18n routes

---

## 8. Route Groups Summary

| Group | Routes | Complete | Partial | Missing |
|-------|--------|:--------:|:-------:|:-------:|
| Public Website | 12 | 9 | 0 | 3 |
| Authentication | 4 | 4 | 0 | 0 |
| Client Portal | 8 | 8 | 0 | 0 |
| Admin Dashboard | 35 | 32 | 3 | 4 |
| API Routes | 45 | 30 | 2 | 13 |

---

*End of Route & API Matrix*
