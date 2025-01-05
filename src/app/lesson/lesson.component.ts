// filepath: /d:/Projects/Alamni-Frontend/src/app/lesson/lesson.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Lesson } from '../interface/lesson';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./lesson.component.css'],
})
export class LessonComponent implements OnInit {
  lesson!: Lesson;
  safeUrl!: SafeResourceUrl;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const lessonData = history.state.lesson;
      if (lessonData) {
        this.lesson = lessonData;
        if (this.lesson.type === 'PDF') {
          console.log('PDF lesson:', this.lesson.pdfUrl);
          this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            `http://localhost:8000/api${this.lesson.pdfUrl!}`
          );
        } else if (this.lesson.type === 'Video') {
          this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            `http://localhost:8000/api${this.lesson.videoUrl!}`
          );
        }
      } else {
        // Handle the case where lesson data is not available
        console.error('Lesson data not available in state');
      }
    });
  }

  markAsFinished(): void {
    // Logic to mark the lesson as finished
    console.log('Lesson marked as finished:', this.lesson.title);
    // You can add more logic here, such as updating the lesson status in the backend
  }
}
