# Pages Specification

**Project**: Hackathon Todo – Phase II
**Authority**: Phase II Constitution v1.0.0
**Framework**: Next.js App Router
**Status**: Approved

## Route Structure

```
app/
├── (auth)/                    # Public authentication routes
│   ├── signin/
│   │   └── page.tsx          # /signin
│   └── signup/
│       └── page.tsx          # /signup
│
├── (app)/                     # Protected application routes
│   └── tasks/
│       └── page.tsx          # /tasks
│
├── api/
│   └── auth/
│       └── [...all]/
│           └── route.ts      # Better Auth API routes
│
├── layout.tsx                 # Root layout
├── page.tsx                   # / (Landing page)
├── loading.tsx                # Global loading state
├── error.tsx                  # Global error boundary
└── not-found.tsx             # 404 page
```

## Route Protection

| Route | Access Level | Redirect If |
|-------|--------------|-------------|
| / | Public | - |
| /signin | Public | Auth → /tasks |
| /signup | Public | Auth → /tasks |
| /tasks | Protected | Not Auth → /signin |

## Page Specifications

### Landing Page (/)

**URL**: `/`
**Access**: Public
**Purpose**: Introduce application and guide users to sign up/sign in

**Visual Structure:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Navigation                                      [Sign In] [Sign Up]         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                         Hackathon Todo                                      │
│                                                                             │
│              Organize your tasks efficiently.                               │
│              Multi-user. Secure. Simple.                                    │
│                                                                             │
│                      [Get Started →]                                        │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                    │
│   │   Feature   │    │   Feature   │    │   Feature   │                    │
│   │     1       │    │     2       │    │     3       │                    │
│   │             │    │             │    │             │                    │
│   │  Personal   │    │   Secure    │    │   Simple    │                    │
│   │   Tasks     │    │   Storage   │    │   Design    │                    │
│   └─────────────┘    └─────────────┘    └─────────────┘                    │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ Footer                                                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Elements:**
| Element | Description |
|---------|-------------|
| Navigation | Logo, Sign In/Sign Up buttons |
| Hero Section | Headline, subheadline, CTA button |
| Features Section | 3 feature highlights |
| Footer | Minimal footer |

**Behavior:**
- "Get Started" links to /signup
- Authenticated users redirected to /tasks
- Responsive layout for mobile

---

### Sign In Page (/signin)

**URL**: `/signin`
**Access**: Public (redirect to /tasks if authenticated)
**Purpose**: Authenticate existing users

**Visual Structure:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [← Back to Home]                                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                              Sign In                                        │
│                                                                             │
│                    ┌──────────────────────────┐                             │
│                    │ Email                    │                             │
│                    │ user@example.com         │                             │
│                    └──────────────────────────┘                             │
│                                                                             │
│                    ┌──────────────────────────┐                             │
│                    │ Password                 │                             │
│                    │ ••••••••                 │                             │
│                    └──────────────────────────┘                             │
│                                                                             │
│                    ┌──────────────────────────┐                             │
│                    │        Sign In           │                             │
│                    └──────────────────────────┘                             │
│                                                                             │
│                    Don't have an account? Sign up                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Elements:**
| Element | Description |
|---------|-------------|
| Back link | Return to landing page |
| Title | "Sign In" |
| Email input | Required, email validation |
| Password input | Required, masked |
| Submit button | "Sign In" |
| Link to signup | "Don't have an account? Sign up" |
| Error area | Display auth errors |

**States:**
| State | Display |
|-------|---------|
| Default | Empty form |
| Submitting | Button shows spinner, inputs disabled |
| Error | Error message above form |
| Success | Redirect to /tasks |

**Behavior:**
- Redirect to /tasks on success
- Preserve intended destination for post-login redirect
- Display generic error message (don't reveal which field is wrong)

---

### Sign Up Page (/signup)

**URL**: `/signup`
**Access**: Public (redirect to /tasks if authenticated)
**Purpose**: Create new user account

**Visual Structure:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [← Back to Home]                                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                              Sign Up                                        │
│                                                                             │
│                    ┌──────────────────────────┐                             │
│                    │ Name                     │                             │
│                    │ John Doe                 │                             │
│                    └──────────────────────────┘                             │
│                                                                             │
│                    ┌──────────────────────────┐                             │
│                    │ Email                    │                             │
│                    │ user@example.com         │                             │
│                    └──────────────────────────┘                             │
│                                                                             │
│                    ┌──────────────────────────┐                             │
│                    │ Password                 │                             │
│                    │ ••••••••                 │                             │
│                    └──────────────────────────┘                             │
│                    Min 8 characters                                         │
│                                                                             │
│                    ┌──────────────────────────┐                             │
│                    │        Sign Up           │                             │
│                    └──────────────────────────┘                             │
│                                                                             │
│                    Already have an account? Sign in                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Elements:**
| Element | Description |
|---------|-------------|
| Back link | Return to landing page |
| Title | "Sign Up" |
| Name input | Required, 1-100 characters |
| Email input | Required, email validation |
| Password input | Required, min 8 characters |
| Password hint | "Min 8 characters" |
| Submit button | "Sign Up" |
| Link to signin | "Already have an account? Sign in" |
| Error area | Display validation/registration errors |

**Validation:**
| Field | Rule | Error Message |
|-------|------|---------------|
| Name | Required | "Name is required" |
| Name | Max 100 chars | "Name must be 100 characters or less" |
| Email | Required | "Email is required" |
| Email | Valid format | "Please enter a valid email" |
| Password | Required | "Password is required" |
| Password | Min 8 chars | "Password must be at least 8 characters" |

**States:**
| State | Display |
|-------|---------|
| Default | Empty form |
| Validating | Real-time field validation |
| Submitting | Button shows spinner, inputs disabled |
| Error | Field-level or form-level error messages |
| Success | Auto sign-in and redirect to /tasks |

---

### Tasks Page (/tasks)

**URL**: `/tasks`
**Access**: Protected (redirect to /signin if not authenticated)
**Purpose**: Main task management interface

**Visual Structure:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 📋 Hackathon Todo                                         [User Menu ▼]     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   My Tasks                                              [+ Add Task]        │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │ ☐  Buy groceries                                           ⋮        │  │
│   │    Milk, eggs, bread...                                             │  │
│   │    Created: Jan 8, 2026                                             │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │ ☑  Call dentist                                            ⋮        │  │
│   │    Schedule cleaning appointment                                    │  │
│   │    Created: Jan 7, 2026                                             │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │ ☐  Review project proposal                                 ⋮        │  │
│   │    No description                                                   │  │
│   │    Created: Jan 6, 2026                                             │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Layout Components:**
| Component | Description |
|-----------|-------------|
| Navigation | Logo, UserMenu |
| Page Header | "My Tasks" title, Add Task button |
| Task List | List of TaskCard components |
| Empty State | Shown when no tasks |
| Add/Edit Modal | Task form in modal |
| Delete Confirmation | Confirm before delete |

**States:**

| State | Display |
|-------|---------|
| Loading | Skeleton cards |
| Empty | EmptyState with "Create first task" CTA |
| Loaded | TaskList with TaskCards |
| Creating | Modal with TaskForm (create mode) |
| Editing | Modal with TaskForm (edit mode) |
| Deleting | Confirmation modal |
| Error | Toast notification |

**Interactions:**

| Action | Trigger | Result |
|--------|---------|--------|
| View tasks | Page load | Fetch and display tasks |
| Add task | Click "Add Task" | Open create modal |
| Edit task | Click menu > Edit | Open edit modal |
| Delete task | Click menu > Delete | Open confirmation modal |
| Toggle complete | Click checkbox | Optimistic update |
| View detail | Click task card | Open detail view (modal or expand) |
| Sign out | Click "Sign Out" | End session, redirect to / |

**Empty State:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                              📝                                             │
│                                                                             │
│                         No tasks yet                                        │
│                                                                             │
│                 Create your first task to get started                       │
│                                                                             │
│                         [+ Create Task]                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 404 Not Found Page

**URL**: Any invalid route
**Access**: Public
**Purpose**: Handle navigation to non-existent pages

**Visual Structure:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                              404                                            │
│                                                                             │
│                       Page Not Found                                        │
│                                                                             │
│              The page you're looking for doesn't exist.                     │
│                                                                             │
│                        [Go to Home]                                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Global Error Page

**URL**: N/A (error boundary)
**Access**: Public
**Purpose**: Handle unexpected application errors

**Visual Structure:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                         Something went wrong                                │
│                                                                             │
│              We encountered an unexpected error.                            │
│                    Please try again later.                                  │
│                                                                             │
│                    [Try Again]  [Go to Home]                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Global Loading State

**Purpose**: Display while pages are loading

**Display:**
- Full-page spinner or skeleton
- Shown during route transitions
- Shown while checking authentication

---

## Layout Structure

### Root Layout

```tsx
// Wraps all pages
- HTML document setup
- Font loading
- Global styles (Tailwind)
- Toast provider
- Auth provider (Better Auth)
```

### Auth Layout (/(auth))

```tsx
// Wraps signin and signup
- Centered content
- Card-style form container
- Back to home link
- No navigation bar
```

### App Layout (/(app))

```tsx
// Wraps protected pages
- Navigation bar with UserMenu
- Auth check middleware
- Main content area
- Toast notifications
```

## Page Loading Behavior

| Page | Loading State |
|------|---------------|
| Landing | Static, no loading needed |
| Sign In | Form skeleton if slow |
| Sign Up | Form skeleton if slow |
| Tasks | Skeleton cards while fetching |

## Page Error Handling

| Error Type | Handling |
|------------|----------|
| Network error | Toast notification, retry option |
| 401 Unauthorized | Redirect to /signin |
| 403 Forbidden | Toast notification |
| 404 Not Found | 404 page |
| 500 Server Error | Error page with retry |

## SEO and Meta

| Page | Title | Description |
|------|-------|-------------|
| Landing | "Hackathon Todo - Task Management" | "Organize your tasks efficiently..." |
| Sign In | "Sign In - Hackathon Todo" | "Sign in to your account" |
| Sign Up | "Sign Up - Hackathon Todo" | "Create a new account" |
| Tasks | "My Tasks - Hackathon Todo" | "Manage your personal tasks" |

## Responsive Breakpoints

| Breakpoint | Layout Changes |
|------------|----------------|
| Mobile (<640px) | Full width, stacked navigation |
| Tablet (640-1024px) | Wider card forms |
| Desktop (>1024px) | Centered max-width content |

## Compliance

This specification complies with:
- Phase II Constitution v1.0.0
- Monorepo Structure Principle (VII) - App Router structure
- Quality Assurance Principle (X)
- Premium UI/UX Requirements
