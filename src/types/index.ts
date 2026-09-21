export type ExamLevel =
  | "Junior Secondary"
  | "Senior Secondary (SS1)"
  | "Senior Secondary (SS2)"
  | "Senior Secondary (SS3)"
  | "WAEC/NECO Candidate"
  | "JAMB Candidate"
  | "100 Level"
  | "200 Level"
  | "300 Level"
  | "400 Level"
  | "500 Level"
  | "Postgraduate";

export const EXAM_LEVELS: ExamLevel[] = [
  "Junior Secondary",
  "Senior Secondary (SS1)",
  "Senior Secondary (SS2)",
  "Senior Secondary (SS3)",
  "WAEC/NECO Candidate",
  "JAMB Candidate",
  "100 Level",
  "200 Level",
  "300 Level",
  "400 Level",
  "500 Level",
  "Postgraduate",
];

export type Subject =
  | "Biology"
  | "Chemistry"
  | "Physics"
  | "Mathematics"
  | "English"
  | "Geography"
  | "Other";

export const SUBJECTS: Subject[] = [
  "Biology",
  "Chemistry",
  "Physics",
  "Mathematics",
  "English",
  "Geography",
  "Other",
];

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  examLevel: ExamLevel;
  school?: string;
  state?: string;
  plan: "free" | "pro";
  preferences: {
    quizCount: number;
    examStyle: ExamStyle;
    responseStyle: "Formal English" | "Simple English" | "Explain like I'm in SS3";
    dailyReminder: boolean;
    reminderTime: string;
    weeklyEmail: boolean;
  };
}

export interface StudyDoc {
  id: string;
  name: string;
  subject: Subject;
  examLevel: string;
  pages: number;
  sizeKb: number;
  text: string;
  createdAt: string;
  lastStudiedAt?: string;
  studyCount: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  rating?: "up" | "down";
}

export interface ChatSession {
  id: string;
  docId: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export type ExamStyle = "WAEC" | "NECO" | "JAMB" | "University" | "General";
export type QuestionType = "mcq" | "theory";
export type Difficulty = "Easy" | "Medium" | "Hard";

export interface QuizOptions {
  count: number;
  type: QuestionType;
  difficulty: Difficulty;
  examStyle: ExamStyle;
  topic?: string;
}

export interface Question {
  id: string;
  question: string;
  type: QuestionType;
  options?: Record<string, string>;
  answer?: string;
  explanation?: string;
  modelAnswer?: string;
  keyPoints?: string[];
}

export interface GradeResult {
  score: number;
  maxScore: number;
  percentage: number;
  grade: string;
  feedback: string;
  pointsHit: string[];
  pointsMissed: string[];
  improvement: string;
}

export interface QuizAttempt {
  id: string;
  docId: string;
  docName: string;
  subject: Subject;
  examStyle: ExamStyle;
  type: QuestionType;
  score: number;
  total: number;
  percentage: number;
  seconds: number;
  takenAt: string;
  questions: Question[];
  answers: Record<string, string>;
  grades?: Record<string, GradeResult>;
  topic?: string;
}

export type SummaryType = "full" | "topic" | "keypoints" | "examfocus";

export interface SavedSummary {
  id: string;
  docId: string;
  docName: string;
  type: SummaryType;
  topic?: string;
  content: string;
  createdAt: string;
}
