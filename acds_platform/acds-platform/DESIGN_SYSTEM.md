# ACDS Design System Documentation

## Enterprise UI/UX Architecture

---

## 1. Design Philosophy

### Core Principles

**Professional Minimalism**
- Every element serves a strategic purpose
- Whitespace used intentionally for clarity
- No decorative elements that don't add value
- Focus on data and insights, not aesthetics

**Executive-First Design**
- Information hierarchy optimized for C-suite consumption
- Quick scanning and comprehension
- Actionable insights prominently displayed
- Minimal cognitive load

**Corporate Decorum**
- Neutral, professional color palette
- Consistent typography and spacing
- Refined interactions without flashiness
- Trustworthy and authoritative appearance

---

## 2. Color System

### Primary Palette

```css
Corporate Navy:     #1e3a5f    /* Primary brand, headers, navigation */
Corporate Blue:     #2c5282    /* Interactive elements, hover states */
Corporate Slate:    #475569    /* Secondary text, labels */
```

### Neutral Palette

```css
White:              #ffffff    /* Card backgrounds, primary surfaces */
Light Gray:         #f1f5f9    /* Page backgrounds */
Border Gray:        #e2e8f0    /* Dividers, card borders */
Medium Gray:        #64748b    /* Tertiary text */
Dark Gray:          #1e293b    /* Primary text */
```

### Status Colors

```css
Critical Red:       #dc2626    /* High-severity alerts, negative trends */
Warning Amber:      #f59e0b    /* Medium-severity warnings */
Healthy Green:      #059669    /* Positive status, healthy metrics */
```

### Usage Guidelines

- **Navy Blue**: Reserved for primary navigation, headers, and key CTAs
- **Status Colors**: Only for risk indicators, never for decoration
- **Neutral Grays**: Majority of UI to maintain professional appearance
- **White**: Card backgrounds to create clear content separation

---

## 3. Typography

### Font Family

**Primary:** Inter (Google Fonts)
- Professional, highly legible
- Excellent at small sizes
- Modern without being trendy
- Used by major enterprise platforms

### Type Scale

```css
Display:        text-5xl (48px)  font-semibold    /* Health scores */
Heading 1:      text-2xl (24px)  font-semibold    /* Page titles */
Heading 2:      text-lg  (18px)  font-semibold    /* Section headers */
Heading 3:      text-base (16px) font-semibold    /* Card titles */
Body:           text-sm  (14px)  font-normal      /* Primary content */
Caption:        text-xs  (12px)  font-normal      /* Labels, metadata */
```

### Font Weights

- **300 (Light)**: Rarely used, only for large display numbers
- **400 (Normal)**: Body text, descriptions
- **500 (Medium)**: Emphasized text, labels
- **600 (Semibold)**: Headings, important metrics
- **700 (Bold)**: Avoided to maintain professional tone

---

## 4. Layout System

### Grid Structure

**Dashboard Grid:** 12-column responsive grid
- Desktop: 3-column layout for cards
- Tablet: 2-column layout
- Mobile: Single column stack

**Spacing Scale**

```css
xs:  0.25rem (4px)   /* Tight spacing within components */
sm:  0.5rem  (8px)   /* Component internal spacing */
md:  1rem    (16px)  /* Default spacing between elements */
lg:  1.5rem  (24px)  /* Section spacing */
xl:  2rem    (32px)  /* Major section breaks */
2xl: 3rem    (48px)  /* Page-level spacing */
```

### Container Widths

- **Max Width:** 1280px (7xl) for main content
- **Sidebar:** Fixed 256px (64 * 4px)
- **Card Padding:** 24px (p-6) standard
- **Page Padding:** 32px (p-8) on main content area

---

## 5. Component Library

### Cards

**Standard Enterprise Card**
```tsx
className="card-enterprise p-6"
// White background, subtle border, minimal shadow
```

**Usage:**
- KPI displays
- Alert notifications
- Data summaries
- Form containers

**Variants:**
- Default: White with gray border
- Hover: Subtle shadow increase
- Status: Colored border-left for severity

### Buttons

**Primary Button**
```tsx
className="btn-primary"
// Navy background, white text, rounded corners
```

**Secondary Button**
```tsx
className="btn-secondary"
// White background, navy text, gray border
```

**Usage Guidelines:**
- Maximum 1 primary button per screen section
- Secondary for alternative actions
- Icon + text for clarity
- Consistent sizing (px-4 py-2)

### Status Badges

**Severity Indicators**
```tsx
className="status-badge bg-red-100 text-red-800"
```

**Variants:**
- Critical: Red background
- Warning: Amber background
- Healthy: Green background
- Info: Blue background

**Usage:**
- Alert severity
- Risk levels
- Priority indicators
- Status labels

### Form Inputs

**Enterprise Input**
```tsx
className="input-enterprise"
// Clean borders, navy focus ring, consistent sizing
```

**Features:**
- Subtle border (gray-300)
- Navy focus ring
- Icon support (left-aligned)
- Placeholder text in gray-400

---

## 6. Navigation Architecture

### Header (Top Bar)

**Components:**
- Logo and system name (left)
- Notification bell (right)
- User profile (right)
- Logout button (right)

**Behavior:**
- Sticky positioning
- White background
- Subtle bottom border
- Consistent 64px height

### Sidebar (Left Navigation)

**Structure:**
- Fixed width (256px)
- Navy background
- White/gray text
- Active state: Lighter blue + left border

**Menu Items:**
1. Executive Dashboard
2. Risk & Alerts
3. Root Cause Analysis
4. Business Impact
5. Recommendations
6. Department Heatmap
7. Executive Report

**Interaction:**
- Hover: Lighter background
- Active: White left border + lighter bg
- Icons + labels for clarity

---

## 7. Screen Layouts

### Login Screen

**Layout:**
- Full-screen gradient background
- Centered authentication card (max-w-md)
- Logo above card
- Form within white card
- Security disclaimer below

**Visual Hierarchy:**
1. Logo and branding
2. "Executive Access" heading
3. Email input
4. Password input
5. Sign in button
6. Security notice

### Dashboard Layout

**Structure:**
```
┌─────────────────────────────────────┐
│ Header (Logo, User, Notifications) │
├──────┬──────────────────────────────┤
│      │ Page Title                   │
│ Side │ Health Score | KPI Grid      │
│ bar  │ Critical Alerts List         │
│      │                              │
└──────┴──────────────────────────────┘
```

**Content Hierarchy:**
1. Page title and description
2. Company health score (prominent)
3. KPI cards (4-grid)
4. Critical alerts section
5. Quick actions

### Detail Views (Analysis, Impact, Recommendations)

**Structure:**
- Breadcrumb/back navigation
- Page title and context
- Primary content cards
- Supporting information
- Action buttons (bottom-right)

---

## 8. Data Visualization

### Principles

**Minimal and Purposeful**
- No decorative charts
- Muted colors (grays with accent colors)
- Clear labels and legends
- Executive-friendly simplicity

### Chart Types Used

**Progress Bars**
- Risk scores
- Probability indicators
- Horizontal bars with labels

**Heatmap Grid**
- Department risk overview
- Color-coded cells
- Minimal borders

**Trend Indicators**
- Up/down/stable arrows
- Percentage changes
- Color-coded (green/red/gray)

### What We Avoid

- ❌ Pie charts (hard to compare)
- ❌ 3D effects (unprofessional)
- ❌ Bright gradients (distracting)
- ❌ Animated charts (unnecessary)
- ❌ Complex multi-axis graphs

---

## 9. Interaction Patterns

### Hover States

**Cards:**
- Subtle shadow increase
- No color change
- Smooth transition (150ms)

**Buttons:**
- Slight color darkening
- No dramatic effects
- Cursor: pointer

**Navigation:**
- Background lightening
- Text color change
- Smooth transition

### Click/Tap Interactions

**Minimal Feedback:**
- No ripple effects
- No dramatic animations
- Instant navigation
- Loading states when needed

### Transitions

**Timing:**
- Fast: 150ms (hover states)
- Medium: 300ms (page transitions)
- Slow: 500ms (avoided)

**Easing:**
- ease-in-out for most transitions
- No bouncing or elastic effects

---

## 10. Responsive Design

### Breakpoints

```css
sm:  640px   /* Small tablets */
md:  768px   /* Tablets */
lg:  1024px  /* Small desktops */
xl:  1280px  /* Standard desktops */
2xl: 1536px  /* Large desktops */
```

### Mobile Adaptations

**Dashboard:**
- Single column layout
- Stacked KPI cards
- Collapsible sidebar (hamburger menu)
- Simplified navigation

**Cards:**
- Full width on mobile
- Reduced padding (p-4 instead of p-6)
- Stacked content within cards

**Tables/Grids:**
- Horizontal scroll when needed
- Priority content visible first
- Simplified on small screens

---

## 11. Accessibility

### WCAG 2.1 AA Compliance

**Color Contrast:**
- Text on white: 4.5:1 minimum
- Large text: 3:1 minimum
- Status colors tested for contrast

**Keyboard Navigation:**
- Tab order logical
- Focus indicators visible
- Skip navigation available

**Screen Readers:**
- Semantic HTML
- ARIA labels where needed
- Alt text for icons

**Focus States:**
- Navy ring (ring-corporate-navy)
- 2px width
- Visible on all interactive elements

---

## 12. Performance Considerations

### Optimization Strategies

**Images:**
- SVG icons (Lucide React)
- No raster images in UI
- Lazy loading for reports

**Code Splitting:**
- Route-based splitting
- Component lazy loading
- Minimal bundle size

**Rendering:**
- Memoized components
- Efficient re-renders
- Virtual scrolling for long lists

---

## 13. Design Tokens

### Tailwind Configuration

```javascript
colors: {
  corporate: {
    navy: '#1e3a5f',
    darkblue: '#2c5282',
    slate: '#475569',
    lightgray: '#f1f5f9',
    border: '#e2e8f0',
  },
  status: {
    critical: '#dc2626',
    warning: '#f59e0b',
    healthy: '#059669',
  }
}
```

### Custom CSS Classes

```css
.card-enterprise      /* Standard card styling */
.btn-primary          /* Primary action button */
.btn-secondary        /* Secondary action button */
.input-enterprise     /* Form input styling */
.status-badge         /* Status indicator badge */
```

---

## 14. Content Guidelines

### Writing Style

**Tone:**
- Professional and authoritative
- Clear and concise
- Action-oriented
- No jargon unless necessary

**Formatting:**
- Sentence case for most text
- UPPERCASE for labels and metadata
- Title Case for proper nouns only

**Numbers:**
- Use commas for thousands (1,234)
- Currency with $ symbol ($4.2M)
- Percentages with % symbol (78%)
- Round to appropriate precision

### Labels and Microcopy

**Buttons:**
- Action verbs: "View Details", "Export PDF"
- Not: "Click here", "Submit"

**Headings:**
- Descriptive: "Root Cause Analysis"
- Not: "Analysis", "Details"

**Status Messages:**
- Clear: "Last Updated: Jan 20, 2026"
- Not: "Updated recently"

---

## 15. Quality Checklist

### Before Launch

**Visual Consistency:**
- [ ] All colors from design system
- [ ] Consistent spacing throughout
- [ ] Typography scale followed
- [ ] Icons consistent size and style

**Functionality:**
- [ ] All navigation works
- [ ] Filters function correctly
- [ ] Data displays accurately
- [ ] Responsive on all devices

**Professional Polish:**
- [ ] No Lorem Ipsum text
- [ ] Realistic data values
- [ ] Proper number formatting
- [ ] Consistent terminology

**Accessibility:**
- [ ] Keyboard navigation works
- [ ] Color contrast passes
- [ ] Focus states visible
- [ ] Screen reader friendly

---

## 16. Future Enhancements

### Phase 2 Features

- Real-time data integration
- Advanced filtering and search
- Customizable dashboards
- Export to PowerPoint
- Email alert notifications
- Mobile native apps
- Multi-language support
- Dark mode option (corporate theme)

### Scalability Considerations

- Component library expansion
- Design system documentation site
- Figma design file integration
- Automated visual regression testing
- Performance monitoring
- Analytics integration

---

**ACDS Design System - Version 1.0**
*Last Updated: January 2026*
