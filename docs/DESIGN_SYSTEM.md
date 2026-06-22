# Jhiro Digital Lab — Design System

## Design Direction

**Reading this as:** Premium digital agency website for B2B clients, with a modern-clean-professional language, leaning toward Linear/Vercel aesthetic with restraint and confidence.

### Dials Configuration
- `DESIGN_VARIANCE: 7` — Asymmetric layouts, editorial feel, but maintain professionalism
- `MOTION_INTENSITY: 5` — Subtle entrance animations, smooth hover states, no overwhelming motion
- `VISUAL_DENSITY: 4` — Clean, spacious, premium feel without feeling empty

---

## Brand Personality

- **Primary:** Modern, Premium, Clean
- **Secondary:** Confident, Technical, Human, Reliable, Focused
- **Voice:** Professional yet approachable, clear, no fluff
- **Visual Tone:** Enterprise-grade without being sterile

---

## Color Tokens

### Light Mode

```css
/* Primary Colors */
--color-primary: #10B981;           /* Emerald 500 - CTA, links, active states */
--color-primary-dark: #064E3B;       /* Emerald 900 - Headings on dark, emphasis */
--color-primary-light: #D1FAE5;      /* Emerald 100 - Subtle backgrounds */

/* Backgrounds */
--color-background: #FFFFFF;         /* Main background */
--color-surface: #F9FAFB;            /* Cards, panels */
--color-surface-elevated: #FFFFFF;   /* Elevated cards with shadow */

/* Borders */
--color-border: #E5E7EB;             /* Default borders */
--color-border-strong: #D1D5DB;       /* Emphasized borders */

/* Text */
--color-text-primary: #111827;       /* Headlines, body */
--color-text-secondary: #6B7280;      /* Captions, meta */
--color-text-tertiary: #9CA3AF;      /* Placeholders */
--color-text-inverse: #FFFFFF;       /* Text on dark backgrounds */

/* Status Colors */
--color-success: #22C55E;           /* Paid, Completed */
--color-warning: #F59E0B;            /* Pending, In Review */
--color-danger: #EF4444;             /* Overdue, Rejected */
--color-info: #3B82F6;               /* Information */

/* Accents */
--color-accent-emerald: #10B981;     /* Primary accent (use sparingly) */
--color-accent-slate: #64748B;       /* Secondary accent */
```

### Dark Mode

```css
/* Dark Mode Backgrounds */
--color-background-dark: #0B0F0E;    /* Main dark background - green tinted black */
--color-surface-dark: #111318;       /* Cards in dark mode */
--color-surface-elevated-dark: #1A1D23; /* Elevated cards */

/* Dark Mode Text */
--color-text-primary-dark: #F9FAFB; /* Headlines, body */
--color-text-secondary-dark: #9CA3AF; /* Captions */

/* Dark Mode Borders */
--color-border-dark: #1F2937;
```

---

## Typography

### Font Family
- **Primary:** Inter (clean, geometric, professional)
- **Monospace:** JetBrains Mono (for code, technical content)
- **Fallbacks:** system-ui, -apple-system, sans-serif

### Type Scale

| Element | Size | Line Height | Weight | Letter Spacing |
|---------|------|-------------|--------|----------------|
| Display | 48px / 3rem | 1.1 | 700 | -0.02em |
| H1 | 36px / 2.25rem | 1.2 | 700 | -0.02em |
| H2 | 28px / 1.75rem | 1.3 | 600 | -0.01em |
| H3 | 22px / 1.375rem | 1.4 | 600 | 0 |
| H4 | 18px / 1.125rem | 1.5 | 600 | 0 |
| Body Large | 18px / 1.125rem | 1.6 | 400 | 0 |
| Body | 16px / 1rem | 1.6 | 400 | 0 |
| Body Small | 14px / 0.875rem | 1.5 | 400 | 0 |
| Caption | 13px / 0.8125rem | 1.4 | 400 | 0.01em |
| Label | 12px / 0.75rem | 1.3 | 500 | 0.02em |
| Overline | 11px / 0.6875rem | 1.2 | 600 | 0.08em |

### Usage Rules

1. **Headlines:** Use weight 600-700, tight line height (1.1-1.3)
2. **Body:** Use weight 400, relaxed line height (1.6)
3. **No em-dashes** in any text — use commas, periods, or parentheses
4. **Uppercase:** Only for overlines/labels, never for body text
5. **Max line length:** 65ch for body paragraphs

---

## Spacing System

### Scale (Base: 4px)

| Token | Value | Usage |
|-------|-------|-------|
| `space-0` | 0 | Reset |
| `space-1` | 4px | Tight gaps |
| `space-2` | 8px | Input padding, small gaps |
| `space-3` | 12px | Form element gaps |
| `space-4` | 16px | Standard gaps |
| `space-5` | 20px | Card padding |
| `space-6` | 24px | Section gaps |
| `space-8` | 32px | Container padding |
| `space-10` | 40px | Large gaps |
| `space-12` | 48px | Section padding |
| `space-16` | 64px | Hero sections |
| `space-20` | 80px | Large sections |
| `space-24` | 96px | Very large sections |
| `space-32` | 128px | Maximum whitespace |

### Layout Spacing

| Context | Padding |
|---------|---------|
| Page container | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` |
| Section vertical | `py-16 lg:py-24` |
| Card padding | `p-5 lg:p-6` |
| Form gap | `space-4` (16px) |
| Grid gap | `gap-6` (24px) |

---

## Border Radius

### Scale

| Token | Value | Usage |
|-------|-------|-------|
| `radius-none` | 0 | None |
| `radius-sm` | 4px | Small inputs, badges |
| `radius-md` | 6px | Default inputs |
| `radius-lg` | 8px | Buttons, small cards |
| `radius-xl` | 12px | Cards, panels |
| `radius-2xl` | 16px | Large cards |
| `radius-full` | 9999px | Pills, avatars |

### Usage Rules

1. **Buttons:** `radius-lg` (8px)
2. **Cards:** `radius-xl` (12px)
3. **Inputs:** `radius-md` (6px)
4. **Badges/Pills:** `radius-full` (9999px)
5. **No mixing** — pick one radius scale and stick to it

---

## Shadows

### Scale

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-xs` | 0 1px 2px rgb(0 0 0 / 0.05) | Subtle elevation |
| `shadow-sm` | 0 1px 3px rgb(0 0 0 / 0.1), 0 1px 2px rgb(0 0 0 / 0.06) | Cards, inputs |
| `shadow-md` | 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) | Dropdowns |
| `shadow-lg` | 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1) | Modals |
| `shadow-xl` | 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) | Large modals |

### Usage Rules

1. **Tint shadows** to match background hue
2. **No pure black** shadows on light backgrounds
3. **Use sparingly** — not every element needs a shadow
4. **Elevation hierarchy** — clear distinction between levels

---

## Grid & Container

### Container
```
- Max width: 1280px (max-w-7xl)
- Horizontal padding: 16px mobile, 24px tablet, 32px desktop
- Centered with mx-auto
```

### Grid System
```
- 12-column grid for complex layouts
- 4-column grid for simple cards
- Gap: 24px (gap-6)
- Responsive: 1 col mobile, 2 col tablet, 3-4 col desktop
```

### Breakpoints
| Name | Min Width | Columns |
|------|-----------|---------|
| Mobile | < 640px | 1-2 |
| Tablet | 640px | 2-4 |
| Desktop | 1024px | 4-8 |
| Wide | 1280px | 8-12 |

---

## Button Hierarchy

### Primary Button
```css
background-color: var(--color-primary);
color: white;
padding: 12px 24px;
border-radius: radius-lg (8px);
font-weight: 600;
```
- Use for: Main CTAs, submit actions
- Never: White text on white background

### Secondary Button
```css
background-color: transparent;
color: var(--color-text-primary);
border: 1px solid var(--color-border);
border-radius: radius-lg (8px);
padding: 12px 24px;
```
- Use for: Secondary actions, cancel

### Ghost Button
```css
background-color: transparent;
color: var(--color-primary);
padding: 12px 24px;
```
- Use for: Tertiary actions, links

### Danger Button
```css
background-color: var(--color-danger);
color: white;
```
- Use for: Destructive actions

### Button States
- **Hover:** Slight darken, translateY(-1px)
- **Active:** translateY(0), scale(0.98)
- **Disabled:** opacity 0.5, cursor not-allowed
- **Loading:** Show spinner, disable interaction

### CTA Rules
1. Labels must be 1-3 words max
2. No wrapping to multiple lines at desktop
3. Only ONE primary CTA per section
4. Contrast ratio: WCAG AA minimum (4.5:1)

---

## Form Patterns

### Input Fields
```css
- Height: 40px
- Padding: 12px 16px
- Border: 1px solid var(--color-border)
- Border-radius: radius-md (6px)
- Focus: ring-2 with primary color
```

### Labels
- Position: Above input (never placeholder-as-label)
- Font: 14px, weight 500
- Color: text-primary

### Validation
- Error message: Below input, red text, with icon
- Success: Green checkmark or border
- Helper text: Secondary color, below input

### Form Layout
```
Label (14px, 500)
Input field
er text (optional)
Error message (when invalid)
```

### Gap System
- Between fields: 16px (space-4)
- Between field groups: 24px (space-6)
- Between form sections: 32px (space-8)

---

## Table Patterns

### Structure
```css
- No zebra stripes by default
- Header: weight 600, uppercase labels optional
- Rows: 48-56px height
- Borders: 1px bottom border
- Hover: Subtle background change
```

### Features
- Sortable columns with indicators
- Pagination for large datasets
- Sticky header on scroll
- Row selection for bulk actions
- Responsive: Horizontal scroll on mobile

### Status Column
- Use pill badges, not colored dots
- Pill colors per status type

---

## Dashboard Card Patterns

### Statistics Card
```css
- Padding: 20px (space-5)
- Border-radius: radius-xl (12px)
- Title: 14px, secondary color
- Value: 32px, bold, primary color
- Trend indicator: Up/down with color
```

### Chart Card
```css
- Padding: 24px (space-6)
- Title: 18px, weight 600
- Chart area: Full width
- Legend: Below chart or inline
```

### List Card
```css
- Header with title and optional action
- List items with consistent padding
- Dividers between items
- Empty state when no data
```

---

## Status Badge

### Status Colors

| Status | Background | Text | Example |
|--------|------------|------|---------|
| New | blue-100 | blue-700 | NEW |
| In Progress | amber-100 | amber-700 | IN PROGRESS |
| Completed | green-100 | green-700 | COMPLETED |
| Paid | green-100 | green-700 | PAID |
| Pending | amber-100 | amber-700 | PENDING |
| Overdue | red-100 | red-700 | OVERDUE |
| Rejected | red-100 | red-700 | REJECTED |
| Draft | gray-100 | gray-700 | DRAFT |

### Badge Styles
```css
- Padding: 4px 12px
- Border-radius: radius-full
- Font: 12px, weight 500
- Uppercase or title case based on context
```

---

## Navigation Patterns

### Public Site Navigation
- Fixed header, 72px height max
- Logo left, links center, CTA right
- Mobile: Hamburger menu
- Dropdown for nested menus
- Sticky on scroll

### Admin/Portal Sidebar
- Width: 240px (fixed)
- Collapsible on tablet
- Bottom sheet on mobile
- Icons + labels
- Active state with background

### Top Bar
- Height: 64px
- Search, notifications, profile menu
- Sticky

### Breadcrumbs
- Use for nested pages
- Slash separator
- Current page not linked

---

## Responsive Behavior

### Mobile (< 640px)
- Single column layouts
- Full-width cards
- Bottom navigation for portal
- Hamburger menu for admin
- Touch-friendly tap targets (44px min)

### Tablet (640px - 1024px)
- 2-column grids
- Collapsed sidebar
- Responsive tables with horizontal scroll

### Desktop (> 1024px)
- Full layouts
- Expanded sidebar
- Side-by-side panels

### Responsive Images
```tsx
<Image
  src="/image.jpg"
  alt="Description"
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

---

## Animation & Motion Rules

### Timing
```css
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Entrance Animations
- Fade in + slight translateY
- Duration: 300ms
- Stagger: 50-100ms between items
- Trigger: On viewport enter

### Hover States
- Duration: 150-200ms
- Scale: 1.02 for cards
- Color: Subtle shift
- Shadow: Slight increase

### Page Transitions
- Fade between routes
- Duration: 200ms

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Accessibility Rules

### Focus States
- Visible outline: 2px solid primary
- Offset: 2px
- Never remove focus styles

### Color Contrast
- Text: 4.5:1 minimum (WCAG AA)
- Large text: 3:1 minimum
- Interactive: 3:1 against adjacent colors

### Keyboard Navigation
- Logical tab order
- Skip links for main content
- Escape to close modals
- Arrow keys for menus

### Screen Readers
- Semantic HTML elements
- ARIA labels for icons
- Alt text for images
- Live regions for dynamic content

---

## Component Examples by Surface

### Public Website

**Hero Section**
- Large headline (48px)
- Subtext (18px, max 20 words)
- Primary CTA button
- Visual: Large image or illustration
- Spacing: Generous (py-24)

**Service Cards**
- Icon at top
- Title (H3)
- Description (Body small)
- Link to learn more
- Hover: Slight lift

**Portfolio Grid**
- Image thumbnails
- Overlay on hover with project name
- Category tag
- Filter by category

### Client Portal

**Dashboard Stats**
- 4 stat cards in a row
- Icon, value, label, trend
- Cards: radius-xl, shadow-sm

**Project List**
- Table with status badges
- Progress bars
- Quick actions
- Pagination

**Chat Interface**
- Message bubbles
- Timestamp
- File attachments
- Mention highlighting

### Admin Panel

**Data Tables**
- Sortable headers
- Row selection
- Bulk actions
- Filters above
- Pagination below

**Forms**
- Section grouping
- Inline validation
- Save/Cancel buttons
- Unsaved changes warning

**Analytics Dashboard**
- Chart cards
- Date range selector
- Export functionality
- Trend indicators

---

## Anti-Patterns to Avoid

1. **No generic AI look** — No AI-purple gradients, centered hero with random image
2. **No em-dashes** — Replace with periods, commas, or parentheses
3. **No Inter as default** — Use Inter for B2B/professional context only
4. **No decorative dots** — Use only for semantic status
5. **No excessive cards** — Use whitespace, borders, or grouping
6. **No zebra stripes** — Clean table rows without alternating colors
7. **No placeholder-only pages** — Every page must have real content structure
8. **No generic names** — Use realistic data (company names, etc.)
9. **No wrapped CTA buttons** — Keep labels short
10. **No section numbering** — Use descriptive labels instead

---

## Implementation Notes

This design system applies to all three surfaces:
- **Public Website** — Editorial, premium, generous whitespace
- **Client Portal** — Calm, focused, progress-oriented
- **Admin Panel** — Efficient, data-dense, professional

Each surface maintains the same core tokens but may vary in:
- Spacing density (admin denser)
- Layout patterns (public more varied)
- Animation intensity (public more engaging)
