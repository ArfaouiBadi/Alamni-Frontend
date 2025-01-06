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
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  imports: [UsersListComponent, CommonModule, CoursesListComponent],
})
export class AdminDashboardComponent implements AfterViewInit {
  totalCourses: number = 0;
  totalUsers: number = 0;
  totalCategories: number = 0;
  totalEnrolledCourses: number = 0;
  chart: any;
  ageDistribution: any = {};

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
    this.enrollmentService.getTotalEnrollmentCount().subscribe({
      next: (total) => {
        this.totalEnrolledCourses = total;
      },
      error: (err) => {
        console.error('Error fetching total enrolled courses:', err);
      },
    });
  }

  fetchCoursesPerCategory(): void {
    this.courseService.getCoursesPerCategory().subscribe({
      next: (data) => {
        const categories = data.map((item) => item.category);
        const counts = data.map((item) => item.count);

        if (this.chart) {
          this.chart.destroy();
        }

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
        console.error('Error fetching courses per category:', err);
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
  }
  showManageCourses() {
    this.currentView = 'manageCourses';
  }
  logout() {
    localStorage.clear(); 
    this.router.navigate(['/login']); 
  }

}
