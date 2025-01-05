import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { UserService } from '../service/user.service';
import { User } from '../interface/user';
import { EnrollmentService } from '../service/enrollment.service';
import { Course } from '../interface/course';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet, CommonModule, RouterModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  username: string | null = null;
  id: string = '';
  user: User | null = null;
  courses: any = [];
  lastUnfinishedCourse: Course | null = null;

  constructor(
    private userService: UserService,
    private enrollmentService: EnrollmentService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('username')) {
      this.username = localStorage.getItem('username');
    }
    this.userService.getUser(this.username!).subscribe((user) => {
      this.user = user;
      console.log(this.user);
      if (this.user) {
        this.id = localStorage.getItem('id') || '';
        if (this.id) {
          this.enrollmentService
            .getUnfinishedCoursesByUserId(this.id)
            .subscribe((courses) => {
              this.courses = courses;
              console.log(this.courses);
            });
          this.enrollmentService
            .getLastUnfinishedCourseByUserId(this.id)
            .subscribe((course) => {
              this.lastUnfinishedCourse = course;
              console.log(this.lastUnfinishedCourse);
            });
        }
      }
    });
  }
}
