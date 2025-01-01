import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

import { Observable } from 'rxjs';
import { CourseService } from '../service/course.service';
import { Course } from '../interface/course';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent, CommonModule],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];

  constructor(private coursesService: CourseService) {}

  ngOnInit(): void {
    console.log('CoursesComponent initialized');
    this.coursesService.getCourses().subscribe((data: Course[]) => {
      console.log('Courses:', data);
      this.courses = data;
    });
  }
  getDurationString(duration: number): string {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (minutes === 0) {
      return `${hours} hours`;
    }
    return `${hours} hours and ${minutes} min`;
  }
  enroll(courseId: string) {
    console.log('Enroll:', courseId);
  }
}
