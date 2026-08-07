# Volunteer Management System API

A REST API for managing volunteers, tasks, projects, attendance, notifications, and reports for a volunteer coordination platform.

This project is built with:

- Node.js
- Express
- PostgreSQL
- Sequelize ORM
- JWT authentication
- Resend email delivery
- Cloudinary for profile image uploads

---

## 1. Project overview

The API supports three main roles:

- ADMIN
- COORDINATOR
- VOLUNTEER

The system allows:

- User registration and login
- Password reset via email
- Project creation and management
- Task assignment to volunteers
- QR-based attendance tracking
- Manual attendance check-in/check-out
- Volunteer notifications
- Weekly/daily reporting and analytics

---

## 2. Base URL

```http
http://localhost:5000
```

All protected routes require a bearer token:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

## 3. Tech stack

### Runtime

- Node.js
- Express.js
- PostgreSQL
- Sequelize

### Security / auth

- JWT
- bcrypt
- Helmet
- CORS

### Additional features

- Resend for sending email
- Cloudinary for uploading avatar images
- QR generation for attendance

---

## 4. Environment setup

Create a `.env` file using the project example values.

### Required environment variables

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=volunteer_management
DB_USER=your_db_user
DB_PASSWORD=your_db_password

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
NODE_ENV=development

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

QR_SECRET=your_qr_secret
QR_EXPIRES_IN=15m

RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=onboarding@resend.dev
CLIENT_URL=http://localhost:5173
```

### Install dependencies

```bash
npm install
```

### Run the server

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

---

## 5. Project structure

```text
src/
  app.js
  server.js
  config/
    cloudinary.js
    database.js
    multer.js
  constants/
    roles.js
  controllers/
  middleware/
  models/
  routes/
  services/
  validators/
```

### Main responsibilities

- `controllers/` – handles HTTP request/response flow
- `services/` – business logic
- `routes/` – API endpoints
- `validators/` – input validation with express-validator
- `models/` – Sequelize models
- `middleware/` – auth and validation middleware

---

## 6. Authentication API

### 6.1 Register user

**Endpoint**

```http
POST /api/v1/auth/register
```

**Expected input**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "VOLUNTEER"
}
```

**Notes**

- `role` is optional
- Valid roles: `VOLUNTEER`, `COORDINATOR`, `ADMIN`
- Email must be unique

**Success response**

```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "VOLUNTEER"
    },
    "token": "jwt-token"
  }
}
```

**Error response**

```json
{
  "success": false,
  "message": "Email already exists"
}
```

### 6.2 Login user

**Endpoint**

```http
POST /api/v1/auth/login
```

**Expected input**

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Success response**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "VOLUNTEER"
    },
    "token": "jwt-token"
  }
}
```

**Error response**

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

## 7. User profile API

All user profile routes require authentication.

### 7.1 Get profile

**Endpoint**

```http
GET /api/v1/users/profile
```

**Headers**

```http
Authorization: Bearer <JWT_TOKEN>
```

**Success response**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "VOLUNTEER",
    "avatar": null,
    "avatarPublicId": null,
    "createdAt": "2026-08-01T00:00:00.000Z",
    "updatedAt": "2026-08-01T00:00:00.000Z"
  }
}
```

### 7.2 Update profile

**Endpoint**

```http
PUT /api/v1/users/profile
```

**Expected input**

```json
{
  "firstName": "John",
  "lastName": "Smith"
}
```

**Success response**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john@example.com",
    "role": "VOLUNTEER",
    "avatar": null,
    "avatarPublicId": null
  }
}
```

### 7.3 Upload profile avatar

**Endpoint**

```http
PATCH /api/v1/users/profile/avatar
```

**Expected input**

- Form-data multipart file
- Field name: `avatar`

**Success response**

```json
{
  "success": true,
  "message": "Profile picture uploaded successfully",
  "data": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "VOLUNTEER",
    "avatar": "https://.../avatar.jpg",
    "avatarPublicId": "avatar_public_id"
  }
}
```

---

## 8. Project management API

### 8.1 Create project

**Endpoint**

```http
POST /api/v1/projects
```

**Required role**

- COORDINATOR

**Expected input**

```json
{
  "title": "Community Food Drive",
  "description": "Distribute food packages to families in need.",
  "startDate": "2026-08-10",
  "endDate": "2026-08-15"
}
```

**Success response**

```json
{
  "success": true,
  "message": "Project created successfully.",
  "data": {
    "id": "uuid",
    "title": "Community Food Drive",
    "description": "Distribute food packages to families in need.",
    "startDate": "2026-08-10",
    "endDate": "2026-08-15",
    "status": "DRAFT",
    "createdBy": "uuid"
  }
}
```

### 8.2 List projects

**Endpoint**

```http
GET /api/v1/projects?page=1&limit=10
```

**Success response**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Community Food Drive",
      "description": "Distribute food packages to families in need.",
      "startDate": "2026-08-10",
      "endDate": "2026-08-15",
      "status": "DRAFT",
      "createdBy": "uuid"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### 8.3 Get project by id

**Endpoint**

```http
GET /api/v1/projects/:id
```

### 8.4 Update project

**Endpoint**

```http
PUT /api/v1/projects/:id
```

**Expected input**

```json
{
  "title": "Updated Project Name",
  "description": "Updated description",
  "status": "ACTIVE"
}
```

### 8.5 Delete project

**Endpoint**

```http
DELETE /api/v1/projects/:id
```

---

## 9. Task API

### 9.1 Create task

**Endpoint**

```http
POST /api/v1/projects/:projectId/tasks
```

**Required role**

- COORDINATOR

**Expected input**

```json
{
  "title": "Register volunteers",
  "description": "Collect volunteer details and emergency contacts.",
  "dueDate": "2026-08-12"
}
```

**Success response**

```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": "uuid",
    "title": "Register volunteers",
    "description": "Collect volunteer details and emergency contacts.",
    "dueDate": "2026-08-12",
    "status": "PENDING",
    "projectId": "uuid"
  }
}
```

### 9.2 Get tasks for project

**Endpoint**

```http
GET /api/v1/projects/:projectId/tasks
```

### 9.3 Get task by id

**Endpoint**

```http
GET /api/v1/projects/:projectId/tasks/:taskId
```

### 9.4 Update task

**Endpoint**

```http
PUT /api/v1/projects/:projectId/tasks/:taskId
```

**Expected input**

```json
{
  "title": "Updated task name",
  "description": "Updated task detail",
  "status": "IN_PROGRESS"
}
```

### 9.5 Delete task

**Endpoint**

```http
DELETE /api/v1/projects/:projectId/tasks/:taskId
```

---

## 10. Volunteer assignment API

### 10.1 Assign volunteers to task

**Endpoint**

```http
POST /api/v1/tasks/:taskId/assignments
```

**Required role**

- COORDINATOR

**Expected input**

```json
{
  "volunteerIds": ["uuid-1", "uuid-2", "uuid-3"]
}
```

**Success response**

```json
{
  "success": true,
  "message": "Volunteers assigned successfully",
  "data": [
    {
      "id": "uuid",
      "taskId": "uuid",
      "volunteerId": "uuid-1"
    }
  ]
}
```

### 10.2 Get assignments for a task

**Endpoint**

```http
GET /api/v1/tasks/:taskId/assignments
```

### 10.3 Remove volunteer assignment

**Endpoint**

```http
DELETE /api/v1/tasks/:taskId/assignments/:volunteerId
```

### 10.4 Update assignment status

**Endpoint**

```http
PATCH /api/v1/projects/:projectId/tasks/:taskId/assignments/status
```

**Expected input**

```json
{
  "status": "COMPLETED"
}
```

---

## 11. Attendance API

### 11.1 Generate QR code for a project

**Endpoint**

```http
POST /api/v1/projects/:projectId/qr-code
```

**Required role**

- COORDINATOR

**Success response**

```json
{
  "success": true,
  "message": "QR Code generated successfully",
  "data": {
    "token": "qr-token",
    "projectId": "uuid"
  }
}
```

### 11.2 Check in using QR code

**Endpoint**

```http
POST /api/v1/attendance/check-in
```

**Required role**

- VOLUNTEER

**Expected input**

```json
{
  "token": "qr-token"
}
```

**Success response**

```json
{
  "success": true,
  "message": "Attendance recorded successfully",
  "data": {
    "id": "uuid",
    "projectId": "uuid",
    "volunteerId": "uuid",
    "checkInTime": "2026-08-01T09:00:00.000Z"
  }
}
```

### 11.3 Manual check-in

**Endpoint**

```http
POST /api/v1/projects/:projectId/manual-check-in
```

**Required role**

- VOLUNTEER

### 11.4 Check out

**Endpoint**

```http
PATCH /api/v1/projects/:projectId/check-out
```

**Required role**

- VOLUNTEER

**Success response**

```json
{
  "success": true,
  "message": "Checked out successfully",
  "data": {
    "id": "uuid",
    "projectId": "uuid",
    "volunteerId": "uuid",
    "checkOutTime": "2026-08-01T12:00:00.000Z"
  }
}
```

### 11.5 Attendance history

**Endpoint**

```http
GET /api/v1/attendance/history
```

**Required role**

- VOLUNTEER

**Success response**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "uuid",
      "projectId": "uuid",
      "volunteerId": "uuid",
      "checkInTime": "2026-08-01T09:00:00.000Z",
      "checkOutTime": "2026-08-01T12:00:00.000Z",
      "hoursWorked": 3
    }
  ]
}
```

---

## 12. Notification API

### 12.1 Get notifications

**Endpoint**

```http
GET /api/v1/notifications
```

**Success response**

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "uuid",
      "message": "You have been assigned to a new task",
      "read": false
    }
  ]
}
```

### 12.2 Mark a notification as read

**Endpoint**

```http
PATCH /api/v1/notifications/:id/read
```

### 12.3 Mark all notifications as read

**Endpoint**

```http
PATCH /api/v1/notifications/read-all
```

---

## 13. Reports and analytics API

### 13.1 Get volunteer hours report

**Endpoint**

```http
GET /api/v1/reports/volunteer-hours
```

**Required role**

- ADMIN

### 13.2 Get project attendance report

**Endpoint**

```http
GET /api/v1/reports/projects/:projectId/attendance
```

**Required role**

- COORDINATOR

### 13.3 Coordinator dashboard

**Endpoint**

```http
GET /api/v1/dashboard/coordinator
```

**Required role**

- COORDINATOR

### 13.4 Project dashboard

**Endpoint**

```http
GET /api/v1/projects/:projectId/dashboard
```

**Required role**

- COORDINATOR

### 13.5 System analytics

**Endpoint**

```http
GET /api/v1/analytics
```

**Required role**

- ADMIN

---

## 14. Response format

The API follows a consistent response format.

### Success responses

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Error responses

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common HTTP status codes

| Status | Meaning                                  |
| ------ | ---------------------------------------- |
| 200    | Successful request                       |
| 201    | Resource created                         |
| 400    | Invalid input or validation failure      |
| 401    | Authentication required or invalid token |
| 403    | Forbidden for current role               |
| 404    | Resource not found                       |
| 409    | Conflict / duplicate record              |
| 500    | Internal server error                    |

---

## 15. Validation rules

The project uses `express-validator` for payload validation.

### Auth validation rules

- Email must be valid
- Password must be at least 8 characters
- First and last name cannot be empty
- Token cannot be empty for password reset

### Project validation rules

- Title required
- Description required
- Start date required and valid ISO date
- End date required and valid ISO date
- End date cannot be earlier than start date

### Task validation rules

- Title required
- Due date required
- Task status must match allowed values

### Assignment validation rules

- `volunteerIds` must be an array with at least one item
- Each volunteer ID must be a valid UUID

---

## 16. Roles and permission model

### ADMIN

- Full system analytics
- Volunteer-hours reporting
- Global visibility

### COORDINATOR

- Create/update/delete projects
- Create/update/delete tasks
- Assign volunteers
- Generate QR codes
- View project dashboard and project reports

### VOLUNTEER

- Register/login
- Check in and check out
- View attendance history
- Receive task assignment notifications

---

## 17. Password reset email flow

The password reset flow works as follows:

1. User calls `POST /api/v1/auth/forgot-password`
2. API validates email
3. If the user exists, a secure token is generated
4. Token is hashed and stored in the database
5. Reset link is sent through Resend
6. User opens reset link to submit new password
7. API validates token, checks expiry, and updates password

**Reset link example**

```http
http://localhost:5173/reset-password/<token>
```

---

## 18. Notes for frontend integration

When integrating with a frontend application:

- Store the JWT in local storage, session storage, or secure cookie
- Include the token in the `Authorization` header as `Bearer <token>`
- Send `Content-Type: application/json` for JSON payload requests
- For avatar uploads, use multipart form-data

---

## 19. Common example requests

### Register

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane@example.com",
    "password": "secret123",
    "role": "VOLUNTEER"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "secret123"
  }'
```

### Get profile

```bash
curl http://localhost:5000/api/v1/users/profile \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

### Create project

```bash
curl -X POST http://localhost:5000/api/v1/projects \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "School Outreach",
    "description": "Volunteer support for school registration day.",
    "startDate": "2026-08-20",
    "endDate": "2026-08-24"
  }'
```

---

## 20. Known implementation notes

- This project currently uses a Sequelize `PasswordReset` model that stores hashed reset tokens.
- Resend email delivery depends on valid `RESEND_API_KEY` and `EMAIL_FROM` configuration.
- The project relies on PostgreSQL for persistence.
- Some endpoints are role-protected and will reject unauthorized access with `401` or `403` responses.

---

## 21. Quick start summary

```bash
npm install
cp .env.example .env
# fill in your real database and email credentials
npm run dev
```

Then use the API at:

```http
http://localhost:5000
```

---
