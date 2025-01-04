import { Component,OnInit } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { EnrollmentService } from '../service/enrollment.service';
import { Course } from '../interface/course';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-library',
  standalone: true,
  imports: [SidebarComponent,CommonModule],
  templateUrl: './library.component.html',
  styleUrl: './library.component.css'
})
export class LibraryComponent implements OnInit {
  id: string = ''; 
  courses: any[] = []; 
  allCourses: any[] = [];
  constructor(private enrollmentService: EnrollmentService){}
  ngOnInit(): void {
   
        this.id = localStorage.getItem('id') || '';  
        if (this.id) {
          this.enrollmentService.getCoursesByUserId(this.id).subscribe((courses) => {
            this.courses = courses;
            this.allCourses = courses; 
            console.log(this.courses);
          });
        }
        
      
    
  }
  filterCourses(event: Event): void {
    const filterValue = (event.target as HTMLSelectElement).value;

    if (filterValue === 'all') {
      this.courses = this.allCourses; // Reset to all courses
    } else if (filterValue === 'finished') {
      this.enrollmentService.getFinishedCoursesByUserId(this.id).subscribe((finishedCourses) => {
        this.courses = finishedCourses;
      });
    } else if (filterValue === 'unfinished') {
      this.enrollmentService.getUnfinishedCoursesByUserId(this.id).subscribe((unfinishedCourses) => {
        this.courses = unfinishedCourses;
      });
    }
  }
}
