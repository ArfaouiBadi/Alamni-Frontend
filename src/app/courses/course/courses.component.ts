import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../service/course.service';
import { Course } from '../../interface/course';
import { Category } from '../../interface/category';
import { Router } from '@angular/router';

import { SidebarComponent } from '../../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [SidebarComponent, CommonModule, FormsModule],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  categories: Category[] = [];
  searchTerm: string = '';
  selectedCategory: Category = { id: '', name: '', description: '' };
  sortBy: string = ''; // Either 'name' or 'duration'
  sortOrder: 'asc' | 'desc' = 'asc'; // Sorting order
  isMenuOpen = false;

  constructor(private coursesService: CourseService, private router: Router) {}

  ngOnInit(): void {
    this.coursesService.getCourses().subscribe((data: Course[]) => {
      this.courses = data;
      this.courses.forEach((course) => {
        course.imageUrl = `http://localhost:8000/api${course.imageUrl}`;
      });
      this.filteredCourses = data;
    });
    this.coursesService.getCategories().subscribe((data: Category[]) => {
      this.categories = data;
    });
  }

  filterCourses(): void {
    this.filteredCourses = this.courses.filter((course) => {
      return (
        (this.selectedCategory.id === '' ||
          course.category.name === this.selectedCategory.name) &&
        (this.searchTerm === '' ||
          course.title.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    });
    this.sortCourses();
  }

  setSort(criteria: string): void {
    this.sortBy = criteria;
    this.sortCourses();
  }

  setSortOrder(order: 'asc' | 'desc'): void {
    this.sortOrder = order;
    this.sortCourses();
  }

  sortCourses(): void {
    this.filteredCourses.sort((a, b) => {
      let comparison = 0;
      if (this.sortBy === 'name') {
        comparison = a.title.localeCompare(b.title);
      } else if (this.sortBy === 'duration') {
        comparison = a.duration - b.duration;
      }
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = { id: '', name: '', description: '' };
    this.sortBy = '';
    this.sortOrder = 'asc';
    this.filteredCourses = this.courses;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  getDurationString(duration: number): string {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (minutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${minutes}m`;
  }

  viewDetails(courseId: string): void {
    this.router.navigate(['/course-details', courseId]);
  }
}
