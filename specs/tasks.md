# Tasks: Hackathon Todo Phase II

**Input**: Design documents from `/specs/`
**Prerequisites**: plan.md, overview.md, architecture.md, features/*.md, api/*.md, database/*.md, ui/*.md, security.md, errors.md

**Tests**: Tests are OPTIONAL for Phase II - not explicitly requested in specifications

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., AUTH1, TASK1)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/app/`
- **Frontend**: `frontend/app/`, `frontend/components/`, `frontend/lib/`
- Paths follow monorepo structure from plan.md

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Create monorepo structure, install dependencies, configure tooling

- [X] T001 Create monorepo root structure with frontend/ and backend/ directories
- [X] T002 [P] Initialize Next.js 16+ project in frontend/ with App Router and TypeScript
- [X] T003 [P] Initialize Python FastAPI project in backend/ with virtual environment
- [X] T004 [P] Configure Tailwind CSS in frontend/tailwind.config.ts
- [X] T005 [P] Create backend/requirements.txt with FastAPI, SQLModel, python-jose, uvicorn dependencies
- [X] T006 [P] Create frontend/package.json with better-auth dependency
- [X] T007 Create .env.example at repository root with all required environment variables
- [X] T008 [P] Create .gitignore with .env files, node_modules, __pycache__, .venv exclusions
- [X] T009 [P] Create CLAUDE.md at repository root with agent instructions
- [X] T010 [P] Create frontend/CLAUDE.md with frontend-specific agent instructions
- [X] T011 [P] Create backend/CLAUDE.md with backend-specific agent instructions

**Checkpoint**: Project structure ready - can proceed to foundational phase

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Backend Foundation

- [X] T012 Create backend/app/__init__.py
- [X] T013 Create backend/app/config.py with Settings class loading from environment variables
- [X] T014 Create backend/app/db.py with SQLModel engine, SessionLocal, and get_db dependency
- [X] T015 Create backend/app/models.py with Task SQLModel definition per specs/database/schema.md
- [X] T016 Create backend/app/schemas.py with TaskCreate, TaskUpdate, TaskResponse Pydantic schemas
- [X] T017 Create backend/app/dependencies.py with get_current_user JWT verification dependency
- [X] T018 Create backend/app/routes/__init__.py
- [X] T019 Create backend/app/main.py with FastAPI app, CORS middleware, and startup event

### Frontend Foundation

- [X] T020 Create frontend/lib/auth.ts with Better Auth client configuration
- [X] T021 Create frontend/app/api/auth/[...all]/route.ts with Better Auth handler
- [X] T022 Create frontend/lib/api.ts with API client and JWT token attachment
- [X] T023 Create frontend/app/layout.tsx with HTML setup, font loading, and providers
- [X] T024 Create frontend/app/globals.css with Tailwind directives and base styles

### UI Component Foundation

- [X] T025 [P] Create frontend/components/ui/Button.tsx with variants per specs/ui/components.md
- [X] T026 [P] Create frontend/components/ui/Input.tsx with label and error state
- [X] T027 [P] Create frontend/components/ui/Card.tsx container component
- [X] T028 [P] Create frontend/components/ui/Spinner.tsx loading indicator
- [X] T029 [P] Create frontend/components/ui/Textarea.tsx with character count
- [X] T030 [P] Create frontend/components/ui/Checkbox.tsx styled checkbox
- [X] T031 [P] Create frontend/components/ui/Modal.tsx dialog overlay
- [X] T032 [P] Create frontend/components/ui/Toast.tsx notification component
- [X] T033 [P] Create frontend/components/ui/Skeleton.tsx loading placeholder

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: Authentication User Stories (Priority: P1) 🎯 MVP

**Goal**: Enable users to register, sign in, sign out, and maintain sessions

**Independent Test**: User can complete full auth flow: register → sign out → sign in → access protected route

### US-AUTH-1: User Registration

- [X] T034 [AUTH1] Create frontend/app/(auth)/signup/page.tsx with registration form per specs/ui/pages.md
- [X] T035 [AUTH1] Implement form validation for name, email, password per specs/features/authentication.md
- [X] T036 [AUTH1] Connect signup form to Better Auth signUp method
- [X] T037 [AUTH1] Handle registration errors and display appropriate messages
- [X] T038 [AUTH1] Implement redirect to /tasks on successful registration

### US-AUTH-2: User Sign In

- [X] T039 [AUTH2] Create frontend/app/(auth)/signin/page.tsx with sign in form per specs/ui/pages.md
- [X] T040 [AUTH2] Implement form validation for email and password
- [X] T041 [AUTH2] Connect signin form to Better Auth signIn method
- [X] T042 [AUTH2] Handle sign in errors with generic error message (security)
- [X] T043 [AUTH2] Implement redirect to /tasks or intended URL on successful sign in

### US-AUTH-3: User Sign Out

- [X] T044 [AUTH3] Create frontend/components/todo/UserMenu.tsx with user info and sign out button
- [X] T045 [AUTH3] Implement sign out functionality using Better Auth signOut method
- [X] T046 [AUTH3] Implement redirect to / after sign out

### US-AUTH-4 & US-AUTH-5: Session & Route Protection

- [X] T047 [AUTH4] Create frontend/app/(app)/layout.tsx with auth check middleware
- [X] T048 [AUTH4] Implement redirect to /signin for unauthenticated users
- [X] T049 [AUTH4] Preserve original URL for post-signin redirect
- [X] T050 [AUTH5] Implement authenticated user redirect from /signin and /signup to /tasks

**Checkpoint**: Authentication fully functional - users can register, sign in, sign out, and access protected routes

---

## Phase 4: Backend API User Stories (Priority: P1) 🎯 MVP

**Goal**: Implement all task CRUD API endpoints with JWT authentication

**Independent Test**: All endpoints return correct responses when tested with valid JWT via curl/Postman

### Backend Task Routes

- [X] T051 Create backend/app/routes/tasks.py with APIRouter for task endpoints
- [X] T052 [TASK-API] Implement GET /api/{user_id}/tasks endpoint with user isolation
- [X] T053 [TASK-API] Implement POST /api/{user_id}/tasks endpoint with validation
- [X] T054 [TASK-API] Implement GET /api/{user_id}/tasks/{task_id} endpoint
- [X] T055 [TASK-API] Implement PUT /api/{user_id}/tasks/{task_id} endpoint
- [X] T056 [TASK-API] Implement DELETE /api/{user_id}/tasks/{task_id} endpoint
- [X] T057 [TASK-API] Implement PATCH /api/{user_id}/tasks/{task_id}/complete endpoint
- [X] T058 [TASK-API] Add user_id verification (URL vs JWT) to all endpoints
- [X] T059 [TASK-API] Register task router in backend/app/main.py

**Checkpoint**: Backend API fully functional - all endpoints work with proper authentication

---

## Phase 5: Task Management Frontend (Priority: P1) 🎯 MVP

**Goal**: Implement task list viewing and creation UI

**Independent Test**: Authenticated user can view their task list and create new tasks

### US-TASK-1: View All Tasks

- [X] T060 [TASK1] Create frontend/components/todo/TaskCard.tsx per specs/ui/components.md
- [X] T061 [TASK1] Create frontend/components/todo/TaskList.tsx container with empty state
- [X] T062 [TASK1] Create frontend/components/todo/EmptyState.tsx for no tasks message
- [X] T063 [TASK1] Create frontend/app/(app)/tasks/page.tsx with task list display
- [X] T064 [TASK1] Implement task fetching on page load using lib/api.ts
- [X] T065 [TASK1] Add loading skeleton state while fetching tasks
- [X] T066 [TASK1] Style completed tasks with visual distinction (muted, strikethrough)

### US-TASK-2: Create New Task

- [X] T067 [TASK2] Create frontend/components/todo/TaskForm.tsx with title and description fields
- [X] T068 [TASK2] Implement real-time form validation for title (1-200 chars) and description (max 1000)
- [X] T069 [TASK2] Add modal trigger button "Add Task" to tasks page header
- [X] T070 [TASK2] Connect TaskForm to API client POST endpoint
- [X] T071 [TASK2] Implement optimistic UI update when task is created
- [X] T072 [TASK2] Show success toast on task creation

**Checkpoint**: Users can view their tasks and create new ones

---

## Phase 6: Task CRUD Completion (Priority: P1)

**Goal**: Complete all remaining task management features

**Independent Test**: User can perform all CRUD operations on their tasks

### US-TASK-4: Edit Task

- [X] T073 [TASK4] Add edit mode to TaskForm component (pre-filled values)
- [X] T074 [TASK4] Add "Edit" option to TaskCard menu
- [X] T075 [TASK4] Connect edit form to API client PUT endpoint
- [X] T076 [TASK4] Implement optimistic UI update on edit
- [X] T077 [TASK4] Show success toast on task update

### US-TASK-5: Toggle Task Completion

- [X] T078 [TASK5] Add checkbox click handler to TaskCard component
- [X] T079 [TASK5] Connect checkbox to API client PATCH complete endpoint
- [X] T080 [TASK5] Implement optimistic toggle with rollback on failure
- [X] T081 [TASK5] Show error toast if toggle fails

### US-TASK-6: Delete Task

- [X] T082 [TASK6] Create frontend/components/todo/DeleteConfirmModal.tsx confirmation dialog
- [X] T083 [TASK6] Add "Delete" option to TaskCard menu
- [X] T084 [TASK6] Connect delete confirmation to API client DELETE endpoint
- [X] T085 [TASK6] Remove task from list after successful deletion
- [X] T086 [TASK6] Show success toast on task deletion

### US-TASK-3: View Task Details (Priority: P2)

- [X] T087 [TASK3] Create frontend/components/todo/TaskDetail.tsx modal/panel
- [X] T088 [TASK3] Display all task fields in detail view
- [X] T089 [TASK3] Add edit and delete actions from detail view

**Checkpoint**: All task CRUD operations fully functional

---

## Phase 7: Landing Page & Navigation (Priority: P1)

**Goal**: Complete public pages and navigation

**Independent Test**: Unauthenticated user can view landing page and navigate to auth pages

- [X] T090 Create frontend/app/page.tsx landing page per specs/ui/pages.md
- [X] T091 [P] Create frontend/components/todo/Navigation.tsx header component
- [X] T092 Add hero section with headline, subheadline, and CTA to landing page
- [X] T093 Add feature highlights section to landing page
- [X] T094 Add footer to landing page
- [X] T095 Implement Navigation component with auth-aware rendering (SignIn/SignUp vs UserMenu)
- [X] T096 Create frontend/app/not-found.tsx 404 page
- [X] T097 Create frontend/app/error.tsx global error boundary
- [X] T098 Create frontend/app/loading.tsx global loading state

**Checkpoint**: All pages accessible with proper navigation

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements across all features

### Error Handling & UX Polish

- [X] T099 Implement toast notification provider in frontend/app/layout.tsx
- [X] T100 Add proper error handling for all API calls with user-friendly messages
- [X] T101 Implement 401 error handling with redirect to signin
- [X] T102 Add loading states to all buttons during API operations
- [X] T103 Disable form inputs during submission to prevent double-submit

### Accessibility & Responsiveness

- [X] T104 Add proper aria labels to all interactive elements
- [X] T105 Ensure keyboard navigation works for all components
- [X] T106 Test and fix responsive layout for mobile (< 640px)
- [X] T107 Test and fix responsive layout for tablet (640-1024px)
- [X] T108 Verify focus rings visible on all interactive elements

### Final Validation

- [X] T109 Verify all user stories from specs/features/task-crud.md are implemented
- [X] T110 Verify all user stories from specs/features/authentication.md are implemented
- [X] T111 Verify user isolation: User A cannot see User B's tasks
- [X] T112 Verify API responses match specs/api/rest-endpoints.md format
- [X] T113 Verify UI matches specs/ui/design-system.md visual standards
- [X] T114 Test complete user journey: register → create task → edit → complete → delete → sign out

**Checkpoint**: Application ready for demo

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
    │
    ▼
Phase 2 (Foundational) ──── BLOCKS ALL USER STORIES
    │
    ├──────────────────────────────────────┐
    ▼                                      ▼
Phase 3 (Auth)                    Phase 4 (Backend API)
    │                                      │
    └──────────────┬───────────────────────┘
                   │
                   ▼
            Phase 5 (Task Frontend MVP)
                   │
                   ▼
            Phase 6 (Task CRUD Complete)
                   │
                   ▼
            Phase 7 (Landing & Nav)
                   │
                   ▼
            Phase 8 (Polish)
```

### User Story Dependencies

- **AUTH1-5 (Phase 3)**: Depends on Foundational (Phase 2) - Frontend auth infrastructure
- **TASK-API (Phase 4)**: Depends on Foundational (Phase 2) - Backend infrastructure
- **TASK1-2 (Phase 5)**: Depends on Phase 3 (Auth) AND Phase 4 (Backend API)
- **TASK3-6 (Phase 6)**: Depends on Phase 5 (Task MVP complete)
- **Landing/Nav (Phase 7)**: Depends on Phase 3 (Navigation needs UserMenu)
- **Polish (Phase 8)**: Depends on all feature phases complete

### Parallel Opportunities

**Within Phase 1:**
- T002, T003 can run in parallel (separate directories)
- T004-T011 can run in parallel (different files)

**Within Phase 2 - Backend:**
- T012-T19 are sequential (dependencies within backend)

**Within Phase 2 - Frontend:**
- T020-T024 are sequential (dependencies within frontend)

**Within Phase 2 - UI Components:**
- T025-T033 can ALL run in parallel (separate component files)

**After Phase 2:**
- Phase 3 (Auth Frontend) and Phase 4 (Backend API) can run in parallel

**Within Phase 6:**
- TASK4 (Edit), TASK5 (Toggle), TASK6 (Delete) can run in parallel

---

## Parallel Example: Phase 2 UI Components

```bash
# Launch all UI component tasks together (9 parallel tasks):
T025: Button.tsx
T026: Input.tsx
T027: Card.tsx
T028: Spinner.tsx
T029: Textarea.tsx
T030: Checkbox.tsx
T031: Modal.tsx
T032: Toast.tsx
T033: Skeleton.tsx
```

---

## Implementation Strategy

### MVP First (Phases 1-5)

1. Complete Phase 1: Setup (T001-T011)
2. Complete Phase 2: Foundational (T012-T033)
3. Complete Phase 3: Authentication (T034-T050)
4. Complete Phase 4: Backend API (T051-T059)
5. Complete Phase 5: Task MVP (T060-T072)
6. **STOP and VALIDATE**: Test core flow independently
7. Deploy/demo if ready (user can register, sign in, view tasks, create tasks)

### Full Implementation

1. Complete MVP (Phases 1-5)
2. Add Phase 6: Complete CRUD (T073-T089)
3. Add Phase 7: Landing & Navigation (T090-T098)
4. Add Phase 8: Polish (T099-T114)
5. Final demo readiness

### Task Counts

| Phase | Tasks | Parallelizable |
|-------|-------|----------------|
| Phase 1: Setup | 11 | 9 |
| Phase 2: Foundational | 22 | 9 (UI components) |
| Phase 3: Auth | 17 | 0 |
| Phase 4: Backend API | 9 | 0 |
| Phase 5: Task MVP | 13 | 0 |
| Phase 6: Task Complete | 17 | 3 (Edit/Toggle/Delete) |
| Phase 7: Landing & Nav | 9 | 1 |
| Phase 8: Polish | 16 | 0 |
| **TOTAL** | **114** | **22** |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All file paths are relative to repository root
- Tests are NOT included as they were not explicitly requested in specifications
