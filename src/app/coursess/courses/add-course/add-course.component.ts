import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../service/course.service';
import { Course } from '../../interface/course';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class AddCourseComponent implements OnInit {
  addCourseForm: FormGroup;
  selectedFile: File | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private courseService: CourseService) {
    this.addCourseForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      duration: [0, Validators.required],
      category: ['', Validators.required],
      levelRequired: [0, Validators.required],
      modules: this.fb.array([]), // Initialize modules as a FormArray
      rewardSystem: this.fb.group({
        points: [0],
        badges: this.fb.array([]),
        levels: this.fb.array([]),
      }),
      visibility: ['Public', Validators.required],
    });
  }

  ngOnInit(): void {}

  get modules(): FormArray {
    return this.addCourseForm.get('modules') as FormArray;
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

  addLesson(moduleIndex: number): void {
    const lessons = this.modules.at(moduleIndex).get('lessons') as FormArray;
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
    const lessons = this.modules.at(moduleIndex).get('lessons') as FormArray;
    lessons.removeAt(lessonIndex);
  }

  onAddCourse(): void {}
}
