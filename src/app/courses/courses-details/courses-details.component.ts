import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../../interface/course';
import { CourseService } from '../../service/course.service';
import { CommonModule } from '@angular/common';
import { QuizService } from '../../service/quiz.service';
import { Lesson } from '../../interface/lesson';
import { Module } from '../../interface/module';
@Component({
  selector: 'app-courses-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './courses-details.component.html',
  styleUrl: './courses-details.component.css',
})
export class CoursesDetailsComponent implements OnInit {
  course!: Course;
  courseDetails!: string;
  isLoading: boolean = false;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly courseService: CourseService,
    private readonly quizService: QuizService
  ) {}
  ngOnInit(): void {
    // Get the course ID from the route
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.courseService.getCourseById(courseId).subscribe({
        next: (data) => {
          this.course = data;
        },
        error: (err) => {
          console.error('Error fetching course details:', err);
        },
      });
    }
  }
  startQuiz(module: Module, lesson: Lesson) {
    this.isLoading = true; // Start loading
    console.log('Starting quiz:', module.title, lesson.title);
    this.courseDetails = `${module.title} - ${lesson.title}`;
    this.quizService.startQuiz(this.courseDetails).subscribe({
      next: (data) => {
        console.log('Quiz started:', data);
        this.isLoading = false; // Stop loading on success
      },
      error: (err) => {
        console.error('Error starting quiz:', err);
        this.isLoading = false; // Stop loading on error
      },
    });
  }
}
