import { Course } from './course';

export interface Role {
  id: string;
  name: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  dateOfBirth: string;
  roles: Role[];
  enrollments: any; // Adjust the type as needed
  enabled: boolean;
  points: number;
  level: number;
  xp: number;
  enrolledCourses: Course[]; // Adjust the type as needed
}
