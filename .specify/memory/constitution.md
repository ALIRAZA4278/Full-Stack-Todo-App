<!--
================================================================================
SYNC IMPACT REPORT
================================================================================
Version Change: 0.0.0 → 1.0.0 (MAJOR - Initial ratification)

Modified Principles: N/A (Initial version)

Added Sections:
  - Core Principles (10 principles defined)
  - Technology Stack (Mandatory)
  - System Architecture Overview
  - Authentication & Security Constitution
  - API Constitution
  - Database Constitution
  - Monorepo & Spec-Kit Structure
  - Claude Code Behavior Rules
  - Quality & Validation Rules
  - Phase Scope Boundaries
  - Governance

Removed Sections: N/A (Initial version)

Templates Requiring Updates:
  ✅ plan-template.md - Constitution Check section compatible with new principles
  ✅ spec-template.md - Requirements section aligns with FR/NFR format
  ✅ tasks-template.md - Phase structure supports frontend/backend monorepo layout

Follow-up TODOs: None

================================================================================
-->

# Hackathon Todo – Phase II Constitution

**Phase Name**: Full-Stack Web Application
**Development Model**: Spec-Driven, Agentic Dev Stack
**Implementation Tooling**: Claude Code + Spec-Kit Plus

This constitution serves as the single source of truth for how the system is designed, built, secured, and evolved. All plans, tasks, implementations, and evaluations MUST comply with this document.

## Primary Objective

Phase II transforms the previously built in-memory console-based Todo application into a modern, production-style, multi-user full-stack web application with persistent storage and authentication.

The system MUST:
- Support multiple authenticated users
- Persist data in a real cloud database
- Enforce strict user-level data isolation
- Be implemented entirely through Claude Code driven by specs
- Be structured as a monorepo compatible with Spec-Kit Plus

**Manual coding by the developer is strictly prohibited.**

## Core Principles

### I. Spec-Driven Development (NON-NEGOTIABLE)

All development MUST follow the Agentic Development Stack workflow:

1. Write or update specifications
2. Generate a technical plan from specs
3. Break the plan into tasks
4. Delegate implementation to Claude Code
5. Review outputs and iterate by updating specs

**Rules:**
- Claude Code MUST NEVER implement features not explicitly defined in specs
- Specifications ALWAYS override assumptions
- If a requirement is not written in a spec, it MUST NOT be implemented

### II. Zero Manual Coding

The developer's role is specification authorship, not code authorship.

**Rules:**
- All code MUST be written by Claude Code
- Manual code edits are forbidden
- Developer interaction is limited to: writing specs, reviewing outputs, approving PRs
- Any code written outside Claude Code violates this constitution

### III. Authentication-First Security

Every API interaction MUST be authenticated and authorized.

**Rules:**
- All API endpoints MUST require a valid JWT token
- JWT MUST be sent in the Authorization header as: `Authorization: Bearer <token>`
- Requests without a token MUST return 401 Unauthorized
- Requests with invalid or expired tokens MUST be rejected
- Backend MUST decode JWT to extract user identity
- Both frontend and backend MUST use the same JWT signing secret via `BETTER_AUTH_SECRET`

### IV. User Data Isolation (NON-NEGOTIABLE)

No user may access another user's data under any circumstance.

**Rules:**
- Backend MUST extract `user_id` from the JWT token
- The `user_id` in the URL path MUST match the authenticated user's ID
- Any mismatch MUST result in a 403 Forbidden response
- Every database query MUST filter by authenticated `user_id`
- No cross-user data access is permitted

### V. RESTful API Consistency

The API MUST follow consistent REST conventions.

**Rules:**
- All routes MUST be prefixed with `/api/`
- Every request MUST be authenticated
- Every response MUST only include tasks owned by the authenticated user
- Task ownership MUST be validated on every operation
- HTTP methods: GET (read), POST (create), PUT (full update), PATCH (partial update), DELETE (remove)

### VI. Relational Data Integrity

The database schema MUST follow relational best practices.

**Rules:**
- All foreign keys MUST be enforced
- Required fields MUST have NOT NULL constraints
- Indexes MUST exist on frequently queried columns (`user_id`, `completed`)
- All database access MUST use SQLModel ORM
- Schema changes MUST be migration-based

### VII. Monorepo Structure

The project MUST be organized as a monorepo with clear layer separation.

**Rules:**
- Frontend and backend MUST be in separate directories (`/frontend/`, `/backend/`)
- Each layer MUST have its own `CLAUDE.md` with layer-specific instructions
- Specs MUST be referenced using `@specs/<path>.md` notation
- Shared configuration MUST be at repository root

### VIII. Technology Stack Compliance

The technology stack is fixed and non-negotiable.

**Frontend:**
- Next.js 16+ using App Router
- TypeScript
- Tailwind CSS
- Better Auth (JavaScript-based authentication)

**Backend:**
- Python FastAPI
- SQLModel ORM
- RESTful API architecture

**Database:**
- Neon Serverless PostgreSQL
- SQLModel-managed schema

**Authentication:**
- Better Auth (frontend)
- JWT-based verification (backend)

### IX. Separation of Concerns

The system MUST maintain clear boundaries between layers.

**Frontend Responsibilities:**
- UI rendering and routing
- Authentication state management via Better Auth
- JWT token attachment to all API requests
- Client-side validation and user feedback

**Backend Responsibilities:**
- RESTful API endpoint exposure
- JWT token verification on every request
- Task ownership enforcement
- Database communication via SQLModel

**Database Responsibilities:**
- Data persistence
- Relational integrity enforcement
- User and task storage

### X. Quality Assurance

The system MUST meet quality standards before deployment.

**Rules:**
- User data isolation MUST be verified
- Authentication MUST be tested for all endpoints
- Persistent storage MUST be validated
- API behavior MUST be consistent across endpoints
- Frontend and backend concerns MUST remain separated

## Technology Stack (Mandatory)

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend Framework | Next.js 16+ (App Router) | UI and routing |
| Frontend Language | TypeScript | Type safety |
| Frontend Styling | Tailwind CSS | Utility-first CSS |
| Frontend Auth | Better Auth | Authentication management |
| Backend Framework | FastAPI | REST API |
| Backend ORM | SQLModel | Database operations |
| Database | Neon PostgreSQL | Persistent storage |
| Token Format | JWT | Stateless authentication |
| Spec System | Spec-Kit Plus | Specification management |
| Implementation Agent | Claude Code | Code generation |

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (Browser)                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js + Better Auth)                    │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────────────────────┐ │
│  │  App Router │  │ Better Auth  │  │  API Client (fetch + JWT header)    │ │
│  │  (Pages)    │  │ (Sessions)   │  │  Authorization: Bearer <token>      │ │
│  └─────────────┘  └──────────────┘  └─────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                            JWT Token in Header
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          BACKEND (FastAPI + SQLModel)                       │
│  ┌──────────────────┐  ┌─────────────────┐  ┌───────────────────────────┐  │
│  │ JWT Verification │  │ Route Handlers  │  │ User Isolation Middleware │  │
│  │ (Middleware)     │  │ /api/{user_id}/ │  │ (user_id from JWT)        │  │
│  └──────────────────┘  └─────────────────┘  └───────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                SQLModel ORM
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATABASE (Neon PostgreSQL)                          │
│  ┌─────────────────────────────┐  ┌─────────────────────────────────────┐  │
│  │  users (Better Auth)        │  │  tasks                              │  │
│  │  - id (PK)                  │  │  - id (PK)                          │  │
│  │  - email (UNIQUE)           │  │  - user_id (FK → users.id)          │  │
│  │  - name                     │  │  - title                            │  │
│  │  - created_at               │  │  - description                      │  │
│  └─────────────────────────────┘  │  - completed                        │  │
│                                    │  - created_at, updated_at           │  │
│                                    └─────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Authentication & Security Constitution

### JWT Token Flow

1. User authenticates via Better Auth on frontend
2. Better Auth issues JWT token
3. Frontend attaches JWT to all API requests: `Authorization: Bearer <token>`
4. Backend verifies JWT using shared `BETTER_AUTH_SECRET`
5. Backend extracts `user_id` from decoded token
6. Backend validates URL `user_id` matches JWT `user_id`

### Security Rules

| Scenario | Required Response |
|----------|-------------------|
| No token provided | 401 Unauthorized |
| Invalid token | 401 Unauthorized |
| Expired token | 401 Unauthorized |
| URL user_id ≠ JWT user_id | 403 Forbidden |
| Valid token + matching user_id | Allow request |

### Environment Variables

| Variable | Purpose | Required By |
|----------|---------|-------------|
| `BETTER_AUTH_SECRET` | JWT signing/verification | Frontend + Backend |
| `DATABASE_URL` | Neon PostgreSQL connection | Backend |

## API Constitution

### Base Path

All routes MUST be prefixed with `/api/`

### Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/{user_id}/tasks` | List all tasks for user |
| POST | `/api/{user_id}/tasks` | Create new task |
| GET | `/api/{user_id}/tasks/{id}` | Get specific task |
| PUT | `/api/{user_id}/tasks/{id}` | Full update of task |
| DELETE | `/api/{user_id}/tasks/{id}` | Delete task |
| PATCH | `/api/{user_id}/tasks/{id}/complete` | Toggle completion status |

### Request/Response Contract

**Create Task (POST)**
```json
// Request
{ "title": "string (1-200 chars)", "description": "string (optional, max 1000 chars)" }

// Response
{ "id": "int", "user_id": "string", "title": "string", "description": "string|null", "completed": false, "created_at": "ISO8601", "updated_at": "ISO8601" }
```

**Error Response Format**
```json
{ "detail": "string" }
```

## Database Constitution

### Schema Definition

**users** (managed by Better Auth)
| Column | Type | Constraints |
|--------|------|-------------|
| id | string | PRIMARY KEY |
| email | string | UNIQUE, NOT NULL |
| name | string | |
| created_at | timestamp | NOT NULL, DEFAULT NOW() |

**tasks**
| Column | Type | Constraints |
|--------|------|-------------|
| id | integer | PRIMARY KEY, AUTOINCREMENT |
| user_id | string | FOREIGN KEY → users.id, NOT NULL |
| title | string | NOT NULL, LENGTH 1-200 |
| description | string | NULLABLE, MAX LENGTH 1000 |
| completed | boolean | NOT NULL, DEFAULT false |
| created_at | timestamp | NOT NULL, DEFAULT NOW() |
| updated_at | timestamp | NOT NULL, DEFAULT NOW() |

### Required Indexes

- `tasks.user_id` - Query optimization for user task lists
- `tasks.completed` - Filter optimization for completion status

## Monorepo & Spec-Kit Structure

```
/
├── .spec-kit/
│   └── config.yaml
├── specs/
│   ├── overview.md
│   ├── architecture.md
│   ├── features/
│   │   └── task-crud.md
│   ├── api/
│   │   └── rest-endpoints.md
│   ├── database/
│   │   └── schema.md
│   └── ui/
│       ├── pages.md
│       └── components.md
├── frontend/
│   ├── CLAUDE.md
│   ├── src/
│   ├── app/
│   └── package.json
├── backend/
│   ├── CLAUDE.md
│   ├── main.py
│   ├── models.py
│   ├── routes/
│   └── requirements.txt
├── CLAUDE.md
└── .specify/
    └── memory/
        └── constitution.md
```

## Claude Code Behavior Rules

Claude Code is the **sole entity** permitted to write or modify code.

### Claude Code MUST:

1. Read relevant specs before any implementation
2. Follow folder-specific `CLAUDE.md` instructions
3. Implement frontend and backend changes consistently
4. Adhere to all constitutional principles
5. Update specs if implementation reveals missing details

### Claude Code MUST NEVER:

1. Implement features not explicitly defined in specs
2. Invent APIs, data models, or contracts
3. Skip authentication/authorization requirements
4. Allow cross-user data access
5. Hardcode secrets or tokens
6. Make assumptions when specs are ambiguous (ask for clarification)

### Required Reading Order

1. Root `CLAUDE.md`
2. Relevant feature specs (`@specs/features/*.md`)
3. API specs (`@specs/api/*.md`)
4. Database specs (`@specs/database/*.md`)
5. Layer-specific `CLAUDE.md` (`/frontend/CLAUDE.md` or `/backend/CLAUDE.md`)

## Quality & Validation Rules

### Mandatory Validations

| Check | Criteria | Failure Action |
|-------|----------|----------------|
| User Isolation | No cross-user data access possible | Block deployment |
| Authentication | All endpoints require valid JWT | Block deployment |
| Authorization | URL user_id must match JWT user_id | Block deployment |
| Persistence | Data survives server restart | Block deployment |
| API Consistency | All endpoints follow constitution | Block deployment |
| Layer Separation | No frontend-backend coupling | Block deployment |

### Acceptance Criteria for Phase II

- [ ] Multiple users can register and authenticate
- [ ] Each user sees only their own tasks
- [ ] Tasks persist in Neon PostgreSQL
- [ ] JWT authentication protects all API endpoints
- [ ] Unauthorized access returns appropriate errors
- [ ] Frontend and backend run as separate services

## Phase Scope Boundaries

### In Scope (Phase II)

- Full-stack web application
- Task CRUD operations (Create, Read, Update, Delete)
- Authentication with JWT via Better Auth
- Persistent database storage (Neon PostgreSQL)
- User isolation and data security
- RESTful API design

### Out of Scope (Phase II)

These features are explicitly excluded and will be addressed in Phase III:

- AI chatbot features
- Natural language task creation
- MCP (Model Context Protocol) tools
- Task sharing between users
- Task categories or tags
- Due dates and reminders
- Real-time updates (WebSockets)

## Governance

### Amendment Process

1. Proposed amendments MUST be documented in a spec
2. Amendments MUST include rationale and impact analysis
3. Constitution version MUST be incremented per semantic versioning
4. All dependent artifacts MUST be updated for consistency

### Versioning Policy

| Change Type | Version Bump | Example |
|-------------|--------------|---------|
| Backward-incompatible principle removal/redefinition | MAJOR | 1.0.0 → 2.0.0 |
| New principle or materially expanded guidance | MINOR | 1.0.0 → 1.1.0 |
| Clarifications, wording, typo fixes | PATCH | 1.0.0 → 1.0.1 |

### Compliance Review

- All PRs MUST verify compliance with this constitution
- Complexity MUST be justified against constitutional principles
- Security violations result in immediate rejection

### Final Authority Statement

This constitution is the **highest authority** for Phase II.

All plans, tasks, implementations, and evaluations MUST comply with this document.

**If a requirement is not written in a spec, it MUST NOT be implemented.**

**Version**: 1.0.0 | **Ratified**: 2026-01-08 | **Last Amended**: 2026-01-08
