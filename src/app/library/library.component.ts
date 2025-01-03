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
  courses: Course[] = []; 
  constructor(private enrollmentService: EnrollmentService){}
  ngOnInit(): void {
   
        this.id = localStorage.getItem('id') || '';  
        if (this.id) {
          this.enrollmentService.getCoursesByUserId(this.id).subscribe((courses) => {
            this.courses = courses;
            console.log(this.courses);
          });
        }
      
    
  }
}
