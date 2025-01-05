// filepath: /d:/Projects/Alamni-Frontend/src/app/lesson-modal/lesson-modal.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Lesson } from '../interface/lesson';

@Component({
  selector: 'app-lesson-modal',
  templateUrl: './lesson-modal.component.html',
  styleUrls: ['./lesson-modal.component.css'],
})
export class LessonModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Lesson) {}
}
