import * as admin from "firebase-admin";
import * as functions from "firebase-functions/v1";
import {
  onDocumentCreated,
  onDocumentDeleted,
  onDocumentUpdated,
} from "firebase-functions/v2/firestore";

admin.initializeApp();
const db = admin.firestore();

// Helper function to update each user's sub-collection
async function updateUserExamCollections(
  examId: string,
  examData: any,
  action: "create" | "delete" | "update"
) {
  const usersSnapshot = await db.collection("users").get();
  const { examYear, classType } = examData;

  // Collect promises for paths with matching examYear
  const promises = usersSnapshot.docs
    .filter(
      (userDoc) =>
        userDoc.data().examYear === examYear &&
        userDoc.data().classes.includes(classType)
    )
    .map((userDoc) => {
      const userId = userDoc.id;
      const userExamsRef = db.collection(`users/${userId}/exams`).doc(examId);

      if (action === "create") {
        return userExamsRef.set(examData);
      } else if (action === "delete") {
        return userExamsRef.delete();
      } else if (action === "update") {
        return userExamsRef.update(examData);
      } else {
        return null;
      }
    });

  // Wait for all relevant promises to resolve
  await Promise.all(promises);
}

// Cloud Function to handle exam creation
export const onExamCreate = onDocumentCreated(
  "exams/{examId}",
  async (event) => {
    const examData = event.data?.data();
    const examId = event.params.examId;

    if (examData) {
      await updateUserExamCollections(examId, examData, "create");
    }
  }
);

// Cloud Function to handle exam deletion
export const onExamDelete = onDocumentDeleted(
  "exams/{examId}",
  async (event) => {
    const examId = event.params.examId;
    const examData = event.data?.data();

    await updateUserExamCollections(examId, examData, "delete");
  }
);

// Cloud Function to handle exam updates
export const onExamUpdate = onDocumentUpdated(
  "exams/{examId}",
  async (event) => {
    const examData = event.data?.after.data();
    const examId = event.params.examId;

    if (examData) {
      await updateUserExamCollections(examId, examData, "update");
    }
  }
);

// --------------------------------------------------------------

// export const deleteUserData = functions.auth.user().onDelete(async (user) => {
//   const uid = user.uid;

//   try {
//     await db.collection("users").doc(uid).delete();
//     console.log(`Successfully deleted user data for UID: ${uid}`);
//   } catch (error) {
//     console.error(`Error deleting user data for UID: ${uid}`, error);
//   }
// });

export const deleteUserData = functions.auth.user().onDelete(async (user) => {
  const uid = user.uid;

  try {
    // Reference to the 'exams' subcollection under the user
    const examsCollectionRef = db.collection(`users/${uid}/exams`);

    // Get all documents in the 'exams' subcollection
    const examsSnapshot = await examsCollectionRef.get();

    // Delete all documents in the 'exams' subcollection
    const examDeletions = examsSnapshot.docs.map((doc) => doc.ref.delete());
    await Promise.all(examDeletions);

    // Delete the user's main document
    await db.collection("users").doc(uid).delete();

    console.log(
      `Successfully deleted user document and 'exams' subcollection for UID: ${uid}`
    );
  } catch (error) {
    console.error(
      `Error deleting user data and subcollection for UID: ${uid}`,
      error
    );
  }
});

// Cloud Function to handle new user creation
// export const onUserCreate = functions.firestore
//   .document("users/{userId}")
//   .onCreate(async (snapshot: DocumentSnapshot) => {
//     const userData = snapshot.data();

//     if (userData) {
//       const examYear = userData.examYear;
//       const userId = snapshot.id;

//       try {
//         // Fetch exams from "exams" collection where examYear matches the user's examYear
//         const examsSnapshot = await db
//           .collection("exams")
//           .where("examYear", "==", examYear)
//           .get();

//         const batch = db.batch();

//         examsSnapshot.docs.forEach((examDoc) => {
//           const examData = examDoc.data();
//           const examId = examDoc.id;

//           // Create a new exam document in the user's "exams" sub-collection
//           const userExamRef = db
//             .collection("users")
//             .doc(userId)
//             .collection("exams")
//             .doc(examId);

//           batch.set(userExamRef, examData);
//         });

//         // Commit all writes in a single batch operation
//         await batch.commit();
//         console.log(`Exams for year ${examYear} added to user ${userId}`);
//       } catch (error) {
//         console.error("Error creating user exams:", error);
//       }
//     }
//   });
