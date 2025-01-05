// filepath: /d:/Projects/Alamni-Frontend/src/app/library/library.component.ts
import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { EnrollmentService } from '../service/enrollment.service';
import { Course } from '../interface/course';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [SidebarComponent, CommonModule],
  templateUrl: './library.component.html',
  styleUrl: './library.component.css',
})
export class LibraryComponent implements OnInit {
  id: string = '';
  courses: any[] = [];
  allCourses: any[] = [];
  finishedCoursesCount: number = 0;
  unfinishedCoursesCount: number = 0;

  constructor(private enrollmentService: EnrollmentService) {}

  ngOnInit(): void {
    this.id = localStorage.getItem('id') || '';
    if (this.id) {
      this.enrollmentService
        .getCoursesByUserId(this.id)
        .subscribe((courses) => {
          this.courses = courses;
          this.allCourses = courses;
          this.updateCourseCounts();
          console.log(this.courses);
        });
    }
  }

  updateCourseCounts(): void {
    this.enrollmentService
      .getFinishedCoursesByUserId(this.id)
      .subscribe((finishedCourses) => {
        this.finishedCoursesCount = finishedCourses.length;
      });
    this.enrollmentService
      .getUnfinishedCoursesByUserId(this.id)
      .subscribe((unfinishedCourses) => {
        this.unfinishedCoursesCount = unfinishedCourses.length;
      });
  }

  filterCoursesByType(type: string): void {
    if (type === 'all') {
      this.courses = this.allCourses; // Reset to all courses
    } else if (type === 'finished') {
      this.enrollmentService
        .getFinishedCoursesByUserId(this.id)
        .subscribe((finishedCourses) => {
          this.courses = finishedCourses;
        });
    } else if (type === 'unfinished') {
      this.enrollmentService
        .getUnfinishedCoursesByUserId(this.id)
        .subscribe((unfinishedCourses) => {
          this.courses = unfinishedCourses;
        });
    }
  }
}
