import { Lesson } from './lesson';

export interface Module {
  title: string;
  lessons: Lesson[];
  duration: number; // Approximate minutes to finish the module
}