import { Component, AfterViewInit } from '@angular/core';
import { CourseService } from '../service/course.service';
import { UserService } from '../service/user.service';
import { CategoryService } from '../service/category.service';
import { Chart, registerables } from 'chart.js';
import { UsersListComponent } from '../users/users-list/users-list.component';
import { CommonModule } from '@angular/common';
import { CoursesListComponent } from '../courses/courses-list/courses-list.component';
import { EnrollmentService } from '../service/enrollment.service';
import { Router } from '@angular/router';
import { CategoriesComponent } from "../categories/categories.component";
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  imports: [UsersListComponent, CommonModule, CoursesListComponent, CategoriesComponent,RouterModule],
})
export class AdminDashboardComponent implements AfterViewInit {
  totalCourses: number = 0;
  totalUsers: number = 0;
  totalCategories: number = 0;
  totalEnrolledCourses: number = 0;
  chart: any;
  ageDistribution: any = {};
  courses: any[] = [];
  constructor(
    private courseService: CourseService,
    private userService: UserService,
    private categoryService: CategoryService,
    private enrollmentService: EnrollmentService,
    private router:Router
  ) {}

  ngAfterViewInit(): void {
    Chart.register(...registerables);

    this.fetchTotalCourses();
    this.fetchTotalUsers();
    this.fetchTotalCategories();
    this.fetchEnrolledCourses();
    this.fetchCoursesPerCategory();
    this.fetchAgeDistribution();
    this.fetchCourses();
  
  }

  fetchTotalCourses(): void {
    this.courseService.getTotalCourses().subscribe({
      next: (total) => {
        this.totalCourses = total;
      },
      error: (err) => {
        console.error('Error fetching total courses:', err);
      },
    });
  }

  fetchTotalUsers(): void {
    this.userService.getTotalUsers().subscribe({
      next: (total) => {
        this.totalUsers = total;
      },
      error: (err) => {
        console.error('Error fetching total users:', err);
      },
    });
  }

  fetchTotalCategories(): void {
    this.categoryService.getTotalCategories().subscribe({
      next: (total) => {
        this.totalCategories = total;
      },
      error: (err) => {
        console.error('Error fetching total categories:', err);
      },
    });
  }

  fetchEnrolledCourses(): void {
    const enrollments = this.enrollmentService.getEnrollments().subscribe(
      (enrollments) => {
        this.totalEnrolledCourses = enrollments;
      },
      (err) => {
        console.error('Error fetching enrolled courses:', err);
      }
    );
    console.log(enrollments);
  }

  fetchCoursesPerCategory(): void {
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        // Group courses by category and count them
        const categoryCounts = courses.reduce((acc, course) => {
          const categoryName = course.category.name;
          if (!acc[categoryName]) {
            acc[categoryName] = 0;
          }
          acc[categoryName]++;
          return acc;
        }, {} as Record<string, number>);
  
        const categories = Object.keys(categoryCounts);
        const counts = Object.values(categoryCounts);
  
        if (this.chart) {
          this.chart.destroy();
        }
  
        // Create a bar chart
        this.chart = new Chart('myAreaChart', {
          type: 'bar',
          data: {
            labels: categories,
            datasets: [
              {
                label: 'Courses per Category',
                data: counts,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              x: { title: { display: true, text: 'Category' } },
              y: {
                title: { display: true, text: 'Number of Courses' },
                beginAtZero: true,
              },
            },
          },
        });
      },
      error: (err) => {
        console.error('Error fetching courses:', err);
      },
    });
  }
  

  fetchAgeDistribution(): void {
    this.userService.getUsersByAgeGroup().subscribe({
      next: (data) => {
        this.ageDistribution = data;
        this.createPieChart();
      },
      error: (err) => {
        console.error('Error fetching age distribution:', err);
      },
    });
  }

  createPieChart(): void {
    const labels = Object.keys(this.ageDistribution);
    const data = Object.values(this.ageDistribution);

    this.chart = new Chart('ageChart', {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'User Age Distribution',
            data: data,
            backgroundColor: [
              '#7234f0', // Purple
              '#0d47a1', // Blue
              '#00c853', // Green
              '#ffeb3b', // Yellow
              '#f44336', // Red
              '#4caf50', // Light Green
            ],
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  }
  currentView: string = 'dashboard';

  showManageUsers() {
    this.currentView = 'manageUsers';
  }

  showDashboard() {
    this.currentView = 'dashboard';
    location.reload();
  }
  showManageCourses() {
    this.currentView = 'manageCourses';
  }
  showManageCategories(){
    this.currentView='manageCategories';
  }
  fetchCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.courses = data.map((course) => ({
          title: course.title,
          duration: course.duration,
        }));
      },
      error: (err) => {
        console.error('Error fetching courses:', err);
      },
    });
  }
  getProgressPercentage(duration: number): number {
    const maxDuration = 700; 
    return Math.min((duration / maxDuration) * 100, 100);
  }
  
  getProgressBarClass(duration: number): string {
    const percentage = this.getProgressPercentage(duration);
    if (percentage <= 20) return 'bg-danger';
    if (percentage <= 40) return 'bg-warning';
    if (percentage <= 60) return 'bg-info';
    if (percentage <= 80) return 'bg-primary';
    return 'bg-success';
  }
  
  logout() {
    localStorage.clear(); 
    this.router.navigate(['/login']); 
  }


}
