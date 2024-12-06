import { Module } from './module';
import { RewardSystem } from './reward-system';

export interface Course {
  id?: string;
  imageUrl: string;
  title: string;
  description: string;
  duration: number; // Total duration in minutes
  category: string;
  levelRequired: number;
  modules: Module[];
  rewardSystem?: RewardSystem;
}
