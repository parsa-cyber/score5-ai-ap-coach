export type Course = string;

export type Difficulty = "easy" | "medium" | "hard";
export type QuestionType = "MCQ" | "FRQ";
export type MistakeType =
  | "Conceptual misunderstanding"
  | "Formula misuse"
  | "Algebra error"
  | "Misread question"
  | "Weak explanation"
  | "Graph interpretation"
  | "Unit conversion"
  | "Evidence selection"
  | "Rubric mismatch";

export type CourseCategory =
  | "Arts"
  | "English"
  | "History and Social Sciences"
  | "Math and Computer Science"
  | "Sciences"
  | "World Languages and Cultures"
  | "AP Capstone"
  | "AP Career Kickstart";

export type CourseInfo = {
  name: Course;
  category: CourseCategory;
  shortName: string;
  units: string[];
  skills: string[];
  frqLabel: string;
  tutorStyle: string;
};

export type Question = {
  id: string;
  course: Course;
  unit: string;
  topic: string;
  difficulty: Difficulty;
  skill: string;
  type: "MCQ";
  prompt: string;
  choices: string[];
  correctAnswer: string;
  explanation: string;
  commonMistake: string;
  mistakeType: MistakeType;
};

export type FRQPrompt = {
  id: string;
  course: Course;
  unit: string;
  topic: string;
  prompt: string;
  points: number;
  rubric: string[];
  modelAnswer: string;
};

export type Attempt = {
  questionId: string;
  selectedAnswer: string;
  correct: boolean;
  unit: string;
  topic: string;
  mistakeType: MistakeType;
  createdAt: string;
  timeSpentSeconds: number;
  course?: Course;
};

export type LearnerProfile = {
  name: string;
  course: Course;
  targetScore: number;
  examDate: string;
  minutesPerDay: number;
  hardestTopics: string[];
  onboarded: boolean;
};
