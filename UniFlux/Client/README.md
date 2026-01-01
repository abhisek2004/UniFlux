# CampusCore

# 🎓 CampusCore – University Management System with Result Integration

## ✅ Project Overview

**CampusCore** is a modern University Management Portal that empowers universities to manage academic operations, student records, attendance, exams, and results from a centralized dashboard. It supports multi-role access: **Super Admin, Higher Authorities (HOD/Principal), Teachers, and Students**, with a secure and scalable architecture.

---

## 🔐 Access Roles & Permissions

### 👑 1. **Super Admin**

* Full access to all modules and roles.
* Can create/manage departments, courses, subjects, users.
* Assign roles (teacher, student, HOD, etc.)
* View analytics (overall performance, attendance, top scorers, etc.)
* Moderate academic calendar and result publishing.

### 🧑‍💼 2. **Higher Authorities (HOD, Principal)**

* Can access departmental or university-wide reports.
* Approve results before publishing.
* View student performance and teacher activities.
* Monitor attendance reports and progress summaries.

### 👩‍🏫 3. **Teacher Panel**

* Create assignments and upload marks.
* Manage attendance (daily/subject-wise).
* Enter internal/external marks and update results.
* View academic calendar and class schedule.

### 🎓 4. **Student Panel**

* View personal dashboard with attendance, marks, and result history.
* Get notifications for results, assignments, and exams.
* Submit feedback and raise grievances.
* Download mark sheets and assignment materials.

---

## 📚 Core Modules & Features

### 1️⃣ **Authentication & Role-Based Authorization**

* Secure login/signup for each role.
* JWT/session-based authentication.
* Role-based access control (RBAC) for routing and permissions.

---

### 2️⃣ **User Management**

* Super Admin can add/manage all users.
* Auto-generate university email IDs and registration numbers.
* Profile section for all users with edit restrictions per role.

---

### 3️⃣ **Department & Course Management**

* Create and assign:

  * Faculties/Departments (e.g., CSE, EEE, ME)
  * Programs (B.Tech, M.Tech, etc.)
  * Subjects with semester tagging
  * Teachers assigned to courses

---

### 4️⃣ **Result Management System**

* Teachers enter internal and external marks per subject.
* Marks auto-calculated for grade (CGPA/SGPA/percentage).
* Grade logic: based on predefined scale (A+, A, B, etc.)
* HOD reviews and approves results before publishing.
* Students view results semester-wise.
* Result PDF export and digital signature system.

---

### 5️⃣ **Attendance Management**

* Mark attendance daily (subject-wise).
* Auto percentage calculation.
* Students can track monthly attendance.
* Color-coded attendance tracker.

---

### 6️⃣ **Exam & Timetable Management**

* Create internal and external exam schedules.
* Notify students and faculty.
* Automated exam seat allocation (optional).

---

### 7️⃣ **Grievance & Feedback System**

* Students can submit feedback or grievances.
* Admin and faculty can respond.
* Ticket-based resolution tracking.

---

### 8️⃣ **Academic Calendar & Notices**

* Upload holiday lists, exam dates, deadlines.
* Department-wise notice board system.
* Push notifications to students and teachers.

---

### 9️⃣ **Dashboard & Reports**

* **Super Admin**: Overview of all data with charts (Bar, Pie, Line)
* **HODs/Teachers**: Class-wise performance trends
* **Students**: Personalized dashboard with progress, alerts, etc.

---

### 🔧 Bonus Features

* **Email/SMS Notifications** for result release, exam alerts.
* **Student Certificates**: Bonafide, Transfer, etc. request and generation.
* **Dark Mode** toggle for better UX.
* **Multi-language support** (optional).

---

## 🗂 Suggested Page Structure (Routes)

* `/login`
* `/dashboard`

  * `/admin`
  * `/hod`
  * `/teacher`
  * `/student`
* `/departments`
* `/students`
* `/teachers`
* `/subjects`
* `/attendance`
* `/results`
* `/results/upload`
* `/results/view`
* `/exam-timetable`
* `/calendar`
* `/notices`
* `/grievance`
* `/profile`

---

## 🧪 Test Users (for mock/demo)

| Role        | Email                                                                 | Password |
| ----------- | --------------------------------------------------------------------- | -------- |
| Super Admin | [superadmin@campuscore.in](mailto:superadmin@campuscore.in)           | admin123 |
| HOD (CSE)   | [hod.cse@campuscore.in](mailto:hod.cse@campuscore.in)                 | hod123   |
| Teacher     | [teacher.rahul@campuscore.in](mailto:teacher.rahul@campuscore.in)     | teach123 |
| Student     | [student.22CS123@campuscore.in](mailto:student.22CS123@campuscore.in) | stud123  |

---

## 📌 Deployment Recommendations

* **Frontend**: Host on Vercel or Netlify
* **Backend**: Deploy with Render, Railway, or DigitalOcean
* **Database**: MongoDB Atlas for scalable document-based data
* **File Storage (if needed)**: Cloudinary or Firebase Storage for PDFs, images

---

## 📋 Extended Functionality for CampusCore

---

### 🎓 1. **Student Management (10 Students Example)**

Each student will have:

* Name, Email, Roll Number, Department, Semester
* Registration No (e.g., `22CS101`)
* Auto-generated login credentials

```json
[
  { "name": "Amit Das", "roll": "22CS101", "email": "amit@campuscore.in", "semester": 5 },
  { "name": "Priya Rani", "roll": "22CS102", "email": "priya@campuscore.in", "semester": 5 },
  ...
  { "name": "Sneha Mehra", "roll": "22CS110", "email": "sneha@campuscore.in", "semester": 5 }
]
```

---

### 📚 2. **Subject Management (6 Subjects Example)**

Each subject has:

* Subject Code, Name, Assigned Teacher, Semester

```json
[
  { "code": "CS501", "name": "Operating Systems", "teacher": "Rahul Mehra" },
  { "code": "CS502", "name": "DBMS", "teacher": "Meena Rathi" },
  { "code": "CS503", "name": "Computer Networks", "teacher": "Aman Raj" },
  { "code": "CS504", "name": "Software Engineering", "teacher": "Kavita Joshi" },
  { "code": "CS505", "name": "AI & ML", "teacher": "Manoj Kumar" },
  { "code": "CS506", "name": "Web Development", "teacher": "Sakshi Bhatia" }
]
```

---

### 🧑‍🏫 3. **Teacher Panel (6 Teachers)**

Each teacher has:

* Name, Email, Assigned Subject, Login Access

```json
[
  { "name": "Rahul Mehra", "email": "rahul@campuscore.in" },
  { "name": "Meena Rathi", "email": "meena@campuscore.in" },
  ...
]
```

---

### 🕒 4. **Class Timetable (5 Days – Mon to Fri)**

Example Timetable (for Semester 5):

| Day       | 9–10 AM       | 10–11 AM | 11–12 PM      | 1–2 PM        | 2–3 PM  |
| --------- | ------------- | -------- | ------------- | ------------- | ------- |
| Monday    | OS            | DBMS     | Web Dev       | CN            | AI      |
| Tuesday   | CN            | AI       | Software Engg | Web Dev       | DBMS    |
| Wednesday | Software Engg | DBMS     | OS            | CN            | Web Dev |
| Thursday  | AI            | OS       | DBMS          | Software Engg | CN      |
| Friday    | Web Dev       | CN       | AI            | OS            | DBMS    |

---

### ✅ 5. **Attendance Management (5-Day Record)**

* Attendance can be stored per subject per day
* Mark as `Present` or `Absent` for each class

```json
{
  "student": "22CS101",
  "subject": "CS501",
  "date": "2025-07-01",
  "status": "Present"
}
```

Teachers can view attendance history and percentage per subject.

---

### 🧾 6. **Marks Management**

Separate pages for:

#### a. **Internal Marks Entry**

* Test 1, Test 2, Assignments
* Entry by teachers
* Max Marks: 30

#### b. **External Marks Entry**

* Final University Exam marks
* Max Marks: 70
* Locked once submitted

#### c. **Semester-wise Result Page**

* Combines internal + external = 100 marks
* Grade (A+, A, B...) auto-calculated
* GPA/CGPA logic applied

---

### 📄 7. **PDF Result Generation & Download**

* Results page for each student
* **“Download Marksheet”** button
* Includes:

  * Student info
  * Subject-wise marks (internal, external, total, grade)
  * Overall GPA/CGPA
  * QR Code for verification (optional)
  * Auto digital signature

✅ Generated using libraries like `pdf-lib`, `jspdf`, or server-rendered PDFs

Example Marksheet Layout:

```
-----------------------------------------
           CAMPUSCORE UNIVERSITY
         Semester V Grade Sheet - 2025
-----------------------------------------
Name: Amit Das       Roll: 22CS101
Program: B.Tech CSE  Semester: V

Subjects:
-----------------------------------------
Subject              Int   Ext  Total  Grade
Operating Systems     25    65    90     A+
DBMS                  24    62    86     A
Computer Networks     20    60    80     A
...
-----------------------------------------
SGPA: 8.95
Result: PASS
-----------------------------------------
Date: 06/07/2025   Principal Sign: ____
```

---

## 📌 Extra Suggestions (Optional)

* Export attendance to Excel
* Add a Student Report Card PDF archive for each semester
* Auto email result PDF to students on publish
* Add a semester history timeline in student dashboard




