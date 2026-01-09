# Feature Specification: Authentication

**Feature**: User Authentication (Signup, Signin, Signout)
**Authority**: Phase II Constitution v1.0.0
**Status**: Approved

## Overview

This specification defines the authentication system for the Hackathon Todo application. Authentication is handled by Better Auth on the frontend with JWT tokens used for backend API authorization.

## Authentication Provider

| Component | Technology |
|-----------|------------|
| Frontend Auth Library | Better Auth |
| Token Format | JWT (JSON Web Token) |
| Token Storage | HTTP-only secure cookie (managed by Better Auth) |
| Backend Verification | JWT signature verification using shared secret |

## User Stories

### US-AUTH-1: User Registration (Priority: P1)

**As a** new user
**I want to** create an account
**So that** I can use the application to manage my tasks

**Preconditions:**
- User is not authenticated
- User is on the signup page

**User Actions:**
1. User navigates to /signup
2. User enters name
3. User enters email address
4. User enters password
5. User clicks "Sign Up" button

**Expected Outcomes:**
- New user record is created
- User is automatically signed in
- JWT token is issued
- User is redirected to /tasks page
- Success notification is displayed

**Error Scenarios:**
| Scenario | Expected Behavior |
|----------|-------------------|
| Email already registered | Error message: "Email already in use" |
| Invalid email format | Form validation error |
| Password too weak | Form validation error with requirements |
| Empty required field | Form validation error |
| Network error | Error notification, form data preserved |

**Acceptance Criteria:**
- [ ] Name is required, 1-100 characters
- [ ] Email is required, valid email format
- [ ] Email must be unique in the system
- [ ] Password is required, minimum 8 characters
- [ ] Password field is masked
- [ ] Form shows real-time validation feedback
- [ ] Successful signup automatically signs user in

### US-AUTH-2: User Sign In (Priority: P1)

**As a** registered user
**I want to** sign in to my account
**So that** I can access my tasks

**Preconditions:**
- User has an existing account
- User is not currently authenticated
- User is on the signin page

**User Actions:**
1. User navigates to /signin
2. User enters email address
3. User enters password
4. User clicks "Sign In" button

**Expected Outcomes:**
- Credentials are verified
- JWT token is issued
- User is redirected to /tasks page
- Session is established

**Error Scenarios:**
| Scenario | Expected Behavior |
|----------|-------------------|
| Invalid email | Error: "Invalid email or password" |
| Wrong password | Error: "Invalid email or password" |
| Account not found | Error: "Invalid email or password" |
| Empty fields | Form validation error |
| Network error | Error notification |

**Acceptance Criteria:**
- [ ] Email and password are required
- [ ] Error messages do not reveal which field is wrong (security)
- [ ] Password field is masked
- [ ] "Remember me" is NOT required (Better Auth handles session)
- [ ] Redirect to intended page after sign in (or /tasks default)

### US-AUTH-3: User Sign Out (Priority: P1)

**As an** authenticated user
**I want to** sign out of my account
**So that** I can securely end my session

**Preconditions:**
- User is authenticated

**User Actions:**
1. User clicks "Sign Out" button in navigation/user menu

**Expected Outcomes:**
- Session is terminated
- JWT token is invalidated/removed
- User is redirected to landing page or signin page
- Protected pages are no longer accessible

**Acceptance Criteria:**
- [ ] Sign out is a single-click action (no confirmation)
- [ ] All session data is cleared
- [ ] User cannot access protected routes after sign out
- [ ] Redirect to / or /signin after sign out

### US-AUTH-4: Session Persistence (Priority: P1)

**As an** authenticated user
**I want to** remain signed in when I return to the application
**So that** I don't have to sign in every time

**Preconditions:**
- User previously signed in
- Session has not expired

**User Actions:**
1. User closes browser tab
2. User reopens the application

**Expected Outcomes:**
- User is still authenticated (if session valid)
- User is redirected to /tasks or appropriate page
- No re-authentication required

**Acceptance Criteria:**
- [ ] Session persists across page reloads
- [ ] Session persists across browser tab closes
- [ ] Expired sessions require re-authentication
- [ ] Better Auth manages session refresh automatically

### US-AUTH-5: Protected Route Access (Priority: P1)

**As the** system
**I want to** prevent unauthenticated access to protected pages
**So that** user data remains secure

**Preconditions:**
- User is not authenticated
- User attempts to access protected route

**Expected Behavior:**
- User is redirected to /signin
- Original intended URL is preserved for post-signin redirect

**Protected Routes:**
- /tasks
- /tasks/*

**Public Routes:**
- /
- /signin
- /signup

**Acceptance Criteria:**
- [ ] All /tasks routes require authentication
- [ ] Unauthenticated users are redirected to /signin
- [ ] After signin, user is redirected to originally requested page

## Credential Requirements

### Email

| Constraint | Value |
|------------|-------|
| Required | Yes |
| Format | Valid email address (RFC 5322) |
| Unique | Yes (one account per email) |
| Case | Case-insensitive for lookup |

### Password

| Constraint | Value |
|------------|-------|
| Required | Yes |
| Minimum Length | 8 characters |
| Maximum Length | 128 characters |
| Complexity | At least one letter and one number |
| Storage | Hashed (handled by Better Auth) |

### Name

| Constraint | Value |
|------------|-------|
| Required | Yes |
| Minimum Length | 1 character |
| Maximum Length | 100 characters |

## JWT Token Specification

### Token Structure

```
Header.Payload.Signature
```

### Payload Claims (Minimum Required)

| Claim | Description | Example |
|-------|-------------|---------|
| sub | User ID (subject) | "user_abc123" |
| email | User email | "user@example.com" |
| iat | Issued at (Unix timestamp) | 1704672000 |
| exp | Expiration (Unix timestamp) | 1704758400 |

### Token Lifecycle

| Event | Duration |
|-------|----------|
| Token Validity | 24 hours (default) |
| Refresh | Automatic (handled by Better Auth) |
| Expiration Behavior | Redirect to signin |

### Token Transmission

| Aspect | Specification |
|--------|---------------|
| Storage | HTTP-only secure cookie |
| API Requests | Authorization: Bearer header |
| HTTPS | Required for all requests |

## Better Auth Integration

### Frontend Configuration

Better Auth must be configured with:
- Email/password authentication provider
- JWT plugin for token generation
- Session management
- CORS configuration for API requests

### Environment Variables

| Variable | Purpose | Required By |
|----------|---------|-------------|
| BETTER_AUTH_SECRET | JWT signing key | Frontend + Backend |
| BETTER_AUTH_URL | Auth service URL | Frontend |

### Auth API Routes (Frontend)

| Route | Method | Purpose |
|-------|--------|---------|
| /api/auth/signup | POST | Create new account |
| /api/auth/signin | POST | Authenticate user |
| /api/auth/signout | POST | End session |
| /api/auth/session | GET | Get current session |

## Backend JWT Verification

### Verification Process

1. Extract token from Authorization header
2. Verify token signature using BETTER_AUTH_SECRET
3. Check token expiration
4. Extract user_id from token payload
5. Validate URL user_id matches token user_id

### Failure Responses

| Scenario | HTTP Status | Response |
|----------|-------------|----------|
| No token | 401 | {"detail": "Not authenticated"} |
| Invalid token | 401 | {"detail": "Invalid token"} |
| Expired token | 401 | {"detail": "Token expired"} |
| User ID mismatch | 403 | {"detail": "Access forbidden"} |

## UI Specifications

### Sign Up Form

- Name input field
- Email input field
- Password input field (masked)
- "Sign Up" button
- Link to signin page: "Already have an account? Sign in"
- Real-time validation feedback

### Sign In Form

- Email input field
- Password input field (masked)
- "Sign In" button
- Link to signup page: "Don't have an account? Sign up"
- Error message area

### User Menu (Authenticated)

- Display user name or email
- Sign Out button/link
- Dropdown or inline menu in navigation

### Loading States

- Button shows loading spinner during auth operations
- Form inputs disabled during submission
- Page shows loading state while checking auth

## Security Requirements

### Password Security

- Passwords NEVER stored in plain text
- Passwords NEVER logged or displayed
- Password field always uses type="password"
- Better Auth handles secure hashing

### Session Security

- HTTP-only cookies (not accessible via JavaScript)
- Secure flag (HTTPS only)
- SameSite attribute for CSRF protection
- Session invalidated on sign out

### Token Security

- Signed with BETTER_AUTH_SECRET
- Short expiration time
- Not stored in localStorage (vulnerable to XSS)
- Transmitted only over HTTPS

## Compliance

This specification complies with:
- Phase II Constitution v1.0.0
- Authentication-First Security Principle (III)
- User Data Isolation Principle (IV)
- Technology Stack Compliance Principle (VIII) - Better Auth
