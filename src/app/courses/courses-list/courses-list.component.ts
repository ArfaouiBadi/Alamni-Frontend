// filepath: /d:/Projects/Alamni-Frontend/src/app/courses/courses-list/courses-list.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Course } from '../../interface/course';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CourseService } from '../../service/course.service';
import { FileUploadService } from '../../service/file-upload.service';
import { Category } from '../../interface/category';
import { Module } from '../../interface/module';
import { Lesson } from '../../interface/lesson';
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
  selectedFiles: { [key: string]: File | null } = {};
  selectedEditFiles: { [key: string]: File | null } = {};
  categories: Category[] = [];
  selectedImage: File | null = null;
  selectedEditImage: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  editImagePreview: string | ArrayBuffer | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly courseService: CourseService,
    private toastr: ToastrService,
    private fileUploadService: FileUploadService
  ) {
    this.addCourseForm = this.fb.group({
      title: ['', Validators.required],
      imageUrl: [''],
      description: ['', Validators.required],
      duration: [0, Validators.required],
      category: ['', Validators.required],
      levelRequired: [0, Validators.required],
      pointsRequired: [0, Validators.required],
      modules: this.fb.array([]), // Initialize modules as a FormArray
      rewardSystem: this.fb.group({
        points: [0],
        badges: this.fb.array([]),
        levels: [0, Validators.required],
      }),
    });

    this.editCourseForm = this.fb.group({
      id: [''],
      title: ['', Validators.required],
      imageUrl: ['', Validators.required],
      description: ['', Validators.required],
      duration: [0, Validators.required],
      category: ['', Validators.required],
      levelRequired: [0, Validators.required],
      pointsRequired: [0, Validators.required],
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
    this.loadCategories();
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe((courses: Course[]) => {
      this.courses = courses;
    });
  }

  loadCategories(): void {
    this.courseService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      },
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
        lessons: this.fb.array([]), // Initialize lessons as a FormArray within each module
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

  onFileSelected(event: Event, moduleIndex: number, lessonIndex: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFiles[`${moduleIndex}-${lessonIndex}`] = file;
    }
  }

  onAddCourse(): void {
    if (this.addCourseForm.invalid) {
      return;
    }

    const courseData = this.addCourseForm.value;

    // Create a FormData object to handle file uploads
    const formData = new FormData();
    formData.append('title', courseData.title);
    formData.append('description', courseData.description);
    formData.append('duration', courseData.duration.toString());
    formData.append('category', courseData.category);
    formData.append('levelRequired', courseData.levelRequired.toString());
    formData.append('pointsRequired', courseData.pointsRequired.toString());
    // Append the image file if selected
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    // Append modules and lessons data
    courseData.modules.forEach((module: Module, moduleIndex: number) => {
      formData.append(`modules[${moduleIndex}].title`, module.title);
      formData.append(
        `modules[${moduleIndex}].duration`,
        module.duration.toString()
      );

      module.lessons.forEach((lesson: Lesson, lessonIndex: number) => {
        formData.append(
          `modules[${moduleIndex}].lessons[${lessonIndex}].title`,
          lesson.title
        );
        formData.append(
          `modules[${moduleIndex}].lessons[${lessonIndex}].type`,
          lesson.type
        );

        formData.append(
          `modules[${moduleIndex}].lessons[${lessonIndex}].content`,
          lesson.content!
        );

        // Append lesson files if selected
        const fileKey = `${moduleIndex}-${lessonIndex}`;
        if (this.selectedFiles[fileKey]) {
          formData.append(
            `modules[${moduleIndex}].lessons[${lessonIndex}].file`,
            this.selectedFiles[fileKey]
          );
        }
      });
    });

    // Append reward system data
    formData.append('rewardSystem.points', courseData.rewardSystem.points);
    courseData.rewardSystem.badges.forEach(
      (badge: string, badgeIndex: number) => {
        formData.append(`rewardSystem.badges[${badgeIndex}]`, badge);
      }
    );
    // Ensure levels is sent as an array
    formData.append('rewardSystem.levels', courseData.rewardSystem.levels);

    // Send the form data using the course service
    this.courseService.addCourse(formData).subscribe({
      next: (data) => {
        Swal.fire({
          title: 'Success!',
          text: 'Course added successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.successMessage = 'Course added successfully!';
        this.errorMessage = null;
        this.loadCourses();
      },
      error: (err) => {
        this.errorMessage = 'Error adding course: ' + err.message;
        this.successMessage = null;
      },
    });
  }

  addCourse(courseData: any): void {
    // Upload files and update URLs
    const uploadPromises = Object.keys(this.selectedFiles).map((key) => {
      const [moduleIndex, lessonIndex] = key.split('-').map(Number);
      const file = this.selectedFiles[key];
      if (file) {
        return this.fileUploadService
          .uploadFile(file)
          .toPromise()
          .then((url) => {
            const lessons = this.modules
              .at(moduleIndex)
              .get('lessons') as FormArray;
            const lesson = lessons.at(lessonIndex);
            if (lesson.get('type')?.value === 'PDF') {
              lesson.patchValue({ pdfUrl: url });
            } else if (lesson.get('type')?.value === 'Video') {
              lesson.patchValue({ videoUrl: url });
            }
          });
      }
      return Promise.resolve();
    });

    Promise.all(uploadPromises)
      .then(() => {
        this.courseService.addCourse(courseData).subscribe({
          next: (data) => {
            this.successMessage = 'Course added successfully!';
            this.errorMessage = null;
            this.loadCourses();
          },
          error: (err) => {
            this.errorMessage = 'Error adding course: ' + err.message;
            this.successMessage = null;
          },
        });
      })
      .catch((err) => {
        this.errorMessage = 'Error uploading files: ' + err.message;
        this.successMessage = null;
      });
  }

  onEditFileSelected(
    event: Event,
    moduleIndex: number,
    lessonIndex: number
  ): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedEditFiles[`${moduleIndex}-${lessonIndex}`] = file;
    }
  }

  onEditCourse(course: Course): void {
    console.log('Editing course:', course);
    this.editCourseForm.patchValue({
      id: course.id,
      title: course.title,
      description: course.description,
      duration: course.duration,
      category: course.category,
      levelRequired: course.levelRequired,
      pointsRequired: course.pointsRequired,
      imageUrl: course.imageUrl,
    });

    console.log('course.imageUrl:', course.imageUrl);
    this.editImagePreview = `http://localhost:8000/api${course.imageUrl}`;

    this.editModules.clear();
    course.modules!.forEach((module) => {
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
  }

  onEditCourseSubmit(): void {
    const courseData = this.editCourseForm.value;
    console.log('this.editCourseForm.value:', this.editCourseForm.value);
    console.log('Editing course:', courseData);

    // Upload image if selected
    if (this.selectedEditImage) {
      this.fileUploadService.uploadFile(this.selectedEditImage).subscribe({
        next: (url) => {
          courseData.imageUrl = url;
          this.updateCourse(courseData);
        },
        error: (err) => {
          this.errorMessage = 'Error uploading image: ' + err.message;
          this.successMessage = null;
        },
      });
    } else {
      this.updateCourse(courseData);
    }
  }

  updateCourse(courseData: any): void {
    // Upload files and update URLs
    const uploadPromises = Object.keys(this.selectedEditFiles).map((key) => {
      const [moduleIndex, lessonIndex] = key.split('-').map(Number);
      const file = this.selectedEditFiles[key];
      if (file) {
        return this.fileUploadService
          .uploadFile(file)
          .toPromise()
          .then((url) => {
            const lessons = this.editModules
              .at(moduleIndex)
              .get('lessons') as FormArray;
            const lesson = lessons.at(lessonIndex);
            if (lesson.get('type')?.value === 'PDF') {
              lesson.patchValue({ pdfUrl: url });
              lesson.patchValue({ videoUrl: '' });
            } else if (lesson.get('type')?.value === 'Video') {
              lesson.patchValue({ videoUrl: url });
              lesson.patchValue({ pdfUrl: '' });
            }
            console.log('File uploaded for module:', moduleIndex, lessonIndex);
            console.log(
              `File uploaded for module ${moduleIndex}, lesson ${lessonIndex}: ${url}`
            );
          })
          .catch((err) => {
            console.error(
              `Error uploading file for module ${moduleIndex}, lesson ${lessonIndex}: ${err.message}`
            );
            throw err;
          });
      }
      return Promise.resolve();
    });

    Promise.all(uploadPromises)
      .then(() => {
        console.log('All files uploaded successfully');
        this.courseService.updateCourse(courseData).subscribe({
          next: (data) => {
            Swal.fire({
              title: 'Success!',
              text: 'Course updated successfully!',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            this.successMessage = 'Course updated successfully!';
            this.errorMessage = null;
            console.log('Course updated successfully');
            console.log('data:', data);
            this.loadCourses();
          },
          error: (err) => {
            this.errorMessage = 'Error updating course: ' + err.message;
            this.successMessage = null;
            console.error('Error updating course:', err.message);
          },
        });
      })
      .catch((err) => {
        this.errorMessage = 'Error uploading files: ' + err.message;
        this.successMessage = null;
        console.error('Error uploading files:', err.message);
      });
  }

  deleteCourse(): void {
    console.log('Deleting course:', this.courseIdToDelete);
    if (!this.courseIdToDelete) return;

    this.courseService.deleteCourse(this.courseIdToDelete).subscribe({
      next: () => {
        this.loadCourses();
        Swal.fire({
          title: 'Deleted!',
          text: 'The course has been deleted.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.toastr.success('Course deleted successfully!');
      },
      error: (error) => {
        console.error('Error deleting course:', error);
        this.toastr.error('Failed to delete course. Please try again.');
      },
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  onEditImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedEditImage = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.editImagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedEditImage);
    }
  }
}
