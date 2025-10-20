import {
  MCQPack,
  MCQPackAnalytics,
  MCQQuestion,
  MCQQuestionAnalytics,
  MCQResult,
} from "@/types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config";

export class McqService {
  // MCQ Pack Operations
  static async createMCQPack(
    packData: Omit<MCQPack, "id" | "createdAt" | "updatedAt">
  ) {
    try {
      const docRef = await addDoc(collection(db, "mcqTests"), {
        ...packData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return { data: { id: docRef.id }, error: null };
    } catch (error) {
      console.error("McqService: Create MCQ pack error:", error);
      return { data: null, error };
    }
  }

  static async updateMCQPack(packId: string, updateData: Partial<MCQPack>) {
    try {
      const packRef = doc(db, "mcqTests", packId);
      await updateDoc(packRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });

      return { data: { success: true }, error: null };
    } catch (error) {
      console.error("McqService: Update MCQ pack error:", error);
      return { data: null, error };
    }
  }

  static async deleteMCQPack(packId: string) {
    try {
      // Delete the pack
      await deleteDoc(doc(db, "mcqTests", packId));

      // Note: Questions will be deleted automatically due to Firestore rules
      // or you can manually delete them if needed

      return { data: { success: true }, error: null };
    } catch (error) {
      console.error("McqService: Delete MCQ pack error:", error);
      return { data: null, error };
    }
  }

  static async getMCQPack(packId: string) {
    try {
      const packDoc = await getDoc(doc(db, "mcqTests", packId));

      if (packDoc.exists()) {
        const packData = {
          id: packDoc.id,
          ...packDoc.data(),
          createdAt: packDoc.data().createdAt?.toDate() || new Date(),
          updatedAt: packDoc.data().updatedAt?.toDate() || new Date(),
        } as MCQPack;

        return { data: packData, error: null };
      } else {
        return { data: null, error: "MCQ pack not found" };
      }
    } catch (error) {
      console.error("McqService: Get MCQ pack error:", error);
      return { data: null, error };
    }
  }

  static async getMCQPacksByYearAndClass(examYear: string, classType: string) {
    try {
      const q = query(
        collection(db, "mcqTests"),
        where("examYear", "==", examYear),
        where("classType", "array-contains", classType),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const packs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as MCQPack[];

      return { data: packs, error: null };
    } catch (error) {
      console.error("McqService: Get MCQ packs error:", error);
      return { data: null, error };
    }
  }

  // Question Operations
  static async addQuestionToPack(
    packId: string,
    questionData: Omit<MCQQuestion, "id" | "createdAt">
  ) {
    try {
      const docRef = await addDoc(
        collection(db, "mcqTests", packId, "questions"),
        {
          ...questionData,
          createdAt: serverTimestamp(),
        }
      );

      // Update pack's total questions count
      const packRef = doc(db, "mcqTests", packId);
      const packDoc = await getDoc(packRef);
      if (packDoc.exists()) {
        const currentCount = packDoc.data().totalQuestions || 0;
        await updateDoc(packRef, {
          totalQuestions: currentCount + 1,
          totalMarks: currentCount + 1, // Assuming 1 mark per question
          updatedAt: serverTimestamp(),
        });
      }

      return { data: { id: docRef.id }, error: null };
    } catch (error) {
      console.error("McqService: Add question error:", error);
      return { data: null, error };
    }
  }

  static async updateQuestion(
    packId: string,
    questionId: string,
    updateData: Partial<MCQQuestion>
  ) {
    try {
      const questionRef = doc(db, "mcqTests", packId, "questions", questionId);
      await updateDoc(questionRef, updateData);

      return { data: { success: true }, error: null };
    } catch (error) {
      console.error("McqService: Update question error:", error);
      return { data: null, error };
    }
  }

  static async deleteQuestion(packId: string, questionId: string) {
    try {
      // Delete the question
      await deleteDoc(doc(db, "mcqTests", packId, "questions", questionId));

      // Update pack's total questions count
      const packRef = doc(db, "mcqTests", packId);
      const packDoc = await getDoc(packRef);
      if (packDoc.exists()) {
        const currentCount = packDoc.data().totalQuestions || 0;
        await updateDoc(packRef, {
          totalQuestions: Math.max(0, currentCount - 1),
          totalMarks: Math.max(0, currentCount - 1),
          updatedAt: serverTimestamp(),
        });
      }

      return { data: { success: true }, error: null };
    } catch (error) {
      console.error("McqService: Delete question error:", error);
      return { data: null, error };
    }
  }

  static async getQuestionsForPack(packId: string) {
    try {
      const q = query(
        collection(db, "mcqTests", packId, "questions"),
        orderBy("order", "asc")
      );

      const querySnapshot = await getDocs(q);
      const questions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as MCQQuestion[];

      return { data: questions, error: null };
    } catch (error) {
      console.error("McqService: Get questions error:", error);
      return { data: null, error };
    }
  }

  // Student Result Operations
  static async saveMCQResult(
    studentId: string,
    packId: string,
    resultData: Omit<MCQResult, "id" | "completedAt">
  ) {
    try {
      const resultRef = doc(db, "users", studentId, "mcqTests", packId);
      await setDoc(resultRef, {
        ...resultData,
        completedAt: serverTimestamp(),
      });

      return { data: { success: true }, error: null };
    } catch (error) {
      console.error("McqService: Save MCQ result error:", error);
      return { data: null, error };
    }
  }

  static async getMCQResult(studentId: string, packId: string) {
    try {
      const resultDoc = await getDoc(
        doc(db, "users", studentId, "mcqTests", packId)
      );

      if (resultDoc.exists()) {
        const resultData = {
          id: resultDoc.id,
          ...resultDoc.data(),
          completedAt: resultDoc.data().completedAt?.toDate() || new Date(),
        } as MCQResult;

        return { data: resultData, error: null };
      } else {
        return { data: null, error: "MCQ result not found" };
      }
    } catch (error) {
      console.error("McqService: Get MCQ result error:", error);
      return { data: null, error };
    }
  }

  static async getStudentMCQHistory(studentId: string) {
    try {
      const q = query(
        collection(db, "users", studentId, "mcqTests"),
        orderBy("completedAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        completedAt: doc.data().completedAt?.toDate() || new Date(),
      })) as MCQResult[];

      return { data: results, error: null };
    } catch (error) {
      console.error("McqService: Get student MCQ history error:", error);
      return { data: null, error };
    }
  }

  // Analytics Operations
  static async getAllResultsForPack(packId: string) {
    try {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const allResults: MCQResult[] = [];

      for (const userDoc of usersSnapshot.docs) {
        const mcqRef = doc(db, "users", userDoc.id, "mcqTests", packId);
        const mcqDoc = await getDoc(mcqRef);

        if (mcqDoc.exists()) {
          const resultData = {
            id: mcqDoc.id,
            ...mcqDoc.data(),
            completedAt: mcqDoc.data().completedAt?.toDate() || new Date(),
          } as MCQResult;
          allResults.push(resultData);
        }
      }

      return { data: allResults, error: null };
    } catch (error) {
      console.error("McqService: Get all results for pack error:", error);
      return { data: null, error };
    }
  }

  static async getMCQAnalytics(packId: string) {
    try {
      // Get pack details
      const packResult = await this.getMCQPack(packId);
      if (packResult.error) {
        return { data: null, error: packResult.error };
      }

      // Get all results
      const resultsResult = await this.getAllResultsForPack(packId);
      if (resultsResult.error) {
        return { data: null, error: resultsResult.error };
      }

      const results = resultsResult.data || [];

      // Calculate analytics
      const analytics = {
        totalAttempts: results.length,
        averageScore:
          results.length > 0
            ? results.reduce((sum, r) => sum + r.percentage, 0) / results.length
            : 0,
        passRate:
          results.length > 0
            ? (results.filter((r) => r.isPassed).length / results.length) * 100
            : 0,
        averageTimeSpent:
          results.length > 0
            ? results.reduce((sum, r) => sum + r.timeSpent, 0) / results.length
            : 0,
        highestScore:
          results.length > 0
            ? Math.max(...results.map((r) => r.percentage))
            : 0,
        lowestScore:
          results.length > 0
            ? Math.min(...results.map((r) => r.percentage))
            : 0,
        scoreDistribution: [
          {
            range: "0-20%",
            count: results.filter(
              (r) => r.percentage >= 0 && r.percentage <= 20
            ).length,
          },
          {
            range: "21-40%",
            count: results.filter(
              (r) => r.percentage >= 21 && r.percentage <= 40
            ).length,
          },
          {
            range: "41-60%",
            count: results.filter(
              (r) => r.percentage >= 41 && r.percentage <= 60
            ).length,
          },
          {
            range: "61-80%",
            count: results.filter(
              (r) => r.percentage >= 61 && r.percentage <= 80
            ).length,
          },
          {
            range: "81-100%",
            count: results.filter(
              (r) => r.percentage >= 81 && r.percentage <= 100
            ).length,
          },
        ],
        passFailData: [
          {
            name: "Passed",
            value: results.filter((r) => r.isPassed).length,
            color: "#10b981",
          },
          {
            name: "Failed",
            value: results.filter((r) => !r.isPassed).length,
            color: "#ef4444",
          },
        ],
      };

      return {
        data: { pack: packResult.data, results, analytics },
        error: null,
      };
    } catch (error) {
      console.error("McqService: Get MCQ analytics error:", error);
      return { data: null, error };
    }
  }

  // Utility Methods
  static async checkIfStudentHasAttempted(studentId: string, packId: string) {
    try {
      const resultDoc = await getDoc(
        doc(db, "users", studentId, "mcqTests", packId)
      );
      return { data: resultDoc.exists(), error: null };
    } catch (error) {
      console.error("McqService: Check attempt error:", error);
      return { data: false, error };
    }
  }

  static async publishMCQPack(packId: string) {
    try {
      const packRef = doc(db, "mcqTests", packId);
      await updateDoc(packRef, {
        status: "published",
        updatedAt: serverTimestamp(),
      });

      return { data: { success: true }, error: null };
    } catch (error) {
      console.error("McqService: Publish MCQ pack error:", error);
      return { data: null, error };
    }
  }

  static async archiveMCQPack(packId: string) {
    try {
      const packRef = doc(db, "mcqTests", packId);
      await updateDoc(packRef, {
        status: "archived",
        updatedAt: serverTimestamp(),
      });

      return { data: { success: true }, error: null };
    } catch (error) {
      console.error("McqService: Archive MCQ pack error:", error);
      return { data: null, error };
    }
  }

  // Analytics Operations
  static async updateMCQAnalytics(packId: string, result: MCQResult) {
    try {
      // Update pack-level analytics
      await this.updatePackAnalytics(packId, result);

      // Update question-level analytics
      await this.updateQuestionAnalytics(packId, result);

      return { data: { success: true }, error: null };
    } catch (error) {
      console.error("McqService: Update MCQ analytics error:", error);
      return { data: null, error };
    }
  }

  static async updatePackAnalytics(packId: string, result: MCQResult) {
    try {
      const analyticsRef = doc(db, "mcqTests", packId, "analytics", "pack");

      // Get current analytics (if exists)
      const currentAnalyticsDoc = await getDoc(analyticsRef);
      let currentAnalytics: MCQPackAnalytics | null = null;

      if (currentAnalyticsDoc.exists()) {
        currentAnalytics = {
          ...currentAnalyticsDoc.data(),
          lastUpdated:
            currentAnalyticsDoc.data()?.lastUpdated?.toDate() || new Date(),
        } as MCQPackAnalytics;
      }

      // If no analytics exist, create new ones
      if (!currentAnalytics) {
        const newAnalytics: MCQPackAnalytics = {
          totalAttempts: 1,
          uniqueUsers: 1,
          averageScore: result.percentage,
          passRate: result.isPassed ? 100 : 0,
          averageTimeSpent: result.timeSpent,
          highestScore: result.percentage,
          lowestScore: result.percentage,
          scoreDistribution: [
            { range: "0-20%", count: result.percentage <= 20 ? 1 : 0 },
            {
              range: "21-40%",
              count: result.percentage > 20 && result.percentage <= 40 ? 1 : 0,
            },
            {
              range: "41-60%",
              count: result.percentage > 40 && result.percentage <= 60 ? 1 : 0,
            },
            {
              range: "61-80%",
              count: result.percentage > 60 && result.percentage <= 80 ? 1 : 0,
            },
            { range: "81-100%", count: result.percentage > 80 ? 1 : 0 },
          ],
          passFailDistribution: {
            passed: result.isPassed ? 1 : 0,
            failed: result.isPassed ? 0 : 1,
          },
          questionStats: result.answers.map((answer) => ({
            questionId: answer.questionId,
            accuracy: answer.isCorrect ? 100 : 0,
            totalAttempts: 1,
            correctAnswers: answer.isCorrect ? 1 : 0,
          })),
          lastUpdated: new Date(),
        };

        await setDoc(analyticsRef, newAnalytics);
        return { data: newAnalytics, error: null };
      }

      // Update existing analytics incrementally
      const newTotalAttempts = currentAnalytics.totalAttempts + 1;
      const newAverageScore =
        (currentAnalytics.averageScore * currentAnalytics.totalAttempts +
          result.percentage) /
        newTotalAttempts;
      const newPassRate =
        (((currentAnalytics.passRate / 100) * currentAnalytics.totalAttempts +
          (result.isPassed ? 1 : 0)) /
          newTotalAttempts) *
        100;
      const newAverageTimeSpent =
        (currentAnalytics.averageTimeSpent * currentAnalytics.totalAttempts +
          result.timeSpent) /
        newTotalAttempts;

      // Update score distribution
      const newScoreDistribution = currentAnalytics.scoreDistribution.map(
        (range) => {
          let count = range.count;
          if (range.range === "0-20%" && result.percentage <= 20) count++;
          else if (
            range.range === "21-40%" &&
            result.percentage > 20 &&
            result.percentage <= 40
          )
            count++;
          else if (
            range.range === "41-60%" &&
            result.percentage > 40 &&
            result.percentage <= 60
          )
            count++;
          else if (
            range.range === "61-80%" &&
            result.percentage > 60 &&
            result.percentage <= 80
          )
            count++;
          else if (range.range === "81-100%" && result.percentage > 80) count++;
          return { ...range, count };
        }
      );

      // Update pass/fail distribution
      const newPassFailDistribution = {
        passed:
          currentAnalytics.passFailDistribution.passed +
          (result.isPassed ? 1 : 0),
        failed:
          currentAnalytics.passFailDistribution.failed +
          (result.isPassed ? 0 : 1),
      };

      // Update question stats
      const newQuestionStats = currentAnalytics.questionStats.map((stat) => {
        const answer = result.answers.find(
          (a) => a.questionId === stat.questionId
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

      const updatedAnalytics: MCQPackAnalytics = {
        totalAttempts: newTotalAttempts,
        uniqueUsers: currentAnalytics.uniqueUsers + 1, // Assume new user for simplicity
        averageScore: newAverageScore,
        passRate: newPassRate,
        averageTimeSpent: newAverageTimeSpent,
        highestScore: Math.max(
          currentAnalytics.highestScore,
          result.percentage
        ),
        lowestScore: Math.min(currentAnalytics.lowestScore, result.percentage),
        scoreDistribution: newScoreDistribution,
        passFailDistribution: newPassFailDistribution,
        questionStats: newQuestionStats,
        lastUpdated: new Date(),
      };

      await setDoc(analyticsRef, updatedAnalytics);
      return { data: updatedAnalytics, error: null };
    } catch (error) {
      console.error("McqService: Update pack analytics error:", error);
      return { data: null, error };
    }
  }

  static async updateQuestionAnalytics(packId: string, result: MCQResult) {
    try {
      // Get questions to know the options and difficulty
      const questionsResult = await this.getQuestionsForPack(packId);
      const questions = questionsResult.data || [];

      // Update analytics for each question incrementally
      for (const answer of result.answers) {
        const question = questions.find((q) => q.id === answer.questionId);
        if (!question) continue;

        const questionAnalyticsRef = doc(
          db,
          "mcqTests",
          packId,
          "questions",
          answer.questionId,
          "analytics",
          "question"
        );

        // Get current analytics (if exists)
        const currentAnalyticsDoc = await getDoc(questionAnalyticsRef);
        let currentAnalytics: MCQQuestionAnalytics | null = null;

        if (currentAnalyticsDoc.exists()) {
          currentAnalytics = {
            ...currentAnalyticsDoc.data(),
            lastUpdated:
              currentAnalyticsDoc.data()?.lastUpdated?.toDate() || new Date(),
          } as MCQQuestionAnalytics;
        }

        const timeSpentPerQuestion = (result.timeSpent * 60) / questions.length; // Convert to seconds per question

        // If no analytics exist, create new ones
        if (!currentAnalytics) {
          const newAnalytics: MCQQuestionAnalytics = {
            totalAttempts: 1,
            correctAnswers: answer.isCorrect ? 1 : 0,
            incorrectAnswers: answer.isCorrect ? 0 : 1,
            accuracy: answer.isCorrect ? 100 : 0,
            averageTimeSpent: timeSpentPerQuestion,
            difficultyBreakdown: {
              easy: {
                attempts: question.difficulty === "easy" ? 1 : 0,
                correct:
                  question.difficulty === "easy" && answer.isCorrect ? 1 : 0,
              },
              medium: {
                attempts: question.difficulty === "medium" ? 1 : 0,
                correct:
                  question.difficulty === "medium" && answer.isCorrect ? 1 : 0,
              },
              hard: {
                attempts: question.difficulty === "hard" ? 1 : 0,
                correct:
                  question.difficulty === "hard" && answer.isCorrect ? 1 : 0,
              },
            },
            optionStats: question.options.map((option) => ({
              optionId: option.id,
              optionText: option.text || "",
              selectedCount: answer.selectedOptionId === option.id ? 1 : 0,
              isCorrect: option.isCorrect,
            })),
            timeStats: {
              averageTime: timeSpentPerQuestion,
              fastestTime: timeSpentPerQuestion,
              slowestTime: timeSpentPerQuestion,
            },
            performanceTrend: {
              recentAccuracy: answer.isCorrect ? 100 : 0,
              improvementRate: 0,
            },
            lastUpdated: new Date(),
          };

          await setDoc(questionAnalyticsRef, newAnalytics);
          continue;
        }

        // Update existing analytics incrementally
        const newTotalAttempts = currentAnalytics.totalAttempts + 1;
        const newCorrectAnswers =
          currentAnalytics.correctAnswers + (answer.isCorrect ? 1 : 0);
        const newIncorrectAnswers =
          currentAnalytics.incorrectAnswers + (answer.isCorrect ? 0 : 1);
        const newAccuracy = (newCorrectAnswers / newTotalAttempts) * 100;
        const newAverageTimeSpent =
          (currentAnalytics.averageTimeSpent * currentAnalytics.totalAttempts +
            timeSpentPerQuestion) /
          newTotalAttempts;

        // Update difficulty breakdown
        const newDifficultyBreakdown = {
          ...currentAnalytics.difficultyBreakdown,
        };
        newDifficultyBreakdown[question.difficulty].attempts++;
        if (answer.isCorrect) {
          newDifficultyBreakdown[question.difficulty].correct++;
        }

        // Update option stats
        const newOptionStats = currentAnalytics.optionStats.map(
          (optionStat) => {
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
            currentAnalytics.timeStats.fastestTime,
            timeSpentPerQuestion
          ),
          slowestTime: Math.max(
            currentAnalytics.timeStats.slowestTime,
            timeSpentPerQuestion
          ),
        };

        // Calculate performance trend (simplified - just recent accuracy)
        const recentAccuracy = answer.isCorrect ? 100 : 0;
        const improvementRate =
          newTotalAttempts > 1
            ? ((newAccuracy - currentAnalytics.accuracy) /
                currentAnalytics.accuracy) *
              100
            : 0;

        const updatedAnalytics: MCQQuestionAnalytics = {
          totalAttempts: newTotalAttempts,
          correctAnswers: newCorrectAnswers,
          incorrectAnswers: newIncorrectAnswers,
          accuracy: newAccuracy,
          averageTimeSpent: newAverageTimeSpent,
          difficultyBreakdown: newDifficultyBreakdown,
          optionStats: newOptionStats,
          timeStats: newTimeStats,
          performanceTrend: {
            recentAccuracy,
            improvementRate,
          },
          lastUpdated: new Date(),
        };

        await setDoc(questionAnalyticsRef, updatedAnalytics);
      }

      return { data: { success: true }, error: null };
    } catch (error) {
      console.error("McqService: Update question analytics error:", error);
      return { data: null, error };
    }
  }

  static async getMCQPackAnalytics(packId: string) {
    try {
      const analyticsRef = doc(db, "mcqTests", packId, "analytics", "pack");
      const analyticsDoc = await getDoc(analyticsRef);

      if (!analyticsDoc.exists()) {
        return { data: null, error: "Analytics not found" };
      }

      const analytics = {
        ...analyticsDoc.data(),
        lastUpdated: analyticsDoc.data()?.lastUpdated?.toDate() || new Date(),
      } as MCQPackAnalytics;

      return { data: analytics, error: null };
    } catch (error) {
      console.error("McqService: Get MCQ pack analytics error:", error);
      return { data: null, error };
    }
  }

  static async getMCQQuestionAnalytics(packId: string, questionId: string) {
    try {
      const analyticsRef = doc(
        db,
        "mcqTests",
        packId,
        "questions",
        questionId,
        "analytics",
        "question"
      );
      const analyticsDoc = await getDoc(analyticsRef);

      if (!analyticsDoc.exists()) {
        return { data: null, error: "Question analytics not found" };
      }

      const analytics = {
        ...analyticsDoc.data(),
        lastUpdated: analyticsDoc.data()?.lastUpdated?.toDate() || new Date(),
      } as MCQQuestionAnalytics;

      return { data: analytics, error: null };
    } catch (error) {
      console.error("McqService: Get MCQ question analytics error:", error);
      return { data: null, error };
    }
  }

  // Get detailed analytics for all questions in a pack
  static async getAllQuestionAnalytics(packId: string) {
    try {
      // Get all questions
      const questionsResult = await this.getQuestionsForPack(packId);
      if (questionsResult.error) {
        return { data: null, error: questionsResult.error };
      }

      const questions = questionsResult.data || [];

      // Get analytics for all questions in parallel
      const analyticsPromises = questions.map(async (question) => {
        const analyticsResult = await this.getMCQQuestionAnalytics(
          packId,
          question.id
        );
        if (analyticsResult.data) {
          return {
            questionId: question.id,
            questionText: question.question,
            difficulty: question.difficulty,
            options: question.options,
            analytics: analyticsResult.data,
          };
        }
        return null;
      });

      const analyticsResults = await Promise.all(analyticsPromises);
      const questionAnalytics = analyticsResults.filter(
        (result) => result !== null
      );

      return { data: questionAnalytics, error: null };
    } catch (error) {
      console.error("McqService: Get all question analytics error:", error);
      return { data: null, error };
    }
  }
}
