import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../../interface/course';
import { CourseService } from '../../service/course.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-courses-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './courses-details.component.html',
  styleUrl: './courses-details.component.css'
})
export class CoursesDetailsComponent implements OnInit {
  course!: Course;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService
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
}
