# System Architecture

**Project**: Hackathon Todo – Phase II
**Authority**: Phase II Constitution v1.0.0

## High-Level Architecture

The system follows a three-tier architecture with strict separation of concerns:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                              CLIENT TIER                                    │
│                           (Web Browser)                                     │
│                                                                             │
│   User interacts via browser. All UI rendering happens client-side.        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ HTTPS
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                           PRESENTATION TIER                                 │
│                       (Next.js Frontend Server)                             │
│                                                                             │
│   - Server-side rendering (SSR) and static generation                       │
│   - Better Auth session management                                          │
│   - JWT token storage and attachment                                        │
│   - Client-side routing and state management                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ REST API + JWT Header
                                      │ Authorization: Bearer <token>
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                           APPLICATION TIER                                  │
│                         (FastAPI Backend Server)                            │
│                                                                             │
│   - JWT verification middleware                                             │
│   - User identity extraction from token                                     │
│   - Business logic execution                                                │
│   - Data validation and sanitization                                        │
│   - User isolation enforcement                                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ SQLModel ORM
                                      │ Connection Pool
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                              DATA TIER                                      │
│                       (Neon PostgreSQL Database)                            │
│                                                                             │
│   - User records (managed by Better Auth)                                   │
│   - Task records with user_id foreign key                                   │
│   - Relational integrity constraints                                        │
│   - Indexed queries for performance                                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Frontend-Backend-Database Interaction

### Request Flow

```
1. User Action
      │
      ▼
2. Frontend Component
      │
      ├──► Better Auth (if auth action)
      │         │
      │         ▼
      │    Session + JWT Token
      │
      ▼
3. API Client (lib/api.ts)
      │
      ├──► Attach JWT: Authorization: Bearer <token>
      │
      ▼
4. HTTP Request to Backend
      │
      ▼
5. FastAPI Middleware
      │
      ├──► Verify JWT signature
      ├──► Check token expiration
      ├──► Extract user_id from token
      │
      ▼
6. Route Handler
      │
      ├──► Validate URL user_id matches JWT user_id
      ├──► Validate request body
      │
      ▼
7. Database Operation (SQLModel)
      │
      ├──► Query includes user_id filter
      │
      ▼
8. Response Generation
      │
      ▼
9. JSON Response to Frontend
      │
      ▼
10. UI Update
```

## JWT-Based Authentication Flow

### Registration Flow

```
┌──────────┐    1. POST /api/auth/signup     ┌──────────────┐
│          │ ──────────────────────────────► │              │
│  Browser │    {email, password, name}      │   Frontend   │
│          │ ◄────────────────────────────── │  (Next.js)   │
└──────────┘    2. Session Created           └──────────────┘
                   JWT Token Issued                 │
                                                    │ 3. Store session
                                                    ▼
                                            ┌──────────────┐
                                            │ Better Auth  │
                                            │   Storage    │
                                            └──────────────┘
```

### Sign In Flow

```
┌──────────┐    1. POST /api/auth/signin     ┌──────────────┐
│          │ ──────────────────────────────► │              │
│  Browser │    {email, password}            │   Frontend   │
│          │ ◄────────────────────────────── │  (Next.js)   │
└──────────┘    2. JWT Token                 └──────────────┘
                                                    │
                                                    │ 3. Verify credentials
                                                    ▼
                                            ┌──────────────┐
                                            │ Better Auth  │
                                            └──────────────┘
```

### Authenticated API Request Flow

```
┌──────────┐    1. User clicks "Add Task"    ┌──────────────┐
│          │ ──────────────────────────────► │              │
│  Browser │                                 │   Frontend   │
│          │                                 │  (Next.js)   │
└──────────┘                                 └──────────────┘
                                                    │
                                                    │ 2. Get JWT from session
                                                    ▼
                                            ┌──────────────┐
                                            │  API Client  │
                                            │  lib/api.ts  │
                                            └──────────────┘
                                                    │
                    3. POST /api/{user_id}/tasks    │
                       Authorization: Bearer <jwt>  │
                       {title, description}         │
                                                    ▼
                                            ┌──────────────┐
                                            │   Backend    │
                                            │  (FastAPI)   │
                                            └──────────────┘
                                                    │
                                                    │ 4. Verify JWT
                                                    │ 5. Check user_id match
                                                    │ 6. Insert task
                                                    ▼
                                            ┌──────────────┐
                                            │   Database   │
                                            │ (Neon PgSQL) │
                                            └──────────────┘
                                                    │
                    7. 201 Created                  │
                       {task object}                │
◄───────────────────────────────────────────────────┘
```

## Stateless Request Lifecycle

Every request is independent and carries all necessary authentication information:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STATELESS REQUEST                                   │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ HTTP Headers                                                          │  │
│  │ ─────────────────────────────────────────────────────────────────────│  │
│  │ Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...        │  │
│  │ Content-Type: application/json                                        │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ JWT Payload (Decoded)                                                 │  │
│  │ ─────────────────────────────────────────────────────────────────────│  │
│  │ {                                                                     │  │
│  │   "sub": "user_abc123",          // User ID                          │  │
│  │   "email": "user@example.com",   // User email                       │  │
│  │   "iat": 1704672000,             // Issued at                        │  │
│  │   "exp": 1704758400              // Expiration                       │  │
│  │ }                                                                     │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  Server does NOT maintain session state.                                    │
│  Every request is verified independently.                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Stateless Design Rules

| Rule | Implementation |
|------|----------------|
| No server sessions | JWT contains all user identity information |
| No sticky sessions | Any backend instance can handle any request |
| Token-based auth | Authentication state travels with request |
| Database is source of truth | All persistent state lives in PostgreSQL |

## Monorepo Responsibility Boundaries

```
/
├── frontend/                      # PRESENTATION TIER
│   ├── CLAUDE.md                  # Frontend-specific agent instructions
│   ├── app/                       # Next.js App Router pages
│   │   ├── (auth)/               # Public auth routes
│   │   │   ├── signin/
│   │   │   └── signup/
│   │   ├── (app)/                # Protected app routes
│   │   │   └── tasks/
│   │   ├── api/                  # Better Auth API routes
│   │   │   └── auth/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/               # React components
│   │   ├── ui/                   # Generic UI components
│   │   └── todo/                 # Domain-specific components
│   ├── lib/                      # Utilities
│   │   ├── api.ts               # API client with JWT
│   │   └── auth.ts              # Better Auth configuration
│   └── package.json
│
├── backend/                       # APPLICATION TIER
│   ├── CLAUDE.md                  # Backend-specific agent instructions
│   ├── main.py                    # FastAPI application entry
│   ├── config.py                  # Environment configuration
│   ├── db.py                      # Database connection
│   ├── models.py                  # SQLModel definitions
│   ├── schemas.py                 # Pydantic request/response schemas
│   ├── dependencies.py            # JWT verification dependency
│   ├── routes/                    # API route handlers
│   │   └── tasks.py
│   └── requirements.txt
│
├── specs/                         # SPECIFICATIONS
│   ├── overview.md
│   ├── architecture.md
│   ├── features/
│   ├── api/
│   ├── database/
│   └── ui/
│
├── .specify/                      # SPEC-KIT PLUS
│   └── memory/
│       └── constitution.md
│
└── CLAUDE.md                      # Root agent instructions
```

### Boundary Rules

| Boundary | Rule |
|----------|------|
| Frontend → Backend | Communication ONLY via REST API with JWT |
| Backend → Database | Communication ONLY via SQLModel ORM |
| Frontend ↔ Database | FORBIDDEN (no direct database access) |
| Specs → Implementation | Specs define WHAT, code implements HOW |

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SECURITY LAYERS                                   │
└─────────────────────────────────────────────────────────────────────────────┘

Layer 1: Transport Security
├── HTTPS encryption for all traffic
└── Secure cookies for session storage

Layer 2: Authentication
├── Better Auth handles credential verification
├── JWT tokens signed with BETTER_AUTH_SECRET
└── Token expiration enforcement

Layer 3: Authorization
├── JWT verification middleware on every request
├── User ID extraction from token
└── URL user_id must match JWT user_id

Layer 4: Data Isolation
├── Every database query filters by user_id
├── Foreign key constraints enforce ownership
└── No cross-user data access possible

Layer 5: Input Validation
├── Pydantic schema validation on all inputs
├── Length constraints on strings
└── Type enforcement
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DEPLOYMENT                                     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Frontend     │     │    Backend      │     │    Database     │
│    Container    │     │    Container    │     │    (Managed)    │
│                 │     │                 │     │                 │
│  Next.js        │────►│  FastAPI        │────►│  Neon           │
│  Port: 3000     │     │  Port: 8000     │     │  PostgreSQL     │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘

Environment Variables:
├── Frontend:
│   ├── BETTER_AUTH_SECRET
│   └── NEXT_PUBLIC_API_URL
│
└── Backend:
    ├── BETTER_AUTH_SECRET
    └── DATABASE_URL
```

## Compliance

This architecture complies with:
- Phase II Constitution v1.0.0
- Separation of Concerns Principle (IX)
- Authentication-First Security Principle (III)
- User Data Isolation Principle (IV)
- Monorepo Structure Principle (VII)
