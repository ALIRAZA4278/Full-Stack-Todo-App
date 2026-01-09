# Database Schema Specification

**Project**: Hackathon Todo – Phase II
**Authority**: Phase II Constitution v1.0.0
**Database**: Neon Serverless PostgreSQL
**ORM**: SQLModel
**Status**: Approved

## Overview

The database stores user accounts and their associated tasks. User data is managed by Better Auth, while tasks are managed by the application backend.

## Connection Configuration

| Setting | Value |
|---------|-------|
| Provider | Neon Serverless PostgreSQL |
| Connection | Via `DATABASE_URL` environment variable |
| ORM | SQLModel (SQLAlchemy-based) |
| SSL | Required |
| Pool | Connection pooling enabled |

## Schema Diagram

```
┌─────────────────────────────────────┐
│              users                  │
│  (Managed by Better Auth)           │
├─────────────────────────────────────┤
│ id          VARCHAR(255) PK         │
│ email       VARCHAR(255) UNIQUE     │
│ name        VARCHAR(100)            │
│ password    VARCHAR(255)            │◄──── Hashed by Better Auth
│ created_at  TIMESTAMP               │
│ updated_at  TIMESTAMP               │
└─────────────────────────────────────┘
                    │
                    │ 1:N
                    │
                    ▼
┌─────────────────────────────────────┐
│              tasks                  │
│  (Managed by Application)           │
├─────────────────────────────────────┤
│ id          SERIAL PK               │
│ user_id     VARCHAR(255) FK ────────┼──► users.id
│ title       VARCHAR(200) NOT NULL   │
│ description TEXT                    │
│ completed   BOOLEAN DEFAULT false   │
│ created_at  TIMESTAMP NOT NULL      │
│ updated_at  TIMESTAMP NOT NULL      │
└─────────────────────────────────────┘
```

## Table Definitions

### users (Managed by Better Auth)

This table is created and managed by Better Auth. The application reads from it but does not modify it directly.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(255) | PRIMARY KEY | Unique user identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User's email address |
| name | VARCHAR(100) | | User's display name |
| password | VARCHAR(255) | NOT NULL | Hashed password |
| email_verified | BOOLEAN | DEFAULT false | Email verification status |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Account creation time |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update time |

**Note**: Better Auth may create additional columns. The above represents the minimum expected schema.

### tasks (Managed by Application)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Auto-incremented task ID |
| user_id | VARCHAR(255) | FOREIGN KEY, NOT NULL | References users.id |
| title | VARCHAR(200) | NOT NULL | Task title |
| description | TEXT | NULLABLE | Task description |
| completed | BOOLEAN | NOT NULL, DEFAULT false | Completion status |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Task creation time |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update time |

**SQL Definition:**

```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);
```

## Indexes

### Required Indexes

| Index Name | Table | Columns | Purpose |
|------------|-------|---------|---------|
| idx_tasks_user_id | tasks | user_id | Fast lookup of user's tasks |
| idx_tasks_completed | tasks | completed | Filter by completion status |
| idx_tasks_user_completed | tasks | user_id, completed | Combined filter queries |

**SQL Definition:**

```sql
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_tasks_user_completed ON tasks(user_id, completed);
```

## Constraints

### Primary Keys

| Table | Column | Type |
|-------|--------|------|
| users | id | VARCHAR(255) |
| tasks | id | SERIAL (auto-increment) |

### Foreign Keys

| Child Table | Child Column | Parent Table | Parent Column | On Delete |
|-------------|--------------|--------------|---------------|-----------|
| tasks | user_id | users | id | CASCADE |

**On Delete CASCADE**: When a user is deleted, all their tasks are automatically deleted.

### Not Null Constraints

| Table | Column |
|-------|--------|
| users | id, email, password, created_at, updated_at |
| tasks | id, user_id, title, completed, created_at, updated_at |

### Unique Constraints

| Table | Column(s) |
|-------|-----------|
| users | email |

### Check Constraints

| Table | Column | Constraint |
|-------|--------|------------|
| tasks | title | LENGTH(title) >= 1 AND LENGTH(title) <= 200 |
| tasks | description | description IS NULL OR LENGTH(description) <= 1000 |

**SQL Definition:**

```sql
ALTER TABLE tasks ADD CONSTRAINT chk_title_length
    CHECK (LENGTH(title) >= 1 AND LENGTH(title) <= 200);

ALTER TABLE tasks ADD CONSTRAINT chk_description_length
    CHECK (description IS NULL OR LENGTH(description) <= 1000);
```

## SQLModel Definitions

### Task Model

The backend must define the Task model using SQLModel:

```
Task model properties:
- id: Optional[int] (primary key, auto-generated)
- user_id: str (foreign key to users.id)
- title: str (1-200 characters)
- description: Optional[str] (max 1000 characters)
- completed: bool (default: false)
- created_at: datetime (UTC, auto-set)
- updated_at: datetime (UTC, auto-updated)
```

### Validation Rules (Enforced by Model)

| Field | Validation |
|-------|------------|
| title | min_length=1, max_length=200 |
| description | max_length=1000 (if provided) |
| completed | boolean type |
| user_id | required, non-empty string |

## Data Integrity Rules

### Invariants

| Rule | Description |
|------|-------------|
| Task ownership | Every task MUST have a valid user_id |
| Title required | Every task MUST have a non-empty title |
| Timestamps required | created_at and updated_at MUST be set |
| User isolation | Tasks can only be accessed by their owner |

### Referential Integrity

| Rule | Enforcement |
|------|-------------|
| User must exist | Foreign key constraint on tasks.user_id |
| Cascade delete | Deleting user deletes all their tasks |

### Timestamp Behavior

| Event | created_at | updated_at |
|-------|------------|------------|
| INSERT | Set to NOW() | Set to NOW() |
| UPDATE | Unchanged | Set to NOW() |
| DELETE | N/A | N/A |

## Query Patterns

### All Tasks for User

```sql
SELECT * FROM tasks
WHERE user_id = :user_id
ORDER BY created_at DESC;
```

### Single Task by ID

```sql
SELECT * FROM tasks
WHERE id = :task_id AND user_id = :user_id;
```

**Note**: Always include `user_id` in WHERE clause to enforce ownership.

### Create Task

```sql
INSERT INTO tasks (user_id, title, description, completed, created_at, updated_at)
VALUES (:user_id, :title, :description, false, NOW(), NOW())
RETURNING *;
```

### Update Task

```sql
UPDATE tasks
SET title = :title, description = :description, updated_at = NOW()
WHERE id = :task_id AND user_id = :user_id
RETURNING *;
```

### Toggle Completion

```sql
UPDATE tasks
SET completed = NOT completed, updated_at = NOW()
WHERE id = :task_id AND user_id = :user_id
RETURNING *;
```

### Delete Task

```sql
DELETE FROM tasks
WHERE id = :task_id AND user_id = :user_id;
```

## Migration Strategy

### Initial Setup

1. Better Auth creates `users` table on first run
2. Application creates `tasks` table on startup
3. Indexes are created with table creation

### Schema Changes (Future)

- All schema changes MUST be migration-based
- Migrations MUST be reversible where possible
- Data migrations MUST preserve existing data
- Migrations run automatically on application startup

## Performance Considerations

### Index Usage

| Query Pattern | Index Used |
|---------------|------------|
| List user's tasks | idx_tasks_user_id |
| List completed tasks | idx_tasks_completed |
| List user's completed tasks | idx_tasks_user_completed |
| Get single task by ID | PRIMARY KEY |

### Connection Pooling

- SQLModel uses SQLAlchemy connection pooling
- Neon provides serverless connection pooling
- Configure appropriate pool size for expected load

## Security Considerations

### Data Access

| Rule | Implementation |
|------|----------------|
| No direct database access from frontend | API is the only interface |
| Every query filtered by user_id | WHERE clause required |
| No SELECT * without user_id filter | Query must scope to user |

### Sensitive Data

| Data | Handling |
|------|----------|
| Passwords | Hashed by Better Auth, never stored plain |
| User IDs | Not considered secret, but used for isolation |
| Task content | Stored plain (no encryption requirement for Phase II) |

## Compliance

This specification complies with:
- Phase II Constitution v1.0.0
- Relational Data Integrity Principle (VI)
- User Data Isolation Principle (IV)
- Technology Stack Compliance Principle (VIII) - SQLModel, Neon PostgreSQL
