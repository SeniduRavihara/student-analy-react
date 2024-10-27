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
  regNo: string;
  gender: "male" | "female";
  roles: "ADMIN" | "STUDENT";
};
