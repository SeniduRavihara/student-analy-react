import React from "react";

export type DataContextType = {
  currentUserData: CurrentUserDataType | null;
  setCurrentUserData: React.Dispatch<
    React.SetStateAction<CurrentUserDataType | null>
  >;
};

export type CurrentUserDataType = {
  uid: string;
  userName: string;
  regNo: string;
  gender: "male" | "female";
  roles: string[];
};
