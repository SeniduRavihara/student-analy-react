import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { auth, db, provider } from "./config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { UserDataType, UserInfoType } from "@/types";

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

export const featchCurrentUserData = async (currentUser: User) => {
  try {
    const documentRef = doc(db, "users", currentUser.uid);
    const userDataDoc = await getDoc(documentRef);

    if (userDataDoc.exists()) {
      const userData = userDataDoc.data() as UserDataType;
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

export const registerStudent = async (data: UserInfoType, uid: string) => {
  const userInfoDocRef = doc(db, "users", uid);

  try {
    await updateDoc(userInfoDocRef, {
      ...data,
      bDate: data.bDate ? data.bDate.toISOString() : null,
      registered: true,
    });

    console.log("Student registered successfully:", data);

    // Step 2: Fetch exams relevant to the student's examYear
    if (data.examYear) {
      const examsQuery = query(
        collection(db, "exams"),
        where("examYear", "==", data.examYear)
      );
      const examsSnapshot = await getDocs(examsQuery);

      // Step 3: Batch add the matching exams to the student's exams sub-collection
      const batch = writeBatch(db); 

      examsSnapshot.docs.forEach((examDoc) => {
        const examData = examDoc.data();
        const userExamRef = doc(db, `users/${uid}/exams`, examDoc.id);
        batch.set(userExamRef, examData);
      });

      await batch.commit();
      console.log(`Exams for year ${data.examYear} added to user ${uid}`);
    }
  } catch (error) {
    console.error("Error registering student:", error);
  }
};

// ----------------------------------------------

export const fetchUserInfo = async (uid: string) => {
  const userInfoDocRef = doc(db, "users", uid);
  const userInfo = await getDoc(userInfoDocRef);

  return userInfo.data() as UserDataType;
};

// -------------------------------------------
// export const generateIndexNumber = async (uid: string, examYear: string) => {
//   const userGenaralInfoDocRef = doc(db, "general", examYear);
//   const userGenaralInfo = await getDoc(userGenaralInfoDocRef);

//   console.log(userGenaralInfo.data());

//   const isGenerating = userGenaralInfo.data()?.isGenerating;

//   let regNo: string;

//   if (isGenerating) {
//     await updateDoc(userGenaralInfoDocRef, {
//       isGenerating: true,
//     });

//     regNo = examYear + userGenaralInfo.data()?.lastRegNo + 1;

//     await updateDoc(userGenaralInfoDocRef, {
//       isGenerating: false,
//       lastRegNo: userGenaralInfo.data()?.lastRegNo + 1,
//     });
//   }

//   return regNo;
// };

export const generateIndexNumber = async (uid: string, examYear: string) => {
  const userGeneralInfoDocRef = doc(db, "general", examYear);
  console.log(uid);

  try {
    const regNo = await runTransaction(db, async (transaction) => {
      const userGeneralInfoDoc = await transaction.get(userGeneralInfoDocRef);

      if (!userGeneralInfoDoc.exists()) {
        throw new Error("Document does not exist!");
      }

      const data = userGeneralInfoDoc.data();
      const lastRegNo = data.lastRegNo || 0;

      // Generate new registration number with exam year prefix
      const newRegNo = examYear + String(lastRegNo + 1).padStart(4, "0");

      // Update the document with the new last registration number
      transaction.update(userGeneralInfoDocRef, {
        lastRegNo: lastRegNo + 1,
      });

      return newRegNo;
    });

    console.log(`Generated Index Number: ${regNo}`);
    return regNo;
  } catch (error) {
    console.error("Failed to generate index number:", error);
    throw error;
  }
};

// ------------------------------------------

export const createExam = async (
  examName: string,
  examDate: Date,
  examYear: string
) => {
  const examCollectionRef = collection(db, "exams");
  await addDoc(examCollectionRef, {
    examName,
    examDate: examDate.toISOString(),
    examStatus: "pending",
    avgResult: null,
    examYear,
  });
};

export const deleteExam = async (examId: string) => {
  const examDocRef = doc(db, "exams", examId);
  await deleteDoc(examDocRef);
};

// -------------------------------------------------

// export const fetchExamsData = async (uid: string) => {
//   const userExamCollectionRef = collection(db, "users", uid, "exams");
//   const userExamInfo = await getDoc(userExamCollectionRef);
// };

// -------------------------------------------------

export const setExamResults = async (
  examId: string,
  examResults: Record<string, number>
) => {
  // Calculate average result and round to 2 decimal points
  const totalMarks = Object.values(examResults).reduce(
    (sum, mark) => sum + mark,
    0
  );
  const avgResult = parseFloat(
    (totalMarks / Object.values(examResults).length).toFixed(2)
  );

  // Sort user IDs based on marks in descending order to determine rank
  const sortedResults = Object.entries(examResults)
    .sort(([, markA], [, markB]) => markB - markA) // Sort by marks
    .map(([userId, mark], index) => ({ userId, mark, rank: index + 1 })); // Assign rank

  // Update each student's record with mark, rank, and avgResult
  const studentPromises = sortedResults.map(async ({ userId, mark, rank }) => {
    const userExamRef = doc(db, `users/${userId}/exams`, examId);

    // Update with mark, rank, and avgResult for each student
    return updateDoc(userExamRef, {
      examResult: mark,
      rank: rank,
      avgResult: avgResult,
    });
  });

  // Update the main exam document with avgResult
  const examRef = doc(db, `exams`, examId);
  const examPromise = updateDoc(examRef, {
    avgResult: avgResult,
  });

  // Wait for all updates to complete
  await Promise.all([...studentPromises, examPromise]);
};

