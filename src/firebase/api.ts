import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { auth, db, provider } from "./config";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { CurrentUserDataType } from "@/types";

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    // console.log(userCredential);
    return userCredential.user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const signup = async ({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    // console.log(userCredential);
    const user = userCredential.user;

    const payload = {
      uid: "",
      userName: "",
      regNo: null,
      email: "",
      roles: "STUDENT",
      registered: false,
    };

    await setDoc(doc(db, "users", user.uid), {
      ...payload,
      uid: user.uid,
      userName: name,
      email,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const googleSignIn = async () => {
  try {
    const userCredential = await signInWithPopup(auth, provider);
    // console.log(userCredential);

    const user = userCredential.user;
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      const payload = {
        uid: user.uid,
        userName: user.displayName || "",
        regNo: null,
        email: user.email || "",
        roles: "STUDENT",
        registered: false,
      };

      await setDoc(userDocRef, payload);
    }

    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const featchCurrentUserData = async (currentUser: User) => {
  try {
    const documentRef = doc(db, "users", currentUser.uid);
    const userDataDoc = await getDoc(documentRef);

    if (userDataDoc.exists()) {
      const userData = userDataDoc.data() as CurrentUserDataType;
      console.log("Current user data fetched successfully");
      return userData;
    } else {
      console.log("Document does not exist.");
      return null;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//--------------------------------------------------------

export const getUserRole = async (uid: string) => {
  const documentRef = doc(db, "users", uid);
  const userData = await getDoc(documentRef);

  return userData?.data()?.roles ?? null;
};

//--------------------------------------------------------

export const getRegisteredStatus = async (uid: string) => {
  const documentRef = doc(db, "users", uid);
  const userData = await getDoc(documentRef);

  return userData?.data()?.registered;
};

// -------------------------------------------------------

export const registerStudent = async (
  data: {
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
  },
  uid: string
) => {
  const userInfoDocRef = doc(db, "users", uid, "studentInfo", uid);
  const userDocRef = doc(db, "users", uid);

  console.log("submit");

  try {
    await setDoc(userInfoDocRef, {
      ...data,
      bDate: data.bDate ? data.bDate.toISOString() : null, // Ensure date is in a string format
    });

    await updateDoc(userDocRef, {
      registered: true,
    });

    console.log("Student registered successfully:", data);
  } catch (error) {
    console.error("Error registering student:", error);
  }
};

// ----------------------------------------------

export const fetchUserInfo = async (uid: string) => {
  const userInfoDocRef = doc(db, "users", uid, "studentInfo", uid);
  const userInfo = await getDoc(userInfoDocRef);

  return userInfo.data();
};
