import { db } from "@/firebase/config";
import { toast } from "@/hooks/use-toast";
import { MCQPack, MCQQuestion, MCQQuestionInput } from "@/types";
import {
  addDoc,
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
  const [pack, setPack] = useState<MCQPack | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<MCQQuestion | null>(
    null
  );
  const [addingQuestion, setAddingQuestion] = useState(false);
  const [updatingQuestion, setUpdatingQuestion] = useState(false);
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
          toast({
            title: "Error",
            description: "Pack not found",
            variant: "destructive",
          });
          navigate("/admin/mcq");
        }
      } catch (error) {
        console.error("Error fetching pack:", error);
        toast({
          title: "Error",
          description: "Failed to load pack",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (packId) {
      fetchPack();
    }
  }, [packId, navigate]);

  const handlePublishPack = async () => {
    if (!pack) return;

    try {
      const newStatus = pack.status === "published" ? "draft" : "published";
      await updateDoc(doc(db, "mcqTests", pack.id), {
        status: newStatus,
        updatedAt: new Date(),
      });

      setPack({ ...pack, status: newStatus });

      toast({
        title: "Success",
        description: `MCQ pack ${
          newStatus === "published" ? "published" : "unpublished"
        } successfully!`,
      });
    } catch (error) {
      console.error("Error updating pack status:", error);
      toast({
        title: "Error",
        description: "Failed to update pack status. Please try again.",
        variant: "destructive",
      });
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
        examYear: pack.examYear,
        classType: pack.classType,
        timeLimit: pack.timeLimit,
        passingMarks: pack.passingMarks,
        totalQuestions,
        totalMarks,
        updatedAt: new Date(),
      });

      toast({
        title: "Success",
        description: "Pack saved successfully!",
      });
    } catch (error) {
      console.error("Error saving pack:", error);
      toast({
        title: "Error",
        description: "Failed to save pack",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleQuestionAdded = async (questionData: MCQQuestionInput) => {
    if (!pack) return;

    setAddingQuestion(true);
    try {
      // Validate
      if (
        questionData.questionContentType === "text" &&
        !questionData.questionText?.trim()
      ) {
        toast({
          title: "Error",
          description: "Please enter a question text",
          variant: "destructive",
        });
        return;
      }

      if (
        questionData.questionContentType === "image" &&
        !questionData.questionImageUrl
      ) {
        toast({
          title: "Error",
          description: "Please upload a question image",
          variant: "destructive",
        });
        return;
      }

      const hasCorrectAnswer = questionData.options.some(
        (option) => option.isCorrect
      );
      if (!hasCorrectAnswer) {
        toast({
          title: "Error",
          description: "Please select at least one correct answer",
          variant: "destructive",
        });
        return;
      }

      // Clean and prepare data
      const cleanOptions = questionData.options.map((option) => {
        const cleanOption: any = {
          id: option.id,
          isCorrect: Boolean(option.isCorrect),
          contentType: option.contentType || "text",
        };

        if (option.contentType === "text" && option.text?.trim()) {
          cleanOption.text = option.text.trim();
        } else if (option.contentType === "image" && option.imageUrl?.trim()) {
          cleanOption.imageUrl = option.imageUrl.trim();
        }

        return cleanOption;
      });

      const questionToSave: any = {
        questionContentType: questionData.questionContentType,
        options: cleanOptions,
        explanation: questionData.explanation || "",
        difficulty: questionData.difficulty,
        marks: questionData.marks || 1,
        order: (pack?.questions?.length || 0) + 1,
        createdAt: new Date(),
      };

      if (
        questionData.questionContentType === "text" &&
        questionData.questionText?.trim()
      ) {
        questionToSave.question = questionData.questionText.trim();
      } else if (
        questionData.questionContentType === "image" &&
        questionData.questionImageUrl
      ) {
        questionToSave.questionImageUrl = questionData.questionImageUrl;
      }

      if (questionData.questionImageBeforeUrl) {
        questionToSave.questionImageBeforeUrl =
          questionData.questionImageBeforeUrl;
      }
      if (questionData.questionImageAfterUrl) {
        questionToSave.questionImageAfterUrl =
          questionData.questionImageAfterUrl;
      }

      // Save to Firestore
      const docRef = await addDoc(
        collection(db, "mcqTests", pack.id, "questions"),
        questionToSave
      );

      const newQuestion: MCQQuestion = {
        id: docRef.id,
        ...questionToSave,
      };

      // Update local state
      const updatedPack = {
        ...pack,
        questions: [...(pack?.questions || []), newQuestion],
        totalQuestions: (pack?.totalQuestions || 0) + 1,
        totalMarks: (pack?.totalMarks || 0) + newQuestion.marks,
      };
      setPack(updatedPack);
      setIsQuestionDialogOpen(false);
      setEditingQuestion(null);

      toast({
        title: "Success",
        description: "Question added successfully!",
      });
    } catch (error) {
      console.error("Error adding question:", error);
      toast({
        title: "Error",
        description: "Failed to add question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAddingQuestion(false);
    }
  };

  const handleQuestionUpdated = async (questionData: MCQQuestionInput) => {
    if (!pack || !editingQuestion) return;

    setUpdatingQuestion(true);
    try {
      // Clean options
      const cleanOptions = questionData.options.map((option) => {
        const cleanOption: any = {
          id: option.id,
          isCorrect: Boolean(option.isCorrect),
          contentType: option.contentType || "text",
        };

        if (option.contentType === "text" && option.text?.trim()) {
          cleanOption.text = option.text.trim();
        } else if (option.contentType === "image" && option.imageUrl?.trim()) {
          cleanOption.imageUrl = option.imageUrl.trim();
        }

        return cleanOption;
      });

      const questionToUpdate: any = {
        questionContentType: questionData.questionContentType,
        options: cleanOptions,
        explanation: questionData.explanation || "",
        difficulty: questionData.difficulty,
        marks: questionData.marks || editingQuestion.marks,
        order: editingQuestion.order,
      };

      if (
        questionData.questionContentType === "text" &&
        questionData.questionText?.trim()
      ) {
        questionToUpdate.question = questionData.questionText.trim();
      } else if (
        questionData.questionContentType === "image" &&
        questionData.questionImageUrl
      ) {
        questionToUpdate.questionImageUrl = questionData.questionImageUrl;
      }

      if (questionData.questionImageBeforeUrl) {
        questionToUpdate.questionImageBeforeUrl =
          questionData.questionImageBeforeUrl;
      }
      if (questionData.questionImageAfterUrl) {
        questionToUpdate.questionImageAfterUrl =
          questionData.questionImageAfterUrl;
      }

      // Update in Firestore
      await updateDoc(
        doc(db, "mcqTests", pack.id, "questions", editingQuestion.id),
        questionToUpdate
      );

      const updatedQuestions = (pack.questions || []).map((q) =>
        q.id === editingQuestion.id ? { ...q, ...questionToUpdate } : q
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

      setIsQuestionDialogOpen(false);
      setEditingQuestion(null);

      toast({
        title: "Success",
        description: "Question updated successfully!",
      });
    } catch (error) {
      console.error("Error updating question:", error);
      toast({
        title: "Error",
        description: "Failed to update question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingQuestion(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!pack) return;

    try {
      // Delete question from sub-collection
      await deleteDoc(doc(db, "mcqTests", pack.id, "questions", questionId));

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

      toast({
        title: "Success",
        description: "Question deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting question:", error);
      toast({
        title: "Error",
        description: "Failed to delete question. Please try again.",
        variant: "destructive",
      });
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
        onQuestionAdded={handleQuestionAdded}
        onQuestionUpdated={handleQuestionUpdated}
        addingQuestion={addingQuestion}
        updatingQuestion={updatingQuestion}
      />
    </div>
  );
};

export default MCQEditPage;
