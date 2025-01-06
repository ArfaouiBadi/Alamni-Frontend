import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Course } from '../../interface/course';
import { CourseService } from '../../service/course.service';
import { CommonModule } from '@angular/common';
import { QuizService } from '../../service/quiz.service';
import { Lesson } from '../../interface/lesson';
import { Module } from '../../interface/module';
import { NavbarComponent } from '../../navbar/navbar.component';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { EnrollmentService } from '../../service/enrollment.service';
import Swal from 'sweetalert2';
import { UserService } from '../../service/user.service';
import { User } from '../../interface/user';

@Component({
  selector: 'app-courses-details',
  standalone: true,
  imports: [CommonModule, NavbarComponent, SidebarComponent],
  templateUrl: './courses-details.component.html',
  styleUrl: './courses-details.component.css',
})
export class CoursesDetailsComponent implements OnInit {
  course!: Course;
  courseDetails!: string;
  isLoading: boolean = false;
  userId: string | null = localStorage.getItem('id');
  isEnrolled: boolean = false;
  studentCount: number = 0;
  user: User | null = null;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly courseService: CourseService,
    private readonly enrollmentService: EnrollmentService,
    private readonly quizService: QuizService,
    private readonly userService: UserService
  ) {}
  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.courseService.getCourseById(courseId).subscribe({
        next: (data) => {
          this.course = data;
          this.checkEnrollment(courseId);
          this.enrollmentService
            .getEnrollementsCountByCourseId(courseId)
            .subscribe({
              next: (count) => {
                this.studentCount = count;
              },
              error: (err) => {
                console.error('Error fetching student count:', err);
              },
            });
        },
        error: (err) => {
          console.error('Error fetching course details:', err);
        },
      });
    }

    this.userService.getUserById(this.userId!).subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
      },
    });
  }
  startQuiz(module: Module, lesson: Lesson) {
    this.isLoading = true; // Start loading
    console.log('Starting quiz:', module.title, lesson.title);
    this.courseDetails = `${module.title} - ${lesson.title}`;
    this.quizService.startQuiz(this.courseDetails).subscribe({
      next: (data) => {
        console.log('Quiz started:', data);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error starting quiz:', err);
        this.isLoading = false;
      },
    });
  }

  enrollCourse(courseId: string) {
    const id = localStorage.getItem('id');
    this.courseService.enrollCourse(courseId, id!).subscribe({
      next: (data) => {
        console.log('Course enrolled:', data);
        Swal.fire({
          title: 'Congratulations!',
          text: 'You have successfully enrolled in this course!',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/library']);
          }
        });
      },
      error: (err) => {
        console.error('Error enrolling course:', err);
        Swal.fire({
          title: 'Error',
          text: 'Failed to enroll in this course.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      },
    });
  }
  goToLesson(courseId: string, lesson: Lesson) {
    this.router.navigate(['lesson', courseId], { state: { lesson } });
  }
  private checkEnrollment(courseId: string): void {
    if (this.userId) {
      this.enrollmentService.getEnrollmentsByUserId(this.userId).subscribe({
        next: (enrollments) => {
          this.isEnrolled = enrollments.some(
            (enrollment) => enrollment.course.id === courseId
          );
        },
        error: (err) => {
          console.error('Error checking enrollment:', err.message);
        },
      });
    }
  }
}
