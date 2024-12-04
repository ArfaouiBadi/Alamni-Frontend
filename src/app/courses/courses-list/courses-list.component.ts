import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CourseService } from '../../service/course.service';
import { Course } from '../../service/course.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-courses-list',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './courses-list.component.html',
  styleUrl: './courses-list.component.css'
})
export class CoursesListComponent  implements OnInit {
  courses: Course[] = [];
  selectedCourse: Course | null = null;
  isLoading = false;

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading = true;
    this.courseService.getCourses().subscribe(
      (data) => {
        this.courses = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching courses:', error);
        this.isLoading = false;
      }
    );
  }

  onSelectCourse(course: Course): void {
    this.selectedCourse = course;
  }
  

  onAddCourse(newCourse: Course): void {
    this.courseService.addCourse(newCourse).subscribe(
      (addedCourse) => {
        this.courses.push(addedCourse);
      },
      (error) => {
        console.error('Error adding course:', error);
      }
    );
  }

  onDeleteCourse(courseId: string | undefined): void {
    if (!courseId) return; // Guard against undefined
  
    this.courseService.deleteCourse(courseId).subscribe(
      () => {
       
        this.courses = this.courses.filter(course => course.id !== courseId);
        
        $('#deleteEmployeeModal').modal('hide');
      },
      (error) => {
        console.error('Error deleting course:', error);
      }
    );
  }
  
  
  
}
