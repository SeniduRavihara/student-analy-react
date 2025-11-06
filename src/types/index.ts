import { User } from "firebase/auth";
import React from "react";

export type DataContextType = {
  currentUserData: UserDataType | null;
  setCurrentUserData: React.Dispatch<React.SetStateAction<UserDataType | null>>;
};

export type AuthContextType = {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export type UserDataType = {
  firstName: string;
  lastName: string;
  whatsapp: string;
  nic: string;
  bDate: Date | undefined;
  phone: string;
  school: string;
  examYear: string;
  media: string;
  stream: string;
  gurdianName: string;
  gurdianPhone: string;
  address: string;
  uid: string;
  userName: string;
  regNo: string | null;
  roles: "ADMIN" | "STUDENT";
  registered: boolean;
  email: string;
  lastResult: number | null;
  lastRank: number;
  classes: string[];
};

// export type CurrentUserDataType = {
//   uid: string;
//   userName: string;
//   regNo: string | null;
//   // gender: "male" | "female";
//   roles: "ADMIN" | "STUDENT";
//   registered: boolean;
//   email: string;
//   lastResult: number | null;
// };

export type UserDataInAdminType = {
  uid: string;
  userName: string;
  regNo: string;
  // gender: "male" | "female";
  roles: "ADMIN" | "STUDENT";
  registered: boolean;
  email: string;
  lastResult: number | null;
};

export type UserInfoType = {
  firstName: string;
  lastName: string;
  whatsapp: string;
  nic: string;
  bDate: Date | undefined;
  phone: string;
  school: string;
  examYear: string;
  media: string;
  stream: string;
  gurdianName: string;
  gurdianPhone: string;
  address: string;
  classes: string[];
};

export type StudentTable = {
  indexNo: string;
  name: string;
  email: string;
  lastResult: number;
};

export type ExamTable = {
  examId: string;
  examName: string;
  examDate: Date;
  examStatus: "pending" | "completed";
  avgResult: number | null;
  classType: string[];
};

export type ExamDataType = {
  examId: string;
  examName: string;
  examDate: Date;
  examStatus: "pending" | "completed";
  avgResult: number | null;
  examYear: string;
  examResult: number;
  isAbsent: boolean;
  classType: string[];
  rank: number | null;
  // createdAt: Date;
};

// MCQ Types
export type MCQOption = {
  id: string;
  text?: string; // Optional text content
  imageUrl?: string; // Optional image URL
  isCorrect: boolean;
  contentType: "text" | "image"; // Type of content
};

export type MCQQuestion = {
  id: string;
  question?: string; // Optional text question
  questionImageBeforeUrl?: string; // Optional image before question text
  questionImageAfterUrl?: string; // Optional image after question text
   questionImageUrl?: string;
  questionContentType: "text" | "image"; // Type of question content
  options: MCQOption[];
  explanation?: string;
  difficulty: "easy" | "medium" | "hard";
  subject?: string;
  topic?: string;
  marks: number;
  order: number;
  createdAt: Date;
};

export type MCQPack = {
  id: string;
  title: string;
  description: string;
  examYear: string;
  classType: string[];
  timeLimit: number; // in minutes
  passingMarks: number;
  status: "draft" | "published" | "archived";
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // admin UID
  totalQuestions: number;
  totalMarks: number;
  questions?: MCQQuestion[]; // Optional for when questions are loaded
};

export type MCQResult = {
  id: string;
  packId: string;
  packTitle: string;
  answers: {
    questionId: string;
    selectedOptionId: string;
    isCorrect: boolean;
    timeSpent: number; // seconds per question
  }[];
  score: number;
  totalMarks: number;
  percentage: number;
  timeSpent: number; // total minutes
  completedAt: Date;
  isPassed: boolean;
  examYear: string;
  classType: string[];
};

// MCQ Analytics Types
export type MCQQuestionAnalytics = {
  totalAttempts: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number; // percentage
  averageTimeSpent: number; // seconds
  difficultyBreakdown: {
    easy: { attempts: number; correct: number };
    medium: { attempts: number; correct: number };
    hard: { attempts: number; correct: number };
  };
  // Individual option selection stats
  optionStats: {
    optionId: string;
    optionText: string;
    selectedCount: number;
    isCorrect: boolean;
  }[];
  // Time-based performance
  timeStats: {
    averageTime: number; // seconds
    fastestTime: number; // seconds
    slowestTime: number; // seconds
  };
  // Performance trends
  performanceTrend: {
    recentAccuracy: number; // last 10 attempts
    improvementRate: number; // percentage change over time
  };
  lastUpdated: Date;
};

export type MCQPackAnalytics = {
  totalAttempts: number;
  uniqueUsers: number;
  averageScore: number;
  passRate: number; // percentage
  averageTimeSpent: number; // minutes
  highestScore: number;
  lowestScore: number;
  scoreDistribution: {
    range: string;
    count: number;
  }[];
  passFailDistribution: {
    passed: number;
    failed: number;
  };
  questionStats: {
    questionId: string;
    accuracy: number;
    totalAttempts: number;
    correctAnswers: number;
  }[];
  lastUpdated: Date;
};

// export type ExamDataType = {
//   examDate: Date;
//   examName: string;
//   examStatus: "pending" | "completed";
//   result: number;
// };
