# 🏖️ Leave Management System - Complete Documentation

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Database Models](#database-models)
4. [API Endpoints](#api-endpoints)
5. [Access Control](#access-control)
6. [Workflow](#workflow)
7. [Setup & Installation](#setup--installation)
8. [Testing](#testing)
9. [Use Cases](#use-cases)

---

## 🎯 Overview

The Leave Management System is a comprehensive module for UniFlux that enables digital leave management for students, teachers, and staff. It provides a complete workflow from leave application to approval, with policy management, balance tracking, and detailed reporting capabilities.

### Key Capabilities

- **Leave Application**: Digital leave request submission with document upload
- **Policy Management**: Configurable leave policies per department and user type
- **Balance Tracking**: Automatic leave balance management and updates
- **Approval Workflow**: HOD and admin approval system with remarks
- **Reports & Analytics**: Comprehensive statistics and reports
- **Role-Based Access**: Secure access control based on user roles

---

## ✨ Features

### For Students

- ✅ Apply for different leave types (casual, sick, emergency, medical)
- ✅ Upload supporting documents (medical certificates, etc.)
- ✅ View leave history and status
- ✅ Check leave balance
- ✅ Update/cancel pending leaves
- ✅ Real-time status notifications

### For Teachers/Faculty

- ✅ Apply for various leave types (casual, sick, earned, duty, maternity/paternity)
- ✅ Check leave balance before applying
- ✅ View leave history
- ✅ Upload supporting documents
- ✅ Manage pending applications

### For HOD (Head of Department)

- ✅ View all department leave requests
- ✅ Approve/reject leaves with remarks
- ✅ View department leave statistics
- ✅ Check department balance summary
- ✅ Identify low balance users
- ✅ Generate department reports

### For Admin/Super Admin

- ✅ View all leaves across university
- ✅ Manage leave types and policies
- ✅ Configure leave quotas and rules
- ✅ Initialize/reset leave balances
- ✅ Override approvals
- ✅ Generate comprehensive reports
- ✅ View leave analytics and trends

---

## 📊 Database Models

### 1. Leave Model

Stores individual leave applications with complete details.

```javascript
{
  userId: ObjectId,              // Reference to User
  userType: String,              // 'student', 'teacher', 'staff'
  leaveType: String,             // Type of leave
  startDate: Date,               // Leave start date
  endDate: Date,                 // Leave end date
  numberOfDays: Number,          // Auto-calculated
  reason: String,                // Reason for leave (10-500 chars)
  documents: [{                  // Supporting documents
    fileName: String,
    fileUrl: String,
    uploadedAt: Date
  }],
  status: String,                // 'pending', 'approved', 'rejected', 'cancelled'
  appliedDate: Date,             // Application submission date
  approvedBy: ObjectId,          // Approver reference
  approvedDate: Date,            // Approval timestamp
  rejectionReason: String,       // Reason if rejected
  remarks: String,               // Approver remarks
  department: String,            // User department
  semester: Number,              // For students (1-10)
  hodApprovalStatus: String,     // HOD approval status
  hodApprovedBy: ObjectId,       // HOD reference
  hodApprovedDate: Date,         // HOD approval timestamp
  hodRemarks: String             // HOD remarks
}
```

**Leave Types:**
- `casual` - Casual leave for personal work
- `sick` - Sick leave with medical certificate
- `emergency` - Emergency leave for urgent situations
- `medical` - Medical leave for treatment
- `earned` - Earned leave for planned vacation
- `duty` - Official duty leave
- `maternity` - Maternity leave (180 days)
- `paternity` - Paternity leave (15 days)
- `personal` - Personal leave

**Methods:**
- `approve(approverId, remarks)` - Approve leave
- `reject(approverId, reason)` - Reject leave
- `cancel()` - Cancel pending leave

**Virtuals:**
- `isActive` - Check if leave is currently active
- `isUpcoming` - Check if leave is upcoming

**Static Methods:**
- `getByStatus(status, filters)` - Get leaves by status
- `getPendingForDepartment(department)` - Get pending department leaves
- `getStatistics(filters)` - Get leave statistics

### 2. LeaveBalance Model

Tracks leave balances for each user with automatic calculations.

```javascript
{
  userId: ObjectId,              // Unique user reference
  userType: String,              // 'student', 'teacher', 'staff'
  academicYear: String,          // e.g., '2026-2027'
  
  // Balance for each leave type
  casualLeave: {
    total: Number,               // Total quota
    used: Number,                // Used leaves
    remaining: Number            // Auto-calculated
  },
  sickLeave: { total, used, remaining },
  earnedLeave: { total, used, remaining },
  emergencyLeave: { total, used, remaining },
  medicalLeave: { total, used, remaining },
  
  lastUpdated: Date              // Last update timestamp
}
```

**Methods:**
- `deductLeave(leaveType, days)` - Deduct leaves from balance
- `restoreLeave(leaveType, days)` - Restore cancelled leaves
- `resetForNewYear(policy)` - Reset balance for new academic year

**Static Methods:**
- `initializeBalance(userId, userType, policy)` - Initialize new balance
- `checkBalance(userId, leaveType, days)` - Check if sufficient balance exists

**Virtuals:**
- `totalAllLeaves` - Get total across all leave types

### 3. LeavePolicy Model

Defines leave policies for different user types and departments.

```javascript
{
  userType: String,              // 'student', 'teacher', 'staff'
  department: String,            // Department code
  academicYear: String,          // Academic year
  
  policies: {
    casualLeave: {
      quota: Number,             // Total leaves per year
      maxConsecutive: Number,    // Max consecutive days
      requiresDocument: Boolean, // Document requirement
      description: String
    },
    sickLeave: {
      quota: Number,
      maxConsecutive: Number,
      requiresDocument: Boolean,
      documentRequiredAfterDays: Number,
      description: String
    },
    earnedLeave: {
      quota: Number,
      maxConsecutive: Number,
      requiresDocument: Boolean,
      advanceNoticeDays: Number,
      description: String
    },
    // Similar structure for other leave types...
  },
  
  generalRules: {
    minimumAttendanceRequired: Number,  // Min attendance % (0-100)
    maxLeavesPerMonth: Number,          // Monthly limit
    canApplyForPastDates: Boolean,      // Allow backdated applications
    approvalWorkflow: String,           // 'hod-only', 'hod-then-admin', 'admin-only'
    autoApprovalForDays: Number         // Auto-approve if days <= this
  },
  
  isActive: Boolean,             // Policy status
  createdBy: ObjectId            // Policy creator
}
```

**Methods:**
- `validateLeaveRequest(leaveType, numberOfDays, documents)` - Validate against policy

**Static Methods:**
- `getActivePolicy(userType, department, academicYear)` - Get active policy
- `createDefaultPolicy(userType, department, createdBy)` - Create default policy

**Virtuals:**
- `totalQuota` - Total leave quota across all types

---

## 🔌 API Endpoints

### Leave Application APIs

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/leaves` | Student, Teacher, Staff | Apply for new leave |
| GET | `/api/leaves` | Admin, HOD, Teacher | Get all leaves with filters |
| GET | `/api/leaves/my-leaves` | Authenticated | Get current user's leaves |
| GET | `/api/leaves/balance` | Authenticated | Get leave balance |
| GET | `/api/leaves/:id` | Authenticated | Get single leave details |
| PUT | `/api/leaves/:id` | Owner | Update pending leave |
| DELETE | `/api/leaves/:id` | Owner | Cancel pending leave |

### Leave Approval APIs

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/leaves/pending` | HOD, Admin | Get pending leaves |
| PUT | `/api/leaves/:id/approve` | HOD, Admin | Approve leave |
| PUT | `/api/leaves/:id/reject` | HOD, Admin | Reject leave |
| GET | `/api/leaves/department/:dept` | HOD, Admin | Get department leaves |
| GET | `/api/leaves/statistics` | HOD, Admin | Get leave statistics |

### Leave Policy APIs

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/leave-policies` | HOD, Admin | Get all policies |
| GET | `/api/leave-policies/my-policy` | Authenticated | Get user's applicable policy |
| GET | `/api/leave-policies/:id` | HOD, Admin | Get single policy |
| POST | `/api/leave-policies` | Admin | Create new policy |
| PUT | `/api/leave-policies/:id` | Admin | Update policy |
| DELETE | `/api/leave-policies/:id` | Admin | Delete policy |
| POST | `/api/leave-policies/create-default` | Admin | Create default policy |
| POST | `/api/leave-policies/:id/initialize-balances` | Admin | Initialize balances from policy |
| PUT | `/api/leave-policies/:id/activate` | Admin | Activate policy |
| PUT | `/api/leave-policies/:id/deactivate` | Admin | Deactivate policy |

### Leave Balance APIs

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/leave-balance/my-balance` | Authenticated | Get personal balance |
| GET | `/api/leave-balance/:userId` | HOD, Admin | Get user balance |
| PUT | `/api/leave-balance/:userId` | Admin | Update user balance |
| POST | `/api/leave-balance/initialize` | Admin | Initialize balances |
| GET | `/api/leave-balance/department/:dept` | HOD, Admin | Get department balances |
| GET | `/api/leave-balance/low-balance` | HOD, Admin | Get low balance users |
| GET | `/api/leave-balance/summary` | HOD, Admin | Get balance summary |
| PUT | `/api/leave-balance/:userId/reset` | Admin | Reset balance to policy |

---

## 🔐 Access Control

### Student

**Can:**
- Apply for leaves (casual, sick, emergency, medical)
- View own leaves and balance
- Update/cancel own pending leaves

**Cannot:**
- View other students' leaves
- Approve/reject leaves
- Manage policies or balances

### Teacher

**Can:**
- Apply for all leave types including earned, duty, maternity/paternity
- View own leaves and balance
- Update/cancel own pending leaves

**Cannot:**
- View other teachers' leaves
- Approve/reject leaves
- Manage policies

### HOD (Head of Department)

**Can:**
- Apply for leaves
- View all department leaves
- Approve/reject department leaves
- View department statistics
- Check department balances
- View leave policies

**Cannot:**
- Approve leaves from other departments
- Modify leave policies
- Access system-wide statistics

### Admin/Super Admin

**Can:**
- Everything HODs can do
- Approve leaves from all departments
- Create/modify/delete leave policies
- Initialize/reset leave balances
- View system-wide statistics
- Manual balance adjustments
- Override any decision

---

## 🔄 Workflow

### Leave Application Workflow

```
1. User applies for leave
   ↓
2. System validates:
   - Date range
   - Policy rules
   - Leave balance
   - Document requirements
   ↓
3. Leave status = 'pending'
   ↓
4. HOD views pending leaves
   ↓
5. HOD approves/rejects
   ↓
6. If approved:
   - Status = 'approved'
   - Balance deducted
   - User notified
   ↓
7. If rejected:
   - Status = 'rejected'
   - Reason provided
   - User notified
```

### Balance Management Workflow

```
1. Admin creates leave policy
   ↓
2. Admin initializes balances for users
   ↓
3. Balances set based on policy quotas
   ↓
4. User applies for leave
   ↓
5. System checks balance
   ↓
6. If approved, balance deducted
   ↓
7. If cancelled, balance restored
   ↓
8. At year end, balances reset
```

---

## ⚙️ Setup & Installation

### 1. Prerequisites

- Node.js 22.9.0+
- MongoDB running
- UniFlux backend setup complete

### 2. Files Included

**Models** (3 files):
- `src/models/Leave.js` - Leave application model
- `src/models/LeaveBalance.js` - Balance tracking model
- `src/models/LeavePolicy.js` - Policy management model

**Controllers** (3 files):
- `src/controllers/leave.controller.js` - Leave operations
- `src/controllers/leaveBalance.controller.js` - Balance management
- `src/controllers/leavePolicy.controller.js` - Policy management

**Routes** (3 files):
- `src/routes/leave.routes.js` - Leave endpoints
- `src/routes/leaveBalance.routes.js` - Balance endpoints
- `src/routes/leavePolicy.routes.js` - Policy endpoints

**Documentation**:
- `LEAVE_MANAGEMENT_DOCS.md` - This file
- `test-leave-api.http` - API test file

### 3. Installation Steps

```bash
# 1. Navigate to server directory
cd e:\WOC\UniFlux\UniFlux\Server

# 2. Models already created (no additional packages needed)

# 3. Routes registered in server.js (already done)

# 4. Start the server
npm run dev
```

### 4. Initial Setup

#### Step 1: Create Leave Policies (Admin)

```bash
# Login as admin and create default policies
POST /api/leave-policies/create-default
{
  "userType": "student",
  "department": "CSE"
}

POST /api/leave-policies/create-default
{
  "userType": "teacher",
  "department": "CSE"
}
```

#### Step 2: Initialize Leave Balances

```bash
# Initialize balances for all users
POST /api/leave-balance/initialize
{
  "userType": "student",
  "department": "CSE",
  "academicYear": "2026-2027"
}
```

#### Step 3: Verify Setup

```bash
# Check if policy is created
GET /api/leave-policies/my-policy

# Check if balance is initialized
GET /api/leave-balance/my-balance
```

---

## 🧪 Testing

### Using REST Client (VS Code Extension)

1. Open `test-leave-api.http`
2. Login to get JWT token
3. Replace `YOUR_JWT_TOKEN_HERE` with actual token
4. Execute requests sequentially

### Test Flow

#### 1. Admin Setup
```
✅ Login as admin
✅ Create default policies for CSE (students & teachers)
✅ Initialize balances for all users
✅ Verify policies created
```

#### 2. Student/Teacher Actions
```
✅ Login as student/teacher
✅ Check leave policy
✅ Check leave balance
✅ Apply for sick leave with documents
✅ View pending leaves
```

#### 3. HOD Approval
```
✅ Login as HOD
✅ View pending leaves
✅ Approve leave with remarks
✅ Check department statistics
```

#### 4. Verification
```
✅ Login as student/teacher
✅ Check leave status (should be approved)
✅ Verify balance deducted
✅ View leave history
```

### Test Cases

**Policy Management** (9 tests):
- [ ] Create default student policy
- [ ] Create default teacher policy
- [ ] Create custom policy with rules
- [ ] Update policy quotas
- [ ] Activate/deactivate policies
- [ ] Initialize balances from policy
- [ ] Prevent duplicate active policies
- [ ] Delete unused policies
- [ ] Get applicable policy for users

**Balance Management** (8 tests):
- [ ] Check personal balance
- [ ] View department balances
- [ ] Identify low balance users
- [ ] Generate balance summary
- [ ] Reset balance for new year
- [ ] Manual balance adjustment
- [ ] Initialize missing balances
- [ ] Balance auto-calculation

**Leave Application** (12 tests):
- [ ] Apply casual leave
- [ ] Apply sick leave with documents
- [ ] Apply emergency leave
- [ ] Apply earned leave with advance notice
- [ ] View personal leave history
- [ ] Update pending leave
- [ ] Cancel pending leave
- [ ] Pagination in leave list
- [ ] Filter by status
- [ ] Filter by date range
- [ ] Search by user name
- [ ] Check insufficient balance error

**Leave Approval** (7 tests):
- [ ] View pending approvals (HOD)
- [ ] Approve leave with remarks
- [ ] Reject leave with reason
- [ ] Balance deduction on approval
- [ ] Department filtering
- [ ] HOD can't approve other departments
- [ ] Admin can override all

**Validation** (10 tests):
- [ ] Validate max consecutive days
- [ ] Validate document requirement
- [ ] Validate date range
- [ ] Validate sufficient balance
- [ ] Validate against attendance
- [ ] Prevent past date (if restricted)
- [ ] Prevent future updates
- [ ] Validate leave type
- [ ] Validate user access
- [ ] Check policy compliance

---

## 💡 Use Cases

### Use Case 1: Student Applies for Sick Leave

**Actor**: Student  
**Precondition**: Student has sufficient sick leave balance

**Steps**:
1. Student logs in
2. Checks leave balance (10 sick leaves available)
3. Applies for 3-day sick leave
4. Uploads medical certificate
5. Submits application

**System Actions**:
- Validates dates and documents
- Checks policy (requires document ✓)
- Checks balance (sufficient ✓)
- Creates leave with status 'pending'
- Sends notification to HOD

**Postcondition**: Leave application pending with HOD

### Use Case 2: HOD Approves Leave

**Actor**: HOD  
**Precondition**: Pending leave exists in department

**Steps**:
1. HOD logs in
2. Views pending leaves
3. Reviews application and documents
4. Adds remarks "Approved. Get well soon."
5. Approves leave

**System Actions**:
- Updates leave status to 'approved'
- Deducts 3 days from student's sick leave balance
- Records HOD details and timestamp
- Sends notification to student

**Postcondition**: Leave approved, balance updated

### Use Case 3: Admin Creates Leave Policy

**Actor**: Admin  
**Precondition**: No active policy exists for department

**Steps**:
1. Admin logs in
2. Creates new policy for ECE students
3. Sets quotas: Casual(5), Sick(10), Emergency(3)
4. Sets rules: Max 5 leaves/month, 75% attendance required
5. Activates policy

**System Actions**:
- Validates unique active policy
- Creates policy with specified rules
- Makes policy active

**Postcondition**: Active policy ready for use

### Use Case 4: Admin Initializes Balances

**Actor**: Admin  
**Precondition**: Active policy exists

**Steps**:
1. Admin logs in
2. Selects policy
3. Clicks "Initialize Balances"
4. System processes all users

**System Actions**:
- Finds all ECE students
- Creates/updates balance for each user
- Sets quotas based on policy
- Sets used=0, calculates remaining

**Postcondition**: All students have initialized balances

### Use Case 5: Low Balance Alert

**Actor**: HOD  
**Precondition**: Some users have low balances

**Steps**:
1. HOD logs in
2. Views low balance report
3. Sees list of students with <2 leaves

**System Actions**:
- Queries all department balances
- Filters users with any leave type < threshold
- Returns sorted list with details

**Postcondition**: HOD aware of low balance users

---

## 📈 Reports & Analytics

### Available Reports

1. **Leave Statistics**
   - Total leaves by status
   - Total days by leave type
   - Department-wise distribution
   - Monthly trends

2. **Balance Summary**
   - Total leaves allocated
   - Total leaves used
   - Remaining balance
   - Department comparison

3. **Low Balance Alert**
   - Users below threshold
   - Leave type breakdown
   - Department-wise list

4. **Department Report**
   - All leaves in department
   - Approval rates
   - Common leave types
   - Peak leave periods

---

## 🔄 Integration Points

### With Attendance System

- Leave approval updates attendance records
- System marks approved leave days as present
- Leave days excluded from attendance calculation

### With Notification System

- Email notification on leave application
- SMS notification on approval/rejection
- In-app notification for status updates
- Reminder for pending approvals

### With Academic Calendar

- Restrict leaves during exam periods
- Block leaves on important dates
- Integration with semester schedules

---

## 🚀 Future Enhancements

- [ ] Bulk leave operations
- [ ] CSV export for reports
- [ ] Advanced analytics dashboard
- [ ] WebSocket real-time updates
- [ ] Mobile app support
- [ ] Attendance integration
- [ ] Calendar view for leaves
- [ ] Email/SMS notifications
- [ ] Document OCR for certificates
- [ ] ML-based approval suggestions
- [ ] Leave carry-forward feature
- [ ] Compensatory leave tracking

---

## 📝 Notes

- All dates are stored in UTC
- Balances are calculated automatically
- Policies can be updated mid-year
- Only pending leaves can be modified
- HOD approval is department-scoped
- Admin can override any decision
- Documents are optional for some leave types
- Balances reset at academic year end

---

**Implementation Complete** ✅  
**Last Updated**: January 14, 2026  
**Version**: 1.0.0
