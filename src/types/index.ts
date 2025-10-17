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
  text: string;
  isCorrect: boolean;
};

export type MCQQuestion = {
  id: string;
  question: string;
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

// export type ExamDataType = {
//   examDate: Date;
//   examName: string;
//   examStatus: "pending" | "completed";
//   result: number;
// };
