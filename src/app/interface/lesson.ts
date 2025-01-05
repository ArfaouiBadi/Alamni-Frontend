export interface Lesson {
id: string;
  title: string;
  type: 'Video' | 'PDF';
  videoUrl?: string;
  pdfUrl?: string;
  generateQuiz?: boolean;
  content?: string; // Additional content for the lesson
}
