# Error Handling Specification

**Project**: Hackathon Todo – Phase II
**Authority**: Phase II Constitution v1.0.0
**Status**: Approved

## Error Response Format

All API errors return JSON with a consistent structure:

```json
{
  "detail": "Human-readable error message"
}
```

### Extended Error Format (Validation)

For validation errors with multiple fields:

```json
{
  "detail": [
    {
      "loc": ["body", "title"],
      "msg": "Title is required",
      "type": "value_error.missing"
    },
    {
      "loc": ["body", "description"],
      "msg": "Description must be 1000 characters or less",
      "type": "value_error.too_long"
    }
  ]
}
```

## HTTP Status Codes

### Success Codes

| Code | Name | Usage |
|------|------|-------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST (resource created) |
| 204 | No Content | Successful DELETE |

### Client Error Codes

| Code | Name | Usage |
|------|------|-------|
| 400 | Bad Request | Validation errors, malformed request |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource doesn't exist |
| 422 | Unprocessable Entity | Semantic validation errors |

### Server Error Codes

| Code | Name | Usage |
|------|------|-------|
| 500 | Internal Server Error | Unexpected server error |
| 503 | Service Unavailable | Database connection failure |

## Error Categories

### Authentication Errors (401)

| Scenario | Response |
|----------|----------|
| No Authorization header | `{"detail": "Not authenticated"}` |
| Invalid header format | `{"detail": "Invalid authorization header"}` |
| Invalid token | `{"detail": "Invalid token"}` |
| Expired token | `{"detail": "Token expired"}` |

**Frontend Behavior:**
- Redirect to /signin
- Clear local session state
- Show toast: "Session expired. Please sign in again."

### Authorization Errors (403)

| Scenario | Response |
|----------|----------|
| URL user_id mismatch | `{"detail": "Access forbidden"}` |
| Attempting to access other's data | `{"detail": "Access forbidden"}` |

**Frontend Behavior:**
- Show toast: "You don't have permission to access this resource."
- Redirect to /tasks

### Validation Errors (400/422)

#### Task Title Validation

| Error | Response |
|-------|----------|
| Missing title | `{"detail": "Title is required"}` |
| Empty title | `{"detail": "Title cannot be empty"}` |
| Title too long | `{"detail": "Title must be 200 characters or less"}` |

#### Task Description Validation

| Error | Response |
|-------|----------|
| Description too long | `{"detail": "Description must be 1000 characters or less"}` |

#### Authentication Validation

| Error | Response |
|-------|----------|
| Invalid email format | `{"detail": "Please enter a valid email address"}` |
| Email already exists | `{"detail": "An account with this email already exists"}` |
| Password too short | `{"detail": "Password must be at least 8 characters"}` |
| Invalid credentials | `{"detail": "Invalid email or password"}` |

**Frontend Behavior:**
- Display error message near relevant field
- Keep form data intact
- Focus on first invalid field

### Not Found Errors (404)

| Scenario | Response |
|----------|----------|
| Task doesn't exist | `{"detail": "Task not found"}` |
| Route doesn't exist | `{"detail": "Not found"}` |

**Note:** 404 is returned for tasks that don't exist OR belong to another user (prevents user enumeration).

**Frontend Behavior:**
- Show toast: "The requested item was not found."
- Redirect to /tasks (for task-specific 404s)

### Server Errors (500)

| Scenario | Response |
|----------|----------|
| Unexpected error | `{"detail": "An unexpected error occurred"}` |
| Database error | `{"detail": "An unexpected error occurred"}` |

**Note:** Never expose internal error details, stack traces, or database information.

**Frontend Behavior:**
- Show toast: "Something went wrong. Please try again."
- Provide "Try Again" option if applicable
- Log error details to console (development only)

## Frontend Error Handling

### Error Display Components

#### Toast Notifications

Used for:
- Transient errors
- Success confirmations
- Network errors

Display Rules:
- Appears in top-right or bottom-right corner
- Auto-dismisses after 5 seconds
- Can be manually dismissed
- Color-coded by severity (red for errors)

#### Inline Field Errors

Used for:
- Form validation errors
- Field-specific issues

Display Rules:
- Appears below the relevant field
- Red text color
- Shows icon + message
- Clears when field is corrected

#### Error Pages

Used for:
- 404 Not Found
- Unrecoverable errors

Display Rules:
- Full page replacement
- Clear message
- Action buttons (Go Home, Try Again)

### Error State Management

```
1. API call initiated
2. Error response received
3. Parse error response
4. Categorize by status code
5. Display appropriate UI
6. Log for debugging (if needed)
```

### Network Error Handling

| Error | Detection | User Message |
|-------|-----------|--------------|
| No internet | fetch throws TypeError | "No internet connection" |
| Timeout | AbortController timeout | "Request timed out" |
| Server down | 503 or network error | "Server is unavailable" |

**Frontend Behavior:**
- Show offline indicator (if applicable)
- Preserve form data
- Provide retry mechanism
- Queue failed actions for retry (optional enhancement)

## Validation Behavior

### Client-Side Validation

Performed before API call:
- Required field checks
- Format validation (email)
- Length constraints
- Type checks

Display:
- Real-time feedback as user types
- Submit button disabled until valid
- Clear error when field is corrected

### Server-Side Validation

Always performed (never trust client):
- Same rules as client-side
- Additional business logic
- Database constraints

Display:
- Errors returned in response
- Frontend maps to appropriate fields
- Shows server-specific messages

### Validation Rules Summary

| Field | Rule | Client | Server |
|-------|------|--------|--------|
| Task title | Required | Yes | Yes |
| Task title | 1-200 chars | Yes | Yes |
| Task description | Max 1000 chars | Yes | Yes |
| Email | Valid format | Yes | Yes |
| Email | Unique | No | Yes |
| Password | Min 8 chars | Yes | Yes |
| Name | Required | Yes | Yes |
| Name | Max 100 chars | Yes | Yes |

## Error Recovery Strategies

### Optimistic Update Rollback

When optimistic updates fail:
1. Display error toast
2. Revert UI to previous state
3. Re-fetch data from server (if needed)

### Form Error Recovery

When form submission fails:
1. Preserve all form data
2. Display error messages
3. Focus first invalid field
4. Allow user to correct and retry

### Session Error Recovery

When authentication fails:
1. Clear local session state
2. Redirect to sign in
3. Preserve intended destination URL
4. Redirect back after successful sign in

## Logging Strategy

### Frontend Logging

| Event | Log Level | Environment |
|-------|-----------|-------------|
| API errors | console.error | Development |
| Validation errors | console.warn | Development |
| User actions | Not logged | - |

**Production:** Minimize logging to prevent information exposure.

### Backend Logging

| Event | Log Level |
|-------|-----------|
| 4xx errors | WARNING |
| 5xx errors | ERROR |
| Authentication failures | WARNING |
| Successful operations | INFO |

**Never log:** Passwords, tokens, sensitive data.

## Error Messages Guidelines

### Message Principles

| Principle | Example |
|-----------|---------|
| Be specific | "Title must be 200 characters or less" not "Invalid title" |
| Be helpful | "Please enter a valid email address" |
| Be secure | "Invalid email or password" (not "Password is wrong") |
| Be human | Avoid technical jargon |

### Message Templates

**Validation:**
- "{Field} is required"
- "{Field} must be {constraint}"
- "Please enter a valid {field type}"

**Authentication:**
- "Please sign in to continue"
- "Session expired. Please sign in again."
- "Invalid email or password"

**Authorization:**
- "You don't have permission to access this resource"

**Server:**
- "Something went wrong. Please try again."
- "Server is temporarily unavailable. Please try again later."

**Network:**
- "No internet connection. Please check your connection."
- "Request timed out. Please try again."

## Compliance

This specification complies with:
- Phase II Constitution v1.0.0
- RESTful API Consistency Principle (V)
- Quality Assurance Principle (X)
- Security Specification (no information disclosure)
