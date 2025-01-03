import { Category } from './category';
import { Module } from './module';
import { RewardSystem } from './reward-system';

export interface Course {
  id?: string;
  imageUrl: string;
  title: string;
  description: string;
  duration: number; // Total duration in minutes
  category: Category;
  levelRequired: number;
  modules?: Module[];
  rewardSystem?: RewardSystem;
  enrollments?: Course[];
}
