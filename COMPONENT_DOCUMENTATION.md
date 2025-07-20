# Alamani Frontend - Component Documentation

## Table of Contents

1. [Overview](#overview)
2. [Navigation Components](#navigation-components)
3. [Authentication Components](#authentication-components)
4. [Course Management Components](#course-management-components)
5. [Admin Components](#admin-components)
6. [Dashboard Components](#dashboard-components)
7. [Component Integration Examples](#component-integration-examples)

---

## Overview

This document provides comprehensive documentation for all public components in the Alamani Frontend application. Each component includes its public properties, methods, inputs, outputs, and usage examples.

---

## Navigation Components

### Navbar Component

**File:** `src/app/navbar/navbar.component.ts`
**Selector:** `app-navbar`

Main navigation component with user authentication state management and view switching.

#### Public Properties

| Property | Type | Description |
|----------|------|-------------|
| `username` | `string \| null` | Currently logged-in username |
| `currentView` | `string` | Current active view ('learn', 'courses', 'home') |
| `isUserLoggedIn` | `boolean` | User authentication status |
| `userRole` | `string \| null` | Current user's role |
| `userId` | `string \| null` | Current user's ID |
| `userLoggedin` | `User \| null` | Complete user object for logged-in user |

#### Public Methods

##### `logout(): void`
Clears user session data and redirects to login page.

**Functionality:**
- Clears localStorage
- Navigates to login page

**Example:**
```html
<button (click)="logout()" class="btn btn-outline-danger">
  Logout
</button>
```

##### `switchView(view: string): void`
Changes the active view in the navigation.

**Parameters:**
- `view` (string): Target view name

**Example:**
```html
<button (click)="switchView('courses')" 
        [class.active]="currentView === 'courses'">
  Courses
</button>
```

#### Animations
- Includes switch animation with opacity transitions
- Duration: 0.5s ease-in-out

#### Usage Example
```typescript
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  imports: [NavbarComponent],
  template: `<app-navbar></app-navbar>`
})
export class AppComponent {}
```

---

## Authentication Components

### Login Component

**File:** `src/app/auth/login/login.component.ts`
**Selector:** `app-login`

Handles user authentication with form validation and error handling.

#### Public Properties

| Property | Type | Description |
|----------|------|-------------|
| `loginForm` | `FormGroup` | Reactive form for login credentials |
| `isLoading` | `boolean` | Loading state indicator |

#### Form Structure
```typescript
loginForm = FormGroup({
  email: FormControl('', [Validators.required, Validators.email]),
  password: FormControl('', [Validators.required, Validators.minLength(6)])
});
```

#### Public Methods

##### `onSubmit(): void`
Handles login form submission with validation and authentication.

**Functionality:**
- Validates form inputs
- Calls AuthService.login()
- Stores authentication data
- Checks email verification
- Handles navigation and error display

##### `cancelLoading(): void`
Cancels the loading state.

#### Usage Example
```html
<form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
  <div class="form-group">
    <input 
      formControlName="email" 
      type="email" 
      class="form-control"
      placeholder="Email"
      [class.is-invalid]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
  </div>
  
  <div class="form-group">
    <input 
      formControlName="password" 
      type="password" 
      class="form-control"
      placeholder="Password"
      [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
  </div>
  
  <button 
    type="submit" 
    [disabled]="!loginForm.valid || isLoading"
    class="btn btn-primary">
    <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
    {{ isLoading ? 'Logging in...' : 'Login' }}
  </button>
</form>
```

---

## Course Management Components

### Courses List Component

**File:** `src/app/courses/courses-list/courses-list.component.ts`
**Selector:** `app-courses-list`

Comprehensive course management component for CRUD operations with file uploads.

#### Public Properties

| Property | Type | Description |
|----------|------|-------------|
| `addCourseForm` | `FormGroup` | Form for adding new courses |
| `editCourseForm` | `FormGroup` | Form for editing existing courses |
| `courses` | `Course[]` | List of all courses |
| `selectedCourse` | `Course \| null` | Currently selected course for editing |
| `categories` | `Category[]` | Available course categories |
| `successMessage` | `string \| null` | Success feedback message |
| `errorMessage` | `string \| null` | Error feedback message |
| `imagePreview` | `string \| ArrayBuffer \| null` | Preview of selected image |

#### Form Structure

##### Add Course Form
```typescript
addCourseForm = FormGroup({
  title: FormControl('', Validators.required),
  imageUrl: FormControl(''),
  description: FormControl('', Validators.required),
  duration: FormControl(0, Validators.required),
  category: FormControl('', Validators.required),
  levelRequired: FormControl(0, Validators.required),
  pointsRequired: FormControl(0, Validators.required),
  modules: FormArray([]),
  rewardSystem: FormGroup({
    points: FormControl(0),
    badges: FormArray([]),
    levels: FormControl(0, Validators.required)
  })
});
```

#### Public Methods

##### `loadCourses(): void`
Fetches and loads all courses from the server.

##### `loadCategories(): void`
Fetches and loads all available categories.

##### `addModule(): void`
Adds a new module to the course form.

**Module Structure:**
```typescript
FormGroup({
  title: FormControl('', Validators.required),
  duration: FormControl(0, Validators.required),
  lessons: FormArray([])
});
```

##### `addLesson(moduleIndex: number): void`
Adds a new lesson to a specific module.

**Parameters:**
- `moduleIndex` (number): Index of the target module

**Lesson Structure:**
```typescript
FormGroup({
  title: FormControl('', Validators.required),
  type: FormControl('Video', Validators.required),
  videoUrl: FormControl(''),
  pdfUrl: FormControl(''),
  generateQuiz: FormControl(false),
  content: FormControl('')
});
```

##### `addBadge(): void`
Adds a new badge to the reward system.

**Badge Structure:**
```typescript
FormGroup({
  name: FormControl('', Validators.required),
  icon: FormControl('', Validators.required)
});
```

##### `onAddCourse(): void`
Handles course creation with file uploads.

**Functionality:**
- Validates form data
- Uploads image and lesson files
- Uploads badge icons
- Creates course via CourseService
- Shows success/error messages

##### `onEditCourse(course: Course): void`
Prepares course data for editing.

**Parameters:**
- `course` (Course): Course to edit

##### `onEditCourseSubmit(): void`
Handles course update with file uploads.

##### `deleteCourse(): void`
Deletes a course after confirmation.

##### File Upload Methods

###### `onFileSelected(event: Event, moduleIndex: number, lessonIndex: number): void`
Handles lesson file selection.

###### `onImageSelected(event: Event): void`
Handles course image selection with preview.

###### `onBadgeIconSelected(event: Event, badgeIndex: number): void`
Handles badge icon file selection.

#### Usage Example
```html
<!-- Course List Display -->
<div class="courses-grid">
  <div *ngFor="let course of courses" class="course-card">
    <img [src]="'http://localhost:8000/api' + course.imageUrl" 
         [alt]="course.title" class="course-image">
    
    <div class="course-content">
      <h3>{{ course.title }}</h3>
      <p>{{ course.description }}</p>
      <p><strong>Duration:</strong> {{ course.duration }} minutes</p>
      <p><strong>Category:</strong> {{ course.category.name }}</p>
      
      <div class="course-actions">
        <button (click)="onEditCourse(course)" 
                class="btn btn-primary">Edit</button>
        <button (click)="confirmDeleteCourse(course.id!)" 
                class="btn btn-danger">Delete</button>
      </div>
    </div>
  </div>
</div>

<!-- Add Course Form -->
<form [formGroup]="addCourseForm" (ngSubmit)="onAddCourse()">
  <!-- Basic Course Information -->
  <div class="form-group">
    <label>Course Title</label>
    <input formControlName="title" type="text" class="form-control">
  </div>
  
  <div class="form-group">
    <label>Course Image</label>
    <input type="file" (change)="onImageSelected($event)" 
           accept="image/*" class="form-control">
    <img *ngIf="imagePreview" [src]="imagePreview" 
         alt="Preview" class="image-preview">
  </div>
  
  <!-- Modules Section -->
  <div formArrayName="modules">
    <div *ngFor="let module of modules.controls; let i = index" 
         [formGroupName]="i" class="module-section">
      
      <h4>Module {{ i + 1 }}</h4>
      
      <div class="form-group">
        <label>Module Title</label>
        <input formControlName="title" type="text" class="form-control">
      </div>
      
      <!-- Lessons Section -->
      <div formArrayName="lessons">
        <div *ngFor="let lesson of getLessons(i).controls; let j = index" 
             [formGroupName]="j" class="lesson-section">
          
          <h5>Lesson {{ j + 1 }}</h5>
          
          <div class="form-group">
            <label>Lesson Type</label>
            <select formControlName="type" class="form-control">
              <option value="Video">Video</option>
              <option value="PDF">PDF</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Upload File</label>
            <input type="file" (change)="onFileSelected($event, i, j)" 
                   class="form-control">
          </div>
          
          <button type="button" (click)="removeLesson(i, j)" 
                  class="btn btn-danger btn-sm">Remove Lesson</button>
        </div>
        
        <button type="button" (click)="addLesson(i)" 
                class="btn btn-secondary">Add Lesson</button>
      </div>
      
      <button type="button" (click)="removeModule(i)" 
              class="btn btn-danger">Remove Module</button>
    </div>
    
    <button type="button" (click)="addModule()" 
            class="btn btn-secondary">Add Module</button>
  </div>
  
  <button type="submit" [disabled]="addCourseForm.invalid" 
          class="btn btn-success">Create Course</button>
</form>
```

---

## Dashboard Components

### Home Page Component

**File:** `src/app/home-page/home-page.component.ts`
**Selector:** `app-home-page`

User dashboard displaying enrolled courses and progress tracking.

#### Public Properties

| Property | Type | Description |
|----------|------|-------------|
| `username` | `string \| null` | Current user's username |
| `id` | `string` | Current user's ID |
| `user` | `User \| null` | Complete user object |
| `enrollments` | `Enrollment[]` | User's course enrollments |
| `allCourses` | `Course[]` | All enrolled courses |
| `courses` | `Course[]` | Filtered courses for display |
| `lastUnfinishedCourse` | `Course \| null` | Most recently accessed unfinished course |
| `finishedCoursesCount` | `number` | Count of completed courses |

#### Public Methods

##### `getEnrollmentsByUserId(userId: string): void`
Fetches user's course enrollments.

**Parameters:**
- `userId` (string): User ID

**Functionality:**
- Fetches enrollments via EnrollmentService
- Maps courses with proper image URLs
- Sets up course data for display

##### `getFinishedCoursesByUserId(userId: string): void`
Fetches completed courses count for the user.

**Parameters:**
- `userId` (string): User ID

##### `setLastUnfinishedCourse(): void`
Identifies the most recently accessed unfinished course.

**Algorithm:**
- Filters unfinished enrollments
- Finds enrollment with latest `lastVisitedDate`
- Sets as `lastUnfinishedCourse`

##### `filterUnfinishedCourses(): void`
Filters courses to show only unfinished ones.

#### Usage Example
```html
<div class="dashboard-container">
  <!-- User Welcome Section -->
  <div class="welcome-section">
    <h1>Welcome back, {{ username }}!</h1>
    <div class="stats-row">
      <div class="stat-card">
        <h3>{{ finishedCoursesCount }}</h3>
        <p>Completed Courses</p>
      </div>
      <div class="stat-card">
        <h3>{{ enrollments.length }}</h3>
        <p>Total Enrollments</p>
      </div>
    </div>
  </div>

  <!-- Continue Learning Section -->
  <div *ngIf="lastUnfinishedCourse" class="continue-learning">
    <h2>Continue Learning</h2>
    <div class="course-card featured">
      <img [src]="'http://localhost:8000/api' + lastUnfinishedCourse.imageUrl" 
           [alt]="lastUnfinishedCourse.title">
      <div class="course-info">
        <h3>{{ lastUnfinishedCourse.title }}</h3>
        <p>{{ lastUnfinishedCourse.description }}</p>
        <a [routerLink]="['/course-details', lastUnfinishedCourse.id]" 
           class="btn btn-primary">Continue</a>
      </div>
    </div>
  </div>

  <!-- Enrolled Courses -->
  <div class="enrolled-courses">
    <h2>Your Courses</h2>
    <div class="courses-grid">
      <div *ngFor="let course of courses" class="course-card">
        <img [src]="'http://localhost:8000/api' + course.imageUrl" 
             [alt]="course.title">
        <div class="course-content">
          <h4>{{ course.title }}</h4>
          <p>{{ course.description | slice:0:100 }}...</p>
          <div class="course-actions">
            <a [routerLink]="['/course-details', course.id]" 
               class="btn btn-primary">View Details</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

---

## Admin Components

### Admin Dashboard Component

**File:** `src/app/admin-dashboard/admin-dashboard.component.ts`
**Selector:** `app-admin-dashboard`

Administrative dashboard with statistics, charts, and management interfaces.

#### Public Properties

| Property | Type | Description |
|----------|------|-------------|
| `totalCourses` | `number` | Total number of courses |
| `totalUsers` | `number` | Total number of users |
| `totalCategories` | `number` | Total number of categories |
| `totalEnrolledCourses` | `number` | Total enrollment count |
| `chart` | `any` | Chart.js instance |
| `ageDistribution` | `any` | User age group distribution data |
| `courses` | `any[]` | Course data for progress display |
| `currentView` | `string` | Current admin view |

#### Public Methods

##### Statistics Methods

###### `fetchTotalCourses(): void`
Fetches total course count from CourseService.

###### `fetchTotalUsers(): void`
Fetches total user count from UserService.

###### `fetchTotalCategories(): void`
Fetches total category count from CategoryService.

###### `fetchEnrolledCourses(): void`
Fetches total enrollment statistics.

##### Chart Methods

###### `fetchCoursesPerCategory(): void`
Creates a bar chart showing course distribution by category.

**Chart Configuration:**
- Type: Bar chart
- X-axis: Category names
- Y-axis: Course count
- Responsive design

###### `fetchAgeDistribution(): void`
Fetches user age distribution data for pie chart.

###### `createPieChart(): void`
Creates a pie chart showing user age group distribution.

**Chart Configuration:**
- Type: Pie chart
- Data: Age group percentages
- Color scheme: Multiple colors for different groups

##### View Management Methods

###### `showManageUsers(): void`
Switches to user management view.

###### `showDashboard(): void`
Returns to main dashboard view with page reload.

###### `showManageCourses(): void`
Switches to course management view.

###### `showManageCategories(): void`
Switches to category management view.

##### Utility Methods

###### `fetchCourses(): void`
Fetches course data for progress visualization.

###### `getProgressPercentage(duration: number): number`
Calculates progress percentage based on course duration.

**Parameters:**
- `duration` (number): Course duration in minutes

**Returns:** Progress percentage (0-100)

###### `getProgressBarClass(duration: number): string`
Returns Bootstrap class for progress bar styling.

**Parameters:**
- `duration` (number): Course duration

**Returns:** CSS class name for progress bar color

##### Authentication

###### `logout(): void`
Clears session and redirects to login.

#### Usage Example
```html
<div class="admin-dashboard">
  <!-- Navigation -->
  <div class="dashboard-nav">
    <button (click)="showDashboard()" 
            [class.active]="currentView === 'dashboard'"
            class="nav-btn">Dashboard</button>
    <button (click)="showManageUsers()" 
            [class.active]="currentView === 'manageUsers'"
            class="nav-btn">Manage Users</button>
    <button (click)="showManageCourses()" 
            [class.active]="currentView === 'manageCourses'"
            class="nav-btn">Manage Courses</button>
    <button (click)="showManageCategories()" 
            [class.active]="currentView === 'manageCategories'"
            class="nav-btn">Manage Categories</button>
  </div>

  <!-- Dashboard View -->
  <div *ngIf="currentView === 'dashboard'" class="dashboard-content">
    <!-- Statistics Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-book"></i>
        </div>
        <div class="stat-content">
          <h3>{{ totalCourses }}</h3>
          <p>Total Courses</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-users"></i>
        </div>
        <div class="stat-content">
          <h3>{{ totalUsers }}</h3>
          <p>Total Users</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-tags"></i>
        </div>
        <div class="stat-content">
          <h3>{{ totalCategories }}</h3>
          <p>Categories</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-graduation-cap"></i>
        </div>
        <div class="stat-content">
          <h3>{{ totalEnrolledCourses }}</h3>
          <p>Total Enrollments</p>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-section">
      <div class="chart-container">
        <h4>Courses per Category</h4>
        <canvas id="myAreaChart"></canvas>
      </div>

      <div class="chart-container">
        <h4>User Age Distribution</h4>
        <canvas id="ageChart"></canvas>
      </div>
    </div>

    <!-- Course Progress Overview -->
    <div class="course-progress-section">
      <h4>Course Duration Overview</h4>
      <div class="progress-list">
        <div *ngFor="let course of courses" class="progress-item">
          <div class="course-info">
            <span class="course-title">{{ course.title }}</span>
            <span class="course-duration">{{ course.duration }} min</span>
          </div>
          <div class="progress">
            <div class="progress-bar" 
                 [ngClass]="getProgressBarClass(course.duration)"
                 [style.width.%]="getProgressPercentage(course.duration)">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Management Views -->
  <div *ngIf="currentView === 'manageUsers'">
    <app-users-list></app-users-list>
  </div>

  <div *ngIf="currentView === 'manageCourses'">
    <app-courses-list></app-courses-list>
  </div>

  <div *ngIf="currentView === 'manageCategories'">
    <app-categories></app-categories>
  </div>
</div>
```

---

## Component Integration Examples

### Complete Authentication Flow
```typescript
// App Component with Authentication
@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <app-navbar *ngIf="isAuthenticated"></app-navbar>
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent implements OnInit {
  isAuthenticated = false;

  ngOnInit() {
    this.isAuthenticated = !!localStorage.getItem('token');
  }
}
```

### Course Management Integration
```typescript
// Parent component integrating course management
@Component({
  template: `
    <div class="course-management">
      <div class="course-list">
        <app-courses-list 
          (courseCreated)="onCourseCreated($event)"
          (courseUpdated)="onCourseUpdated($event)"
          (courseDeleted)="onCourseDeleted($event)">
        </app-courses-list>
      </div>
    </div>
  `
})
export class CourseManagementComponent {
  onCourseCreated(course: Course) {
    console.log('New course created:', course);
    // Handle course creation
  }

  onCourseUpdated(course: Course) {
    console.log('Course updated:', course);
    // Handle course update
  }

  onCourseDeleted(courseId: string) {
    console.log('Course deleted:', courseId);
    // Handle course deletion
  }
}
```

### Dashboard Data Flow
```typescript
// Dashboard with real-time updates
@Component({
  template: `
    <div class="dashboard">
      <app-home-page 
        [userProgress]="userProgress"
        (courseAccessed)="updateLastAccessed($event)">
      </app-home-page>
    </div>
  `
})
export class DashboardWrapperComponent {
  userProgress: any = {};

  updateLastAccessed(courseId: string) {
    // Update last accessed course
    this.userProgress.lastAccessed = courseId;
  }
}
```

### Error Handling Patterns
```typescript
// Component with comprehensive error handling
@Component({
  template: `
    <div class="component-container">
      <div *ngIf="loading" class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i> Loading...
      </div>
      
      <div *ngIf="error" class="error-message">
        <div class="alert alert-danger">
          {{ error }}
          <button (click)="retry()" class="btn btn-sm btn-outline-danger">
            Retry
          </button>
        </div>
      </div>
      
      <div *ngIf="!loading && !error" class="content">
        <!-- Component content -->
      </div>
    </div>
  `
})
export class BaseComponent {
  loading = false;
  error: string | null = null;

  protected handleError(error: any) {
    this.loading = false;
    this.error = error.message || 'An unexpected error occurred';
    console.error('Component error:', error);
  }

  retry() {
    this.error = null;
    this.loadData();
  }

  protected loadData() {
    // Implement in child components
  }
}
```

### Component Communication
```typescript
// Parent-child component communication
@Component({
  template: `
    <app-course-list 
      [courses]="courses"
      [selectedCourse]="selectedCourse"
      (courseSelected)="onCourseSelected($event)"
      (courseEnroll)="onCourseEnroll($event)">
    </app-course-list>
  `
})
export class CourseContainerComponent {
  courses: Course[] = [];
  selectedCourse: Course | null = null;

  onCourseSelected(course: Course) {
    this.selectedCourse = course;
  }

  onCourseEnroll(courseId: string) {
    const userId = localStorage.getItem('id');
    if (userId) {
      this.courseService.enrollCourse(courseId, userId).subscribe({
        next: () => console.log('Enrollment successful'),
        error: (error) => console.error('Enrollment failed:', error)
      });
    }
  }
}
```

---

## Best Practices

### 1. Component Lifecycle
```typescript
export class ExampleComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    // Initialize component
    this.loadData();
  }

  ngOnDestroy() {
    // Cleanup subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData() {
    this.service.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => this.handleData(data),
        error: (error) => this.handleError(error)
      });
  }
}
```

### 2. Form Validation
```typescript
// Comprehensive form validation
export class FormComponent {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  get emailErrors() {
    const control = this.form.get('email');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Email is required';
      if (control.errors['email']) return 'Invalid email format';
    }
    return null;
  }

  onSubmit() {
    if (this.form.valid) {
      this.processForm(this.form.value);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsTouched();
    });
  }
}
```

### 3. Loading States
```typescript
// Consistent loading state management
export class DataComponent {
  loading = false;
  data: any[] = [];

  async loadData() {
    this.loading = true;
    try {
      this.data = await this.service.getData().toPromise();
    } catch (error) {
      this.handleError(error);
    } finally {
      this.loading = false;
    }
  }
}
```

This comprehensive component documentation provides detailed information about all public APIs, methods, and integration patterns for the Alamani Frontend application components.