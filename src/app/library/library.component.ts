// filepath: /d:/Projects/Alamni-Frontend/src/app/library/library.component.ts
import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { EnrollmentService } from '../service/enrollment.service';
import { Course } from '../interface/course';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [SidebarComponent, CommonModule, RouterModule],
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css'],
})
export class LibraryComponent implements OnInit {
  id: string = '';
  enrollments: any[] = [];
  allCourses: Course[] = [];
  courses: Course[] = [];
  finishedCoursesCount: number = 0;
  unfinishedCoursesCount: number = 0;

  constructor(
    private enrollmentService: EnrollmentService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.id = localStorage.getItem('id') || '';
    if (this.id) {
      this.getEnrollmentsByUserId(this.id);
    }
  }

  getEnrollmentsByUserId(userId: string): void {
    this.enrollmentService.getEnrollmentsByUserId(userId).subscribe({
      next: (enrollments) => {
        this.enrollments = enrollments;
        this.allCourses = enrollments.map((enrollment) => {
          const course = enrollment.course;
          console.log('Course:', course);
          course.imageUrl = `http://localhost:8000/api${course.imageUrl}`;
          return course;
        });
        this.courses = this.allCourses; // Initialize courses with all courses
        this.updateCourseCounts();
      },
      error: (err) => {
        console.error('Error fetching enrollments:', err);
      },
    });
  }
  updateCourseCounts(): void {
    this.finishedCoursesCount = this.enrollments.filter(
      (enrollment) => enrollment.finished
    ).length;
    this.unfinishedCoursesCount = this.enrollments.filter(
      (enrollment) => !enrollment.finished
    ).length;
  }

  filterCoursesByType(type: string): void {
    if (type === 'all') {
      this.courses = this.allCourses; // Reset to all courses
    } else if (type === 'finished') {
      this.courses = this.enrollments
        .filter((enrollment) => enrollment.finished)
        .map((enrollment) => {
          const course = enrollment.course;

          return course;
        });
    } else if (type === 'unfinished') {
      this.courses = this.enrollments
        .filter((enrollment) => !enrollment.finished)
        .map((enrollment) => {
          const course = enrollment.course;
          return course;
        });
    }
  }
  viewDetails(courseId: string): void {
    console.log('Viewing course details:', courseId);
    this.router.navigate(['/course-details', courseId]);
  }
}
