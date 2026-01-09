# Implementation Plan: Hackathon Todo Phase II

**Project**: Hackathon Todo – Phase II Full-Stack Web Application
**Authority**: Phase II Constitution v1.0.0 + Phase II Specifications
**Date**: 2026-01-08
**Status**: Approved for Implementation

## Executive Summary

This plan defines HOW to implement the Hackathon Todo Phase II application based on the approved specifications. The implementation follows an incremental, security-first approach where authentication and user isolation are built into the system from day one.

**Implementation Order:**
1. Project Structure & Configuration
2. Database & Persistence Layer
3. Backend API with Authentication
4. Frontend Foundation with Auth Integration
5. UI Components & Design System
6. Feature Implementation (CRUD)
7. Integration & Polish
8. Validation & Quality Assurance

---

## 1. Architecture Implementation Plan

### 1.1 Monorepo Structure Validation

The project MUST be organized as a monorepo with the following verified structure:

```
/
├── frontend/                    # Next.js Application
│   ├── app/                     # App Router pages
│   │   ├── (auth)/             # Public auth routes
│   │   ├── (app)/              # Protected routes
│   │   ├── api/auth/           # Better Auth routes
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/                 # Generic components
│   │   └── todo/               # Domain components
│   ├── lib/
│   │   ├── api.ts              # API client
│   │   └── auth.ts             # Better Auth config
│   ├── CLAUDE.md
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py             # FastAPI entry
│   │   ├── config.py           # Environment config
│   │   ├── db.py               # Database connection
│   │   ├── models.py           # SQLModel models
│   │   ├── schemas.py          # Pydantic schemas
│   │   ├── dependencies.py     # JWT verification
│   │   └── routes/
│   │       └── tasks.py        # Task endpoints
│   ├── CLAUDE.md
│   └── requirements.txt
│
├── specs/                       # Specifications (read-only)
├── .specify/                    # Spec-Kit Plus
├── CLAUDE.md                    # Root instructions
├── .env.example                 # Environment template
└── .gitignore
```

### 1.2 Spec-Kit Folder Confirmation

Verify existing Spec-Kit structure:
- `.specify/memory/constitution.md` - Constitution exists
- `specs/` directory with all specification files
- `history/prompts/` for PHR records

### 1.3 Frontend Responsibilities

| Responsibility | Implementation |
|----------------|----------------|
| UI Rendering | Next.js App Router with React Server/Client Components |
| Routing | App Router file-based routing |
| Authentication State | Better Auth session management |
| JWT Attachment | API client automatically attaches token |
| Form Validation | Client-side + Server validation |
| State Management | React useState/useReducer (no external state library) |
| Styling | Tailwind CSS utility classes |

### 1.4 Backend Responsibilities

| Responsibility | Implementation |
|----------------|----------------|
| API Endpoints | FastAPI router with typed responses |
| JWT Verification | Custom dependency with jose library |
| User Isolation | Middleware + query filtering |
| Data Validation | Pydantic schemas |
| Database Access | SQLModel ORM |
| Error Handling | HTTPException with standard format |
| CORS | FastAPI CORS middleware |

### 1.5 JWT Trust Boundaries

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           TRUST BOUNDARY                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Frontend (Trusted for token storage)                                   │
│  ├── Better Auth issues JWT on successful auth                         │
│  ├── Token stored in HTTP-only secure cookie                           │
│  └── Token attached to every API request                               │
│                                                                         │
│  ═══════════════════════ NETWORK ═══════════════════════════════════   │
│                                                                         │
│  Backend (Trusted for verification)                                     │
│  ├── Extracts token from Authorization header                          │
│  ├── Verifies signature with BETTER_AUTH_SECRET                        │
│  ├── Validates expiration                                              │
│  ├── Extracts user_id from sub claim                                   │
│  └── Compares URL user_id with JWT user_id                             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

SHARED SECRET: BETTER_AUTH_SECRET
- Same value in frontend and backend .env files
- Minimum 32 characters
- Never committed to version control
```

---

## 2. Database & Persistence Plan

### 2.1 Neon PostgreSQL Setup Approach

**Step 1: Neon Account and Database**
1. Create Neon account (if not exists)
2. Create new project for Hackathon Todo
3. Copy connection string to DATABASE_URL

**Step 2: Connection Configuration**
- Use pooled connection string for serverless
- Enable SSL (sslmode=require)
- Configure SQLModel with async support

### 2.2 SQLModel Integration Strategy

**Database Session Management:**
1. Create database engine from DATABASE_URL
2. Create SessionLocal factory
3. Use dependency injection for request-scoped sessions
4. Ensure proper session cleanup on request completion

**Model Definition Order:**
1. Base SQLModel configuration
2. Task model with all fields and constraints

### 2.3 Table Creation Order

| Order | Table | Creator | Notes |
|-------|-------|---------|-------|
| 1 | users | Better Auth | Auto-created on first auth |
| 2 | tasks | Application | Created on startup via SQLModel |

**Tasks Table Creation:**
- Check if table exists before creation
- Create indexes after table creation
- Add check constraints for validation

### 2.4 Relationship Enforcement

**Foreign Key Setup:**
- tasks.user_id → users.id
- ON DELETE CASCADE (delete tasks when user deleted)
- Enforce at database level AND application level

### 2.5 Migration and Initialization Strategy

**Phase II Approach (Simplified):**
1. SQLModel create_all() on application startup
2. No formal migration tool (out of scope)
3. Indexes created via raw SQL after table creation

**Initialization Sequence:**
```
1. Application starts
2. Database engine created
3. create_all() runs (creates tasks table if not exists)
4. Create indexes if not exist
5. Application ready to serve requests
```

### 2.6 Data Ownership Enforcement Strategy

**Triple-Layer Enforcement:**

| Layer | Mechanism |
|-------|-----------|
| 1. API | URL user_id must match JWT user_id |
| 2. Query | Every query includes WHERE user_id = :jwt_user_id |
| 3. Database | Foreign key ensures user exists |

**Query Pattern:**
```
NEVER: SELECT * FROM tasks WHERE id = :task_id
ALWAYS: SELECT * FROM tasks WHERE id = :task_id AND user_id = :jwt_user_id
```

---

## 3. Authentication & Security Plan

### 3.1 Better Auth Configuration Steps (Frontend)

**Step 1: Install Better Auth**
- Add better-auth package to frontend
- Configure in lib/auth.ts

**Step 2: Configure Providers**
- Email/password provider only (Phase II)
- No social providers

**Step 3: Configure Database Adapter**
- Use PostgreSQL adapter
- Point to same Neon database

**Step 4: Configure JWT Plugin**
- Enable JWT generation
- Set expiration to 24 hours
- Configure claims (sub, email, iat, exp)

**Step 5: Create Auth API Route**
- Create catch-all route at app/api/auth/[...all]/route.ts
- Export Better Auth handler

### 3.2 JWT Issuance Strategy

**Token Issuance Flow:**
1. User submits credentials to /api/auth/signin
2. Better Auth verifies credentials
3. Better Auth generates JWT with:
   - sub: user.id
   - email: user.email
   - iat: current timestamp
   - exp: current + 24 hours
4. JWT signed with BETTER_AUTH_SECRET
5. Token stored in HTTP-only cookie

### 3.3 Shared Secret Handling

**Environment Variable Setup:**

Frontend (.env.local):
```
BETTER_AUTH_SECRET=<32+ character secret>
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Backend (.env):
```
BETTER_AUTH_SECRET=<same secret as frontend>
DATABASE_URL=postgresql://...
```

**Secret Generation:**
- Use cryptographically secure random generator
- Minimum 32 characters
- Different secrets for dev/staging/prod

### 3.4 JWT Validation Workflow in FastAPI

**Dependency Implementation:**

```
get_current_user(request) →
  1. Extract Authorization header
  2. Parse "Bearer <token>"
  3. Decode JWT with BETTER_AUTH_SECRET
  4. Verify signature (raises 401 if invalid)
  5. Check expiration (raises 401 if expired)
  6. Extract user_id from "sub" claim
  7. Return user_id
```

**Route-Level Usage:**
```
@router.get("/{user_id}/tasks")
async def list_tasks(user_id: str, current_user: str = Depends(get_current_user)):
    if user_id != current_user:
        raise HTTPException(403, "Access forbidden")
    # proceed with query
```

### 3.5 User Identity Extraction

**JWT Claim Extraction:**
- Primary: `sub` claim contains user_id
- Secondary: `email` claim for display purposes
- Fallback: Return 401 if `sub` missing

### 3.6 Authorization Enforcement at Route Level

**Every Route MUST:**
1. Receive user_id from URL path
2. Get current_user from JWT (via dependency)
3. Compare: if user_id != current_user → 403
4. Include user_id in all database queries

**Enforcement Checklist:**
- [ ] GET /api/{user_id}/tasks - List (filter by user_id)
- [ ] POST /api/{user_id}/tasks - Create (set user_id from JWT)
- [ ] GET /api/{user_id}/tasks/{id} - Read (filter by user_id)
- [ ] PUT /api/{user_id}/tasks/{id} - Update (filter by user_id)
- [ ] DELETE /api/{user_id}/tasks/{id} - Delete (filter by user_id)
- [ ] PATCH /api/{user_id}/tasks/{id}/complete - Toggle (filter by user_id)

### 3.7 Failure and Edge-Case Handling

| Scenario | Detection | Response |
|----------|-----------|----------|
| No Authorization header | Header missing | 401 "Not authenticated" |
| Malformed header | Doesn't match "Bearer <token>" | 401 "Invalid authorization header" |
| Invalid signature | jose verification fails | 401 "Invalid token" |
| Expired token | exp < current time | 401 "Token expired" |
| Missing sub claim | sub not in payload | 401 "Invalid token" |
| User ID mismatch | URL user_id != JWT sub | 403 "Access forbidden" |
| Task not found | Query returns None | 404 "Task not found" |

---

## 4. Backend API Implementation Plan

### 4.1 FastAPI Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app instance, CORS, startup
│   ├── config.py            # Settings from environment
│   ├── db.py                # Engine, SessionLocal, get_db
│   ├── models.py            # Task SQLModel
│   ├── schemas.py           # TaskCreate, TaskUpdate, TaskResponse
│   ├── dependencies.py      # get_current_user (JWT verification)
│   └── routes/
│       ├── __init__.py
│       └── tasks.py         # All task endpoints
├── requirements.txt
└── CLAUDE.md
```

### 4.2 Middleware and Dependency Planning

**Middleware Stack (order matters):**
1. CORS Middleware (first)
2. Request logging (optional)

**Dependencies:**
| Dependency | Purpose | Scope |
|------------|---------|-------|
| get_db | Database session | Request |
| get_current_user | JWT verification | Request |

### 4.3 REST Endpoint Implementation Order

| Phase | Endpoint | Priority |
|-------|----------|----------|
| 1 | Health check (/) | Setup validation |
| 2 | GET /{user_id}/tasks | Core functionality |
| 3 | POST /{user_id}/tasks | Core functionality |
| 4 | GET /{user_id}/tasks/{id} | Core functionality |
| 5 | PUT /{user_id}/tasks/{id} | Core functionality |
| 6 | DELETE /{user_id}/tasks/{id} | Core functionality |
| 7 | PATCH /{user_id}/tasks/{id}/complete | Core functionality |

### 4.4 Request/Response Validation Strategy

**Request Validation:**
- Pydantic schemas for request bodies
- Field validators for length constraints
- Type coercion handled by Pydantic

**Response Validation:**
- SQLModel response mode for automatic serialization
- ISO 8601 timestamp formatting
- Nullable fields properly typed

**Schemas Required:**
- TaskCreate: title (required), description (optional)
- TaskUpdate: title (required), description (optional)
- TaskResponse: all fields including id, timestamps
- TaskListResponse: tasks array + count

### 4.5 Error Handling Approach

**Standard Error Format:**
```json
{"detail": "Error message"}
```

**Error Mapping:**
| Exception | Status | Message |
|-----------|--------|---------|
| ValidationError | 422 | Field-specific errors |
| HTTPException(401) | 401 | Auth errors |
| HTTPException(403) | 403 | Authorization errors |
| HTTPException(404) | 404 | Not found |
| Generic Exception | 500 | "An unexpected error occurred" |

### 4.6 Task Ownership Enforcement Logic

**Create Task:**
```
user_id = get from JWT (ignore any user_id in body)
task.user_id = user_id
```

**Read/Update/Delete Task:**
```
task = SELECT * FROM tasks WHERE id = :task_id AND user_id = :jwt_user_id
if task is None:
    raise 404 (prevents user enumeration)
```

### 4.7 Stateless Request Handling

**Rules:**
- No session storage in backend
- No user cache
- Every request verified independently
- Database is single source of truth
- No sticky routing required

---

## 5. Frontend Application Plan

### 5.1 Next.js App Router Structure

```
app/
├── (auth)/                    # Route group - no shared layout
│   ├── signin/
│   │   └── page.tsx          # Sign in form
│   └── signup/
│       └── page.tsx          # Sign up form
│
├── (app)/                     # Route group - protected layout
│   ├── layout.tsx            # Auth check + navigation
│   └── tasks/
│       └── page.tsx          # Main tasks page
│
├── api/
│   └── auth/
│       └── [...all]/
│           └── route.ts      # Better Auth handler
│
├── layout.tsx                 # Root layout (providers)
├── page.tsx                   # Landing page
├── loading.tsx               # Global loading
├── error.tsx                 # Global error boundary
└── not-found.tsx            # 404 page
```

### 5.2 Server vs Client Component Strategy

| Component Type | Use Case | Directive |
|----------------|----------|-----------|
| Server Component | Static content, initial data | Default (no directive) |
| Client Component | Interactivity, hooks, forms | 'use client' |

**Component Classification:**
- Landing page: Server Component
- Auth forms: Client Component (form state)
- Tasks page: Client Component (CRUD operations)
- Task list: Client Component (optimistic updates)
- Navigation: Client Component (auth state)
- UI components: Client Component (interactivity)

### 5.3 Authentication-Aware Routing

**Route Protection Implementation:**
1. Create auth middleware using Better Auth
2. Wrap protected routes in auth check
3. Redirect unauthenticated users to /signin
4. Preserve original URL for post-signin redirect

**Protected Routes:**
- /tasks and all nested routes

**Public Routes:**
- / (landing)
- /signin
- /signup

**Redirect Logic:**
- Authenticated user visits /signin → redirect to /tasks
- Authenticated user visits /signup → redirect to /tasks
- Unauthenticated user visits /tasks → redirect to /signin

### 5.4 API Client Abstraction

**lib/api.ts Structure:**
```
Configuration:
- Base URL from NEXT_PUBLIC_API_URL
- Default headers (Content-Type: application/json)

Functions:
- getToken(): Get JWT from Better Auth session
- apiClient(endpoint, options): Wrapper with JWT attachment
- tasks.list(userId): GET /api/{userId}/tasks
- tasks.create(userId, data): POST /api/{userId}/tasks
- tasks.get(userId, taskId): GET /api/{userId}/tasks/{taskId}
- tasks.update(userId, taskId, data): PUT /api/{userId}/tasks/{taskId}
- tasks.delete(userId, taskId): DELETE /api/{userId}/tasks/{taskId}
- tasks.toggleComplete(userId, taskId): PATCH /api/{userId}/tasks/{taskId}/complete
```

### 5.5 State and Data Fetching Strategy

**Data Fetching:**
- Use React hooks (useEffect + useState)
- Fetch tasks on page load
- Refetch after mutations
- No SWR/React Query (keep simple for Phase II)

**State Management:**
- Local component state for form inputs
- Lifted state for task list
- No global state library needed

**Loading States:**
- isLoading boolean per operation
- Skeleton components during fetch
- Spinner on buttons during submit

### 5.6 Error and Loading State Handling

**Loading States:**
| Context | Display |
|---------|---------|
| Page load | Skeleton cards |
| Form submit | Button spinner + disabled inputs |
| Task toggle | Optimistic update (no spinner) |
| Delete | Modal disabled during request |

**Error Handling:**
| Error | Display |
|-------|---------|
| Network error | Toast notification |
| 401 | Redirect to /signin |
| 403 | Toast "Access forbidden" |
| 404 | Toast "Not found" |
| 400/422 | Inline form errors |
| 500 | Toast "Something went wrong" |

---

## 6. Premium UI/UX Execution Plan

### 6.1 Design System Application Strategy

**Tailwind Configuration:**
1. Configure custom colors per design spec
2. Set up font family (Inter)
3. Configure spacing scale
4. Add custom shadows

**CSS Organization:**
- globals.css: Tailwind directives + base styles
- Component-level: Tailwind utilities only
- No CSS modules needed

### 6.2 Typography and Color System Rollout

**Typography Implementation:**
| Element | Class |
|---------|-------|
| H1 | text-3xl font-semibold text-gray-800 |
| H2 | text-2xl font-semibold text-gray-800 |
| H3 | text-lg font-semibold text-gray-800 |
| Body | text-base text-gray-600 |
| Small | text-sm text-gray-500 |

**Color Implementation:**
| Usage | Class |
|-------|-------|
| Primary | bg-blue-600 hover:bg-blue-700 |
| Success | text-green-600 bg-green-100 |
| Error | text-red-600 bg-red-100 |
| Border | border-gray-200 |
| Background | bg-gray-50 (page) bg-white (cards) |

### 6.3 Reusable Component Build Order

**Phase 1: Foundation**
1. Button (variants: primary, secondary, danger, ghost)
2. Input (with label, error state)
3. Card (container component)

**Phase 2: Forms**
4. Textarea (with character count)
5. Checkbox (styled)
6. Spinner (loading indicator)

**Phase 3: Feedback**
7. Toast (notification system)
8. Modal (dialog overlay)
9. Skeleton (loading placeholder)

**Phase 4: Domain**
10. TaskCard (task display)
11. TaskList (container with empty state)
12. TaskForm (create/edit form)
13. EmptyState (no tasks message)
14. UserMenu (dropdown)
15. Navigation (header)

### 6.4 Task-Focused UX Flow Planning

**Create Task Flow:**
```
1. Click "Add Task" button
2. Modal opens with empty form
3. User types title (required)
4. User optionally types description
5. Click "Create"
6. Modal closes
7. New task appears in list (optimistic)
8. Success toast shown
```

**Edit Task Flow:**
```
1. Click menu icon on task card
2. Select "Edit"
3. Modal opens with pre-filled form
4. User modifies fields
5. Click "Save"
6. Modal closes
7. Task updates in list (optimistic)
8. Success toast shown
```

**Delete Task Flow:**
```
1. Click menu icon on task card
2. Select "Delete"
3. Confirmation modal appears
4. Click "Delete" to confirm
5. Modal closes
6. Task removed from list
7. Success toast shown
```

**Toggle Complete Flow:**
```
1. Click checkbox on task card
2. Task visually updates immediately (optimistic)
3. API call in background
4. If fails, revert visual + show error toast
```

### 6.5 Accessibility and Responsiveness Checks

**Accessibility Requirements:**
- [ ] All inputs have associated labels
- [ ] Focus visible on all interactive elements
- [ ] Escape closes modals
- [ ] Tab order is logical
- [ ] Color contrast meets WCAG AA
- [ ] Error messages linked to inputs

**Responsive Breakpoints:**
| Breakpoint | Changes |
|------------|---------|
| Mobile (<640px) | Full-width cards, stacked layout |
| Tablet (640-1024px) | Centered content, wider cards |
| Desktop (>1024px) | Max-width container, optimal reading width |

### 6.6 Visual Consistency Enforcement

**Component Standards:**
- All buttons use same size variants
- All inputs have consistent padding
- All cards have same border-radius and shadow
- Consistent spacing using Tailwind scale

**Interaction Standards:**
- Hover states on all clickable elements
- Focus rings using ring-2 ring-blue-500
- Transitions on color/shadow changes (150ms)

### 6.7 UX Validation Checkpoints

| Checkpoint | Validation |
|------------|------------|
| After component creation | Visual matches design spec |
| After page completion | Flow matches user story |
| After integration | Transitions feel smooth |
| Before final review | Cross-browser testing |

---

## 7. Integration Plan (Frontend ↔ Backend)

### 7.1 JWT Attachment to API Requests

**Implementation in lib/api.ts:**
1. Import Better Auth client
2. Get session/token from Better Auth
3. Extract JWT from session
4. Add Authorization header to all requests

**Header Format:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 7.2 API Contract Validation

**Before Integration:**
1. Backend returns expected response format
2. Status codes match specification
3. Error format is {"detail": "..."}
4. Timestamps are ISO 8601

**Integration Testing:**
1. Create task → verify response matches TaskResponse
2. List tasks → verify array + count format
3. Error cases → verify error format

### 7.3 Error Propagation to UI

**Error Flow:**
```
1. API returns error (4xx/5xx)
2. API client catches error
3. Parse error response
4. Throw typed error
5. Component catches error
6. Display appropriate UI feedback
```

**Error Type Handling:**
| Status | UI Action |
|--------|-----------|
| 401 | Redirect to /signin |
| 403 | Toast "Access forbidden" |
| 404 | Toast "Not found" |
| 400/422 | Show inline errors |
| 500 | Toast "Something went wrong" |

### 7.4 Auth-Protected Route Behavior

**Protection Flow:**
1. User navigates to /tasks
2. Layout checks auth status
3. If not authenticated → redirect to /signin
4. If authenticated → render page
5. Page fetches tasks using user_id from session

### 7.5 User Session Lifecycle Handling

**Session States:**
| State | Detection | Action |
|-------|-----------|--------|
| No session | No token/session | Show login |
| Valid session | Token present + not expired | Allow access |
| Expired session | Token expired | Refresh or redirect |
| Sign out | User clicks sign out | Clear session, redirect |

**Session Refresh:**
- Better Auth handles automatic refresh
- If refresh fails, redirect to /signin

---

## 8. Validation & Quality Assurance Plan

### 8.1 Spec-to-Implementation Validation Steps

| Spec | Validation |
|------|------------|
| overview.md | All user capabilities implemented |
| architecture.md | Three-tier structure maintained |
| task-crud.md | All 6 user stories functional |
| authentication.md | All 5 auth user stories functional |
| rest-endpoints.md | All 6 endpoints return correct format |
| schema.md | Tables created with constraints |
| components.md | All components rendered correctly |
| pages.md | All pages accessible at correct routes |
| design-system.md | Visual styles match specification |
| security.md | All security measures implemented |
| errors.md | All error cases handled |

### 8.2 Security Validation (Auth, Isolation)

**Authentication Tests:**
- [ ] No token → 401
- [ ] Invalid token → 401
- [ ] Expired token → 401
- [ ] Valid token → success

**User Isolation Tests:**
- [ ] User A cannot list User B's tasks
- [ ] User A cannot read User B's task
- [ ] User A cannot update User B's task
- [ ] User A cannot delete User B's task
- [ ] URL user_id mismatch → 403

### 8.3 Functional Validation (CRUD Correctness)

**Create Task:**
- [ ] Creates task with provided title
- [ ] Description is optional
- [ ] user_id set from JWT (not request)
- [ ] completed defaults to false
- [ ] Timestamps set correctly

**Read Tasks:**
- [ ] Returns only authenticated user's tasks
- [ ] Includes all task fields
- [ ] Returns count

**Update Task:**
- [ ] Updates title and description
- [ ] Does not change completed
- [ ] Updates updated_at timestamp
- [ ] Returns 404 for non-existent task

**Delete Task:**
- [ ] Removes task from database
- [ ] Returns 204 No Content
- [ ] Task no longer appears in list

**Toggle Complete:**
- [ ] Toggles completed status
- [ ] Updates updated_at timestamp
- [ ] Returns updated task

### 8.4 UI/UX Quality Validation

**Visual Quality:**
- [ ] Typography matches design spec
- [ ] Colors match design spec
- [ ] Spacing is consistent
- [ ] Cards have correct shadows/borders

**Interaction Quality:**
- [ ] Buttons have hover states
- [ ] Focus rings visible
- [ ] Transitions are smooth
- [ ] Loading states prevent double-submit

**Responsive Quality:**
- [ ] Mobile layout works
- [ ] Tablet layout works
- [ ] Desktop layout works

### 8.5 Edge-Case Handling Validation

**Input Edge Cases:**
- [ ] Empty title rejected
- [ ] Title at max length (200) accepted
- [ ] Title over max length rejected
- [ ] Description at max length (1000) accepted
- [ ] Description over max length rejected

**State Edge Cases:**
- [ ] Empty task list shows empty state
- [ ] Network error shows toast
- [ ] Rapid toggle doesn't break state

### 8.6 Hackathon Demo Readiness Checklist

**Core Functionality:**
- [ ] User can register
- [ ] User can sign in
- [ ] User can sign out
- [ ] User can create task
- [ ] User can view tasks
- [ ] User can edit task
- [ ] User can delete task
- [ ] User can complete/uncomplete task

**Security:**
- [ ] User A cannot see User B's tasks
- [ ] Unauthenticated access blocked

**Quality:**
- [ ] UI looks professional
- [ ] No visual bugs
- [ ] No console errors
- [ ] Performance acceptable

---

## 9. Risk & Mitigation Plan

### 9.1 Authentication Integration Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Better Auth config complexity | Medium | High | Follow official docs, test early |
| JWT format mismatch | Medium | High | Verify claims match expectations |
| Session refresh issues | Low | Medium | Test refresh flow explicitly |

### 9.2 JWT Mismatch Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Different secrets | High | Critical | Copy-paste exact value |
| Different algorithms | Low | Critical | Verify HS256 on both sides |
| Clock skew | Low | Low | Use generous expiration window |

### 9.3 UI Complexity Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Component scope creep | Medium | Medium | Stick to spec, no extras |
| Responsive issues | Medium | Low | Test on multiple sizes |
| Accessibility gaps | Medium | Low | Run accessibility audit |

### 9.4 Deployment Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Environment variable issues | High | High | Document all required vars |
| CORS misconfiguration | Medium | High | Test cross-origin early |
| Database connection issues | Low | High | Verify connection string format |

### 9.5 Mitigation Strategies Summary

1. **Test Early**: Verify auth flow before building features
2. **Verify Secrets**: Triple-check BETTER_AUTH_SECRET matches
3. **Incremental Testing**: Test each endpoint as built
4. **Document Everything**: Keep notes on configuration
5. **Stick to Spec**: No feature additions beyond specification

---

## 10. Decisions & Tradeoffs

### 10.1 JWT vs Session-Based Auth

**Decision**: JWT-based authentication

**Alternatives Considered:**
- Server-side sessions with cookies

**Reasoning:**
- Constitution mandates stateless architecture
- Better Auth supports JWT natively
- Simplifies backend (no session store)
- Aligns with modern API design

### 10.2 Monorepo vs Separate Repos

**Decision**: Monorepo

**Alternatives Considered:**
- Separate repositories for frontend/backend

**Reasoning:**
- Constitution mandates monorepo structure
- Simpler dependency management
- Easier to maintain consistency
- Single source of truth for specs

### 10.3 SQLModel ORM Choice

**Decision**: SQLModel for database operations

**Alternatives Considered:**
- Raw SQL
- SQLAlchemy directly
- Other ORMs (Tortoise, Peewee)

**Reasoning:**
- Constitution mandates SQLModel
- Native Pydantic integration
- Type-safe queries
- FastAPI ecosystem alignment

### 10.4 Server Components vs Client Components

**Decision**: Prefer Client Components for interactive features

**Alternatives Considered:**
- Server Components with server actions
- Full client-side rendering

**Reasoning:**
- Forms require client-side state
- Optimistic updates require client-side control
- Better Auth hooks require client context
- Simpler mental model for Phase II scope

### 10.5 Simplicity vs Extensibility

**Decision**: Favor simplicity

**Alternatives Considered:**
- Adding abstractions for future extensibility
- Implementing plugin architecture

**Reasoning:**
- Phase II has defined scope
- No manual coding means no custom patterns
- YAGNI principle applies
- Phase III can extend as needed

---

## Implementation Phases Summary

| Phase | Focus | Dependencies |
|-------|-------|--------------|
| 1 | Project Setup | None |
| 2 | Database | Phase 1 |
| 3 | Backend Auth | Phase 2 |
| 4 | Backend API | Phase 3 |
| 5 | Frontend Auth | Phase 4 |
| 6 | UI Components | Phase 1 |
| 7 | Pages & Features | Phase 5, 6 |
| 8 | Integration | Phase 7 |
| 9 | Polish & QA | Phase 8 |

---

## Compliance

This plan complies with:
- Phase II Constitution v1.0.0
- All Phase II Specification documents
- Spec-Driven Development Principle (I)
- Zero Manual Coding Principle (II)
- Authentication-First Security Principle (III)
- User Data Isolation Principle (IV) - NON-NEGOTIABLE
- Technology Stack Compliance Principle (VIII)
