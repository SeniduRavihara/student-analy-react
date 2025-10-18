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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  examData: any,
  action: "create" | "delete" | "update"
) {
  const usersSnapshot = await db.collection("users").get();
  const { examYear, classType } = examData;

  // Collect promises for paths with matching examYear
  const promises = usersSnapshot.docs
    .filter((userDoc) => {
      const userData = userDoc.data();
      const userClasses = userData.classes || [];

      // Handle both string and array formats for classType
      if (Array.isArray(classType)) {
        // If classType is an array, check if any of the user's classes match any of the exam's classTypes
        return (
          userData.examYear === examYear &&
          classType.some((examClass) => userClasses.includes(examClass))
        );
      } else {
        // If classType is still a string (backward compatibility)
        return (
          userData.examYear === examYear && userClasses.includes(classType)
        );
      }
    })
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

    console.log("EXAM DATA", examData);

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

// Simple Hello World function for testing
export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello World!");
});

// --------------------------------------------------------------
// MCQ ANALYTICS CLOUD FUNCTIONS
// --------------------------------------------------------------

// Cloud Function to update MCQ analytics when a user submits a test
export const onMCQResultSubmit = onDocumentCreated(
  "users/{userId}/mcqTests/{packId}",
  async (event) => {
    const resultData = event.data?.data();
    const { userId, packId } = event.params;

    if (!resultData) {
      console.error("No result data found");
      return;
    }

    try {
      console.log(
        `Updating MCQ analytics for pack ${packId} by user ${userId}`
      );

      // Update pack-level analytics atomically
      const packAnalyticsRef = db.doc(`mcqTests/${packId}/analytics/pack`);

      // Get current analytics to calculate new values
      const currentAnalytics = await packAnalyticsRef.get();
      const currentData = currentAnalytics.exists
        ? currentAnalytics.data()
        : null;

      if (!currentData) {
        // First submission - create initial analytics
        const initialAnalytics = {
          totalAttempts: 1,
          uniqueUsers: 1,
          averageScore: resultData.percentage,
          passRate: resultData.isPassed ? 100 : 0,
          averageTimeSpent: resultData.timeSpent,
          highestScore: resultData.percentage,
          lowestScore: resultData.percentage,
          scoreDistribution: [
            { range: "0-20%", count: resultData.percentage <= 20 ? 1 : 0 },
            {
              range: "21-40%",
              count:
                resultData.percentage > 20 && resultData.percentage <= 40
                  ? 1
                  : 0,
            },
            {
              range: "41-60%",
              count:
                resultData.percentage > 40 && resultData.percentage <= 60
                  ? 1
                  : 0,
            },
            {
              range: "61-80%",
              count:
                resultData.percentage > 60 && resultData.percentage <= 80
                  ? 1
                  : 0,
            },
            { range: "81-100%", count: resultData.percentage > 80 ? 1 : 0 },
          ],
          passFailDistribution: {
            passed: resultData.isPassed ? 1 : 0,
            failed: resultData.isPassed ? 0 : 1,
          },
          questionStats: resultData.answers.map((answer: any) => ({
            questionId: answer.questionId,
            accuracy: answer.isCorrect ? 100 : 0,
            totalAttempts: 1,
            correctAnswers: answer.isCorrect ? 1 : 0,
          })),
          lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        };

        await packAnalyticsRef.set(initialAnalytics);
      } else {
        // Update existing analytics incrementally
        const newTotalAttempts = currentData.totalAttempts + 1;
        const newAverageScore =
          (currentData.averageScore * currentData.totalAttempts +
            resultData.percentage) /
          newTotalAttempts;
        const newPassRate =
          (((currentData.passRate / 100) * currentData.totalAttempts +
            (resultData.isPassed ? 1 : 0)) /
            newTotalAttempts) *
          100;
        const newAverageTimeSpent =
          (currentData.averageTimeSpent * currentData.totalAttempts +
            resultData.timeSpent) /
          newTotalAttempts;

        // Update score distribution
        const newScoreDistribution = currentData.scoreDistribution.map(
          (range: any) => {
            let count = range.count;
            if (range.range === "0-20%" && resultData.percentage <= 20) count++;
            else if (
              range.range === "21-40%" &&
              resultData.percentage > 20 &&
              resultData.percentage <= 40
            )
              count++;
            else if (
              range.range === "41-60%" &&
              resultData.percentage > 40 &&
              resultData.percentage <= 60
            )
              count++;
            else if (
              range.range === "61-80%" &&
              resultData.percentage > 60 &&
              resultData.percentage <= 80
            )
              count++;
            else if (range.range === "81-100%" && resultData.percentage > 80)
              count++;
            return { ...range, count };
          }
        );

        // Update pass/fail distribution
        const newPassFailDistribution = {
          passed:
            currentData.passFailDistribution.passed +
            (resultData.isPassed ? 1 : 0),
          failed:
            currentData.passFailDistribution.failed +
            (resultData.isPassed ? 0 : 1),
        };

        // Update question stats
        const newQuestionStats = currentData.questionStats.map((stat: any) => {
          const answer = resultData.answers.find(
            (a: any) => a.questionId === stat.questionId
          );
          if (answer) {
            const newCorrectAnswers =
              stat.correctAnswers + (answer.isCorrect ? 1 : 0);
            return {
              ...stat,
              totalAttempts: newTotalAttempts,
              correctAnswers: newCorrectAnswers,
              accuracy: (newCorrectAnswers / newTotalAttempts) * 100,
            };
          }
          return {
            ...stat,
            totalAttempts: newTotalAttempts,
            accuracy: (stat.correctAnswers / newTotalAttempts) * 100,
          };
        });

        await packAnalyticsRef.update({
          totalAttempts: newTotalAttempts,
          uniqueUsers: currentData.uniqueUsers + 1, // Assume new user for simplicity
          averageScore: newAverageScore,
          passRate: newPassRate,
          averageTimeSpent: newAverageTimeSpent,
          highestScore: Math.max(
            currentData.highestScore,
            resultData.percentage
          ),
          lowestScore: Math.min(currentData.lowestScore, resultData.percentage),
          scoreDistribution: newScoreDistribution,
          passFailDistribution: newPassFailDistribution,
          questionStats: newQuestionStats,
          lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      // Update question-level analytics for each answer
      for (const answer of resultData.answers) {
        const questionAnalyticsRef = db.doc(
          `mcqTests/${packId}/questions/${answer.questionId}/analytics/question`
        );

        // Get current question analytics
        const currentQuestionAnalytics = await questionAnalyticsRef.get();
        const currentQuestionData = currentQuestionAnalytics.exists
          ? currentQuestionAnalytics.data()
          : null;

        const timeSpentPerQuestion =
          (resultData.timeSpent * 60) / resultData.answers.length; // Convert to seconds per question

        if (!currentQuestionData) {
          // First submission for this question
          const initialQuestionAnalytics = {
            totalAttempts: 1,
            correctAnswers: answer.isCorrect ? 1 : 0,
            incorrectAnswers: answer.isCorrect ? 0 : 1,
            accuracy: answer.isCorrect ? 100 : 0,
            averageTimeSpent: timeSpentPerQuestion,
            difficultyBreakdown: {
              easy: { attempts: 1, correct: answer.isCorrect ? 1 : 0 },
              medium: { attempts: 0, correct: 0 },
              hard: { attempts: 0, correct: 0 },
            },
            optionStats: [], // Will be populated by getting question data
            timeStats: {
              averageTime: timeSpentPerQuestion,
              fastestTime: timeSpentPerQuestion,
              slowestTime: timeSpentPerQuestion,
            },
            performanceTrend: {
              recentAccuracy: answer.isCorrect ? 100 : 0,
              improvementRate: 0,
            },
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
          };

          await questionAnalyticsRef.set(initialQuestionAnalytics);
        } else {
          // Update existing question analytics
          const newTotalAttempts = currentQuestionData.totalAttempts + 1;
          const newCorrectAnswers =
            currentQuestionData.correctAnswers + (answer.isCorrect ? 1 : 0);
          const newIncorrectAnswers =
            currentQuestionData.incorrectAnswers + (answer.isCorrect ? 0 : 1);
          const newAccuracy = (newCorrectAnswers / newTotalAttempts) * 100;
          const newAverageTimeSpent =
            (currentQuestionData.averageTimeSpent *
              currentQuestionData.totalAttempts +
              timeSpentPerQuestion) /
            newTotalAttempts;

          // Update option stats (simplified - just increment selected option)
          const newOptionStats = currentQuestionData.optionStats.map(
            (optionStat: any) => {
              if (optionStat.optionId === answer.selectedOptionId) {
                return {
                  ...optionStat,
                  selectedCount: optionStat.selectedCount + 1,
                };
              }
              return optionStat;
            }
          );

          // Update time stats
          const newTimeStats = {
            averageTime: newAverageTimeSpent,
            fastestTime: Math.min(
              currentQuestionData.timeStats.fastestTime,
              timeSpentPerQuestion
            ),
            slowestTime: Math.max(
              currentQuestionData.timeStats.slowestTime,
              timeSpentPerQuestion
            ),
          };

          // Calculate performance trend
          const recentAccuracy = answer.isCorrect ? 100 : 0;
          const improvementRate =
            newTotalAttempts > 1
              ? ((newAccuracy - currentQuestionData.accuracy) /
                  currentQuestionData.accuracy) *
                100
              : 0;

          await questionAnalyticsRef.update({
            totalAttempts: newTotalAttempts,
            correctAnswers: newCorrectAnswers,
            incorrectAnswers: newIncorrectAnswers,
            accuracy: newAccuracy,
            averageTimeSpent: newAverageTimeSpent,
            optionStats: newOptionStats,
            timeStats: newTimeStats,
            performanceTrend: {
              recentAccuracy,
              improvementRate,
            },
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
          });
        }
      }

      console.log(`Successfully updated MCQ analytics for pack ${packId}`);
    } catch (error) {
      console.error(`Error updating MCQ analytics for pack ${packId}:`, error);
    }
  }
);
