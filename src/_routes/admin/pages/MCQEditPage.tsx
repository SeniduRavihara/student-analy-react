import { useToast } from "@/context/ToastContext";
import { db } from "@/firebase/config";
import { StorageService } from "@/firebase/services/StorageService";
import { MCQPack, MCQQuestion } from "@/types";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MCQPackInfo } from "../components/MCQPackInfo";
import { MCQQuestionDialog } from "../components/MCQQuestionDialog";
import { MCQQuestionsList } from "../components/MCQQuestionsList";

const MCQEditPage = () => {
  const { packId } = useParams<{ packId: string }>();
  const navigate = useNavigate();
  const { success: showSuccess, error: showError } = useToast();
  const [pack, setPack] = useState<MCQPack | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<MCQQuestion | null>(
    null
  );

  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;

  // Reset to first page when pack changes
  useEffect(() => {
    setCurrentPage(1);
  }, [pack?.id]);

  useEffect(() => {
    const fetchPack = async () => {
      try {
        const packDoc = await getDoc(doc(db, "mcqTests", packId!));
        if (packDoc.exists()) {
          const packData = {
            id: packDoc.id,
            ...packDoc.data(),
            createdAt: packDoc.data().createdAt?.toDate() || new Date(),
            updatedAt: packDoc.data().updatedAt?.toDate() || new Date(),
          } as MCQPack;

          // Fetch questions from sub-collection
          const questionsQuery = query(
            collection(db, "mcqTests", packId!, "questions"),
            orderBy("order", "asc")
          );
          const questionsSnapshot = await getDocs(questionsQuery);

          const questionsData = questionsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
          })) as MCQQuestion[];

          // Add questions to pack data
          packData.questions = questionsData;
          setPack(packData);

          console.log(packData);
        } else {
          showError("Error", "Pack not found");
          navigate("/admin/mcq");
        }
      } catch (error) {
        console.error("Error fetching pack:", error);
        showError("Error", "Failed to load pack");
      } finally {
        setLoading(false);
      }
    };

    if (packId) {
      fetchPack();
    }
  }, [packId, navigate, showError]);

  const handlePublishPack = async () => {
    if (!pack) return;

    try {
      const newStatus = pack.status === "published" ? "draft" : "published";
      await updateDoc(doc(db, "mcqTests", pack.id), {
        status: newStatus,
        updatedAt: new Date(),
      });

      setPack({ ...pack, status: newStatus });

      showSuccess(
        "Success",
        `MCQ pack ${
          newStatus === "published" ? "published" : "unpublished"
        } successfully!`
      );
    } catch (error) {
      console.error("Error updating pack status:", error);
      showError("Error", "Failed to update pack status. Please try again.");
    }
  };

  const handleSavePack = async () => {
    if (!pack) return;

    setSaving(true);
    try {
      // Calculate totals from questions
      const totalQuestions = pack.questions?.length || 0;
      const totalMarks =
        pack.questions?.reduce((sum, q) => sum + (q.marks || 1), 0) || 0;

      await updateDoc(doc(db, "mcqTests", pack.id), {
        title: pack.title,
        description: pack.description,
        examYears: pack.examYears,
        classTypes: pack.classTypes,
        timeLimit: pack.timeLimit,
        passingMarks: pack.passingMarks,
        totalQuestions,
        totalMarks,
        updatedAt: new Date(),
      });

      showSuccess("Success", "Pack saved successfully!");
    } catch (error) {
      console.error("Error saving pack:", error);
      showError("Error", "Failed to save pack");
    } finally {
      setSaving(false);
    }
  };

  const handleQuestionSaved = (savedQuestion: MCQQuestion) => {
    if (!pack) return;

    // Check if this is an update or new question
    const existingIndex =
      pack.questions?.findIndex((q) => q.id === savedQuestion.id) ?? -1;

    if (existingIndex >= 0) {
      // Update existing question
      const updatedQuestions = [...(pack.questions || [])];
      updatedQuestions[existingIndex] = savedQuestion;

      const updatedPack = {
        ...pack,
        questions: updatedQuestions,
        totalMarks: updatedQuestions.reduce((sum, q) => sum + q.marks, 0),
      };
      setPack(updatedPack);
    } else {
      // Add new question
      const updatedPack = {
        ...pack,
        questions: [...(pack.questions || []), savedQuestion],
        totalQuestions: (pack.totalQuestions || 0) + 1,
        totalMarks: (pack.totalMarks || 0) + savedQuestion.marks,
      };
      setPack(updatedPack);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!pack) return;

    try {
      // Delete question from sub-collection
      await deleteDoc(doc(db, "mcqTests", pack.id, "questions", questionId));

      // Delete associated storage files
      await StorageService.deleteQuestionImage(pack.id, questionId);

      const updatedQuestions = (pack.questions || []).filter(
        (q) => q.id !== questionId
      );
      setPack({
        ...pack,
        questions: updatedQuestions,
        totalQuestions: updatedQuestions.length,
        totalMarks: updatedQuestions.reduce(
          (sum, q) => sum + (q.marks || 1),
          0
        ),
      });

      showSuccess("Success", "Question deleted successfully!");
    } catch (error) {
      console.error("Error deleting question:", error);
      showError("Error", "Failed to delete question. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pack...</p>
        </div>
      </div>
    );
  }

  if (!pack) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Pack not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MCQPackInfo
        pack={pack}
        saving={saving}
        onPackUpdate={setPack}
        onPublishPack={handlePublishPack}
        onSavePack={handleSavePack}
        onBack={() => navigate("/admin/mcq")}
      />

      <MCQQuestionsList
        questions={pack.questions || []}
        loading={false}
        currentPage={currentPage}
        questionsPerPage={questionsPerPage}
        onPageChange={setCurrentPage}
        onAddQuestion={() => {
          setEditingQuestion(null);
          setIsQuestionDialogOpen(true);
        }}
        onEditQuestion={(question) => {
          setEditingQuestion(question);
          setIsQuestionDialogOpen(true);
        }}
        onDeleteQuestion={handleDeleteQuestion}
        onTestStorage={() => {}}
        totalMarks={pack.totalMarks || 0}
      />

      <MCQQuestionDialog
        open={isQuestionDialogOpen}
        pack={pack}
        editingQuestion={editingQuestion}
        onOpenChange={setIsQuestionDialogOpen}
        onQuestionSaved={handleQuestionSaved}
      />
    </div>
  );
};

export default MCQEditPage;
