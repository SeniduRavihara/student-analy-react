// import {
//   addDoc,
//   collection,
//   deleteDoc,
//   doc,
//   getDoc,
//   serverTimestamp,
//   updateDoc,
// } from "firebase/firestore";
// import { db } from "./config";


// export const createExam = async (
//   examName: string,
//   examDate: Date,
//   examYear: string,
//   classTypes: string[]
// ) => {
//   const examCollectionRef = collection(db, "exams");
//   await addDoc(examCollectionRef, {
//     examName,
//     examDate: examDate.toISOString(),
//     examStatus: "pending",
//     avgResult: null,
//     examYear,
//     createdAt: serverTimestamp(),
//     classType: classTypes,
//   });
// };

// export const deleteExam = async (examId: string) => {
//   const examDocRef = doc(db, "exams", examId);
//   await deleteDoc(examDocRef);
// };

// // -------------------------------------------------

// export const updateExamClassTypeToArray = async (examId: string) => {
//   try {
//     const examDocRef = doc(db, "exams", examId);
//     const examDoc = await getDoc(examDocRef);

//     if (!examDoc.exists()) {
//       throw new Error("Exam document does not exist!");
//     }

//     const examData = examDoc.data();
//     const currentClassType = examData.classType;

//     console.log("EXAM DATA", examData);

//     // Check if classType is already an array
//     if (Array.isArray(currentClassType)) {
//       console.log("classType is already an array:", currentClassType);
//       return;
//     }

//     // Convert string classType to array format
//     const newClassType = [currentClassType];

//     // Update the exam document
//     await updateDoc(examDocRef, {
//       classType: newClassType,
//     });

//     console.log(
//       `Updated exam ${examId} classType from "${currentClassType}" to ["${currentClassType}"]`
//     );
//   } catch (error) {
//     console.error("Error updating exam classType to array:", error);
//     throw error;
//   }
// };

// // -------------------------------------------------

// // export const fetchExamsData = async (uid: string) => {
// //   const userExamCollectionRef = collection(db, "users", uid, "exams");
// //   const userExamInfo = await getDoc(userExamCollectionRef);
// // };

// // -------------------------------------------------

// // export const setExamResults2 = async (
// //   examId: string,
// //   examResults: Record<string, number>
// // ) => {
// //   // Calculate average result and round to 2 decimal points
// //   const totalMarks = Object.values(examResults).reduce(
// //     (sum, mark) => sum + mark,
// //     0
// //   );
// //   const avgResult = parseFloat(
// //     (totalMarks / Object.values(examResults).length).toFixed(2)
// //   );

// //   // Sort user IDs based on marks in descending order to determine rank
// //   const sortedResults = Object.entries(examResults)
// //     .sort(([, markA], [, markB]) => markB - markA) // Sort by marks
// //     .map(([userId, mark], index) => ({ userId, mark, rank: index + 1 })); // Assign rank

// //   // Update each student's record with mark, rank, and avgResult
// //   const studentPromises = sortedResults.map(async ({ userId, mark, rank }) => {
// //     const userExamRef = doc(db, `users/${userId}/exams`, examId);
// //     const userRef = doc(db, "users", userId);

// //     // Update the exam sub-collection document
// //     const examUpdatePromise = updateDoc(userExamRef, {
// //       examResult: mark,
// //       rank: rank,
// //       avgResult: avgResult,
// //     });

// //     // Update the user's main document with last rank and result
// //     const userUpdatePromise = updateDoc(userRef, {
// //       lastRank: rank,
// //       lastResult: mark,
// //     });

// //     return Promise.all([examUpdatePromise, userUpdatePromise]);
// //   });

// //   // Update the main exam document with avgResult
// //   const examRef = doc(db, `exams`, examId);
// //   const examPromise = updateDoc(examRef, {
// //     avgResult: avgResult,
// //     examStatus: "completed",
// //   });

// //   // Wait for all updates to complete
// //   await Promise.all([...studentPromises, examPromise]);
// // };

// export const setExamResults = async (
//   examId: string,
//   examResults: Record<string, { examResult: number | null; isAbsent: boolean }>
// ) => {
//   // Filter out absent students for rank and average calculations
//   const presentResults = Object.entries(examResults).filter(
//     ([, result]) => !result.isAbsent && result.examResult !== null
//   ) as [string, { examResult: number; isAbsent: boolean }][];

//   console.log("HELLO", presentResults);

//   // // Calculate average result for present students and round to 2 decimal points
//   const totalMarks = presentResults.reduce(
//     (sum, [, { examResult }]) => sum + examResult,
//     0
//   );
//   const avgResult = parseFloat(
//     (presentResults.length > 0
//       ? totalMarks / presentResults.length
//       : 0
//     ).toFixed(2)
//   );

//   console.log("AVG", avgResult);

//   // // Sort present students based on marks in descending order to determine rank
//   const sortedResults = presentResults
//     .sort(([, a], [, b]) => b.examResult - a.examResult) // Sort by marks
//     .map(([userId, result], _index, array) => {
//       // Find the first occurrence of this mark to determine rank
//       const firstIndex = array.findIndex(
//         ([, r]) => r.examResult === result.examResult
//       );
//       const rank = firstIndex + 1; // Use the first index + 1 as rank for all students with same marks

//       return {
//         userId,
//         result,
//         rank,
//       };
//     }); // Assign rank

//   console.log("SOR", sortedResults);

//   // return;

//   // Update each student's record with mark, rank, isAbsent, and avgResult
//   const studentPromises = Object.entries(examResults).map(
//     async ([userId, { examResult, isAbsent }]) => {
//       const userExamRef = doc(db, `users/${userId}/exams`, examId);
//       const userRef = doc(db, "users", userId);

//       // Ensure isAbsent has a default value if undefined
//       const isAbsentValue = (isAbsent ?? false) || examResult === null;

//       // If the student is absent, set rank to null and keep marks as 0
//       const found = sortedResults.find((res) => res.userId === userId);
//       const rank = isAbsentValue ? null : found?.rank ?? null;

//       // Update the exam sub-collection document
//       const examUpdatePromise = updateDoc(userExamRef, {
//         examResult: examResult ?? null, // Ensure examResult is never undefined
//         isAbsent: isAbsentValue,
//         rank,
//         avgResult,
//       });

//       // Update the user's main document with last rank and result only if valid data exists
//       const promises = [examUpdatePromise];

//       // Only update user's main document if rank and result are valid (not null/undefined)
//       if (rank != null && examResult != null) {
//         const userUpdatePromise = updateDoc(userRef, {
//           lastRank: rank,
//           lastResult: examResult,
//         });
//         promises.push(userUpdatePromise);
//       }

//       return Promise.all(promises);
//     }
//   );

//   // Update the main exam document with avgResult and mark it as completed
//   const examRef = doc(db, `exams`, examId);
//   const examPromise = updateDoc(examRef, {
//     avgResult,
//     examStatus: "completed",
//   });

//   // Wait for all updates to complete
//   await Promise.all([...studentPromises, examPromise]);
// };
