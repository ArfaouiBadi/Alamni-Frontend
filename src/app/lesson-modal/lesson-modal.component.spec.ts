import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonModalComponent } from './lesson-modal.component';

describe('LessonModalComponent', () => {
  let component: LessonModalComponent;
  let fixture: ComponentFixture<LessonModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
