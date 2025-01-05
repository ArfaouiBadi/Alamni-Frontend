// filepath: /d:/Projects/Alamni-Frontend/src/app/lesson/lesson.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Lesson } from '../interface/lesson';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { Location } from '@angular/common';
import { QuizService } from '../service/quiz.service';
@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  styleUrls: ['./lesson.component.css'],
})
export class LessonComponent implements OnInit {
  lesson!: Lesson;
  safeUrl!: SafeResourceUrl;
  isLoading: boolean = false;
  username: string = '';
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly sanitizer: DomSanitizer,
    private readonly location: Location,
    private readonly quizService: QuizService
  ) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username')!;
    this.route.paramMap.subscribe((params) => {
      const lessonData = history.state.lesson;
      if (lessonData) {
        this.lesson = lessonData;
        if (this.lesson.type === 'PDF') {
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
  goBack(): void {
    this.location.back();
  }
  async takeQuiz(): Promise<void> {
    this.isLoading = true; // Start loading
    console.log('Starting quiz:', this.lesson.pdfUrl);

    try {
      const response = await fetch(
        `http://localhost:8000/api${this.lesson.pdfUrl!}`
      );
      const blob = await response.blob();
      console.log('Fetched PDF:', blob);
      const file = new File([blob], 'lesson.pdf', { type: 'application/pdf' });

      this.quizService.uploadPdf(file).subscribe({
        next: (response) => {
          console.log('PDF uploaded:', response);
          this.quizService.startQuiz(this.username).subscribe({
            next: (data) => {
              console.log('Quiz started:', data);
              this.isLoading = false; // Stop loading on success
            },
            error: (err) => {
              console.error('Error starting quiz:', err);
              this.isLoading = false; // Stop loading on error
            },
          });
        },
        error: (err) => {
          console.error('Error uploading PDF:', err);
          this.isLoading = false; // Stop loading on error
        },
      });
    } catch (error) {
      console.error('Error fetching PDF:', error);
      this.isLoading = false; // Stop loading on error
    }
  }
}
