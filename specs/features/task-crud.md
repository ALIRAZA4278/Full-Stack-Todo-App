# Feature Specification: Task CRUD Operations

**Feature**: Task Management (Create, Read, Update, Delete)
**Authority**: Phase II Constitution v1.0.0
**Status**: Approved

## Overview

This specification defines all task management operations available to authenticated users. Each user manages their own private task list with complete data isolation from other users.

## User Stories

### US-1: View All Tasks (Priority: P1)

**As an** authenticated user
**I want to** see all my tasks in a list
**So that** I can track what I need to do

**Preconditions:**
- User is authenticated with valid JWT
- User is on the tasks page

**User Actions:**
1. User navigates to /tasks page

**Expected Outcomes:**
- System displays all tasks owned by the authenticated user
- Tasks are displayed in reverse chronological order (newest first)
- Each task shows: title, completion status, created date
- If user has no tasks, an empty state message is displayed

**Acceptance Criteria:**
- [ ] Only tasks with matching user_id are returned
- [ ] Tasks from other users are NEVER visible
- [ ] Empty state displays when no tasks exist
- [ ] Loading state displays while fetching

### US-2: Create New Task (Priority: P1)

**As an** authenticated user
**I want to** create a new task
**So that** I can track something I need to do

**Preconditions:**
- User is authenticated with valid JWT
- User is on the tasks page

**User Actions:**
1. User clicks "Add Task" button
2. User enters task title (required)
3. User optionally enters task description
4. User clicks "Create" button

**Expected Outcomes:**
- New task is created in the database
- Task is assigned to the authenticated user (user_id from JWT)
- Task appears in the task list immediately
- Success notification is displayed
- Form is cleared after successful creation

**Error Scenarios:**
| Scenario | Expected Behavior |
|----------|-------------------|
| Empty title | Form validation error, task not created |
| Title > 200 characters | Form validation error, task not created |
| Description > 1000 characters | Form validation error, task not created |
| Network error | Error notification, form data preserved |
| 401 Unauthorized | Redirect to sign in page |

**Acceptance Criteria:**
- [ ] Title is required, 1-200 characters
- [ ] Description is optional, max 1000 characters
- [ ] Task user_id is set from JWT (not from form input)
- [ ] Task completed defaults to false
- [ ] Task created_at and updated_at are set to current UTC timestamp
- [ ] UI updates optimistically (task appears before API confirms)

### US-3: View Task Details (Priority: P2)

**As an** authenticated user
**I want to** view the full details of a task
**So that** I can see the complete description

**Preconditions:**
- User is authenticated with valid JWT
- Task exists and belongs to the authenticated user

**User Actions:**
1. User clicks on a task in the list

**Expected Outcomes:**
- Task details panel or modal displays
- Shows: title, description, completion status, created date, updated date

**Error Scenarios:**
| Scenario | Expected Behavior |
|----------|-------------------|
| Task not found | 404 error, redirect to task list |
| Task belongs to another user | 403 error, redirect to task list |

**Acceptance Criteria:**
- [ ] Only display task if user_id matches authenticated user
- [ ] Display all task fields
- [ ] Provide options to edit or delete from detail view

### US-4: Edit Task (Priority: P1)

**As an** authenticated user
**I want to** edit an existing task
**So that** I can update the title or description

**Preconditions:**
- User is authenticated with valid JWT
- Task exists and belongs to the authenticated user

**User Actions:**
1. User clicks "Edit" on a task
2. User modifies title and/or description
3. User clicks "Save" button

**Expected Outcomes:**
- Task is updated in the database
- updated_at timestamp is refreshed
- UI reflects changes immediately
- Success notification is displayed

**Error Scenarios:**
| Scenario | Expected Behavior |
|----------|-------------------|
| Empty title | Form validation error, task not updated |
| Title > 200 characters | Form validation error |
| Task belongs to another user | 403 Forbidden, task not updated |
| Task not found | 404 Not Found |

**Acceptance Criteria:**
- [ ] Only task owner can edit
- [ ] Title validation enforced (1-200 chars)
- [ ] Description validation enforced (max 1000 chars)
- [ ] user_id cannot be changed
- [ ] completed status is NOT changed by edit (separate operation)
- [ ] updated_at is set to current UTC timestamp

### US-5: Toggle Task Completion (Priority: P1)

**As an** authenticated user
**I want to** mark a task as complete or incomplete
**So that** I can track my progress

**Preconditions:**
- User is authenticated with valid JWT
- Task exists and belongs to the authenticated user

**User Actions:**
1. User clicks the completion checkbox/toggle on a task

**Expected Outcomes:**
- Task completed status is toggled (true ↔ false)
- updated_at timestamp is refreshed
- UI reflects change immediately (optimistic update)
- Visual indicator shows completed state (strikethrough, checkmark)

**Error Scenarios:**
| Scenario | Expected Behavior |
|----------|-------------------|
| Task belongs to another user | 403 Forbidden, no change |
| Task not found | 404 Not Found |
| Network error | Revert optimistic update, show error |

**Acceptance Criteria:**
- [ ] Only task owner can toggle completion
- [ ] Completed tasks are visually distinct
- [ ] Toggle is a single-click action (no confirmation)
- [ ] Optimistic UI update with rollback on failure

### US-6: Delete Task (Priority: P1)

**As an** authenticated user
**I want to** delete a task
**So that** I can remove tasks I no longer need

**Preconditions:**
- User is authenticated with valid JWT
- Task exists and belongs to the authenticated user

**User Actions:**
1. User clicks "Delete" on a task
2. Confirmation dialog appears
3. User confirms deletion

**Expected Outcomes:**
- Task is permanently deleted from database
- Task is removed from UI immediately
- Success notification is displayed

**Error Scenarios:**
| Scenario | Expected Behavior |
|----------|-------------------|
| Task belongs to another user | 403 Forbidden, task not deleted |
| Task not found | 404 Not Found |
| User cancels confirmation | No action taken |

**Acceptance Criteria:**
- [ ] Only task owner can delete
- [ ] Confirmation required before deletion
- [ ] Deletion is permanent (no soft delete)
- [ ] UI updates immediately after confirmation

## Validation Constraints

### Task Title

| Constraint | Value |
|------------|-------|
| Required | Yes |
| Minimum Length | 1 character |
| Maximum Length | 200 characters |
| Allowed Characters | Any printable characters |
| Whitespace | Trimmed from start/end |

### Task Description

| Constraint | Value |
|------------|-------|
| Required | No |
| Maximum Length | 1000 characters |
| Allowed Characters | Any printable characters |
| Whitespace | Preserved (except leading/trailing) |

## Ownership Enforcement Rules

### Backend Enforcement (Mandatory)

1. **Extract user_id from JWT token** - NEVER from request body or URL parameter trust
2. **Verify URL user_id matches JWT user_id** - Return 403 if mismatch
3. **Filter all queries by user_id** - Every SELECT, UPDATE, DELETE must include user_id clause
4. **Set user_id on create** - Use JWT user_id, ignore any user_id in request body

### Frontend Behavior

1. **Include JWT in all requests** - Authorization: Bearer header
2. **Use authenticated user's ID in URLs** - /api/{user_id}/tasks
3. **Never allow user_id editing** - Field not exposed in forms

## Data Invariants

| Invariant | Description |
|-----------|-------------|
| Task always has owner | user_id is NOT NULL and FK constrained |
| Task always has title | title is NOT NULL |
| Task has creation timestamp | created_at is NOT NULL, immutable |
| Task has update timestamp | updated_at is NOT NULL, updates on any change |
| Completion has default | completed defaults to false |

## UI Behavior Specifications

### Task List Display

- Tasks displayed in card format
- Each card shows: checkbox, title, description preview (truncated), created date
- Completed tasks show visual distinction (muted colors, strikethrough)
- Click on card expands or navigates to detail view

### Form Behavior

- Real-time validation feedback as user types
- Submit button disabled until form is valid
- Clear error messages with specific guidance
- Form preserves input on validation failure
- Form clears on successful submission

### Loading States

- Skeleton cards while loading task list
- Spinner on buttons during API calls
- Disable form inputs during submission

### Empty State

- Friendly message when no tasks exist
- Call-to-action button to create first task
- Illustration or icon to make state visually clear

## Compliance

This specification complies with:
- Phase II Constitution v1.0.0
- User Data Isolation Principle (IV) - NON-NEGOTIABLE
- RESTful API Consistency Principle (V)
- Quality Assurance Principle (X)
