// filepath: /d:/Projects/Alamni-Frontend/src/app/lesson/lesson.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Lesson } from '../interface/lesson';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { Location } from '@angular/common';
import { QuizService } from '../service/quiz.service';
import { Enrollment } from '../interface/Enrollment';
import { EnrollmentService } from '../service/enrollment.service';
import Swal from 'sweetalert2';
import { RewardSystem } from '../interface/reward-system';
import { UserService } from '../service/user.service';
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
  enrollmentId: string | null = null;
  enrollment: Enrollment | null = null;
  isFinished: boolean = false;
  courseRewards: RewardSystem = {};
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly sanitizer: DomSanitizer,
    private readonly location: Location,
    private readonly quizService: QuizService,
    private readonly enrollmentService: EnrollmentService,
    private readonly userService: UserService
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
    this.enrollment = history.state.enrollment;
    this.courseRewards = history.state.courseRewards;
  }

  markAsFinished(): void {
    if (this.isFinished || !this.lesson || !this.enrollment) {
      return;
    }

    this.enrollment.completedLessons.push(this.lesson.title);
    this.enrollment.progress = Math.floor(
      (this.enrollment.completedLessons.length / this.enrollment.lessonsCount) *
        100
    );
    if (this.enrollment.progress >= 100) {
      this.enrollment.finished = true;
      Swal.fire({
        title: 'Congratulations!',
        text: 'You have successfully completed the course.',
        icon: 'success',
        confirmButtonText: 'OK',
      });
      Swal.fire({
        title: 'Rewards Earned!',
        html: this.formatRewards(this.courseRewards),
        icon: 'success',
        confirmButtonText: 'OK',
      });
    }
    console.log('Updated enrollment:', this.enrollment.progress);
    this.enrollmentService.updateEnrollment(this.enrollment).subscribe({
      next: (updatedEnrollment) => {
        console.log('Enrollment updated:', updatedEnrollment);
        this.isFinished = true;
        this.userService
          .updateUserRewards(history.state.userId, this.courseRewards)
          .subscribe({
            next: (data) => {
              console.log('User rewards updated:', data);
            },
            error: (err) => {
              console.error('Error updating user rewards:', err.message);
            },
          });
      },
      error: (err) => {
        console.error('Error updating enrollment:', err.message);
      },
    });
    console.log('Lesson marked as finished:', this.lesson.title);
  }
  private formatRewards(rewards: RewardSystem): string {
    let rewardsHtml = '<ul>';
    if (rewards.points) {
      rewardsHtml += `<li>Points: ${rewards.points}</li>`;
    }
    if (rewards.badges) {
      rewards.badges.forEach((badge) => {
        rewardsHtml += `<li>Badge: ${badge.name}</li>`;
      });
    }
    if (rewards.levels) {
      rewardsHtml += `<li>Levels: ${rewards.levels}</li>`;
    }
    rewardsHtml += '</ul>';
    return rewardsHtml;
  }
  goBack(): void {
    this.location.back();
  }
  async takeQuiz(): Promise<void> {
    this.isLoading = true;
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to Spend 10 Credits to take This Quiz',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `http://localhost:8000/api${this.lesson.pdfUrl!}`
          );
          const blob = await response.blob();
          console.log('Fetched PDF:', blob);
          const updatedPdfUrl = this.lesson.pdfUrl!.replace('/files/', '');
          const file = new File([blob], updatedPdfUrl, {
            type: 'application/pdf',
          });

          this.quizService.uploadPdf(file).subscribe({
            next: (response) => {
              console.log('PDF uploaded:', response);
              this.quizService.startQuiz(this.username).subscribe({
                next: (data) => {
                  console.log('Quiz Results:', data);
                  this.isLoading = false;
                  Swal.fire({
                    title: 'Quiz Completed!',
                    html: `You have successfully completed the quiz.<br> Your score is  ${data.score} <br>
                    You have earned ${data.score} points`,
                    icon: 'success',
                    confirmButtonText: 'OK',
                  });
                  const rewards: RewardSystem = {
                    points: data.score - 10,
                  };
                  this.userService
                    .updateUserRewards(history.state.userId, rewards)
                    .subscribe({
                      next: (data) => {
                        console.log('User rewards updated:', data);
                      },
                      error: (err) => {
                        console.error(
                          'Error updating user rewards:',
                          err.message
                        );
                      },
                    });
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
      } else {
        this.isLoading = false; // Stop loading on cancel
      }
    });
  }
}
