import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { UserService } from '../service/user.service';
import { User } from '../interface/user';
import { EnrollmentService } from '../service/enrollment.service';
import { Course } from '../interface/course';
import { CommonModule } from '@angular/common';
import { Enrollment } from '../interface/Enrollment';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet, CommonModule, RouterModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  username: string | null = null;
  id: string = '';
  user: User | null = null;
  enrollments: Enrollment[] = [];
  allCourses: Course[] = [];
  courses: Course[] = [];
  lastUnfinishedCourse: Course | null = null;
  finishedCoursesCount: number = 0;

  constructor(
    private userService: UserService,
    private enrollmentService: EnrollmentService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('username')) {
      this.username = localStorage.getItem('username');
    }
    if (this.username) {
      this.userService.getUser(this.username).subscribe((user) => {
        this.user = user;
        if (this.user) {
          this.id = localStorage.getItem('id') || '';
          if (this.id) {
            this.getEnrollmentsByUserId(this.id);
            this.getFinishedCoursesByUserId(this.id); 
          }
        }
      });
    }
  }
  getFinishedCoursesByUserId(userId: string): void {
    this.enrollmentService.getFinishedCoursesByUserId(userId).subscribe({
      next: (finishedCourses) => {
        this.finishedCoursesCount = finishedCourses.length;
        console.log('Finished Courses Count:', this.finishedCoursesCount);
      },
      error: (err) => {
        console.error('Error fetching finished courses:', err);
      },
    });
  }
  getEnrollmentsByUserId(userId: string): void {
    this.enrollmentService.getEnrollmentsByUserId(userId).subscribe({
      next: (enrollments) => {
        this.enrollments = enrollments;
        this.allCourses = enrollments.map((enrollment) => {
          const course = enrollment.course;
          course.imageUrl = `http://localhost:8000/api${course.imageUrl}`;
          return course;
        });
        this.courses = this.allCourses;
        this.setLastUnfinishedCourse();
      },
      error: (err) => {
        console.error('Error fetching enrollments:', err);
      },
    });
  }

  setLastUnfinishedCourse(): void {
    const unfinishedEnrollments = this.enrollments.filter(
      (enrollment) => !enrollment.finished
    );
    if (unfinishedEnrollments.length > 0) {
      const lastEnrollment = unfinishedEnrollments.reduce((prev, current) =>
        new Date(prev.lastVisitedDate) > new Date(current.lastVisitedDate)
          ? prev
          : current
      );
      this.lastUnfinishedCourse = lastEnrollment.course;
    }
  }

  filterUnfinishedCourses(): void {
    this.courses = this.enrollments
      .filter((enrollment) => !enrollment.finished)
      .map((enrollment) => {
        const course = enrollment.course;

        return course;
      });
  }
}
