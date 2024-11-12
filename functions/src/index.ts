import * as admin from "firebase-admin";
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

  // Collect promises to ensure all paths return a value
  const promises = usersSnapshot.docs.map((userDoc) => {
    const userId = userDoc.id;
    const userExamsRef = db.collection(`users/${userId}/exams`).doc(examId);

    if (action === "create") {
      return userExamsRef.set(examData);
    } else if (action === "delete") {
      return userExamsRef.delete();
    } else if (action === "update") {
      return userExamsRef.update(examData);
    } else {
      return null; // Ensures all code paths return a value
    }
  });

  // Wait for all promises to resolve
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

    await updateUserExamCollections(examId, {}, "delete");
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
