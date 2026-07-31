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
- GET `/api/v1/projects?page=1&limit=10`
- GET `/api/v1/projects/:id`
- PUT `/api/v1/projects/PROJECT_ID`
- DELETE `/api/v1/projects/:id`

## Task

- POST `/api/v1/projects/:projectId/tasks`
  {
  "title": "Register Volunteers",
  "description": "Collect volunteer information before the event.",
  "dueDate": "2026-08-10"
  }
- GET `/api/v1/projects/:projectId/tasks`
- GET `/api/v1/projects/:projectId/tasks/:taskId`
- PUT `/api/v1/projects/:projectId/tasks/:taskId`
- DELETE `/api/v1/projects/:projectId/tasks/:taskId`

## Assign Volunteers

- `POST /api/v1/tasks/:taskId/assignments`
  {
  "volunteerIds": [
  "uuid-1",
  "uuid-2",
  "uuid-3"
  ]
  }

- GET `/api/v1/tasks/:taskId/assignments`
- DELETE `/api/v1/tasks/:taskId/assignments/:vwholunteerId`
- PATCH `/api/v1/projects/:projectId/tasks/:taskId/assignments/status`
- GET `/api/v1/projects/:projectId/tasks/:taskId/assignments`

## Notifications

- GET `/api/v1/notifications`
- PATCH `/api/v1/notifications/{notificationId}/read`
- PATCH `/api/v1/notifications/read-all`

## Dashbord progress

- GET `/api/v1/projects/:projectId/dashboard`
