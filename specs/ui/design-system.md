# Design System Specification

**Project**: Hackathon Todo – Phase II
**Authority**: Phase II Constitution v1.0.0
**Framework**: Tailwind CSS
**Status**: Approved

## Design Philosophy

The Hackathon Todo design system embodies:

| Principle | Description |
|-----------|-------------|
| **Professional** | Production-grade SaaS appearance |
| **Minimal** | Clean, uncluttered interfaces |
| **Modern** | Contemporary design patterns |
| **Consistent** | Unified visual language throughout |
| **Accessible** | WCAG 2.1 AA compliant |

**A visually unpolished UI is considered a failure.**

## Color System

### Brand Colors

| Name | Hex | Tailwind | Usage |
|------|-----|----------|-------|
| Primary | #2563EB | blue-600 | Primary actions, links |
| Primary Hover | #1D4ED8 | blue-700 | Hover states |
| Primary Light | #DBEAFE | blue-100 | Backgrounds, badges |

### Semantic Colors

| Name | Hex | Tailwind | Usage |
|------|-----|----------|-------|
| Success | #16A34A | green-600 | Success states, completed |
| Success Light | #DCFCE7 | green-100 | Success backgrounds |
| Error | #DC2626 | red-600 | Errors, destructive actions |
| Error Light | #FEE2E2 | red-100 | Error backgrounds |
| Warning | #D97706 | amber-600 | Warnings, caution |
| Warning Light | #FEF3C7 | amber-100 | Warning backgrounds |
| Info | #0284C7 | sky-600 | Informational |
| Info Light | #E0F2FE | sky-100 | Info backgrounds |

### Neutral Colors

| Name | Hex | Tailwind | Usage |
|------|-----|----------|-------|
| Gray 50 | #F9FAFB | gray-50 | Page backgrounds |
| Gray 100 | #F3F4F6 | gray-100 | Card backgrounds, dividers |
| Gray 200 | #E5E7EB | gray-200 | Borders |
| Gray 300 | #D1D5DB | gray-300 | Disabled states |
| Gray 400 | #9CA3AF | gray-400 | Placeholder text |
| Gray 500 | #6B7280 | gray-500 | Secondary text |
| Gray 600 | #4B5563 | gray-600 | Body text |
| Gray 700 | #374151 | gray-700 | Headings |
| Gray 800 | #1F2937 | gray-800 | Primary text |
| Gray 900 | #111827 | gray-900 | Darkest text |
| White | #FFFFFF | white | Backgrounds, text on dark |

### Background Colors

| Usage | Color |
|-------|-------|
| Page background | gray-50 |
| Card background | white |
| Input background | white |
| Hover background | gray-100 |
| Selected background | blue-50 |

## Typography

### Font Family

| Type | Font | Tailwind |
|------|------|----------|
| Primary | Inter | font-sans |
| Monospace | JetBrains Mono | font-mono |

### Font Sizes

| Name | Size | Line Height | Tailwind | Usage |
|------|------|-------------|----------|-------|
| xs | 12px | 16px | text-xs | Labels, badges |
| sm | 14px | 20px | text-sm | Secondary text, inputs |
| base | 16px | 24px | text-base | Body text |
| lg | 18px | 28px | text-lg | Large body |
| xl | 20px | 28px | text-xl | Small headings |
| 2xl | 24px | 32px | text-2xl | Section headings |
| 3xl | 30px | 36px | text-3xl | Page headings |
| 4xl | 36px | 40px | text-4xl | Hero headings |

### Font Weights

| Name | Weight | Tailwind | Usage |
|------|--------|----------|-------|
| Normal | 400 | font-normal | Body text |
| Medium | 500 | font-medium | Buttons, labels |
| Semibold | 600 | font-semibold | Headings |
| Bold | 700 | font-bold | Emphasis |

### Typography Hierarchy

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| H1 (Page title) | 3xl (30px) | Semibold | gray-800 |
| H2 (Section title) | 2xl (24px) | Semibold | gray-800 |
| H3 (Card title) | lg (18px) | Semibold | gray-800 |
| Body | base (16px) | Normal | gray-600 |
| Body Small | sm (14px) | Normal | gray-500 |
| Caption | xs (12px) | Normal | gray-500 |
| Button | sm (14px) | Medium | Varies |
| Input | base (16px) | Normal | gray-800 |

## Spacing Scale

Based on 4px base unit:

| Name | Value | Tailwind | Usage |
|------|-------|----------|-------|
| 0 | 0px | 0 | Reset |
| 1 | 4px | 1 | Tight spacing |
| 2 | 8px | 2 | Icon padding |
| 3 | 12px | 3 | Compact elements |
| 4 | 16px | 4 | Standard spacing |
| 5 | 20px | 5 | Medium spacing |
| 6 | 24px | 6 | Section spacing |
| 8 | 32px | 8 | Large spacing |
| 10 | 40px | 10 | Extra large |
| 12 | 48px | 12 | Section padding |
| 16 | 64px | 16 | Page sections |
| 20 | 80px | 20 | Hero sections |

### Spacing Guidelines

| Context | Spacing |
|---------|---------|
| Inline elements | 2 (8px) |
| Form field gap | 4 (16px) |
| Card padding | 6 (24px) |
| Section gap | 8-12 (32-48px) |
| Page padding | 4-6 (16-24px) |

## Layout

### Container Widths

| Name | Max Width | Tailwind | Usage |
|------|-----------|----------|-------|
| sm | 640px | max-w-sm | Auth forms |
| md | 768px | max-w-md | Modals |
| lg | 1024px | max-w-lg | Cards |
| xl | 1280px | max-w-xl | Content |
| 2xl | 1536px | max-w-2xl | Full page |

### Grid System

| Columns | Tailwind | Usage |
|---------|----------|-------|
| 1 | grid-cols-1 | Mobile, single column |
| 2 | grid-cols-2 | Two-column layouts |
| 3 | grid-cols-3 | Feature grids |
| 4 | grid-cols-4 | Desktop grids |

### Breakpoints

| Name | Min Width | Tailwind | Description |
|------|-----------|----------|-------------|
| sm | 640px | sm: | Small tablets |
| md | 768px | md: | Tablets |
| lg | 1024px | lg: | Laptops |
| xl | 1280px | xl: | Desktops |
| 2xl | 1536px | 2xl: | Large screens |

## Border Radius

| Name | Value | Tailwind | Usage |
|------|-------|----------|-------|
| none | 0px | rounded-none | No rounding |
| sm | 4px | rounded-sm | Small elements |
| DEFAULT | 6px | rounded | Buttons |
| md | 8px | rounded-md | Cards, inputs |
| lg | 12px | rounded-lg | Large cards |
| xl | 16px | rounded-xl | Modals |
| full | 9999px | rounded-full | Pills, avatars |

## Shadows

| Name | Tailwind | Usage |
|------|----------|-------|
| sm | shadow-sm | Subtle elevation |
| DEFAULT | shadow | Cards, dropdowns |
| md | shadow-md | Floating elements |
| lg | shadow-lg | Modals |
| xl | shadow-xl | Emphasized elements |

### Shadow Values

```css
shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
```

## Borders

| Usage | Width | Color |
|-------|-------|-------|
| Default | 1px | gray-200 |
| Focus | 2px | blue-500 |
| Error | 1px | red-500 |
| Divider | 1px | gray-100 |

## Transitions

| Property | Duration | Easing | Tailwind |
|----------|----------|--------|----------|
| Color | 150ms | ease-in-out | transition-colors |
| Background | 150ms | ease-in-out | transition-colors |
| Shadow | 150ms | ease-in-out | transition-shadow |
| Transform | 200ms | ease-out | transition-transform |
| All | 150ms | ease-in-out | transition-all |

### Standard Transition

```css
transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
```

## Component Patterns

### Buttons

**Primary Button**
```
Background: blue-600
Text: white
Border: none
Radius: rounded-md
Padding: px-4 py-2
Shadow: shadow-sm

Hover:
- Background: blue-700

Focus:
- Ring: ring-2 ring-blue-500 ring-offset-2

Disabled:
- Opacity: opacity-50
- Cursor: cursor-not-allowed
```

**Secondary Button**
```
Background: white
Text: gray-700
Border: 1px gray-300
Radius: rounded-md
Padding: px-4 py-2

Hover:
- Background: gray-50

Focus:
- Ring: ring-2 ring-gray-500 ring-offset-2
```

**Danger Button**
```
Background: red-600
Text: white
Border: none
Radius: rounded-md
Padding: px-4 py-2

Hover:
- Background: red-700
```

### Inputs

**Default State**
```
Background: white
Border: 1px gray-300
Radius: rounded-md
Padding: px-3 py-2
Font: text-base
```

**Focus State**
```
Border: blue-500
Ring: ring-2 ring-blue-500 ring-offset-0
```

**Error State**
```
Border: red-500
Ring: ring-2 ring-red-500 ring-offset-0
```

### Cards

```
Background: white
Border: 1px gray-200
Radius: rounded-lg
Shadow: shadow-sm
Padding: p-6

Hover (if interactive):
- Shadow: shadow-md
- Border: gray-300
```

### Modals

```
Backdrop:
- Background: black/50

Dialog:
- Background: white
- Radius: rounded-xl
- Shadow: shadow-xl
- Max Width: max-w-md
- Padding: p-6
```

## Iconography

### Icon Sizes

| Name | Size | Tailwind | Usage |
|------|------|----------|-------|
| xs | 12px | w-3 h-3 | Inline, badges |
| sm | 16px | w-4 h-4 | Buttons (small) |
| md | 20px | w-5 h-5 | Buttons, inputs |
| lg | 24px | w-6 h-6 | Navigation |
| xl | 32px | w-8 h-8 | Feature icons |

### Icon Style

- Line icons preferred (not filled)
- 1.5px stroke width
- Consistent style throughout

## Accessibility

### Focus States

All interactive elements must have visible focus indicators:
```
focus:outline-none
focus:ring-2
focus:ring-blue-500
focus:ring-offset-2
```

### Color Contrast

| Combination | Ratio | Status |
|-------------|-------|--------|
| gray-800 on white | 12.6:1 | Pass AAA |
| gray-600 on white | 5.7:1 | Pass AA |
| gray-500 on white | 4.6:1 | Pass AA |
| blue-600 on white | 4.7:1 | Pass AA |
| white on blue-600 | 4.7:1 | Pass AA |

### Touch Targets

Minimum touch target size: 44x44 pixels for mobile

## Responsive Design

### Mobile First

All styles are mobile-first. Use responsive prefixes for larger screens:

```
// Mobile (default)
class="px-4"

// Tablet and up
class="px-4 md:px-6"

// Desktop and up
class="px-4 md:px-6 lg:px-8"
```

### Common Responsive Patterns

| Pattern | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Container padding | px-4 | md:px-6 | lg:px-8 |
| Grid columns | grid-cols-1 | md:grid-cols-2 | lg:grid-cols-3 |
| Font size (hero) | text-2xl | md:text-3xl | lg:text-4xl |
| Card width | w-full | md:max-w-md | lg:max-w-lg |

## Micro-interactions

### Button Click

```
Active state: scale-95 (slight shrink)
Duration: 100ms
```

### Checkbox Toggle

```
Transition: background-color 150ms
Checkmark: fade-in 100ms
```

### Card Hover

```
Shadow transition: 150ms
Transform: translateY(-2px)
```

### Toast Appearance

```
Enter: fade-in + slide-from-right
Exit: fade-out + slide-to-right
Duration: 300ms
```

### Modal

```
Backdrop: fade-in 200ms
Dialog: scale-95 to scale-100 + fade-in 200ms
```

## Compliance

This specification complies with:
- Phase II Constitution v1.0.0
- Quality Assurance Principle (X)
- Premium UI/UX Requirements (Mandatory)
- WCAG 2.1 AA Accessibility Guidelines
