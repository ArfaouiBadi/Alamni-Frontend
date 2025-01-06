import { Lesson } from './lesson';

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  duration: number; // Approximate minutes to finish the module
}
