import { User } from "firebase/auth";
import React from "react";

export type DataContextType = {
  currentUserData: CurrentUserDataType | null;
  setCurrentUserData: React.Dispatch<
    React.SetStateAction<CurrentUserDataType | null>
  >;
};

export type AuthContextType = {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export type CurrentUserDataType = {
  uid: string;
  userName: string;
  regNo: string | null;
  gender: "male" | "female";
  roles: "ADMIN" | "STUDENT";
  registered: boolean;
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
  lastResult: number | null;
  status: "pending" | "completed";
  avgResult: number | null;
};
