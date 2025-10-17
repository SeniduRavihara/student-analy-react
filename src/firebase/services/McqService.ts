import { MCQPack, MCQQuestion, MCQResult } from "@/types";
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
      const resultRef = doc(db, "users", studentId, "mcqs", packId);
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
        doc(db, "users", studentId, "mcqs", packId)
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
        collection(db, "users", studentId, "mcqs"),
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
        const mcqRef = doc(db, "users", userDoc.id, "mcqs", packId);
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
        doc(db, "users", studentId, "mcqs", packId)
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
}
