import { UserDataType, UserInfoType } from "@/types";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { auth, db, provider } from "./config";

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

  const regNo = await generateIndexNumber(uid, data.examYear);
  // console.log("REG_NO", regNo);
  localStorage.setItem("regNo", regNo);

  try {
    await updateDoc(userInfoDocRef, {
      ...data,
      bDate: data.bDate ? data.bDate.toISOString() : null,
      registered: true,
      regNo: regNo,
    });

    console.log("Student registered successfully:", data);

    // Step 2: Fetch exams relevant to the student's examYear
    if (data.examYear) {
      const examsQuery = query(
        collection(db, "exams"),
        where("examYear", "==", data.examYear),
        where("classType", "in", data.classes)
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

// ----------------------------------------------

export const updateUserInfo = async (
  uid: string,
  updatedData: UserInfoType
) => {
  const userDocRef = doc(db, "users", uid);

  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { bDate, ...restOfData } = updatedData;
    // Update the user document with the new data
    await updateDoc(userDocRef, {
      ...restOfData,
      bDate: updatedData.bDate ? updatedData.bDate.toISOString() : null,
    });

    console.log("User information updated successfully.");
  } catch (error) {
    console.error("Error updating user information:", error);
    throw error; // Optionally, you could handle the error here, depending on your use case
  }
};

// // This function is used to update all the users
// export const addDefaultClassesToUsers = async () => {
//   const usersCollectionRef = collection(db, "users");

//   try {
//     const usersSnapshot = await getDocs(usersCollectionRef);
//     const updatePromises = usersSnapshot.docs.map(async (userDoc) => {
//       const userData = userDoc.data();

//       // Only update users who do not have the 'classes' attribute
//       if (!userData.classes || !Array.isArray(userData.classes)) {
//         const userDocRef = doc(db, "users", userDoc.id);
//         await updateDoc(userDocRef, { classes: ["THEORY"] });
//         console.log(`Updated user ${userDoc.id} with default classes.`);
//       }
//     });

//     await Promise.all(updatePromises);
//     console.log("All applicable users have been updated.");
//   } catch (error) {
//     console.error("Error updating users:", error);
//     throw error;
//   }
// };

// export const updateAllExamCollection = async () => {
//   const examsCollectionRef = collection(db, "exams");

//   try {
//     const examsSnapshot = await getDocs(examsCollectionRef);
//     const batch = writeBatch(db);

//     examsSnapshot.docs.forEach((exam) => {
//       const examData = exam.data();

//       // Only update exams that do not have the 'classType' attribute
//       if (!examData.classType) {
//         const examRef = doc(db, "exams", exam.id);
//         batch.update(examRef, { classType: "THEORY" });
//         console.log(`Updated exam ${exam.id} with default classType.`);
//       }
//     });

//     await batch.commit();
//     console.log("All applicable exams have been updated.");
//   } catch (error) {
//     console.error("Error updating exams:", error);
//     throw error;
//   }
// };

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
      const newRegNo = examYear + String(lastRegNo + 1).padStart(3, "0");

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
  examYear: string,
  classType: string
) => {
  const examCollectionRef = collection(db, "exams");
  await addDoc(examCollectionRef, {
    examName,
    examDate: examDate.toISOString(),
    examStatus: "pending",
    avgResult: null,
    examYear,
    createdAt: serverTimestamp(),
    classType,
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

// export const setExamResults2 = async (
//   examId: string,
//   examResults: Record<string, number>
// ) => {
//   // Calculate average result and round to 2 decimal points
//   const totalMarks = Object.values(examResults).reduce(
//     (sum, mark) => sum + mark,
//     0
//   );
//   const avgResult = parseFloat(
//     (totalMarks / Object.values(examResults).length).toFixed(2)
//   );

//   // Sort user IDs based on marks in descending order to determine rank
//   const sortedResults = Object.entries(examResults)
//     .sort(([, markA], [, markB]) => markB - markA) // Sort by marks
//     .map(([userId, mark], index) => ({ userId, mark, rank: index + 1 })); // Assign rank

//   // Update each student's record with mark, rank, and avgResult
//   const studentPromises = sortedResults.map(async ({ userId, mark, rank }) => {
//     const userExamRef = doc(db, `users/${userId}/exams`, examId);
//     const userRef = doc(db, "users", userId);

//     // Update the exam sub-collection document
//     const examUpdatePromise = updateDoc(userExamRef, {
//       examResult: mark,
//       rank: rank,
//       avgResult: avgResult,
//     });

//     // Update the user's main document with last rank and result
//     const userUpdatePromise = updateDoc(userRef, {
//       lastRank: rank,
//       lastResult: mark,
//     });

//     return Promise.all([examUpdatePromise, userUpdatePromise]);
//   });

//   // Update the main exam document with avgResult
//   const examRef = doc(db, `exams`, examId);
//   const examPromise = updateDoc(examRef, {
//     avgResult: avgResult,
//     examStatus: "completed",
//   });

//   // Wait for all updates to complete
//   await Promise.all([...studentPromises, examPromise]);
// };

export const setExamResults = async (
  examId: string,
  examResults: Record<string, { examResult: number | null; isAbsent: boolean }>
) => {
  // Filter out absent students for rank and average calculations
  const presentResults = Object.entries(examResults).filter(
    ([, result]) => !result.isAbsent && result.examResult !== null
  ) as [string, { examResult: number; isAbsent: boolean }][];

  console.log("HELLO", presentResults);

  // // Calculate average result for present students and round to 2 decimal points
  const totalMarks = presentResults.reduce(
    (sum, [, { examResult }]) => sum + examResult,
    0
  );
  const avgResult = parseFloat(
    (presentResults.length > 0
      ? totalMarks / presentResults.length
      : 0
    ).toFixed(2)
  );

  console.log("AVG", avgResult);

  // // Sort present students based on marks in descending order to determine rank
  const sortedResults = presentResults
    .sort(([, a], [, b]) => b.examResult - a.examResult) // Sort by marks
    .map(([userId, result], index) => ({
      userId,
      result,
      rank: index + 1,
    })); // Assign rank

  console.log("SOR", sortedResults);

  // Update each student's record with mark, rank, isAbsent, and avgResult
  const studentPromises = Object.entries(examResults).map(
    async ([userId, { examResult, isAbsent }]) => {
      const userExamRef = doc(db, `users/${userId}/exams`, examId);
      const userRef = doc(db, "users", userId);

      // Ensure isAbsent has a default value if undefined
      const isAbsentValue = isAbsent ?? false;

      // If the student is absent, set rank to null and keep marks as 0
      const found = sortedResults.find((res) => res.userId === userId);
      const rank = isAbsentValue ? null : found?.rank ?? null;

      // Update the exam sub-collection document
      const examUpdatePromise = updateDoc(userExamRef, {
        examResult: examResult ?? null, // Ensure examResult is never undefined
        isAbsent: isAbsentValue,
        rank,
        avgResult,
      });

      // Update the user's main document with last rank and result only if valid data exists
      const promises = [examUpdatePromise];

      // Only update user's main document if rank and result are valid (not null/undefined)
      if (rank != null && examResult != null) {
        const userUpdatePromise = updateDoc(userRef, {
          lastRank: rank,
          lastResult: examResult,
        });
        promises.push(userUpdatePromise);
      }

      return Promise.all(promises);
    }
  );

  // Update the main exam document with avgResult and mark it as completed
  const examRef = doc(db, `exams`, examId);
  const examPromise = updateDoc(examRef, {
    avgResult,
    examStatus: "completed",
  });

  // Wait for all updates to complete
  await Promise.all([...studentPromises, examPromise]);
};
