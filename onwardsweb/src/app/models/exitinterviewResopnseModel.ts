import { BaseEntity } from './BaseEntity';

export interface ExitInterview {
  id: number;
  exitInterviewId: number;
  exitInterviewName: string;
  question: string;
  hasOptions: boolean;
  exitInterviewOptions: exitInterviewOption[];
}

interface exitInterviewOption {
  questionId: number;
  description: string;
  id: number;
}

export interface UserExitInterview extends BaseEntity {
  questionId: number;
  optionId: number | null;
  answer: string | null;
}
