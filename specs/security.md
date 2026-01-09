# Security Specification

**Project**: Hackathon Todo – Phase II
**Authority**: Phase II Constitution v1.0.0
**Status**: Approved

## Security Principles

| Principle | Description |
|-----------|-------------|
| Authentication First | Every API request must be authenticated |
| User Isolation | Users can only access their own data |
| Defense in Depth | Multiple security layers |
| Secure by Default | Security enabled without configuration |
| Least Privilege | Minimum necessary access |

## Authentication

### JWT Token Verification

All API endpoints (except auth routes) require JWT verification:

**Verification Steps (Backend):**

1. Extract token from `Authorization: Bearer <token>` header
2. Verify token signature using `BETTER_AUTH_SECRET`
3. Check token has not expired (`exp` claim)
4. Extract user identity from `sub` claim
5. Proceed with request if all checks pass

**Verification Failures:**

| Failure | HTTP Status | Response |
|---------|-------------|----------|
| No Authorization header | 401 | `{"detail": "Not authenticated"}` |
| Malformed header | 401 | `{"detail": "Invalid authorization header"}` |
| Invalid signature | 401 | `{"detail": "Invalid token"}` |
| Expired token | 401 | `{"detail": "Token expired"}` |
| Missing required claims | 401 | `{"detail": "Invalid token"}` |

### Token Structure

**Required JWT Claims:**

| Claim | Type | Description |
|-------|------|-------------|
| sub | string | User ID (subject) |
| iat | number | Issued at (Unix timestamp) |
| exp | number | Expiration (Unix timestamp) |

**Optional Claims:**

| Claim | Type | Description |
|-------|------|-------------|
| email | string | User's email address |
| name | string | User's display name |

### Token Security

| Rule | Implementation |
|------|----------------|
| Signing algorithm | HS256 (HMAC-SHA256) |
| Secret management | Environment variable `BETTER_AUTH_SECRET` |
| Token storage | HTTP-only secure cookies (frontend) |
| Transmission | HTTPS only |
| Expiration | 24 hours (configurable by Better Auth) |

## Authorization

### User Isolation Rules

**NON-NEGOTIABLE**: No user may access another user's data.

**URL-Based User ID Verification:**

1. Every task endpoint includes `{user_id}` in the URL path
2. Backend extracts `user_id` from JWT token (`sub` claim)
3. Backend compares URL `{user_id}` with JWT `user_id`
4. If they don't match → 403 Forbidden

```
Request: GET /api/user_123/tasks
JWT sub: user_456

Result: 403 Forbidden (user_123 ≠ user_456)
```

**Database Query Filtering:**

Every database query MUST include user_id filter:

```
// CORRECT
SELECT * FROM tasks WHERE user_id = :jwt_user_id AND id = :task_id

// WRONG - Never do this
SELECT * FROM tasks WHERE id = :task_id
```

### Authorization Matrix

| Resource | Action | Authorization |
|----------|--------|---------------|
| Task | Create | JWT user_id used as owner |
| Task | Read (list) | Filter by JWT user_id |
| Task | Read (single) | JWT user_id must match task owner |
| Task | Update | JWT user_id must match task owner |
| Task | Delete | JWT user_id must match task owner |

## Secure Defaults

### Backend Defaults

| Setting | Default | Rationale |
|---------|---------|-----------|
| CORS | Restricted to frontend origin | Prevent unauthorized origins |
| Authentication | Required on all /api routes | No accidental public endpoints |
| SQL Injection | Parameterized queries (SQLModel) | ORM prevents injection |
| Rate limiting | Not implemented (Phase II) | Future enhancement |

### Frontend Defaults

| Setting | Default | Rationale |
|---------|---------|-----------|
| Cookie secure flag | true | HTTPS only |
| Cookie httpOnly | true | Prevent XSS token theft |
| Cookie sameSite | lax | CSRF protection |
| API base URL | Environment variable | No hardcoded URLs |

## Threat Prevention

### SQL Injection Prevention

**Implemented by:**
- SQLModel ORM (parameterized queries)
- Pydantic validation (type enforcement)
- No raw SQL queries

### XSS Prevention

**Implemented by:**
- React's automatic escaping
- No `dangerouslySetInnerHTML`
- Content-Security-Policy header (recommended)

### CSRF Prevention

**Implemented by:**
- SameSite cookie attribute
- Bearer token authentication (stateless)
- CORS restrictions

### User Enumeration Prevention

**Implemented by:**
- Generic error messages for auth failures
- Same response for "user not found" and "wrong password"
- 404 for tasks regardless of ownership (no differentiation)

## Secret Management

### Environment Variables

| Variable | Purpose | Security |
|----------|---------|----------|
| BETTER_AUTH_SECRET | JWT signing | NEVER commit to repo |
| DATABASE_URL | Database connection | Contains credentials |
| NEXT_PUBLIC_API_URL | API URL | Can be public |

### Secret Handling Rules

| Rule | Implementation |
|------|----------------|
| Never hardcode secrets | Use environment variables |
| Never log secrets | Exclude from logging |
| Never expose in responses | Filter from error messages |
| Different secrets per environment | Unique values for dev/prod |

### .env File (Example)

```
# .env.local (NEVER commit)
BETTER_AUTH_SECRET=your-very-long-random-secret-key-min-32-chars
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### .gitignore Requirements

```
.env
.env.local
.env.production
*.pem
*.key
```

## Data Protection

### Sensitive Data Handling

| Data Type | Storage | Transmission |
|-----------|---------|--------------|
| Passwords | Hashed (bcrypt via Better Auth) | HTTPS |
| JWT tokens | HTTP-only cookies | HTTPS |
| User IDs | Plain (not secret) | HTTPS |
| Task content | Plain (no encryption) | HTTPS |

### Password Security

Handled by Better Auth:
- Bcrypt hashing
- Salt included
- Configurable work factor
- Never stored in plain text
- Never logged

### Database Security

| Measure | Implementation |
|---------|----------------|
| SSL connection | Required via DATABASE_URL |
| Connection pooling | Prevents connection exhaustion |
| Parameterized queries | SQLModel enforces |
| Foreign key constraints | Prevents orphan data |

## Error Handling Security

### Information Disclosure Prevention

| Error Type | Response |
|------------|----------|
| Internal server error | Generic message, no stack trace |
| Database error | Generic message, no SQL details |
| Validation error | Specific field errors (safe) |
| Auth error | Generic message (prevent enumeration) |

### Secure Error Messages

**CORRECT:**
```json
{"detail": "Invalid email or password"}
```

**WRONG (leaks information):**
```json
{"detail": "User with email user@example.com not found"}
```

## Security Headers (Recommended)

| Header | Value | Purpose |
|--------|-------|---------|
| X-Content-Type-Options | nosniff | Prevent MIME sniffing |
| X-Frame-Options | DENY | Prevent clickjacking |
| X-XSS-Protection | 1; mode=block | XSS filter |
| Strict-Transport-Security | max-age=31536000 | Force HTTPS |
| Content-Security-Policy | default-src 'self' | Restrict resource loading |

## Logging and Audit

### What to Log

| Event | Log Level |
|-------|-----------|
| Successful authentication | INFO |
| Failed authentication | WARN |
| Authorization failure (403) | WARN |
| Task created/updated/deleted | INFO |
| Server errors | ERROR |

### What NOT to Log

| Data | Reason |
|------|--------|
| Passwords | Security |
| JWT tokens | Security |
| Full request bodies | May contain sensitive data |
| Database credentials | Security |

## Security Testing Checklist

### Authentication Tests

- [ ] Requests without token return 401
- [ ] Requests with invalid token return 401
- [ ] Requests with expired token return 401
- [ ] Valid token allows access

### Authorization Tests

- [ ] User A cannot read User B's tasks
- [ ] User A cannot update User B's tasks
- [ ] User A cannot delete User B's tasks
- [ ] URL user_id mismatch returns 403

### Input Validation Tests

- [ ] SQL injection attempts blocked
- [ ] XSS payloads sanitized/escaped
- [ ] Oversized inputs rejected
- [ ] Invalid types rejected

### Data Protection Tests

- [ ] Passwords not visible in responses
- [ ] Passwords not visible in logs
- [ ] JWT secret not exposed
- [ ] Database credentials not exposed

## Incident Response

### Security Incident Types

| Incident | Response |
|----------|----------|
| Suspected token compromise | Rotate BETTER_AUTH_SECRET |
| Database credential leak | Rotate DATABASE_URL |
| User reports unauthorized access | Investigate access logs |

### Post-Incident Actions

1. Identify and contain the breach
2. Rotate affected credentials
3. Force logout all users (if token compromise)
4. Review access logs
5. Document and report

## Compliance

This specification complies with:
- Phase II Constitution v1.0.0
- Authentication-First Security Principle (III)
- User Data Isolation Principle (IV) - NON-NEGOTIABLE
- Quality Assurance Principle (X)
