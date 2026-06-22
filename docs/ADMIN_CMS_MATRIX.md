# ADMIN CMS MATRIX — Jhiro Digital Lab

**Date:** 2026-06-18  
**Purpose:** Document all CMS content management capabilities  

---

## Format

| Public Section | Database Source | Admin Page | Create | Edit | Delete | Reorder | Active Toggle | Locale | Upload | Status |
|---------------|-----------------|------------|:------:|:----:|:------:|:-------:|:------------:|:------:|:------:|:------:|

**Status Values:**
- `COMPLETE` - Full CRUD working
- `PARTIAL` - Some features missing
- `MISSING` - Not implemented
- `HARDCODE` - Data is hardcoded

---

## 1. Homepage Sections

| Public Section | Database Source | Admin Page | Create | Edit | Delete | Reorder | Active Toggle | Locale | Upload | Status |
|---------------|-----------------|------------|:------:|:----:|:------:|:-------:|:------------:|:------:|:------:|:------:|
| Hero - Headline | CMSContent.hero | /cms/homepage | - | ✓ | - | N/A | - | ID | - | COMPLETE |
| Hero - Subheadline | CMSContent.hero | /cms/homepage | - | ✓ | - | N/A | - | ID | - | COMPLETE |
| Hero - CTA Primary | CMSContent.hero | /cms/homepage | - | ✓ | - | N/A | - | ID | - | COMPLETE |
| Hero - CTA Secondary | CMSContent.hero | /cms/homepage | - | ✓ | - | N/A | - | ID | - | COMPLETE |
| Hero - Image | CMSContent.hero | /cms/homepage | - | ✓ | - | N/A | - | ID | ✓ | COMPLETE |
| Availability Badge | - | - | - | - | - | - | - | - | - | HARDCODE |
| Stats - Project Count | - | - | - | - | - | - | - | - | - | HARDCODE |
| Stats - Client Count | - | - | - | - | - | - | - | - | - | HARDCODE |
| Stats - Years | - | - | - | - | - | - | - | - | - | HARDCODE |
| Stats - Satisfaction | - | - | - | - | - | - | - | - | - | HARDCODE |
| Work Process Steps | - | - | - | - | - | - | - | - | - | HARDCODE |
| CTA Banner | - | - | - | - | - | - | - | - | - | HARDCODE |

### Issues with Homepage:
- Stats are hardcoded (48 projects, 31 clients, 5 years, 4.9/5 satisfaction)
- Work process steps (Discovery, Define, Design, Build, Validate, Launch) are hardcoded
- CTA Banner text is hardcoded
- No admin UI to manage these sections

---

## 2. Services Section

| Public Section | Database Source | Admin Page | Create | Edit | Delete | Reorder | Active Toggle | Locale | Upload | Status |
|---------------|-----------------|------------|:------:|:----:|:------:|:-------:|:------------:|:------:|:------:|:------:|
| Services Title | CMSContent.services | /cms/services | - | ✓ | - | N/A | - | ID | - | COMPLETE |
| Services Description | CMSContent.services | /cms/services | - | ✓ | - | N/A | - | ID | - | COMPLETE |
| Service Items | - | - | - | - | - | - | - | - | - | HARDCODE |
| Service Icons | - | - | - | - | - | - | - | - | - | HARDCODE |

### Service Items (Hardcoded):
1. Website & digital presence
2. Web application
3. Mobile experience
4. Dashboard & analytics
5. Digital commerce
6. Automation & AI

### Issues:
- Services list is hardcoded in `/services/page.tsx`
- No ability to add/edit/delete services from admin
- No icon picker

---

## 3. About Section

| Public Section | Database Source | Admin Page | Create | Edit | Delete | Reorder | Active Toggle | Locale | Upload | Status |
|---------------|-----------------|------------|:------:|:----:|:------:|:-------:|:------------:|:------:|:------:|:------:|
| About Title | CMSContent.about | /cms/about | - | ✓ | - | N/A | - | ID | - | COMPLETE |
| About Description | CMSContent.about | /cms/about | - | ✓ | - | N/A | - | ID | - | COMPLETE |
| Work Process | - | - | - | - | - | - | - | - | - | HARDCODE |

### Issues:
- Work process timeline (Discovery, Design, Build, Launch) is hardcoded
- No admin UI to manage about content beyond basic text

---

## 4. Portfolio Section

| Public Section | Database Source | Admin Page | Create | Edit | Delete | Reorder | Active Toggle | Locale | Upload | Status |
|---------------|-----------------|------------|:------:|:----:|:------:|:-------:|:------------:|:------:|:------:|:------:|
| Portfolio List | Portfolio table | /admin/portfolio | ✓ | PARTIAL | PARTIAL | - | - | - | ✓ | PARTIAL |
| Portfolio Name | Portfolio.name | /admin/portfolio | ✓ | ✓ | ✓ | - | - | - | - | COMPLETE |
| Portfolio Description | Portfolio.description | /admin/portfolio | ✓ | ✓ | ✓ | - | - | - | - | COMPLETE |
| Portfolio Technologies | Portfolio.technologies | /admin/portfolio | ✓ | ✓ | ✓ | - | - | - | - | COMPLETE |
| Portfolio Screenshots | Portfolio.screenshots | /admin/portfolio | ✓ | ✓ | ✓ | - | - | - | ✓ | COMPLETE |
| Portfolio URL | Portfolio.projectUrl | /admin/portfolio | ✓ | ✓ | ✓ | - | - | - | - | COMPLETE |
| Portfolio Featured | Portfolio.isFeatured | - | - | - | - | - | - | - | - | MISSING |
| Portfolio SEO | SEOMeta table | - | - | - | - | - | - | - | - | MISSING |

### Issues:
- Edit functionality exists but update API is missing
- Delete soft-delete not implemented
- isFeatured toggle not in UI
- SEO meta not managed

---

## 5. Case Study Section

| Public Section | Database Source | Admin Page | Create | Edit | Delete | Reorder | Active Toggle | Locale | Upload | Status |
|---------------|-----------------|------------|:------:|:----:|:------:|:-------:|:------------:|:------:|:------:|:------:|
| Case Study List | - | MISSING | MISSING | MISSING | MISSING | - | - | - | - | MISSING |
| Case Study Title | - | - | - | - | - | - | - | - | - | MISSING |
| Case Study Problem | - | - | - | - | - | - | - | - | - | MISSING |
| Case Study Solution | - | - | - | - | - | - | - | - | - | MISSING |
| Case Study Result | - | - | - | - | - | - | - | - | - | MISSING |
| Case Study Screenshots | - | - | - | - | - | - | - | - | - | MISSING |
| Case Study Metrics | - | - | - | - | - | - | - | - | - | MISSING |
| Case Study SEO | - | - | - | - | - | - | - | - | - | MISSING |

### Issues:
- **ENTIRE CASE STUDY MODULE IS MISSING**
- No database records created
- No admin pages
- No public pages

---

## 6. Blog/Article Section

| Public Section | Database Source | Admin Page | Create | Edit | Delete | Reorder | Active Toggle | Locale | Upload | Status |
|---------------|-----------------|------------|:------:|:----:|:------:|:-------:|:------------:|:------:|:------:|:------:|
| Article List | Article table | /admin/blog | ✓ | PARTIAL | PARTIAL | - | - | ✓ | ✓ | PARTIAL |
| Article Title | Article.title | /admin/blog/new | ✓ | ✓ | ✓ | - | - | - | - | COMPLETE |
| Article Slug | Article.slug | Auto | - | - | - | - | - | - | - | COMPLETE |
| Article Content | Article.content | /admin/blog/new | ✓ | ✓ | ✓ | - | - | - | - | COMPLETE |
| Article Excerpt | Article.excerpt | /admin/blog/new | ✓ | ✓ | ✓ | - | - | - | - | COMPLETE |
| Article Category | Article.category | /admin/blog/new | ✓ | ✓ | ✓ | - | - | - | - | COMPLETE |
| Article Tags | Article.tags | /admin/blog/new | ✓ | ✓ | ✓ | - | - | - | - | COMPLETE |
| Article Thumbnail | Article.thumbnail | /admin/blog/new | ✓ | ✓ | ✓ | - | - | - | ✓ | COMPLETE |
| Article Status | Article.status | /admin/blog/new | ✓ | ✓ | - | - | ✓ | - | - | COMPLETE |
| Article SEO | SEOMeta table | - | - | - | - | - | - | - | - | MISSING |

### Issues:
- Edit page exists but update API is missing
- Delete soft-delete not implemented
- SEO meta not managed

---

## 7. Resource Center

| Public Section | Database Source | Admin Page | Create | Edit | Delete | Reorder | Active Toggle | Locale | Upload | Status |
|---------------|-----------------|------------|:------:|:----:|:------:|:-------:|:------------:|:------:|:------:|:------:|
| Resource List | Resource table | /admin/resources | ✓ | PARTIAL | MISSING | - | - | - | ✓ | PARTIAL |
| Resource Title | Resource.title | /admin/resources/new | ✓ | ✓ | - | - | - | - | - | COMPLETE |
| Resource Description | Resource.description | /admin/resources/new | ✓ | ✓ | - | - | - | - | - | COMPLETE |
| Resource Type | Resource.type | /admin/resources/new | ✓ | ✓ | - | - | - | - | - | COMPLETE |
| Resource Category | Resource.category | /admin/resources/new | ✓ | ✓ | - | - | - | - | - | COMPLETE |
| Resource File | Resource.fileUrl | /admin/resources/new | ✓ | ✓ | - | - | - | - | ✓ | COMPLETE |
| Download Count | Resource.downloadCount | - | - | - | - | - | - | - | - | MISSING |

### Issues:
- Edit functionality exists but update API is missing
- Delete not implemented
- Download count not incremented when file downloaded

---

## 8. Contact/Footer Section

| Public Section | Database Source | Admin Page | Create | Edit | Delete | Reorder | Active Toggle | Locale | Upload | Status |
|---------------|-----------------|------------|:------:|:----:|:------:|:-------:|:------------:|:------:|:------:|:------:|
| Contact Email | CMSContent.contact | /cms/contact | - | ✓ | - | N/A | - | ID | - | COMPLETE |
| Contact Phone | CMSContent.contact | /cms/contact | - | ✓ | - | N/A | - | ID | - | COMPLETE |
| Contact Location | CMSContent.contact | /cms/contact | - | ✓ | - | N/A | - | ID | - | COMPLETE |
| Footer Description | CMSContent.footer | /cms/footer | - | ✓ | - | N/A | - | ID | - | COMPLETE |
| Footer Copyright | CMSContent.footer | /cms/footer | - | ✓ | - | N/A | - | ID | - | COMPLETE |
| Bank Name (Invoice) | CMSContent.contact | /cms/contact | - | ✓ | - | N/A | - | ID | - | COMPLETE |
| Bank Account | CMSContent.contact | /cms/contact | - | ✓ | - | N/A | - | ID | - | COMPLETE |
| Invoice Tax Rate | CMSContent.contact | /cms/contact | - | ✓ | - | N/A | - | ID | - | COMPLETE |
| Invoice Payment Note | CMSContent.contact | /cms/contact | - | ✓ | - | N/A | - | ID | - | COMPLETE |
| Invoice Footer | CMSContent.contact | /cms/contact | - | ✓ | - | N/A | - | ID | - | COMPLETE |

### Status: COMPLETE

---

## 9. Branding Section

| Public Section | Database Source | Admin Page | Create | Edit | Delete | Reorder | Active Toggle | Locale | Upload | Status |
|---------------|-----------------|------------|:------:|:----:|:------:|:-------:|:------------:|:------:|:------:|:------:|
| Brand Name | CMSContent.branding | /cms/branding | - | ✓ | - | N/A | - | ID | - | COMPLETE |
| Brand Tagline | CMSContent.branding | /cms/branding | - | ✓ | - | N/A | - | ID | - | COMPLETE |
| Brand Logo | CMSContent.branding | /cms/branding | - | ✓ | - | N/A | - | ID | ✓ | COMPLETE |
| Brand Favicon | CMSContent.branding | /cms/branding | - | ✓ | - | N/A | - | ID | ✓ | COMPLETE |

### Status: COMPLETE

---

## 10. Navigation (Menu)

| Public Section | Database Source | Admin Page | Create | Edit | Delete | Reorder | Active Toggle | Locale | Upload | Status |
|---------------|-----------------|------------|:------:|:----:|:------:|:-------:|:------------:|:------:|:------:|:------:|
| Navigation Links | - | - | - | - | - | - | - | - | - | HARDCODE |
| Mobile Menu | - | - | - | - | - | - | - | - | - | HARDCODE |

### Issues:
- Navigation is hardcoded in SiteHeader component
- No admin UI to manage menu items

---

## 11. FAQ Section

| Public Section | Database Source | Admin Page | Create | Edit | Delete | Reorder | Active Toggle | Locale | Upload | Status |
|---------------|-----------------|------------|:------:|:----:|:------:|:-------:|:------------:|:------:|:------:|:------:|
| FAQ Items | - | - | - | - | - | - | - | - | - | MISSING |

### Issues:
- FAQ is hardcoded (not visible on current homepage but in PRD)
- No admin UI to manage FAQ

---

## 12. Testimonials Section

| Public Section | Database Source | Admin Page | Create | Edit | Delete | Reorder | Active Toggle | Locale | Upload | Status |
|---------------|-----------------|------------|:------:|:----:|:------:|:-------:|:------------:|:------:|:------:|:------:|
| Testimonials | - | - | - | - | - | - | - | - | - | MISSING |

### Issues:
- Testimonials are not displayed on current homepage
- No admin UI to manage testimonials
- No database model for testimonials

---

## Summary of Missing CMS Features

### Critical (Need Implementation)
1. **Case Study Module** - Entire module missing
2. **FAQ Management** - No database model or UI
3. **Testimonials** - No database model or UI
4. **Service Items** - Hardcoded, need dynamic management

### High Priority
5. **Portfolio Featured Toggle** - UI missing
6. **Article SEO Management** - Not implemented
7. **Portfolio SEO Management** - Not implemented
8. **Portfolio Edit API** - Missing
9. **Article Edit API** - Missing

### Medium Priority
10. **Resource Delete API** - Missing
11. **Download Count Tracking** - Not implemented
12. **Navigation Management** - Hardcoded

### Low Priority
13. **Locale (EN)** - Only ID implemented
14. **FAQ Reorder** - Need if FAQ implemented

---

## Admin CMS Pages Inventory

| Page | Route | Status |
|------|-------|--------|
| CMS Dashboard | /cms | COMPLETE |
| Homepage Editor | /cms/homepage | COMPLETE |
| Services Editor | /cms/services | COMPLETE |
| About Editor | /cms/about | COMPLETE |
| Contact Editor | /cms/contact | COMPLETE |
| Footer Editor | /cms/footer | COMPLETE |
| Branding Editor | /cms/branding | COMPLETE |
| Blog List | /admin/blog | PARTIAL |
| Blog Create | /admin/blog/new | COMPLETE |
| Blog Edit | /admin/blog/[id]/edit | PARTIAL |
| Portfolio List | /admin/portfolio | PARTIAL |
| Portfolio Create | /admin/portfolio/new | COMPLETE |
| Portfolio Edit | /admin/portfolio/[id]/edit | PARTIAL |
| Resources List | /admin/resources | PARTIAL |
| Resources Create | /admin/resources/new | COMPLETE |
| Resources Edit | /admin/resources/[id]/edit | PARTIAL |
| Case Study List | MISSING | MISSING |
| Case Study Create | MISSING | MISSING |
| Case Study Edit | MISSING | MISSING |

---

## Recommendations

### Immediate Actions
1. Create Case Study admin pages and API routes
2. Create FAQ database model and admin UI
3. Implement Portfolio update API
4. Implement Article update API

### Short Term
5. Add SEO meta management to articles
6. Add SEO meta management to portfolios
7. Create testimonials model and admin UI
8. Implement service items as dynamic CMS

### Medium Term
9. Add EN locale support for all CMS content
10. Create navigation management UI
11. Implement download count tracking
12. Add FAQ reorder functionality

---

*End of Admin CMS Matrix*
