import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CourseService } from '../../../service/course.service';
import { Course } from '../../../interface/course';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';  

@Component({
  selector: 'app-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
})
export class CoursesListComponent implements OnInit {
  addCourseForm: FormGroup;
  editCourseForm: FormGroup;
  selectedFile: File | null = null;
  courses: Course[] = [];
  selectedCourse: Course | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  courseIdToDelete: string | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly courseService: CourseService
  ) {
    this.addCourseForm = this.fb.group({
      title: ['', Validators.required],
      imageUrl: ['', Validators.required],
      description: ['', Validators.required],
      duration: [0, Validators.required],
      category: ['', Validators.required],
      levelRequired: [0, Validators.required],
      modules: this.fb.array([]), // Initialize modules as a FormArray
      rewardSystem: this.fb.group({
        points: [0],
        badges: this.fb.array([]),
        levels: [0, Validators.required],
      }),
    });

    this.editCourseForm = this.fb.group({
      title: ['', Validators.required],
      imageUrl: ['', Validators.required],
      description: ['', Validators.required],
      duration: [0, Validators.required],
      category: ['', Validators.required],
      levelRequired: [0, Validators.required],
      modules: this.fb.array([]), // Initialize modules as a FormArray
      rewardSystem: this.fb.group({
        points: [0],
        badges: this.fb.array([]),
        levels: [0, Validators.required],
      }),
    });
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe((courses: Course[]) => {
      this.courses = courses;
    });
  }

  confirmDeleteCourse(courseId: string): void {
    this.courseIdToDelete = courseId;
  }

  get modules(): FormArray {
    return this.addCourseForm.get('modules') as FormArray;
  }

  get editModules(): FormArray {
    return this.editCourseForm.get('modules') as FormArray;
  }

  get badges(): FormArray {
    return this.addCourseForm.get('rewardSystem.badges') as FormArray;
  }

  get editBadges(): FormArray {
    return this.editCourseForm.get('rewardSystem.badges') as FormArray;
  }

  getLessons(moduleIndex: number): FormArray {
    return this.modules.at(moduleIndex).get('lessons') as FormArray;
  }

  getEditLessons(moduleIndex: number): FormArray {
    return this.editModules.at(moduleIndex).get('lessons') as FormArray;
  }

  addModule(): void {
    this.modules.push(
      this.fb.group({
        title: ['', Validators.required],
        duration: [0, Validators.required],
        lessons: this.fb.array([]), // Initialize lessons as a FormArray within each module
      })
    );
  }

  addEditModule(): void {
    this.editModules.push(
      this.fb.group({
        title: ['', Validators.required],
        duration: [0, Validators.required],
        lessons: this.fb.array([]),
      })
    );
  }

  addLesson(moduleIndex: number): void {
    const lessons = this.getLessons(moduleIndex);
    lessons.push(
      this.fb.group({
        title: ['', Validators.required],
        type: ['Video', Validators.required],
        videoUrl: [''],
        pdfUrl: [''],
        generateQuiz: [false],
        content: [''],
      })
    );
  }

  addEditLesson(moduleIndex: number): void {
    const lessons = this.getEditLessons(moduleIndex);
    lessons.push(
      this.fb.group({
        title: ['', Validators.required],
        type: ['Video', Validators.required],
        videoUrl: [''],
        pdfUrl: [''],
        generateQuiz: [false],
        content: [''],
      })
    );
  }

  removeLesson(moduleIndex: number, lessonIndex: number): void {
    const lessons = this.getLessons(moduleIndex);
    lessons.removeAt(lessonIndex);
  }

  removeEditLesson(moduleIndex: number, lessonIndex: number): void {
    const lessons = this.getEditLessons(moduleIndex);
    lessons.removeAt(lessonIndex);
  }

  addBadge(): void {
    this.badges.push(this.fb.control(''));
  }

  addEditBadge(): void {
    this.editBadges.push(this.fb.control(''));
  }

  removeBadge(index: number): void {
    this.badges.removeAt(index);
  }

  removeEditBadge(index: number): void {
    this.editBadges.removeAt(index);
  }

  onAddCourse(): void {
    if (this.addCourseForm.invalid) {
      Swal.fire('Error', 'Please fill in all required fields.', 'error');
      return;
    }

    const newCourse: Course = this.addCourseForm.value;

    this.courseService.addCourse(newCourse).subscribe({
      next: (addedCourse) => {
        this.addCourseForm.reset();
        this.loadCourses();
        Swal.fire('Success', 'Course added successfully!', 'success');
      },
      error: (error) => {
        console.error('Error adding course:', error);
        Swal.fire('Error', 'Failed to add course. Please try again.', 'error');
      },
    });
  }

  onEditCourse(course: Course): void {
    this.selectedCourse = course;
    this.editCourseForm.patchValue(course);

    // Clear existing modules and lessons
    this.editModules.clear();
    course.modules?.forEach((module) => {
      const moduleGroup = this.fb.group({
        title: [module.title, Validators.required],
        duration: [module.duration, Validators.required],
        lessons: this.fb.array([]),
      });

      const lessonsArray = moduleGroup.get('lessons') as FormArray;
      module.lessons.forEach((lesson) => {
        lessonsArray.push(
          this.fb.group({
            title: [lesson.title, Validators.required],
            type: [lesson.type, Validators.required],
            videoUrl: [lesson.videoUrl],
            pdfUrl: [lesson.pdfUrl],
            content: [lesson.content],
          })
        );
      });

      this.editModules.push(moduleGroup);
    });

    // Clear existing badges
    this.editBadges.clear();
    course.rewardSystem!.badges!.forEach((badge) => {
      this.editBadges.push(this.fb.control(badge));
    });
  }

  onUpdateCourse(): void {
    if (this.editCourseForm.invalid) {
      Swal.fire('Error', 'Please fill in all required fields.', 'error');
      return;
    }

    const updatedCourse: Course = this.editCourseForm.value;
    updatedCourse.id = this.selectedCourse?.id; // Ensure the id is set correctly

    this.courseService.updateCourse(updatedCourse).subscribe({
      next: (updatedCourse) => {
        this.loadCourses();
        Swal.fire('Success', 'Course updated successfully!', 'success');
      },
      error: (error) => {
        console.error('Error updating course:', error);
        Swal.fire('Error', 'Failed to update course. Please try again.', 'error');
      },
    });
  }

  deleteCourse(): void {
    if (!this.courseIdToDelete) return;

    Swal.fire({
      title: 'Are you sure?',
      text: 'This course will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.courseService.deleteCourse(this.courseIdToDelete).subscribe({
          next: () => {
            this.loadCourses();
            Swal.fire('Deleted!', 'The course has been deleted.', 'success');
          },
          error: (error) => {
            console.error('Error deleting course:', error);
            Swal.fire('Error', 'Failed to delete course. Please try again.', 'error');
          },
        });
      }
    });
  }
}
