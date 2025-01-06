// filepath: /d:/Projects/Alamni-Frontend/src/app/interface/enrollment.ts
import { User } from './user';
import { Course } from './course';

export interface Enrollment {
  id: string;
  user: User;
  course: Course;
  progress: number;
  finished: boolean;
  startDate: Date;
  lastVisitedDate: Date;
  completedLessons: string[];
}
