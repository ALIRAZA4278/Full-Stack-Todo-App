# UI Components Specification

**Project**: Hackathon Todo – Phase II
**Authority**: Phase II Constitution v1.0.0
**Framework**: Next.js + Tailwind CSS
**Status**: Approved

## Component Architecture

```
components/
├── ui/                    # Generic, reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Textarea.tsx
│   ├── Checkbox.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   ├── Spinner.tsx
│   ├── Skeleton.tsx
│   ├── Toast.tsx
│   └── Avatar.tsx
│
└── todo/                  # Domain-specific components
    ├── TaskCard.tsx
    ├── TaskList.tsx
    ├── TaskForm.tsx
    ├── TaskDetail.tsx
    ├── EmptyState.tsx
    ├── UserMenu.tsx
    └── Navigation.tsx
```

## Generic UI Components

### Button

**Purpose**: Primary action trigger component

**Variants:**
| Variant | Use Case | Visual Style |
|---------|----------|--------------|
| primary | Main actions (Create, Save) | Solid background, brand color |
| secondary | Secondary actions | Outlined, subtle |
| danger | Destructive actions (Delete) | Red/danger color |
| ghost | Tertiary actions | No border, subtle hover |

**States:**
| State | Behavior |
|-------|----------|
| default | Normal appearance |
| hover | Subtle background/color change |
| focus | Visible focus ring (accessibility) |
| active | Pressed state |
| disabled | Reduced opacity, no interactions |
| loading | Spinner replaces or accompanies text |

**Sizes:**
| Size | Use Case |
|------|----------|
| sm | Compact areas, inline actions |
| md | Default size |
| lg | Primary CTAs, emphasized actions |

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| variant | string | No | 'primary' | 'secondary' | 'danger' | 'ghost' |
| size | string | No | 'sm' | 'md' | 'lg' |
| disabled | boolean | No | Disable interactions |
| loading | boolean | No | Show loading state |
| type | string | No | 'button' | 'submit' | 'reset' |
| onClick | function | No | Click handler |
| children | ReactNode | Yes | Button content |

---

### Input

**Purpose**: Text input field with label and validation

**States:**
| State | Visual Feedback |
|-------|-----------------|
| default | Normal border |
| focus | Brand color border, focus ring |
| error | Red border, error message below |
| disabled | Muted background, no interactions |

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| label | string | No | Input label text |
| placeholder | string | No | Placeholder text |
| error | string | No | Error message to display |
| type | string | No | 'text' | 'email' | 'password' |
| disabled | boolean | No | Disable input |
| required | boolean | No | Mark as required |
| value | string | No | Controlled value |
| onChange | function | No | Change handler |

**Accessibility:**
- Label associated with input via `htmlFor`
- Error messages linked via `aria-describedby`
- Required fields marked with `aria-required`

---

### Textarea

**Purpose**: Multi-line text input

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| label | string | No | Textarea label |
| placeholder | string | No | Placeholder text |
| error | string | No | Error message |
| rows | number | No | Number of visible rows |
| maxLength | number | No | Character limit |
| disabled | boolean | No | Disable input |
| value | string | No | Controlled value |
| onChange | function | No | Change handler |

**Features:**
- Character counter when maxLength is set
- Auto-resize option (optional enhancement)

---

### Checkbox

**Purpose**: Boolean toggle input

**States:**
| State | Visual |
|-------|--------|
| unchecked | Empty box |
| checked | Box with checkmark |
| indeterminate | Box with dash (if needed) |
| disabled | Muted, no interaction |

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| label | string | No | Checkbox label |
| checked | boolean | No | Checked state |
| disabled | boolean | No | Disable checkbox |
| onChange | function | No | Change handler |

**Accessibility:**
- Clickable label area
- Keyboard accessible (Space to toggle)

---

### Card

**Purpose**: Container for grouped content

**Variants:**
| Variant | Use Case |
|---------|----------|
| default | Standard container |
| interactive | Clickable card with hover state |
| elevated | More prominent shadow |

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| variant | string | No | Card style variant |
| padding | string | No | Padding size |
| onClick | function | No | Click handler (if interactive) |
| children | ReactNode | Yes | Card content |

**Visual Characteristics:**
- Rounded corners
- Subtle border or shadow
- Consistent padding

---

### Modal

**Purpose**: Dialog overlay for focused interactions

**Features:**
| Feature | Description |
|---------|-------------|
| Backdrop | Semi-transparent overlay |
| Close on escape | Keyboard dismissal |
| Close on backdrop click | Click outside to dismiss |
| Focus trap | Tab cycles within modal |
| Body scroll lock | Prevent background scrolling |

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| isOpen | boolean | Yes | Modal visibility |
| onClose | function | Yes | Close handler |
| title | string | No | Modal title |
| size | string | No | 'sm' | 'md' | 'lg' |
| children | ReactNode | Yes | Modal content |

**Accessibility:**
- `role="dialog"`
- `aria-modal="true"`
- Focus moves to modal on open
- Focus returns to trigger on close

---

### Spinner

**Purpose**: Loading indicator

**Sizes:**
| Size | Use Case |
|------|----------|
| sm | Inline, buttons |
| md | Content areas |
| lg | Full page loading |

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| size | string | No | Spinner size |
| color | string | No | Spinner color |

---

### Skeleton

**Purpose**: Content placeholder during loading

**Variants:**
| Variant | Shape |
|---------|-------|
| text | Rounded rectangle (single line) |
| title | Wider rounded rectangle |
| avatar | Circle |
| card | Full card shape |

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| variant | string | No | Skeleton shape |
| width | string | No | Custom width |
| height | string | No | Custom height |

**Animation:**
- Subtle pulse or shimmer animation

---

### Toast

**Purpose**: Notification messages

**Variants:**
| Variant | Use Case | Color |
|---------|----------|-------|
| success | Operation completed | Green |
| error | Operation failed | Red |
| warning | Caution message | Yellow |
| info | Informational | Blue |

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| message | string | Yes | Toast message |
| variant | string | No | Toast type |
| duration | number | No | Auto-dismiss time (ms) |
| onClose | function | No | Manual close handler |

**Behavior:**
- Appears at top-right or bottom-right
- Auto-dismisses after duration
- Can be manually dismissed
- Stacks if multiple toasts

---

### Avatar

**Purpose**: User representation

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| name | string | No | User name (for initials) |
| src | string | No | Image URL |
| size | string | No | Avatar size |

**Behavior:**
- Show image if `src` provided
- Show initials if no image
- Fallback to generic icon

---

## Domain Components

### TaskCard

**Purpose**: Display a single task in the list

**Visual Structure:**
```
┌─────────────────────────────────────────────────┐
│ ☐ Task Title                          ⋮ Menu   │
│   Description preview (truncated)...           │
│   Created: Jan 8, 2026                         │
└─────────────────────────────────────────────────┘
```

**Elements:**
| Element | Description |
|---------|-------------|
| Checkbox | Toggle completion |
| Title | Task title (bold) |
| Description | Truncated preview (2 lines max) |
| Created date | Relative or absolute date |
| Menu | Edit, Delete actions |

**States:**
| State | Visual |
|-------|--------|
| incomplete | Normal appearance |
| completed | Muted text, strikethrough title |
| hover | Elevated shadow, pointer cursor |
| selected | Highlighted border (if applicable) |

**Interactions:**
| Interaction | Result |
|-------------|--------|
| Click checkbox | Toggle completion |
| Click card body | Open detail view |
| Click menu > Edit | Open edit form |
| Click menu > Delete | Show delete confirmation |

---

### TaskList

**Purpose**: Container for TaskCard components

**Features:**
- Renders list of TaskCard components
- Handles empty state
- Shows loading skeletons
- Supports scroll for long lists

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| tasks | Task[] | Yes | Array of tasks |
| isLoading | boolean | No | Show loading state |
| onToggleComplete | function | No | Completion handler |
| onEdit | function | No | Edit handler |
| onDelete | function | No | Delete handler |

---

### TaskForm

**Purpose**: Create or edit task

**Fields:**
| Field | Component | Validation |
|-------|-----------|------------|
| Title | Input | Required, max 200 chars |
| Description | Textarea | Optional, max 1000 chars |

**Modes:**
| Mode | Title | Submit Button |
|------|-------|---------------|
| create | "Create Task" | "Create" |
| edit | "Edit Task" | "Save" |

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| mode | string | No | 'create' | 'edit' |
| initialValues | object | No | Pre-fill form (edit mode) |
| onSubmit | function | Yes | Form submission handler |
| onCancel | function | No | Cancel handler |
| isSubmitting | boolean | No | Loading state |

**Behavior:**
- Real-time validation feedback
- Disable submit until valid
- Show character count for description
- Clear form on successful create
- Preserve data on validation error

---

### TaskDetail

**Purpose**: Full task view (modal or panel)

**Visual Structure:**
```
┌─────────────────────────────────────────────────┐
│ Task Title                              ✕ Close │
├─────────────────────────────────────────────────┤
│                                                 │
│ Description text here...                        │
│                                                 │
├─────────────────────────────────────────────────┤
│ Status: ☐ Incomplete                            │
│ Created: January 8, 2026 at 10:30 AM           │
│ Updated: January 8, 2026 at 2:00 PM            │
├─────────────────────────────────────────────────┤
│                    [Edit]  [Delete]             │
└─────────────────────────────────────────────────┘
```

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| task | Task | Yes | Task to display |
| onClose | function | Yes | Close handler |
| onEdit | function | No | Edit handler |
| onDelete | function | No | Delete handler |
| onToggleComplete | function | No | Toggle handler |

---

### EmptyState

**Purpose**: Display when no tasks exist

**Visual Structure:**
```
┌─────────────────────────────────────────────────┐
│                                                 │
│              📝 (Illustration)                  │
│                                                 │
│           No tasks yet                          │
│     Create your first task to get started       │
│                                                 │
│              [+ Create Task]                    │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| title | string | No | Main message |
| description | string | No | Supporting text |
| action | ReactNode | No | CTA button |

---

### UserMenu

**Purpose**: User account dropdown

**Visual Structure:**
```
┌──────────────────┐
│ 👤 John Doe    ▼ │
├──────────────────┤
│ Sign Out         │
└──────────────────┘
```

**Elements:**
- Avatar or initial
- User name or email
- Dropdown arrow
- Sign out option

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| user | object | Yes | User data (name, email) |
| onSignOut | function | Yes | Sign out handler |

---

### Navigation

**Purpose**: Top navigation bar

**Visual Structure:**
```
┌─────────────────────────────────────────────────────────────┐
│ 📋 Hackathon Todo                          [UserMenu]       │
└─────────────────────────────────────────────────────────────┘
```

**Elements:**
- Logo/brand (links to home)
- UserMenu (when authenticated)
- Sign In/Sign Up links (when not authenticated)

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| user | object | No | Current user (null if not auth) |
| onSignOut | function | No | Sign out handler |

---

## Component States Summary

### Loading States

Every data-dependent component must handle:
| State | Display |
|-------|---------|
| Loading | Skeleton or spinner |
| Error | Error message with retry option |
| Empty | EmptyState component |
| Success | Normal content |

### Form States

Every form component must handle:
| State | Display |
|-------|---------|
| Valid | Submit enabled |
| Invalid | Submit disabled, errors shown |
| Submitting | Loading indicator, inputs disabled |
| Error | Error toast/message |
| Success | Success toast, form cleared/closed |

## Accessibility Requirements

### Keyboard Navigation

| Requirement | Implementation |
|-------------|----------------|
| Tab order | Logical, follows visual order |
| Focus visible | Clear focus indicators |
| Escape key | Close modals/dropdowns |
| Enter key | Submit forms, activate buttons |
| Space key | Toggle checkboxes |

### Screen Reader Support

| Requirement | Implementation |
|-------------|----------------|
| Labels | All inputs have associated labels |
| Announcements | Toast notifications announced |
| Landmarks | Proper heading hierarchy |
| Alt text | Images have descriptive alt |

### Color Contrast

| Requirement | Standard |
|-------------|----------|
| Normal text | 4.5:1 minimum |
| Large text | 3:1 minimum |
| UI components | 3:1 minimum |

## Responsive Behavior

| Breakpoint | Component Adaptation |
|------------|---------------------|
| Mobile (<640px) | Full width, stacked layouts |
| Tablet (640-1024px) | Two-column where appropriate |
| Desktop (>1024px) | Multi-column, side panels |

## Compliance

This specification complies with:
- Phase II Constitution v1.0.0
- Quality Assurance Principle (X)
- Premium UI/UX Requirements (Mandatory)
- WCAG 2.1 AA Accessibility Guidelines
