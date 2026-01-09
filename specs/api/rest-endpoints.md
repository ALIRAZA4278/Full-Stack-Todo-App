# REST API Specification

**Project**: Hackathon Todo – Phase II
**Authority**: Phase II Constitution v1.0.0
**Status**: Approved

## Base Configuration

| Setting | Value |
|---------|-------|
| Base URL | `/api` |
| Protocol | HTTPS |
| Content-Type | application/json |
| Character Encoding | UTF-8 |

## Authentication

### Mandatory Header

All endpoints require the following header:

```
Authorization: Bearer <jwt_token>
```

### Token Source

- JWT token is issued by Better Auth on the frontend
- Token contains user identity in the `sub` claim
- Token is signed with `BETTER_AUTH_SECRET`

### Authentication Failure

| Scenario | Status Code | Response |
|----------|-------------|----------|
| Missing Authorization header | 401 | `{"detail": "Not authenticated"}` |
| Malformed header | 401 | `{"detail": "Invalid authorization header"}` |
| Invalid token signature | 401 | `{"detail": "Invalid token"}` |
| Expired token | 401 | `{"detail": "Token expired"}` |

## User Identity Verification

Every endpoint includes `{user_id}` in the URL path. The backend MUST:

1. Extract `user_id` from JWT token (`sub` claim)
2. Compare URL `{user_id}` with JWT `user_id`
3. Return 403 Forbidden if they do not match

### Authorization Failure

| Scenario | Status Code | Response |
|----------|-------------|----------|
| URL user_id != JWT user_id | 403 | `{"detail": "Access forbidden"}` |

## Endpoints

### GET /api/{user_id}/tasks

**Purpose**: List all tasks for the authenticated user

**Request:**
```http
GET /api/{user_id}/tasks HTTP/1.1
Authorization: Bearer <jwt_token>
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| user_id | string | Authenticated user's ID |

**Query Parameters:**
None (filtering/sorting out of scope for Phase II)

**Success Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "tasks": [
    {
      "id": 1,
      "user_id": "user_abc123",
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "completed": false,
      "created_at": "2026-01-08T10:30:00Z",
      "updated_at": "2026-01-08T10:30:00Z"
    },
    {
      "id": 2,
      "user_id": "user_abc123",
      "title": "Call dentist",
      "description": null,
      "completed": true,
      "created_at": "2026-01-07T14:00:00Z",
      "updated_at": "2026-01-08T09:15:00Z"
    }
  ],
  "count": 2
}
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| tasks | array | List of task objects |
| count | integer | Total number of tasks |

**Error Responses:**
| Status | Scenario |
|--------|----------|
| 401 | Not authenticated |
| 403 | User ID mismatch |

---

### POST /api/{user_id}/tasks

**Purpose**: Create a new task

**Request:**
```http
POST /api/{user_id}/tasks HTTP/1.1
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| user_id | string | Authenticated user's ID |

**Request Body:**
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| title | string | Yes | 1-200 characters |
| description | string | No | Max 1000 characters |

**Success Response:**
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": 3,
  "user_id": "user_abc123",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "created_at": "2026-01-08T12:00:00Z",
  "updated_at": "2026-01-08T12:00:00Z"
}
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| id | integer | Auto-generated task ID |
| user_id | string | Owner's user ID (from JWT) |
| title | string | Task title |
| description | string/null | Task description |
| completed | boolean | Always false for new tasks |
| created_at | string | ISO 8601 UTC timestamp |
| updated_at | string | ISO 8601 UTC timestamp |

**Error Responses:**
| Status | Scenario | Response |
|--------|----------|----------|
| 400 | Missing title | `{"detail": "Title is required"}` |
| 400 | Title too long | `{"detail": "Title must be 200 characters or less"}` |
| 400 | Description too long | `{"detail": "Description must be 1000 characters or less"}` |
| 401 | Not authenticated | `{"detail": "Not authenticated"}` |
| 403 | User ID mismatch | `{"detail": "Access forbidden"}` |

---

### GET /api/{user_id}/tasks/{task_id}

**Purpose**: Get a specific task by ID

**Request:**
```http
GET /api/{user_id}/tasks/{task_id} HTTP/1.1
Authorization: Bearer <jwt_token>
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| user_id | string | Authenticated user's ID |
| task_id | integer | Task ID to retrieve |

**Success Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 1,
  "user_id": "user_abc123",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "created_at": "2026-01-08T10:30:00Z",
  "updated_at": "2026-01-08T10:30:00Z"
}
```

**Error Responses:**
| Status | Scenario | Response |
|--------|----------|----------|
| 401 | Not authenticated | `{"detail": "Not authenticated"}` |
| 403 | User ID mismatch | `{"detail": "Access forbidden"}` |
| 404 | Task not found | `{"detail": "Task not found"}` |

**Note**: A 404 is returned if the task doesn't exist OR if it belongs to another user (prevents user enumeration).

---

### PUT /api/{user_id}/tasks/{task_id}

**Purpose**: Full update of a task (title and description)

**Request:**
```http
PUT /api/{user_id}/tasks/{task_id} HTTP/1.1
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Buy groceries and snacks",
  "description": "Milk, eggs, bread, chips"
}
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| user_id | string | Authenticated user's ID |
| task_id | integer | Task ID to update |

**Request Body:**
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| title | string | Yes | 1-200 characters |
| description | string | No | Max 1000 characters, null to clear |

**Success Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 1,
  "user_id": "user_abc123",
  "title": "Buy groceries and snacks",
  "description": "Milk, eggs, bread, chips",
  "completed": false,
  "created_at": "2026-01-08T10:30:00Z",
  "updated_at": "2026-01-08T14:00:00Z"
}
```

**Behavior:**
- `updated_at` is set to current UTC timestamp
- `completed` status is NOT changed by PUT (use PATCH for completion)
- `user_id` and `created_at` are immutable

**Error Responses:**
| Status | Scenario | Response |
|--------|----------|----------|
| 400 | Missing title | `{"detail": "Title is required"}` |
| 400 | Title too long | `{"detail": "Title must be 200 characters or less"}` |
| 400 | Description too long | `{"detail": "Description must be 1000 characters or less"}` |
| 401 | Not authenticated | `{"detail": "Not authenticated"}` |
| 403 | User ID mismatch | `{"detail": "Access forbidden"}` |
| 404 | Task not found | `{"detail": "Task not found"}` |

---

### DELETE /api/{user_id}/tasks/{task_id}

**Purpose**: Permanently delete a task

**Request:**
```http
DELETE /api/{user_id}/tasks/{task_id} HTTP/1.1
Authorization: Bearer <jwt_token>
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| user_id | string | Authenticated user's ID |
| task_id | integer | Task ID to delete |

**Success Response:**
```http
HTTP/1.1 204 No Content
```

**Behavior:**
- Task is permanently deleted (no soft delete)
- Returns 204 even if task was already deleted (idempotent)

**Error Responses:**
| Status | Scenario | Response |
|--------|----------|----------|
| 401 | Not authenticated | `{"detail": "Not authenticated"}` |
| 403 | User ID mismatch | `{"detail": "Access forbidden"}` |
| 404 | Task not found | `{"detail": "Task not found"}` |

---

### PATCH /api/{user_id}/tasks/{task_id}/complete

**Purpose**: Toggle task completion status

**Request:**
```http
PATCH /api/{user_id}/tasks/{task_id}/complete HTTP/1.1
Authorization: Bearer <jwt_token>
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| user_id | string | Authenticated user's ID |
| task_id | integer | Task ID to toggle |

**Request Body:**
None required. The endpoint toggles the current completion status.

**Success Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 1,
  "user_id": "user_abc123",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": true,
  "created_at": "2026-01-08T10:30:00Z",
  "updated_at": "2026-01-08T15:30:00Z"
}
```

**Behavior:**
- If `completed` was `false`, it becomes `true`
- If `completed` was `true`, it becomes `false`
- `updated_at` is set to current UTC timestamp

**Error Responses:**
| Status | Scenario | Response |
|--------|----------|----------|
| 401 | Not authenticated | `{"detail": "Not authenticated"}` |
| 403 | User ID mismatch | `{"detail": "Access forbidden"}` |
| 404 | Task not found | `{"detail": "Task not found"}` |

---

## Data Types

### Task Object

```json
{
  "id": 1,
  "user_id": "user_abc123",
  "title": "Task title",
  "description": "Task description or null",
  "completed": false,
  "created_at": "2026-01-08T10:30:00Z",
  "updated_at": "2026-01-08T10:30:00Z"
}
```

| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| id | integer | No | Auto-incremented primary key |
| user_id | string | No | Foreign key to users table |
| title | string | No | Task title (1-200 chars) |
| description | string | Yes | Task description (max 1000 chars) |
| completed | boolean | No | Completion status |
| created_at | string | No | ISO 8601 UTC timestamp |
| updated_at | string | No | ISO 8601 UTC timestamp |

### Timestamps

All timestamps are:
- Formatted as ISO 8601: `YYYY-MM-DDTHH:MM:SSZ`
- Always in UTC timezone
- Suffixed with `Z` to indicate UTC

### Error Response

```json
{
  "detail": "Error message describing what went wrong"
}
```

## HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation errors |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Authorization failure (user mismatch) |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Unexpected server error |

## CORS Configuration

The backend must allow cross-origin requests from the frontend:

| Setting | Value |
|---------|-------|
| Allow Origin | Frontend URL |
| Allow Methods | GET, POST, PUT, PATCH, DELETE, OPTIONS |
| Allow Headers | Authorization, Content-Type |
| Allow Credentials | true |

## Rate Limiting

Out of scope for Phase II. No rate limiting implemented.

## Compliance

This specification complies with:
- Phase II Constitution v1.0.0
- RESTful API Consistency Principle (V)
- Authentication-First Security Principle (III)
- User Data Isolation Principle (IV)
