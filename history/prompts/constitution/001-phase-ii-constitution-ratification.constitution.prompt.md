---
id: 001
title: Phase II Constitution Ratification
stage: constitution
date: 2026-01-08
surface: agent
model: claude-opus-4-5-20251101
feature: none
branch: master
user: developer
command: /sp.constitution
labels: ["constitution", "phase-ii", "full-stack", "governance", "agentic-development"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - N/A (governance document)
---

## Prompt

/sp.constitution

Create a detailed, authoritative project constitution for Phase II of the Hackathon Todo Application, following Spec-Kit Plus conventions and agentic development principles.

This constitution must act as the single source of truth for how the system is designed, built, secured, and evolved using Claude Code. It should clearly define architectural intent, development rules, responsibilities of agents, and strict constraints such as no manual coding.

────────────────────────────────────────
PROJECT IDENTITY
────────────────────────────────────────
Project Name: Hackathon Todo – Phase II
Phase Name: Full-Stack Web Application
Development Model: Spec-Driven, Agentic Dev Stack
Implementation Tooling: Claude Code + Spec-Kit Plus

This phase transforms the previously built in-memory console-based Todo application into a modern, production-style, multi-user full-stack web application with persistent storage and authentication.

────────────────────────────────────────
PRIMARY OBJECTIVE
────────────────────────────────────────
The primary objective of Phase II is to demonstrate the ability to design, plan, and implement a full-stack application using specifications instead of manual coding.

The system must:
- Support multiple authenticated users
- Persist data in a real cloud database
- Enforce strict user-level data isolation
- Be implemented entirely through Claude Code driven by specs
- Be structured as a monorepo compatible with Spec-Kit Plus

Manual coding by the developer is strictly prohibited.

────────────────────────────────────────
DEVELOPMENT PRINCIPLES
────────────────────────────────────────
This project strictly follows the Agentic Development Stack workflow:

1. Write or update specifications
2. Generate a technical plan from specs
3. Break the plan into tasks
4. Delegate implementation to Claude Code
5. Review outputs and iterate by updating specs

Claude Code must never implement features that are not explicitly defined in specs.

Specifications always override assumptions.

────────────────────────────────────────
TECHNOLOGY STACK (MANDATORY)
────────────────────────────────────────

Frontend:
- Next.js 16+ using App Router
- TypeScript
- Tailwind CSS
- Better Auth (JavaScript-based authentication)

Backend:
- Python FastAPI
- SQLModel ORM
- RESTful API architecture

Database:
- Neon Serverless PostgreSQL
- Persistent cloud storage
- SQLModel-managed schema

Authentication:
- Better Auth (frontend)
- JWT-based authentication for backend verification

Spec System:
- GitHub Spec-Kit Plus
- Claude Code as the sole implementation agent

────────────────────────────────────────
SYSTEM ARCHITECTURE OVERVIEW
────────────────────────────────────────
The system is composed of three independent layers:

1. Frontend (Next.js)
   - Handles UI, routing, and authentication
   - Issues JWT tokens upon login via Better Auth
   - Attaches JWT tokens to all backend API requests

2. Backend (FastAPI)
   - Exposes RESTful API endpoints
   - Verifies JWT tokens on every request
   - Enforces task ownership and user isolation
   - Communicates with Neon PostgreSQL

3. Database (Neon PostgreSQL)
   - Stores users and tasks
   - Enforces relational integrity
   - Persists data across sessions

The frontend and backend must remain statelessly connected via JWT authentication.

────────────────────────────────────────
AUTHENTICATION & SECURITY CONSTITUTION
────────────────────────────────────────
Authentication is mandatory for all API interactions.

Rules:
- All API endpoints require a valid JWT token
- JWT must be sent in the Authorization header as:
  Authorization: Bearer <token>
- Requests without a token must return 401 Unauthorized
- Requests with invalid or expired tokens must be rejected
- Backend must decode JWT to identify the authenticated user

Shared Secret:
- Both frontend and backend must use the same JWT signing secret
- Environment variable name:
  BETTER_AUTH_SECRET

User Identity Enforcement:
- The backend must extract user_id from the JWT
- The user_id in the URL must match the authenticated user
- Any mismatch must result in a 403 Forbidden response

────────────────────────────────────────
API CONSTITUTION
────────────────────────────────────────
The REST API must follow consistent conventions.

Base Path:
- All routes must be prefixed with /api/

Endpoints:
- GET    /api/{user_id}/tasks
- POST   /api/{user_id}/tasks
- GET    /api/{user_id}/tasks/{id}
- PUT    /api/{user_id}/tasks/{id}
- DELETE /api/{user_id}/tasks/{id}
- PATCH  /api/{user_id}/tasks/{id}/complete

Behavior Rules:
- Every request must be authenticated
- Every response must only include tasks owned by the authenticated user
- Task ownership must be validated on every operation
- No cross-user data access is allowed under any circumstance

────────────────────────────────────────
DATABASE CONSTITUTION
────────────────────────────────────────
The database schema must follow relational best practices.

Tables:

users (managed by Better Auth):
- id (string, primary key)
- email (unique)
- name
- created_at

tasks:
- id (integer, primary key)
- user_id (foreign key → users.id)
- title (required, 1–200 characters)
- description (optional, max 1000 characters)
- completed (boolean, default false)
- created_at
- updated_at

Indexes:
- tasks.user_id
- tasks.completed

All database access must be performed using SQLModel.

────────────────────────────────────────
MONOREPO & SPEC-KIT STRUCTURE
────────────────────────────────────────
This project must be organized as a monorepo.

Required structure:

- /.spec-kit/config.yaml
- /specs/
  - overview.md
  - architecture.md
  - features/
  - api/
  - database/
  - ui/
- /frontend/
- /backend/
- /CLAUDE.md
- /frontend/CLAUDE.md
- /backend/CLAUDE.md

Specifications must be referenced using:
@specs/<path>.md

Claude Code must always read:
- Root CLAUDE.md
- Relevant feature specs
- API specs
- Database specs
- Layer-specific CLAUDE.md

────────────────────────────────────────
CLAUDE CODE BEHAVIOR RULES
────────────────────────────────────────
Claude Code is the only entity allowed to write or modify code.

Claude Code must:
- Read specs before implementation
- Follow folder-specific CLAUDE.md instructions
- Implement frontend and backend changes consistently
- Never invent features not defined in specs
- Update specs if implementation reveals missing details

Manual developer coding is forbidden.

────────────────────────────────────────
QUALITY & VALIDATION RULES
────────────────────────────────────────
The system must ensure:
- User data isolation
- Secure authentication
- Persistent storage
- Consistent API behavior
- Clear separation of frontend and backend concerns

Any violation of security, isolation, or spec alignment is considered a failure.

────────────────────────────────────────
PHASE SCOPE BOUNDARIES
────────────────────────────────────────
Phase II includes:
- Full-stack web application
- Task CRUD operations
- Authentication with JWT
- Persistent database storage

Phase II explicitly excludes:
- AI chatbot features
- Natural language task creation
- MCP tools

These will be addressed in Phase III.

────────────────────────────────────────
FINAL AUTHORITY STATEMENT
────────────────────────────────────────
This constitution is the highest authority for Phase II.

All plans, tasks, implementations, and evaluations must comply with this document.

If a requirement is not written in a spec, it must not be implemented.

## Response snapshot

Created comprehensive Phase II Constitution (v1.0.0) for Hackathon Todo Application with:

**10 Core Principles:**
1. Spec-Driven Development (NON-NEGOTIABLE)
2. Zero Manual Coding
3. Authentication-First Security
4. User Data Isolation (NON-NEGOTIABLE)
5. RESTful API Consistency
6. Relational Data Integrity
7. Monorepo Structure
8. Technology Stack Compliance
9. Separation of Concerns
10. Quality Assurance

**Key Sections:**
- Technology Stack (Next.js, FastAPI, Neon PostgreSQL, Better Auth)
- System Architecture with ASCII diagram
- JWT Token Flow and Security Rules
- API Constitution with endpoint definitions
- Database Schema with constraints and indexes
- Monorepo structure definition
- Claude Code behavior rules
- Phase scope boundaries (in/out)
- Governance and amendment process

**Sync Impact Report:** All templates verified compatible (plan-template.md, spec-template.md, tasks-template.md).

## Outcome

- ✅ Impact: Constitution ratified as authoritative governance document for Phase II
- 🧪 Tests: N/A (governance document, not code)
- 📁 Files: 1 file created/updated (.specify/memory/constitution.md)
- 🔁 Next prompts: /sp.specify to create feature specs, /sp.plan for architecture planning
- 🧠 Reflection: Constitution successfully captures all user requirements with 10 principles covering development workflow, security, API design, data integrity, and governance

## Evaluation notes (flywheel)

- Failure modes observed: None - all placeholders replaced, version incremented correctly
- Graders run and results (PASS/FAIL): PASS - No remaining placeholders, dates in ISO format, principles are declarative and testable
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Monitor template sync when constitution amendments occur
