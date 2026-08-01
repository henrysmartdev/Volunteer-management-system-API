# Volunteer-management-system-API

Core API endpoints for the Volunteer Management System, including authentication, user profile, and project management.

## Authentication

- POST `/api/v1/auth/register`
- POST `/api/v1/auth/login`
- POST `/api/v1/auth/forgot-password`
- POST `/api/v1/auth/reset-password`

## User profile

- GET `/api/v1/users/profile`
- PUT `/api/v1/users/profile`
- PATCH `/api/v1/users/profile/avatar`
  - multipart form field: `avatar`

## Projects

- POST `/api/v1/projects`
- GET  `/api/v1/projects`
- GET  `/api/v1/projects/:id`
- PATCH `/api/v1/projects/:id`
- DELETE `/api/v1/projects/:id`


# Task & Assignment Module API Documentation

This document describes the Task and Assignment modules of the Volunteer Management System API.

---

# Task Module

## Base Route

```
/api/v1/projects/:projectId/tasks
```

Tasks belong to a Project.

---

## 1. Create Task

**Endpoint**

```http
POST /api/v1/projects/:projectId/tasks
```

### Description

Creates a new task under a project.

### Request Body

```json
{
  "title": "Medical Registration",
  "description": "Register beneficiaries",
  "dueDate": "2026-09-10",
  "priority": "HIGH"
}
```

### Business Rules

- Validate project ID.
- Ensure project exists.
- Prevent creation if project status is:
  - ARCHIVED
  - COMPLETED
- Task status defaults to **NOT_STARTED**.
- Save the authenticated coordinator as the creator.

---

## 2. Get All Tasks

**Endpoint**

```http
GET /api/v1/projects/:projectId/tasks
```

### Description

Returns all tasks belonging to a project.

### Business Rules

- Validate project ID.
- Ensure project exists.
- Return all tasks for the project.

---

## 3. Get Task By ID

**Endpoint**

```http
GET /api/v1/task/:taskId
```

### Description

Returns a single task.

### Business Rules

- Validate task ID.
- Ensure task exists.

---

## 4. Update Task

**Endpoint**

```http
PATCH /api/v1/tasks/:taskId
```

### Description

Updates task details.

### Allowed Fields

- title
- description
- priority
- dueDate

> **Task status is intentionally excluded because it is automatically synchronized based on Assignment progress.**

### Business Rules

- Validate task ID.
- Ensure task exists.
- Restrict updates to allowed fields.
- Prevent duplicate titles (if applicable).
- Validate due date.

---

## 5. Delete Task

**Endpoint**

```http
DELETE /api/v1/tasks/:taskId
```

### Description

Deletes a task.

### Business Rules

- Validate task ID.
- Ensure task exists.
- Delete task.
- Return deleted task.

---

# Assignment Module

## Base Routes

Create Assignment

```
/api/v1/tasks/:taskId/assignments
```

Manage Assignment

```
/api/v1/assignments
```

---

## 1. Create Assignment

**Endpoint**

```http
POST /api/v1/tasks/:taskId/assignments
```

### Description

Assigns a volunteer to a task.

### Request Body

```json
{
  "volunteerId": "uuid"
}
```

### Business Rules

- Validate task ID.
- Ensure task exists.
- Validate volunteer ID.
- Ensure volunteer exists.
- Ensure the user has the VOLUNTEER role.
- Prevent duplicate assignments.
- Assignment status defaults to **NOT_STARTED**.

---

## 2. Get All Assignments

**Endpoint**

```http
GET /api/v1/tasks/:taskId/assignments
```

### Description

Returns all volunteers assigned to a task.

### Business Rules

- Validate task ID.
- Ensure task exists.
- Return all assignments for the task.

---

## 3. Get Assignment By ID

**Endpoint**

```http
GET /api/v1/assignments/:assignmentId
```

### Description

Returns a single assignment.

### Includes

- Volunteer information
- Task information

### Business Rules

- Validate assignment ID.
- Ensure assignment exists.

---

## 4. Update Assignment Status

**Endpoint**

```http
PATCH /api/v1/assignments/:assignmentId
```

### Description

Updates the status of an assignment.

### Request Body

```json
{
  "status": "IN_PROGRESS"
}
```

### Allowed Field

- status

### Authorization

Coordinator

- Can update any assignment.

Volunteer

- Can update **only their own** assignment.

### Business Rules

- Validate assignment ID.
- Ensure assignment exists.
- Restrict updates to the status field.
- Update assignment.
- Automatically synchronize the parent task status.

---

### Automatic Task Status Synchronization

Whenever an assignment status changes, the backend automatically updates the parent task.

| Assignment Statuses | Resulting Task Status |
|---------------------|----------------------|
| All NOT_STARTED | NOT_STARTED |
| At least one IN_PROGRESS | IN_PROGRESS |
| At least one COMPLETED but not all completed | IN_PROGRESS |
| All COMPLETED | COMPLETED |

This synchronization is handled internally by:

```javascript
updateTaskStatus(taskId)
```

No coordinator intervention is required.

---

## 5. Delete Assignment

**Endpoint**

```http
DELETE /api/v1/assignments/:assignmentId
```

### Description

Removes a volunteer from a task.

### Authorization

Coordinator only.

### Business Rules

- Validate assignment ID.
- Ensure assignment exists.
- Delete assignment.
- Return deleted assignment.

---

# Workflow

```
Project
   │
   ├── Task
   │      │
   │      ├── Assignment
```

Example Progress Flow

```
Task
Status: NOT_STARTED

John -> NOT_STARTED
Mary -> NOT_STARTED
```

↓

John starts work.

```
John -> IN_PROGRESS
Mary -> NOT_STARTED
```

↓

Task becomes

```
IN_PROGRESS
```

↓

John completes.

```
John -> COMPLETED
Mary -> NOT_STARTED
```

↓

Task remains

```
IN_PROGRESS
```

↓

Mary completes.

```
John -> COMPLETED
Mary -> COMPLETED
```

↓

Task becomes

```
COMPLETED
```

---

# Endpoint Summary

| Module | Method | Endpoint | Description |
|---------|--------|----------|-------------|
| Task | POST | `/api/v1/projects/:projectId/tasks` | Create a task |
| Task | GET | `/api/v1/projects/:projectId/tasks` | Get all tasks in a project |
| Task | GET | `/api/v1/tasks/:taskId` | Get a task by ID |
| Task | PATCH | `/api/v1/tasks/:taskId` | Update task details |
| Task | DELETE | `/api/v1/tasks/:taskId` | Delete a task |
| Assignment | POST | `/api/v1/tasks/:taskId/assignments` | Assign a volunteer to a task |
| Assignment | GET | `/api/v1/tasks/:taskId/assignments` | Get all assignments for a task |
| Assignment | GET | `/api/v1/assignments/:assignmentId` | Get an assignment by ID |
| Assignment | PATCH | `/api/v1/assignments/:assignmentId` | Update assignment status (automatically updates the parent task status) |
| Assignment | DELETE | `/api/v1/assignments/:assignmentId` | Remove a volunteer from a task |


## Get My Assignments

Returns all assignments belonging to the currently authenticated volunteer.

### Endpoint

```http
GET /api/v1/assignments/my
```

### Authorization

**Bearer Token Required**

Only authenticated volunteers can access this endpoint.

### Request Headers

```http
Authorization: Bearer <JWT_TOKEN>
```

### Request Body

None.

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Assignments retrieved successfully.",
  "data": [
    {
      "id": "c6c648db-300d-48fd-8734-dfd4616d1232",
      "taskId": "0c768410-0439-45ec-95d1-313cf7c6a47c",
      "volunteerId": "6d5d6c4a-4f9e-4d8d-a7ef-9a1e3c0f2b41",
      "status": "IN_PROGRESS",
      "createdAt": "2026-08-01T10:20:30.000Z",
      "updatedAt": "2026-08-01T11:45:18.000Z",
      "Task": {
        "id": "0c768410-0439-45ec-95d1-313cf7c6a47c",
        "title": "Volunteer Registration",
        "description": "Register all volunteers arriving for the outreach event.",
        "priority": "HIGH",
        "status": "IN_PROGRESS",
        "dueDate": "2026-08-14"
      }
    }
  ]
}
```

