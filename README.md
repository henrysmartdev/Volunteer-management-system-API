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
