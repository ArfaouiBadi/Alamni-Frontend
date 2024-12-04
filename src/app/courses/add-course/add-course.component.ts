import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CourseService } from '../../service/course.service';
import { Course } from '../../service/course.service';
import { ReactiveFormsModule } from '@angular/forms';

interface AddCourseFormControls {
  title: FormControl<string | null>;
  description: FormControl<string | null>;
  levelRequired: FormControl<string | null>;
  duration: FormControl<string | null>;
  category: FormControl<string | null>;
}

@Component({
  selector: 'app-add-course',
  standalone: true,
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css'],
  imports: [ReactiveFormsModule],
})
export class AddCourseComponent {
  addCourseForm: FormGroup<AddCourseFormControls>;
  isSubmitted = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private router: Router
  ) {
    this.addCourseForm = this.fb.group({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      levelRequired: new FormControl('', [Validators.required]),
      duration: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
      category: new FormControl('', [Validators.required]),
    });
  }

  // Convenience getter for easy access to form fields
  get f() {
    return this.addCourseForm.controls;
  }

  onSubmit(): void {
    this.isSubmitted = true;

    // If the form is invalid, return
    if (this.addCourseForm.invalid) {
      return;
    }

    // Create course object
    const newCourse: Course = {
      title: this.f.title.value,
      description: this.f.description.value,
      levelRequired: this.f.levelRequired.value,
      duration: this.f.duration.value,
      category: this.f.category.value,
    };

    // Call the service to add the course
    this.courseService.addCourse(newCourse).subscribe(
      (response) => {
        this.successMessage = 'Course added successfully!';
        this.errorMessage = null;
        this.router.navigate(['/courses']); // Navigate to the course list after successful submission
      },
      (error) => {
        this.errorMessage = 'Error adding course. Please try again!';
        this.successMessage = null;
      }
    );
  }
}
