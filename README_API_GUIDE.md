# Alamani Frontend - Complete API & Component Guide

## 📚 Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Architecture](#architecture)
4. [Documentation Files](#documentation-files)
5. [Quick Reference](#quick-reference)
6. [Common Usage Patterns](#common-usage-patterns)
7. [Development Guidelines](#development-guidelines)

---

## 🚀 Overview

The Alamani Frontend is a comprehensive **Angular 18** learning management system (LMS) that provides:

- **User Authentication & Authorization** with role-based access control
- **Course Management** with video/PDF lessons and quiz generation
- **Enrollment System** with progress tracking
- **Admin Dashboard** with analytics and user management
- **Gamification** with points, levels, and badges
- **File Upload** capabilities for various content types

**Technology Stack:**
- Angular 18.2.0 with standalone components
- TypeScript 5.5.2
- Bootstrap 5.3.3 + Angular Material 17.0.0
- Chart.js 4.4.7 for data visualization
- RxJS 7.8.0 for reactive programming
- SweetAlert2 for user notifications

---

## 🏁 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Angular CLI 18+
- Backend API running on `http://localhost:8000`
- Flask service for quiz generation on `http://127.0.0.1:5000`

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd alamani-frontend

# Install dependencies
npm install

# Start development server
ng serve

# Build for production
ng build
```

### Environment Setup
The application connects to:
- **Main API:** `http://localhost:8000/api`
- **Quiz Service:** `http://127.0.0.1:5000`

### Authentication Flow
1. Navigate to `/login`
2. Use valid credentials to authenticate
3. Token and user data stored in localStorage
4. Access granted based on user role (USER/ADMIN)

---

## 🏗️ Architecture

### Service Layer
```
AuthService → User authentication
UserService → User management & statistics  
CourseService → Course CRUD & enrollment
EnrollmentService → Progress tracking
CategoryService → Category management
QuizService → PDF upload & quiz generation
FileUploadService → General file handling
```

### Component Hierarchy
```
AppComponent
├── NavbarComponent (Authentication state)
├── LoginComponent (Authentication)
├── HomePageComponent (User dashboard)
├── AdminDashboardComponent (Admin interface)
├── CoursesListComponent (Course management)
└── Protected routes with guards
```

### Data Flow
```
Component → Service → HTTP Client → Backend API
Component ← Service ← Observable Response ← Backend API
```

---

## 📖 Documentation Files

### 1. [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
**Complete service API documentation** covering:
- All service methods with parameters and return types
- Data models and interfaces
- Authentication patterns
- Error handling examples
- RxJS Observable usage

### 2. [COMPONENT_DOCUMENTATION.md](./COMPONENT_DOCUMENTATION.md)
**Comprehensive component documentation** covering:
- Public properties and methods
- Form structures and validation
- Event handling and lifecycle
- Integration patterns
- Template usage examples

---

## 🔗 Quick Reference

### Essential Services

#### Authentication
```typescript
// Login user
authService.login({ email, password }).subscribe(response => {
  localStorage.setItem('token', response.token);
});

// Register user
authService.signUp(userData).subscribe(response => {
  console.log('User registered:', response);
});
```

#### Course Management
```typescript
// Get all courses
courseService.getCourses().subscribe(courses => {
  this.courses = courses;
});

// Enroll in course
courseService.enrollCourse(courseId, userId).subscribe(result => {
  console.log('Enrollment successful');
});
```

#### User Management
```typescript
// Get user by ID
userService.getUserById(id).subscribe(user => {
  this.user = user;
});

// Update user progress
userService.updateUserLevelAndPoints(id, { level: 5, points: 1000 })
  .subscribe(result => console.log('Progress updated'));
```

### Key Components

#### Course List Management
```typescript
// Add new course with modules and lessons
onAddCourse() {
  const courseData = this.addCourseForm.value;
  // File uploads handled automatically
  this.courseService.addCourse(courseData).subscribe(result => {
    this.loadCourses();
  });
}
```

#### User Dashboard
```typescript
// Load user enrollments
getEnrollmentsByUserId(userId: string) {
  this.enrollmentService.getEnrollmentsByUserId(userId)
    .subscribe(enrollments => {
      this.enrollments = enrollments;
      this.setLastUnfinishedCourse();
    });
}
```

### Route Guards
```typescript
// Authentication guard
canActivate(): boolean {
  return !!localStorage.getItem('token');
}

// Role-based guard
canActivate(route: ActivatedRouteSnapshot): boolean {
  const requiredRole = route.data['role'];
  const userRole = JSON.parse(localStorage.getItem('role') || 'null');
  return userRole === requiredRole;
}
```

---

## 🎯 Common Usage Patterns

### 1. Service Injection & Error Handling
```typescript
@Component({...})
export class ExampleComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  loading = false;
  error: string | null = null;

  constructor(
    private userService: UserService,
    private courseService: CourseService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData() {
    this.loading = true;
    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          this.users = users;
          this.loading = false;
        },
        error: (error) => {
          this.error = error.message;
          this.loading = false;
        }
      });
  }
}
```

### 2. Form Management with Validation
```typescript
@Component({...})
export class FormComponent {
  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', Validators.required],
    category: ['', Validators.required]
  });

  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value;
      this.serviceMethod(formData).subscribe({
        next: (result) => this.handleSuccess(result),
        error: (error) => this.handleError(error)
      });
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

### 3. File Upload Integration
```typescript
onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    
    this.fileUploadService.uploadFile(file).subscribe({
      next: (fileUrl) => {
        this.form.patchValue({ fileUrl });
        console.log('File uploaded successfully:', fileUrl);
      },
      error: (error) => {
        console.error('Upload failed:', error);
      }
    });
  }
}
```

### 4. Real-time Data Updates
```typescript
@Component({...})
export class DashboardComponent implements OnInit {
  stats$ = interval(30000).pipe(
    startWith(0),
    switchMap(() => forkJoin({
      totalUsers: this.userService.getTotalUsers(),
      totalCourses: this.courseService.getTotalCourses(),
      totalEnrollments: this.enrollmentService.getEnrollments()
    }))
  );

  ngOnInit() {
    this.stats$.subscribe(stats => {
      this.updateCharts(stats);
    });
  }
}
```

---

## 📋 Development Guidelines

### 1. **Code Organization**
- Use standalone components (Angular 18 pattern)
- Implement proper TypeScript interfaces
- Follow reactive programming with RxJS
- Organize services by feature/domain

### 2. **State Management**
- Store authentication data in localStorage
- Use services for shared state
- Implement proper cleanup in ngOnDestroy
- Handle loading and error states consistently

### 3. **Error Handling**
- Always provide error handling in subscribe blocks
- Display user-friendly error messages
- Log detailed errors to console for debugging
- Implement retry mechanisms where appropriate

### 4. **Security Best Practices**
- Use route guards for protected routes
- Validate user roles on sensitive operations
- Clear sensitive data on logout
- Implement proper input validation

### 5. **Performance Optimization**
- Use OnPush change detection where possible
- Implement virtual scrolling for large lists
- Lazy load feature modules
- Optimize images and assets

### 6. **Testing Guidelines**
```typescript
// Service testing example
describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch users', () => {
    const mockUsers = [{ id: '1', name: 'Test User' }];
    
    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/users`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });
});
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. **CORS Errors**
```bash
# Ensure backend is configured for CORS
# Frontend runs on http://localhost:4200
# Backend should allow this origin
```

#### 2. **Authentication Issues**
```typescript
// Check token validity
const token = localStorage.getItem('token');
if (!token) {
  this.router.navigate(['/login']);
}
```

#### 3. **File Upload Problems**
```typescript
// Ensure proper FormData usage
const formData = new FormData();
formData.append('file', file);
// Don't set Content-Type header manually
```

#### 4. **Observable Memory Leaks**
```typescript
// Always unsubscribe in ngOnDestroy
private destroy$ = new Subject<void>();

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

---

## 📞 Support & Contributing

### Getting Help
1. Check this documentation first
2. Review component and service interfaces
3. Check browser console for errors
4. Verify backend API connectivity

### Contributing
1. Follow established patterns in existing code
2. Add proper TypeScript types
3. Include error handling
4. Update documentation for new features
5. Test thoroughly before submitting

### Code Style
- Use TypeScript strict mode
- Follow Angular style guide
- Use meaningful variable names
- Add JSDoc comments for public methods

---

**📝 Last Updated:** December 2024  
**💻 Angular Version:** 18.2.0  
**🔄 API Version:** Compatible with backend v1.0**