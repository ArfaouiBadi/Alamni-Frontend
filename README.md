# Alamani Frontend - Learning Management System

A comprehensive Learning Management System built with Angular 18, providing an interactive platform for online education with course management, user enrollment, quizzes, and administrative features.

## 🚀 Features

### 🎓 Learning Features
- **Interactive Courses**: Browse and enroll in various courses
- **Video Lessons**: Watch educational content with progress tracking
- **Quizzes & Assessments**: Test knowledge with interactive quizzes
- **PDF Resources**: Access downloadable course materials
- **Progress Tracking**: Monitor learning progress across courses
- **Leaderboard**: Gamified learning with user rankings

### 👥 User Management
- **Multi-role Authentication**: Support for students, instructors, and administrators
- **User Profiles**: Customizable user profiles with progress tracking
- **Email Verification**: Secure account verification process
- **Role-based Access Control**: Different permissions for different user types

### 📊 Administrative Features
- **Admin Dashboard**: Comprehensive admin panel for system management
- **Course Management**: Create, edit, and manage courses
- **User Management**: Manage users and their roles
- **Analytics**: Track user engagement and course performance
- **Category Management**: Organize courses by categories

### 🎨 User Experience
- **Responsive Design**: Mobile-friendly interface using Bootstrap 5
- **Modern UI**: Built with Angular Material components
- **Interactive Charts**: Data visualization with Chart.js
- **Real-time Notifications**: Toast notifications for user feedback
- **Search & Filter**: Easy navigation through courses and content

## 🛠️ Technology Stack

### Frontend
- **Angular**: 18.2.0 (Latest)
- **TypeScript**: 5.5.2
- **Angular Material**: 17.0.0
- **Bootstrap**: 5.3.3
- **RxJS**: 7.8.0

### UI/UX Libraries
- **Chart.js**: 4.4.7 (Data visualization)
- **ng2-charts**: 6.0.1 (Angular Chart.js wrapper)
- **ngx-toastr**: 19.0.0 (Toast notifications)
- **SweetAlert2**: 11.15.10 (Beautiful alerts)

### Additional Features
- **PDF.js**: 4.10.38 (PDF viewing)
- **Angular SSR**: Server-side rendering support
- **Express**: 4.18.2 (SSR server)

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Angular CLI**: 18.x or higher

```bash
# Install Angular CLI globally
npm install -g @angular/cli@18
```

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone [repository-url]
cd alamani-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create environment files in `src/environments/`:
- `environment.ts` (development)
- `environment.prod.ts` (production)

### 4. Start Development Server
```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/` in your browser. The application will automatically reload when you make changes.

### 5. Backend Configuration
Make sure your backend API is running on `http://localhost:8000/api` (as configured in the services).

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run build` | Build for production |
| `npm run watch` | Build in watch mode |
| `npm test` | Run unit tests |
| `npm run serve:ssr:alamani-Frontend` | Serve with SSR |

## 🏗️ Build

### Development Build
```bash
ng build
```

### Production Build
```bash
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

## 🧪 Testing

### Unit Tests
```bash
ng test
```

Tests are executed via [Karma](https://karma-runner.github.io) test runner.

### End-to-End Tests
```bash
ng e2e
```

Note: You need to add an e2e testing package first.

## 📁 Project Structure

```
src/
├── app/
│   ├── admin-dashboard/     # Admin panel components
│   ├── auth/               # Authentication components
│   ├── categories/         # Category management
│   ├── courses/           # Course-related components
│   ├── guards/            # Route guards
│   ├── home-page/         # Home page components
│   ├── interface/         # TypeScript interfaces
│   ├── landing-page/      # Landing page
│   ├── leaderboard/       # Leaderboard features
│   ├── lesson/            # Lesson components
│   ├── library/           # Resource library
│   ├── navbar/            # Navigation components
│   ├── profile/           # User profile components
│   ├── service/           # Angular services
│   ├── sidebar/           # Sidebar navigation
│   └── users/             # User management
├── assets/                # Static assets
└── environments/          # Environment configurations
```

## 📚 Documentation

For detailed documentation, refer to:
- [API Documentation](./API_DOCUMENTATION.md) - Complete API service documentation
- [Component Documentation](./COMPONENT_DOCUMENTATION.md) - Detailed component reference
- [API Guide](./README_API_GUIDE.md) - API usage guide

## 🔐 Authentication & Authorization

The application supports multiple user roles:
- **Student**: Can enroll in courses, take quizzes, track progress
- **Instructor**: Can create and manage courses, view student progress
- **Admin**: Full system access, user management, analytics

## 🌐 API Integration

The frontend communicates with a backend API running on `http://localhost:8000/api`. Key endpoints include:
- Authentication (`/auth`)
- User management (`/users`)
- Course management (`/courses`)
- Quiz system (`/quizzes`)
- File uploads (`/files`)

## 🎨 Styling & Theming

The application uses:
- **Bootstrap 5.3.3** for responsive layout
- **Angular Material 17** for UI components
- **Custom CSS** for theme customization

## 🔧 Development Guidelines

### Code Scaffolding
```bash
# Generate new component
ng generate component component-name

# Generate service
ng generate service service-name

# Generate module
ng generate module module-name
```

### Code Style
- Follow Angular style guide
- Use TypeScript strict mode
- Implement proper error handling
- Add appropriate unit tests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For support and questions:
- Check the documentation files in this repository
- Review the component and API documentation
- Contact the development team

## 🔗 Related Links

- [Angular Documentation](https://angular.dev)
- [Angular Material](https://material.angular.io)
- [Bootstrap](https://getbootstrap.com)
- [Chart.js](https://www.chartjs.org)

---

**Built with ❤️ using Angular 18**