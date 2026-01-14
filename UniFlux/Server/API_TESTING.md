# API Testing Guide for CRUD Operations

## Overview
This guide covers testing the newly implemented CRUD API endpoints for Students, Teachers, and Subjects.

## Prerequisites
1. Server running on `http://localhost:5000`
2. MongoDB connection established
3. Valid JWT token for authentication

## Authentication

### Register a User
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@uniflux.com",
  "password": "admin123",
  "role": "admin"
}
```

### Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@uniflux.com",
  "password": "admin123"
}
```

**Note**: Copy the returned `token` for use in subsequent requests.

## Student APIs

### 1. Get All Students (with pagination, search, filters)
```bash
GET http://localhost:5000/api/students?page=1&limit=10&search=John&semester=3&department=60a1b2c3d4e5f6g7h8i9j0k1
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by name, email, or registration number
- `department` (optional): Filter by department ID
- `semester` (optional): Filter by current semester
- `course` (optional): Filter by course ID
- `status` (optional): Filter by status (active/inactive/graduated)

### 2. Get Single Student
```bash
GET http://localhost:5000/api/students/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

### 3. Create Student
```bash
POST http://localhost:5000/api/students
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@student.uniflux.com",
  "password": "student123",
  "dateOfBirth": "2002-05-15",
  "gender": "male",
  "phone": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "department": "60a1b2c3d4e5f6g7h8i9j0k1",
  "course": "60a1b2c3d4e5f6g7h8i9j0k2",
  "semester": 3,
  "enrollmentYear": 2022,
  "guardianName": "Jane Doe",
  "guardianPhone": "+1234567891",
  "guardianEmail": "jane.doe@email.com"
}
```

**Note**: Registration number is auto-generated.

### 4. Update Student
```bash
PUT http://localhost:5000/api/students/:id
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "semester": 4,
  "phone": "+1234567899",
  "address": {
    "street": "456 Oak Ave",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
```

### 5. Delete Student
```bash
DELETE http://localhost:5000/api/students/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

### 6. Get Student Attendance
```bash
GET http://localhost:5000/api/students/:id/attendance?semester=3
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters:**
- `semester` (optional): Filter by semester
- `subject` (optional): Filter by subject ID

### 7. Get Student Marks
```bash
GET http://localhost:5000/api/students/:id/marks?semester=3
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters:**
- `semester` (optional): Filter by semester
- `subject` (optional): Filter by subject ID

## Teacher APIs

### 1. Get All Teachers (with pagination, search, filters)
```bash
GET http://localhost:5000/api/teachers?page=1&limit=10&search=Dr&department=60a1b2c3d4e5f6g7h8i9j0k1
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by name, email, or employee ID
- `department` (optional): Filter by department ID
- `designation` (optional): Filter by designation
- `status` (optional): Filter by status (active/on-leave/resigned)

### 2. Get Single Teacher
```bash
GET http://localhost:5000/api/teachers/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

### 3. Create Teacher
```bash
POST http://localhost:5000/api/teachers
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Dr. Sarah Smith",
  "email": "sarah.smith@uniflux.com",
  "password": "teacher123",
  "dateOfBirth": "1985-08-20",
  "gender": "female",
  "phone": "+1234567892",
  "address": {
    "street": "789 University Ave",
    "city": "Boston",
    "state": "MA",
    "zipCode": "02101",
    "country": "USA"
  },
  "department": "60a1b2c3d4e5f6g7h8i9j0k1",
  "designation": "Assistant Professor",
  "qualification": "Ph.D. in Computer Science",
  "experience": 8,
  "joiningDate": "2020-01-15",
  "specialization": "Machine Learning, Data Science"
}
```

**Note**: Employee ID is auto-generated.

### 4. Update Teacher
```bash
PUT http://localhost:5000/api/teachers/:id
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "designation": "Associate Professor",
  "experience": 9,
  "phone": "+1234567893"
}
```

### 5. Delete Teacher
```bash
DELETE http://localhost:5000/api/teachers/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

### 6. Get Teacher Subjects
```bash
GET http://localhost:5000/api/teachers/:id/subjects
Authorization: Bearer YOUR_JWT_TOKEN
```

### 7. Get Teacher Workload
```bash
GET http://localhost:5000/api/teachers/:id/workload
Authorization: Bearer YOUR_JWT_TOKEN
```

## Subject APIs

### 1. Get All Subjects (with pagination, search, filters)
```bash
GET http://localhost:5000/api/subjects?page=1&limit=10&search=Mathematics&department=60a1b2c3d4e5f6g7h8i9j0k1
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by name or code
- `department` (optional): Filter by department ID
- `semester` (optional): Filter by semester
- `course` (optional): Filter by course ID
- `type` (optional): Filter by type (theory/practical/project)

### 2. Get Single Subject
```bash
GET http://localhost:5000/api/subjects/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

### 3. Create Subject
```bash
POST http://localhost:5000/api/subjects
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "code": "CS301",
  "name": "Database Management Systems",
  "description": "Introduction to database concepts, SQL, and database design",
  "credits": 4,
  "type": "theory",
  "semester": 5,
  "department": "60a1b2c3d4e5f6g7h8i9j0k1",
  "course": "60a1b2c3d4e5f6g7h8i9j0k2",
  "syllabusUrl": "https://example.com/syllabus/cs301.pdf"
}
```

### 4. Update Subject
```bash
PUT http://localhost:5000/api/subjects/:id
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Advanced Database Management Systems",
  "credits": 5,
  "description": "Advanced database concepts including NoSQL and distributed databases"
}
```

### 5. Delete Subject
```bash
DELETE http://localhost:5000/api/subjects/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

### 6. Get Subject Students
```bash
GET http://localhost:5000/api/subjects/:id/students?semester=5
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters:**
- `semester` (optional): Filter by semester
- `department` (optional): Filter by department ID

### 7. Assign Teacher to Subject
```bash
PUT http://localhost:5000/api/subjects/:id/assign-teacher
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "teacherId": "60a1b2c3d4e5f6g7h8i9j0k3"
}
```

## Response Format

### Success Response
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    // Response data here
  },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## Testing with cURL

### Example: Create Student with cURL
```bash
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@student.uniflux.com",
    "password": "student123",
    "dateOfBirth": "2002-05-15",
    "gender": "male",
    "phone": "+1234567890",
    "department": "60a1b2c3d4e5f6g7h8i9j0k1",
    "course": "60a1b2c3d4e5f6g7h8i9j0k2",
    "semester": 3,
    "enrollmentYear": 2022
  }'
```

## Role-Based Access Control

### Student Routes
- `GET /students` - admin, teacher
- `POST /students` - admin only
- `GET /students/:id` - all authenticated
- `PUT /students/:id` - admin, student (own record)
- `DELETE /students/:id` - admin only
- `GET /students/:id/attendance` - all authenticated
- `GET /students/:id/marks` - all authenticated

### Teacher Routes
- `GET /teachers` - admin, teacher
- `POST /teachers` - admin only
- `GET /teachers/:id` - all authenticated
- `PUT /teachers/:id` - admin, teacher (own record)
- `DELETE /teachers/:id` - admin only
- `GET /teachers/:id/subjects` - all authenticated
- `GET /teachers/:id/workload` - admin, teacher

### Subject Routes
- `GET /subjects` - all authenticated
- `POST /subjects` - admin only
- `GET /subjects/:id` - all authenticated
- `PUT /subjects/:id` - admin only
- `DELETE /subjects/:id` - admin only
- `GET /subjects/:id/students` - all authenticated
- `PUT /subjects/:id/assign-teacher` - admin only

## Notes

1. **Auto-generated Fields**:
   - Student registration numbers: Format `REG-YYYY-XXXX`
   - Teacher employee IDs: Format `EMP-YYYY-XXXX`

2. **Validation**:
   - Email must be unique across all users
   - Subject codes must be unique
   - Phone numbers should include country code
   - Teacher can teach maximum 6 subjects

3. **Error Handling**:
   - All validation errors return 400 status
   - Authentication errors return 401 status
   - Authorization errors return 403 status
   - Not found errors return 404 status
   - Server errors return 500 status

4. **Pagination**:
   - Default page size: 10 items
   - Maximum page size: 100 items
   - Response includes: `total`, `page`, `limit`, `totalPages`, `hasNextPage`, `hasPrevPage`

## Testing Checklist

- [ ] Student CRUD operations
- [ ] Teacher CRUD operations
- [ ] Subject CRUD operations
- [ ] Pagination functionality
- [ ] Search functionality
- [ ] Filtering functionality
- [ ] Role-based access control
- [ ] Error handling
- [ ] Validation
- [ ] Auto-generated fields (registration numbers, employee IDs)
- [ ] Student attendance retrieval
- [ ] Student marks retrieval
- [ ] Teacher subjects retrieval
- [ ] Teacher workload calculation
- [ ] Subject students retrieval
- [ ] Teacher assignment to subjects
