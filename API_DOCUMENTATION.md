# Alamani Frontend - API Documentation

## Table of Contents

1. [Overview](#overview)
2. [Services](#services)
   - [Authentication Service](#authentication-service)
   - [User Service](#user-service)
   - [Course Service](#course-service)
   - [Enrollment Service](#enrollment-service)
   - [Quiz Service](#quiz-service)
   - [File Upload Service](#file-upload-service)
   - [Category Service](#category-service)
3. [Data Models (Interfaces)](#data-models-interfaces)
4. [Components](#components)
5. [Guards](#guards)
6. [Routing](#routing)
7. [Usage Examples](#usage-examples)

## Overview

The Alamani Frontend is an Angular 18 application built for managing online courses, user enrollment, quizzes, and educational content. It provides a comprehensive learning management system with user authentication, role-based access control, and interactive learning features.

**Key Technologies:**
- Angular 18.2.0
- TypeScript 5.5.2
- Angular Material 17.0.0
- Bootstrap 5.3.3
- Chart.js 4.4.7
- RxJS 7.8.0

**Base API URL:** `http://localhost:8000/api`

---

## Services

### Authentication Service

**File:** `src/app/service/auth.service.ts`

Handles user authentication operations including login, signup, and email verification.

#### Methods

##### `login(loginData: any): Observable<any>`
Authenticates a user with email and password.

**Parameters:**
- `loginData` (object): User credentials
  - `email` (string): User's email address
  - `password` (string): User's password

**Returns:** `Observable<any>` - Authentication response with token and user data

**Example:**
```typescript
const credentials = {
  email: 'user@example.com',
  password: 'password123'
};

authService.login(credentials).subscribe({
  next: (response) => {
    console.log('Login successful:', response);
    localStorage.setItem('token', response.token);
  },
  error: (error) => console.error('Login failed:', error)
});
```

##### `signUp(signUpData: any): Observable<any>`
Registers a new user account.

**Parameters:**
- `signUpData` (object): User registration data
  - `firstName` (string): User's first name
  - `lastName` (string): User's last name
  - `email` (string): User's email address
  - `username` (string): Unique username
  - `password` (string): User's password
  - `dateOfBirth` (string): User's date of birth

**Returns:** `Observable<any>` - Registration response

**Example:**
```typescript
const userData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  username: 'johndoe',
  password: 'securepassword',
  dateOfBirth: '1990-01-01'
};

authService.signUp(userData).subscribe({
  next: (response) => console.log('Registration successful:', response),
  error: (error) => console.error('Registration failed:', error)
});
```

##### `checkEmailVerification(email: string): Observable<any>`
Checks if a user's email has been verified.

**Parameters:**
- `email` (string): User's email address

**Returns:** `Observable<any>` - Verification status response

---

### User Service

**File:** `src/app/service/user.service.ts`

Manages user-related operations including profile management, statistics, and rewards.

#### Methods

##### `getUsers(): Observable<any>`
Retrieves all users (admin only).

**Returns:** `Observable<any>` - List of all users

##### `deleteUser(id: number): Observable<any>`
Deletes a user account (admin only).

**Parameters:**
- `id` (number): User ID to delete

**Returns:** `Observable<any>` - Deletion confirmation

##### `getUserById(id: string): Observable<any>`
Retrieves a specific user by ID.

**Parameters:**
- `id` (string): User ID

**Returns:** `Observable<any>` - User data

##### `getUser(username: string): Observable<any>`
Retrieves a user by username.

**Parameters:**
- `username` (string): Username to search for

**Returns:** `Observable<any>` - User data

##### `getTotalUsers(): Observable<number>`
Gets the total count of registered users.

**Returns:** `Observable<number>` - Total user count

##### `getTotalEnrolledCourses(): Observable<number>`
Gets the total number of course enrollments across all users.

**Returns:** `Observable<number>` - Total enrollment count

##### `getUsersByAgeGroup(): Observable<Map<string, number>>`
Gets user distribution by age groups.

**Returns:** `Observable<Map<string, number>>` - Age group distribution

##### `updateUserName(id: string, userData: any): Observable<any>`
Updates a user's name information.

**Parameters:**
- `id` (string): User ID
- `userData` (object): Updated name data
  - `firstName` (string): New first name
  - `lastName` (string): New last name

**Returns:** `Observable<any>` - Update confirmation

##### `updateUserRewards(id: string, rewardData: RewardSystem): Observable<any>`
Updates a user's reward system data.

**Parameters:**
- `id` (string): User ID
- `rewardData` (RewardSystem): Reward system data

**Returns:** `Observable<any>` - Update confirmation

##### `updateUserLevelAndPoints(id: string, updates: object): Observable<any>`
Updates a user's level and points.

**Parameters:**
- `id` (string): User ID
- `updates` (object): Level and points data
  - `level` (number): New user level
  - `points` (number): New point total

**Returns:** `Observable<any>` - Update confirmation

---

### Course Service

**File:** `src/app/service/course.service.ts`

Manages course-related operations including CRUD operations and enrollment.

#### Methods

##### `addCourse(courseData: Course): Observable<any>`
Creates a new course.

**Parameters:**
- `courseData` (Course): Course data object

**Returns:** `Observable<any>` - Created course response

##### `getCourseById(id: string): Observable<Course>`
Retrieves a specific course by ID.

**Parameters:**
- `id` (string): Course ID

**Returns:** `Observable<Course>` - Course data

##### `getCourses(): Observable<Course[]>`
Retrieves all available courses.

**Returns:** `Observable<Course[]>` - Array of courses

##### `updateCourse(course: Course): Observable<any>`
Updates an existing course.

**Parameters:**
- `course` (Course): Updated course data

**Returns:** `Observable<any>` - Update confirmation

##### `deleteCourse(id: string): Observable<any>`
Deletes a course.

**Parameters:**
- `id` (string): Course ID to delete

**Returns:** `Observable<any>` - Deletion confirmation

##### `getTotalCourses(): Observable<number>`
Gets the total number of courses.

**Returns:** `Observable<number>` - Total course count

##### `getCoursesPerCategory(): Observable<{category: string; count: number}[]>`
Gets course distribution by category.

**Returns:** `Observable<{category: string; count: number}[]>` - Course count per category

##### `getCategories(): Observable<Category[]>`
Retrieves all course categories.

**Returns:** `Observable<Category[]>` - Array of categories

##### `enrollCourse(courseId: string, userId: string): Observable<any>`
Enrolls a user in a course.

**Parameters:**
- `courseId` (string): Course ID
- `userId` (string): User ID

**Returns:** `Observable<any>` - Enrollment confirmation

---

### Enrollment Service

**File:** `src/app/service/enrollment.service.ts`

Manages user course enrollments and progress tracking.

#### Methods

##### `getEnrollmentsByUserId(userId: string): Observable<Enrollment[]>`
Retrieves all enrollments for a specific user.

**Parameters:**
- `userId` (string): User ID

**Returns:** `Observable<Enrollment[]>` - Array of user enrollments

##### `getEnrollementsCountByCourseId(courseId: string): Observable<number>`
Gets the enrollment count for a specific course.

**Parameters:**
- `courseId` (string): Course ID

**Returns:** `Observable<number>` - Enrollment count

##### `getEnrollments(): Observable<any>`
Gets total enrollment statistics.

**Returns:** `Observable<any>` - Enrollment statistics

##### `getFinishedCoursesByUserId(userId: string): Observable<Map<string, string>[]>`
Retrieves completed courses for a user.

**Parameters:**
- `userId` (string): User ID

**Returns:** `Observable<Map<string, string>[]>` - Completed courses data

##### `updateEnrollment(enrollment: Enrollment): Observable<any>`
Updates enrollment progress and status.

**Parameters:**
- `enrollment` (Enrollment): Updated enrollment data

**Returns:** `Observable<any>` - Update confirmation

---

### Quiz Service

**File:** `src/app/service/quiz.service.ts`

Handles quiz-related operations and PDF upload for quiz generation.

**Base URL:** `http://127.0.0.1:5000` (Flask backend)

#### Methods

##### `uploadPdf(file: File): Observable<any>`
Uploads a PDF file for quiz generation.

**Parameters:**
- `file` (File): PDF file to upload

**Returns:** `Observable<any>` - Upload response

##### `startQuiz(username: string): Observable<any>`
Initiates a quiz session for a user.

**Parameters:**
- `username` (string): Username of the quiz taker

**Returns:** `Observable<any>` - Quiz session data

---

### File Upload Service

**File:** `src/app/service/file-upload.service.ts`

Handles general file upload operations.

#### Methods

##### `uploadFile(file: File): Observable<string>`
Uploads a file to the server.

**Parameters:**
- `file` (File): File to upload

**Returns:** `Observable<string>` - Upload response as text

---

### Category Service

**File:** `src/app/service/category.service.ts`

Manages course categories.

#### Methods

##### `getCategories(): Observable<Category[]>`
Retrieves all categories.

**Returns:** `Observable<Category[]>` - Array of categories

##### `getTotalCategories(): Observable<number>`
Gets the total number of categories.

**Returns:** `Observable<number>` - Category count

##### `createCategory(category: Category): Observable<Category>`
Creates a new category.

**Parameters:**
- `category` (Category): Category data

**Returns:** `Observable<Category>` - Created category

##### `updateCategory(id: string, category: Category): Observable<Category>`
Updates an existing category.

**Parameters:**
- `id` (string): Category ID
- `category` (Category): Updated category data

**Returns:** `Observable<Category>` - Updated category

##### `deleteCategory(id: string): Observable<void>`
Deletes a category.

**Parameters:**
- `id` (string): Category ID to delete

**Returns:** `Observable<void>` - Deletion confirmation

---

## Data Models (Interfaces)

### User Interface

**File:** `src/app/interface/user.ts`

```typescript
interface Role {
  id: string;
  name: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  dateOfBirth: string;
  roles: Role[];
  enrollments: any;
  enabled: boolean;
  points: number;
  level: number;
  xp: number;
  enrolledCourses: any[];
}
```

### Course Interface

**File:** `src/app/interface/course.ts`

```typescript
interface Course {
  id?: string;
  imageUrl: string;
  title: string;
  description: string;
  duration: number; // Total duration in minutes
  category: Category;
  levelRequired: number;
  pointsRequired: number;
  modules?: Module[];
  rewardSystem?: RewardSystem;
  enrollments?: Course[];
}
```

### Enrollment Interface

**File:** `src/app/interface/Enrollment.ts`

```typescript
interface Enrollment {
  id: string;
  user: User;
  course: Course;
  progress: number;
  finished: boolean;
  startDate: Date;
  lastVisitedDate: Date;
  completedLessons: string[];
  lessonsCount: number;
}
```

### Category Interface

**File:** `src/app/interface/category.ts`

```typescript
interface Category {
  id?: string;
  name: string;
  description: string;
}
```

### Module Interface

**File:** `src/app/interface/module.ts`

```typescript
interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  duration: number; // Approximate minutes to finish the module
}
```

### Lesson Interface

**File:** `src/app/interface/lesson.ts`

```typescript
interface Lesson {
  id: string;
  title: string;
  type: 'Video' | 'PDF';
  videoUrl?: string;
  pdfUrl?: string;
  content?: string; // Additional content for the lesson
}
```

### Quiz Interface

**File:** `src/app/interface/quiz.ts`

```typescript
interface Quiz {
  questions: Question[];
}
```

### Question Interface

**File:** `src/app/interface/question.ts`

```typescript
interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}
```

### Reward System Interface

**File:** `src/app/interface/reward-system.ts`

```typescript
interface RewardSystem {
  points?: number;
  badges?: Badge[];
  levels?: number;
}
```

### Badge Interface

**File:** `src/app/interface/Badge.ts`

```typescript
interface Badge {
  name: string;
  icon: string;
}
```

---

## Components

### Login Component

**File:** `src/app/auth/login/login.component.ts`

Handles user authentication with form validation and error handling.

#### Public Properties
- `loginForm: FormGroup` - Reactive form for login credentials
- `isLoading: boolean` - Loading state indicator

#### Public Methods

##### `onSubmit(): void`
Handles login form submission with validation and authentication.

**Functionality:**
- Validates form inputs (email and password)
- Calls AuthService.login()
- Stores authentication token and user data
- Checks email verification status
- Navigates to home page or shows verification warning
- Displays error messages using SweetAlert2

##### `cancelLoading(): void`
Cancels the loading state.

**Usage Example:**
```typescript
// In template
<form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
  <input formControlName="email" type="email" />
  <input formControlName="password" type="password" />
  <button type="submit" [disabled]="!loginForm.valid">Login</button>
</form>
```

---

## Guards

### Auth Guard

**File:** `src/app/guards/auth.guard.ts`

Protects routes requiring authentication.

#### `canActivate(): boolean`
Checks if user has a valid authentication token.

**Returns:** 
- `true` if token exists in localStorage
- `false` and redirects to login if no token

### Role Guard

**File:** `src/app/guards/role.guard.ts`

Protects routes requiring specific user roles.

#### `canActivate(route: ActivatedRouteSnapshot): boolean`
Checks if user has the required role for the route.

**Parameters:**
- `route` (ActivatedRouteSnapshot): Route data containing required role

**Returns:**
- `true` if user has required role
- `false` and redirects to home if insufficient permissions

---

## Routing

**File:** `src/app/app.routes.ts`

### Public Routes
- `/login` - Login page
- `/signup` - Registration page
- `/logout` - Logout functionality

### Protected Routes (Requires Authentication)
- `/home` - Home page
- `/profile` - User profile
- `/courses` - Course listing
- `/library` - User's course library
- `/leaderboard` - User rankings
- `/course-details/:id` - Course details page
- `/lesson/:lessonId` - Individual lesson view

### Admin Routes (Requires ROLE_ADMIN)
- `/admin-dashboard` - Administrative dashboard
- `/Managecategories` - Category management

---

## Usage Examples

### Basic Service Injection and Usage

```typescript
import { Component, OnInit } from '@angular/core';
import { UserService } from './service/user.service';
import { CourseService } from './service/course.service';

@Component({
  selector: 'app-example',
  template: `...`
})
export class ExampleComponent implements OnInit {
  constructor(
    private userService: UserService,
    private courseService: CourseService
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.loadCourses();
  }

  loadUserData() {
    this.userService.getUserById('123').subscribe({
      next: (user) => console.log('User loaded:', user),
      error: (error) => console.error('Error loading user:', error)
    });
  }

  loadCourses() {
    this.courseService.getCourses().subscribe({
      next: (courses) => console.log('Courses loaded:', courses),
      error: (error) => console.error('Error loading courses:', error)
    });
  }
}
```

### Course Enrollment Example

```typescript
enrollInCourse(courseId: string, userId: string) {
  this.courseService.enrollCourse(courseId, userId).subscribe({
    next: (response) => {
      console.log('Enrollment successful:', response);
      // Update UI or show success message
    },
    error: (error) => {
      console.error('Enrollment failed:', error);
      // Show error message
    }
  });
}
```

### File Upload Example

```typescript
uploadFile(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.fileUploadService.uploadFile(file).subscribe({
      next: (response) => {
        console.log('File uploaded successfully:', response);
      },
      error: (error) => {
        console.error('Upload failed:', error);
      }
    });
  }
}
```

### Quiz Functionality Example

```typescript
startQuizSession(username: string) {
  this.quizService.startQuiz(username).subscribe({
    next: (quizData) => {
      console.log('Quiz started:', quizData);
      // Initialize quiz UI
    },
    error: (error) => {
      console.error('Failed to start quiz:', error);
    }
  });
}

uploadPdfForQuiz(file: File) {
  this.quizService.uploadPdf(file).subscribe({
    next: (response) => {
      console.log('PDF uploaded for quiz generation:', response);
    },
    error: (error) => {
      console.error('PDF upload failed:', error);
    }
  });
}
```

### User Progress Tracking

```typescript
updateUserProgress(userId: string, courseId: string, progress: number) {
  const enrollment: Enrollment = {
    id: 'enrollment-id',
    user: { id: userId } as User,
    course: { id: courseId } as Course,
    progress: progress,
    finished: progress >= 100,
    startDate: new Date(),
    lastVisitedDate: new Date(),
    completedLessons: [],
    lessonsCount: 0
  };

  this.enrollmentService.updateEnrollment(enrollment).subscribe({
    next: (response) => {
      console.log('Progress updated:', response);
    },
    error: (error) => {
      console.error('Failed to update progress:', error);
    }
  });
}
```

---

## Error Handling

All services return RxJS Observables and should be handled with proper error handling:

```typescript
service.method().subscribe({
  next: (data) => {
    // Handle success
  },
  error: (error) => {
    // Handle error
    console.error('Operation failed:', error);
    // Show user-friendly error message
  }
});
```

## Authentication Token Management

The application uses JWT tokens stored in localStorage:

```typescript
// Storing token after login
localStorage.setItem('token', response.token);
localStorage.setItem('role', JSON.stringify(response.roles[0]));
localStorage.setItem('username', response.username);
localStorage.setItem('email', response.email);
localStorage.setItem('id', response.id);

// Retrieving token for API calls
const token = localStorage.getItem('token');
```

## Contributing

When adding new services or components:

1. Follow the established patterns for service injection and Observable handling
2. Add proper TypeScript interfaces for data models
3. Include comprehensive error handling
4. Add appropriate route guards for protected functionality
5. Update this documentation with new APIs and usage examples