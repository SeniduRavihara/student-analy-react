import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, provider } from "../config";

class AuthService {
  static async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async login({ email, password }: { email: string; password: string }) {
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
  }

  static async signup({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }) {
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
  }

  static googleSignIn = async () => {
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
          lastResult: null,
        };

        await setDoc(userDocRef, payload);
      }

      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

export default AuthService;
