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
};

export type ExamDataType = {
  examId: string;
  examName: string;
  examDate: Date;
  examStatus: "pending" | "completed";
  avgResult: number | null;
  examYear: string;
  examResult: number
};

// export type ExamDataType = {
//   examDate: Date;
//   examName: string;
//   examStatus: "pending" | "completed";
//   result: number;
// };
