import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QuestionCardSkeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/firebase/config";
import { StorageTest } from "@/firebase/services/StorageTest";
import { toast } from "@/hooks/use-toast";
import { useData } from "@/hooks/useData";
import { MCQOption, MCQPack, MCQQuestion } from "@/types";
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
import {
  Edit,
  FileText,
  Globe,
  Image,
  Loader2,
  Lock,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const MCQEditPage = () => {
  const { packId } = useParams<{ packId: string }>();
  const navigate = useNavigate();
  const { currentUserData } = useData();
  const [pack, setPack] = useState<MCQPack | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addingQuestion, setAddingQuestion] = useState(false);
  const [updatingQuestion, setUpdatingQuestion] = useState(false);
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

  // Question form state
  const [questionText, setQuestionText] = useState("");
  const [questionImageUrl, setQuestionImageUrl] = useState("");
  const [questionImageBeforeUrl, setQuestionImageBeforeUrl] = useState("");
  const [questionImageAfterUrl, setQuestionImageAfterUrl] = useState("");
  const [questionContentType, setQuestionContentType] = useState<
    "text" | "image"
  >("text");
  const [options, setOptions] = useState<MCQOption[]>([
    { id: "1", text: "", isCorrect: false, contentType: "text" },
    { id: "2", text: "", isCorrect: false, contentType: "text" },
    { id: "3", text: "", isCorrect: false, contentType: "text" },
    { id: "4", text: "", isCorrect: false, contentType: "text" },
  ]);
  const [explanation, setExplanation] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium"
  );
  const [marks, setMarks] = useState(1);

  // Image upload functions using Firebase Storage
  const handleQuestionImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && pack) {
      try {
        // Check if user is authenticated
        if (!currentUserData?.uid) {
          toast({
            title: "Error",
            description: "You must be logged in to upload images",
            variant: "destructive",
          });
          return;
        }

        // TEMPORARY: Use base64 for testing
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          if (questionContentType === "image") {
            setQuestionImageUrl(imageUrl);
          }
          toast({
            title: "Success",
            description: "Question image uploaded successfully (base64)",
          });
        };
        reader.readAsDataURL(file);
        return;
      } catch (error) {
        console.error("Upload error:", error);
        toast({
          title: "Error",
          description:
            "Failed to upload image. Please check your internet connection and try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleQuestionImageBeforeUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && pack) {
      try {
        if (!currentUserData?.uid) {
          toast({
            title: "Error",
            description: "You must be logged in to upload images",
            variant: "destructive",
          });
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          setQuestionImageBeforeUrl(imageUrl);
          toast({
            title: "Success",
            description: "Image before question uploaded successfully",
          });
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Upload error:", error);
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive",
        });
      }
    }
  };

  const handleQuestionImageAfterUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && pack) {
      try {
        if (!currentUserData?.uid) {
          toast({
            title: "Error",
            description: "You must be logged in to upload images",
            variant: "destructive",
          });
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          setQuestionImageAfterUrl(imageUrl);
          toast({
            title: "Success",
            description: "Image after question uploaded successfully",
          });
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Upload error:", error);
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive",
        });
      }
    }
  };

  const handleOptionImageUpload = async (
    optionId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && pack) {
      try {
        // Check if user is authenticated
        if (!currentUserData?.uid) {
          toast({
            title: "Error",
            description: "You must be logged in to upload images",
            variant: "destructive",
          });
          return;
        }

        // TEMPORARY: Use base64 for testing
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          setOptions((prev) =>
            prev.map((option) =>
              option.id === optionId
                ? { ...option, imageUrl, contentType: "image" as const }
                : option
            )
          );
          toast({
            title: "Success",
            description: "Option image uploaded successfully (base64)",
          });
        };
        reader.readAsDataURL(file);
        return;
      } catch (error) {
        console.error("Upload error:", error);
        toast({
          title: "Error",
          description:
            "Failed to upload image. Please check your internet connection and try again.",
          variant: "destructive",
        });
      }
    }
  };

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

  const handleAddQuestion = async () => {
    if (questionContentType === "text" && !questionText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a question text",
        variant: "destructive",
      });
      return;
    }

    if (questionContentType === "image" && !questionImageUrl) {
      toast({
        title: "Error",
        description: "Please upload a question image",
        variant: "destructive",
      });
      return;
    }

    const hasCorrectAnswer = options.some((option) => option.isCorrect);
    if (!hasCorrectAnswer) {
      toast({
        title: "Error",
        description: "Please select at least one correct answer",
        variant: "destructive",
      });
      return;
    }

    if (!pack) {
      toast({
        title: "Error",
        description: "Pack not found",
        variant: "destructive",
      });
      return;
    }

    setAddingQuestion(true);
    try {
      // Clean options to remove undefined values and ensure valid structure
      const cleanOptions = options.map((option) => {
        // Ensure contentType is valid
        const validContentType = option.contentType || "text";

        // Build clean option object
        const cleanOption: Partial<MCQOption> = {
          id: option.id,
          isCorrect: Boolean(option.isCorrect),
          contentType: validContentType,
        };

        // Only add text or imageUrl if they have valid values and match contentType
        if (validContentType === "text" && option.text && option.text.trim()) {
          cleanOption.text = option.text.trim();
        } else if (validContentType === "image" && option.imageUrl && option.imageUrl.trim()) {
          cleanOption.imageUrl = option.imageUrl.trim();
        }

        return cleanOption as MCQOption;
      }).filter((option) => option.id); // Ensure option has an id

      // Deep clean function to remove undefined values
      const deepClean = (obj: unknown): Record<string, unknown> | undefined => {
        if (obj === null || obj === undefined) return undefined;
        if (typeof obj !== 'object') return obj as Record<string, unknown>;
        if (Array.isArray(obj)) {
          const cleanedArray = obj.map(deepClean).filter(item => item !== undefined);
          return cleanedArray.length > 0 ? cleanedArray : undefined;
        }
        const cleaned: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
          const cleanedValue = deepClean(value);
          if (cleanedValue !== undefined) {
            cleaned[key] = cleanedValue;
          }
        }
        return Object.keys(cleaned).length > 0 ? cleaned : undefined;
      };

      // Build question data object and clean it
      const rawQuestionData: Record<string, unknown> = {
        questionContentType,
        options: cleanOptions,
        explanation,
        difficulty,
        marks: 1,
        order: (pack?.questions?.length || 0) + 1,
        createdAt: new Date(),
      };

      // Set question content based on type
      if (questionContentType === "text" && questionText.trim()) {
        rawQuestionData.question = questionText.trim();
      } else if (questionContentType === "image" && questionImageUrl) {
        rawQuestionData.questionImageUrl = questionImageUrl;
      }

      // Always include before/after images if they exist
      if (questionImageBeforeUrl) {
        rawQuestionData.questionImageBeforeUrl = questionImageBeforeUrl;
      }
      if (questionImageAfterUrl) {
        rawQuestionData.questionImageAfterUrl = questionImageAfterUrl;
      }

      // Deep clean the data to remove all undefined values
      const newQuestionData = deepClean(rawQuestionData) as Partial<MCQQuestion>;

      console.log("Final cleaned question data for add:", newQuestionData);

      // Save question to sub-collection
      const docRef = await addDoc(
        collection(db, "mcqTests", pack.id, "questions"),
        newQuestionData
      );

      const newQuestion: MCQQuestion = {
        id: docRef.id,
        question: newQuestionData.question,
        questionImageBeforeUrl: newQuestionData.questionImageBeforeUrl,
        questionImageAfterUrl: newQuestionData.questionImageAfterUrl,
        questionContentType: newQuestionData.questionContentType || "text",
        options: newQuestionData.options || [],
        explanation: newQuestionData.explanation,
        difficulty: newQuestionData.difficulty || "medium",
        marks: newQuestionData.marks || 1,
        order: newQuestionData.order || 1,
        createdAt: newQuestionData.createdAt || new Date(),
      };

      // Update pack data
      const updatedPack = {
        ...pack,
        questions: [...(pack?.questions || []), newQuestion],
        totalQuestions: (pack?.totalQuestions || 0) + 1,
        totalMarks: (pack?.totalMarks || 0) + newQuestion.marks,
      };
      setPack(updatedPack);
      resetQuestionForm();
      setIsQuestionDialogOpen(false);

      toast({
        title: "Success",
        description: "Question added successfully!",
      });
    } catch (error) {
      console.error("Error adding question:", error);
      console.error("Error details:", error);
      toast({
        title: "Error",
        description: "Failed to add question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAddingQuestion(false);
    }
  };

  const handleEditQuestion = (question: MCQQuestion) => {
    console.log("Editing question:", question);
    console.log("Original options:", question.options);

    setEditingQuestion(question);
    setQuestionText(question.question || "");
    setQuestionImageUrl(question.questionImageUrl || "");
    setQuestionImageBeforeUrl(question.questionImageBeforeUrl || "");
    setQuestionImageAfterUrl(question.questionImageAfterUrl || "");
    setQuestionContentType(question.questionContentType || "text");

    // Ensure options have contentType field (for backward compatibility)
    const optionsWithContentType = question.options.map((option) => ({
      ...option,
      contentType: option.contentType || (option.imageUrl ? "image" : "text"),
    }));
    console.log("Options with contentType:", optionsWithContentType);
    setOptions(optionsWithContentType);

    setExplanation(question.explanation || "");
    setDifficulty(question.difficulty);
    setIsQuestionDialogOpen(true);
  };

  const handleUpdateQuestion = async () => {
    if (!editingQuestion || !pack) return;

    setUpdatingQuestion(true);
    try {
      console.log("Updating question with options:", options);

      // Clean options to remove undefined values and ensure valid structure
      const cleanOptions = options.map((option) => {
        // Ensure contentType is valid
        const validContentType = option.contentType || "text";

        // Build clean option object
        const cleanOption: Partial<MCQOption> = {
          id: option.id,
          isCorrect: Boolean(option.isCorrect),
          contentType: validContentType,
        };

        // Only add text or imageUrl if they have valid values and match contentType
        if (validContentType === "text" && option.text && option.text.trim()) {
          cleanOption.text = option.text.trim();
        } else if (validContentType === "image" && option.imageUrl && option.imageUrl.trim()) {
          cleanOption.imageUrl = option.imageUrl.trim();
        }

        return cleanOption as MCQOption;
      }).filter((option) => option.id); // Ensure option has an id

      console.log("Cleaned options:", cleanOptions);

      // Deep clean function to remove undefined values
      const deepClean = (obj: unknown): Record<string, unknown> | undefined => {
        if (obj === null || obj === undefined) return undefined;
        if (typeof obj !== 'object') return obj as Record<string, unknown>;
        if (Array.isArray(obj)) {
          const cleanedArray = obj.map(deepClean).filter(item => item !== undefined);
          return cleanedArray.length > 0 ? cleanedArray : undefined;
        }
        const cleaned: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
          const cleanedValue = deepClean(value);
          if (cleanedValue !== undefined) {
            cleaned[key] = cleanedValue;
          }
        }
        return Object.keys(cleaned).length > 0 ? cleaned : undefined;
      };

      // Build updated question data object and clean it
      const rawQuestionData: Record<string, unknown> = {
        questionContentType,
        options: cleanOptions,
        explanation,
        difficulty,
        marks: editingQuestion.marks,
        order: editingQuestion.order,
      };

      // Set question content based on type
      if (questionContentType === "text" && questionText.trim()) {
        rawQuestionData.question = questionText.trim();
      } else if (questionContentType === "image" && questionImageUrl) {
        rawQuestionData.questionImageUrl = questionImageUrl;
      }

      // Always include before/after images if they exist
      if (questionImageBeforeUrl) {
        rawQuestionData.questionImageBeforeUrl = questionImageBeforeUrl;
      }
      if (questionImageAfterUrl) {
        rawQuestionData.questionImageAfterUrl = questionImageAfterUrl;
      }

      // Deep clean the data to remove all undefined values
      const updatedQuestionData = deepClean(rawQuestionData);

      console.log("Final cleaned question data:", updatedQuestionData);

      // Update question in sub-collection
      await updateDoc(
        doc(db, "mcqTests", pack.id, "questions", editingQuestion.id),
        updatedQuestionData
      );

      const updatedQuestions = (pack.questions || []).map((q) =>
        q.id === editingQuestion.id
          ? {
              ...q,
              ...updatedQuestionData,
            }
          : q
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

      resetQuestionForm();
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
      // Delete question images from Firebase Storage (optional)
      // Since we're using base64 images now, storage deletion is not needed
      // try {
      //   await StorageService.deleteQuestionImage(pack.id, questionId);
      // } catch (storageError) {
      //   console.warn(
      //     "Failed to delete storage files (CORS issue in development):",
      //     storageError
      //   );
      //   // Continue with Firestore deletion even if storage deletion fails
      // }

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

  const handleOptionChange = (optionId: string, text: string) => {
    setOptions(
      options.map((opt) => (opt.id === optionId ? { ...opt, text } : opt))
    );
  };

  const handleOptionContentTypeChange = (
    optionId: string,
    contentType: "text" | "image"
  ) => {
    setOptions(
      options.map((opt) =>
        opt.id === optionId
          ? {
              ...opt,
              contentType,
              text: contentType === "text" ? opt.text : undefined,
              imageUrl: contentType === "image" ? opt.imageUrl : undefined,
            }
          : opt
      )
    );
  };

  const handleCorrectAnswerChange = (optionId: string) => {
    setOptions(
      options.map((opt) => ({
        ...opt,
        isCorrect: opt.id === optionId,
      }))
    );
  };

  // Test Firebase Storage connection
  const testStorageConnection = async () => {
    try {
      toast({
        title: "Testing Storage",
        description: "Testing Firebase Storage connection...",
      });

      const textTest = await StorageTest.testStorageConnection();
      const imageTest = await StorageTest.testImageUpload();

      if (textTest && imageTest) {
        toast({
          title: "Storage Test Passed",
          description: "Firebase Storage is working correctly!",
        });
      } else {
        toast({
          title: "Storage Test Failed",
          description:
            "Firebase Storage has issues. Check console for details.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Storage test error:", error);
      toast({
        title: "Storage Test Error",
        description:
          "Failed to test Firebase Storage. Check console for details.",
        variant: "destructive",
      });
    }
  };

  const resetQuestionForm = () => {
    setQuestionText("");
    setQuestionImageUrl("");
    setQuestionImageBeforeUrl("");
    setQuestionImageAfterUrl("");
    setQuestionContentType("text");
    setOptions([
      { id: "1", text: "", isCorrect: false, contentType: "text" },
      { id: "2", text: "", isCorrect: false, contentType: "text" },
      { id: "3", text: "", isCorrect: false, contentType: "text" },
      { id: "4", text: "", isCorrect: false, contentType: "text" },
    ]);
    setExplanation("");
    setDifficulty("medium");
    setMarks(1);
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
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Edit MCQ Pack
            </h1>
            <p className="text-gray-600">{pack.title}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/admin/mcq")}>
              Back to Packs
            </Button>
            <Button
              variant="outline"
              onClick={handlePublishPack}
              className={
                pack.status === "published"
                  ? "text-orange-600 hover:text-orange-700 border-orange-200"
                  : "text-green-600 hover:text-green-700 border-green-200"
              }
            >
              {pack.status === "published" ? (
                <Lock className="h-4 w-4 mr-2" />
              ) : (
                <Globe className="h-4 w-4 mr-2" />
              )}
              {pack.status === "published" ? "Unpublish" : "Publish"}
            </Button>
            <Button
              onClick={handleSavePack}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Pack"}
            </Button>
          </div>
        </div>
      </div>

      {/* Pack Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pack Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={pack.title}
                onChange={(e) => setPack({ ...pack, title: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={pack.description}
                onChange={(e) =>
                  setPack({ ...pack, description: e.target.value })
                }
                className="mt-1"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Time Limit (min)</Label>
                <Input
                  type="number"
                  value={pack.timeLimit}
                  onChange={(e) =>
                    setPack({ ...pack, timeLimit: Number(e.target.value) })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Passing Marks (%)</Label>
                <Input
                  type="number"
                  value={pack.passingMarks}
                  onChange={(e) =>
                    setPack({ ...pack, passingMarks: Number(e.target.value) })
                  }
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Questions ({pack.questions?.length || 0})</CardTitle>
                <CardDescription>
                  Total Marks: {pack.totalMarks}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    resetQuestionForm();
                    setEditingQuestion(null);
                    setIsQuestionDialogOpen(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
                <Button
                  onClick={testStorageConnection}
                  variant="outline"
                  className="text-orange-600 border-orange-600 hover:bg-orange-50"
                >
                  Test Storage
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <QuestionCardSkeleton key={i} />
                ))}
              </div>
            ) : (pack.questions?.length || 0) === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No questions added yet.</p>
                <p className="text-sm">Click "Add Question" to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Pagination logic */}
                {(() => {
                  const questions = pack.questions || [];
                  const totalQuestions = questions.length;
                  const totalPages = Math.ceil(
                    totalQuestions / questionsPerPage
                  );
                  const startIndex = (currentPage - 1) * questionsPerPage;
                  const endIndex = startIndex + questionsPerPage;
                  const currentQuestions = questions.slice(
                    startIndex,
                    endIndex
                  );

                  return (
                    <>
                      {currentQuestions.map((question, index) => (
                        <Card
                          key={question.id}
                          className="border-l-4 border-l-blue-500"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                                    Q{startIndex + index + 1}
                                  </span>
                                  <span
                                    className={`text-xs font-medium px-2 py-1 rounded ${
                                      question.difficulty === "easy"
                                        ? "bg-green-100 text-green-800"
                                        : question.difficulty === "medium"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {question.difficulty}
                                  </span>
                                </div>
                                <div className="font-medium mb-2">
                                  <div className="space-y-2">
                                    {question.questionImageBeforeUrl && (
                                      <img
                                        src={question.questionImageBeforeUrl}
                                        alt="Question diagram before"
                                        className="max-w-full h-auto max-h-32 object-contain rounded border"
                                      />
                                    )}
                                    {question.questionContentType === "text" &&
                                      question.question && (
                                        <p className="text-sm">
                                          {question.question}
                                        </p>
                                      )}
                                    {question.questionContentType === "image" &&
                                      question.questionImageUrl && (
                                        <img
                                          src={question.questionImageUrl}
                                          alt="Question"
                                          className="max-w-full h-auto max-h-32 object-contain rounded border"
                                        />
                                      )}
                                    {question.questionImageAfterUrl && (
                                      <img
                                        src={question.questionImageAfterUrl}
                                        alt="Question diagram after"
                                        className="max-w-full h-auto max-h-32 object-contain rounded border"
                                      />
                                    )}
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  {question.options.map((option, optIndex) => (
                                    <div
                                      key={option.id}
                                      className="flex items-center gap-2"
                                    >
                                      <span className="text-sm text-gray-500 w-6">
                                        {String.fromCharCode(65 + optIndex)}.
                                      </span>
                                      <div
                                        className={`text-sm ${
                                          option.isCorrect
                                            ? "font-medium text-green-600"
                                            : ""
                                        }`}
                                      >
                                        {option.contentType === "image" &&
                                        option.imageUrl ? (
                                          <img
                                            src={option.imageUrl}
                                            alt={`Option ${String.fromCharCode(
                                              65 + optIndex
                                            )}`}
                                            className="max-w-16 max-h-16 object-contain rounded border inline-block"
                                          />
                                        ) : (
                                          <span>{option.text}</span>
                                        )}
                                      </div>
                                      {option.isCorrect && (
                                        <span className="text-green-600 text-xs">
                                          ✓
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="flex gap-1 ml-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditQuestion(question)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteQuestion(question.id)
                                  }
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      {/* Pagination Controls */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="text-sm text-gray-600">
                            Showing {startIndex + 1} to{" "}
                            {Math.min(endIndex, totalQuestions)} of{" "}
                            {totalQuestions} questions
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(currentPage - 1)}
                              disabled={currentPage === 1}
                            >
                              Previous
                            </Button>

                            <div className="flex items-center space-x-1">
                              {Array.from(
                                { length: Math.min(5, totalPages) },
                                (_, i) => {
                                  const pageNumber =
                                    Math.max(
                                      1,
                                      Math.min(totalPages - 4, currentPage - 2)
                                    ) + i;
                                  if (pageNumber > totalPages) return null;

                                  return (
                                    <Button
                                      key={pageNumber}
                                      variant={
                                        pageNumber === currentPage
                                          ? "default"
                                          : "outline"
                                      }
                                      size="sm"
                                      onClick={() => setCurrentPage(pageNumber)}
                                      className={`w-8 h-8 p-0 ${
                                        pageNumber === currentPage
                                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                                          : "bg-white border-gray-300 hover:bg-gray-50"
                                      }`}
                                    >
                                      {pageNumber}
                                    </Button>
                                  );
                                }
                              )}
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(currentPage + 1)}
                              disabled={currentPage === totalPages}
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Question Dialog */}
      <Dialog
        open={isQuestionDialogOpen}
        onOpenChange={setIsQuestionDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingQuestion ? "Edit Question" : "Add New Question"}
            </DialogTitle>
            <DialogDescription>
              {editingQuestion
                ? "Update the question details"
                : "Create a new multiple choice question"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Question Content Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Question Content
                </h3>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>

              {/* Content Type Selection */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <Label className="text-sm font-medium text-gray-700">
                  Question Type *
                </Label>
                <div className="flex gap-6 mt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      value="text"
                      checked={questionContentType === "text"}
                      onChange={(e) =>
                        setQuestionContentType(
                          e.target.value as "text" | "image"
                        )
                      }
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="flex items-center gap-2">
                      <FileText size={18} className="text-gray-600" />
                      <span className="font-medium">Text Question</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      value="image"
                      checked={questionContentType === "image"}
                      onChange={(e) =>
                        setQuestionContentType(
                          e.target.value as "text" | "image"
                        )
                      }
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="flex items-center gap-2">
                      <Image size={18} className="text-gray-600" />
                      <span className="font-medium">Image Question</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Question Input Area */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-medium text-gray-700">
                    {questionContentType === "text"
                      ? "Question Text *"
                      : "Question Image *"}
                  </Label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById("before-image-input")?.click()
                      }
                      className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                      title="Add diagram before question"
                    >
                      <Plus size={14} />
                      Add Before Image
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById("after-image-input")?.click()
                      }
                      className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                      title="Add diagram after question"
                    >
                      <Plus size={14} />
                      Add After Image
                    </button>
                  </div>
                </div>

                {/* Before Image Display */}
                {questionImageBeforeUrl && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-800">
                        📷 Before Question
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuestionImageBeforeUrl("")}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Remove image"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <img
                      src={questionImageBeforeUrl}
                      alt="Before question"
                      className="max-w-full h-auto max-h-40 border border-blue-200 rounded"
                    />
                  </div>
                )}

                {/* Main Question Content */}
                {questionContentType === "text" ? (
                  <Textarea
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Enter your question here..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                  />
                ) : (
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleQuestionImageUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer"
                    />
                    {questionImageUrl && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-green-800">
                            🖼️ Main Question Image
                          </span>
                          <button
                            type="button"
                            onClick={() => setQuestionImageUrl("")}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Remove image"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <img
                          src={questionImageUrl}
                          alt="Question"
                          className="max-w-full h-auto max-h-48 border rounded"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* After Image Display */}
                {questionImageAfterUrl && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-800">
                        📷 After Question
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuestionImageAfterUrl("")}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Remove image"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <img
                      src={questionImageAfterUrl}
                      alt="After question"
                      className="max-w-full h-auto max-h-40 border border-blue-200 rounded"
                    />
                  </div>
                )}

                {/* Hidden file inputs */}
                <input
                  id="before-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleQuestionImageBeforeUpload}
                  className="hidden"
                />
                <input
                  id="after-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleQuestionImageAfterUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Answer Options Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Answer Options
                </h3>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>

              <div className="space-y-3">
                {options.map((option, index) => (
                  <div
                    key={option.id}
                    className="border border-gray-200 rounded-lg p-4 bg-white hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold text-sm">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="font-medium text-gray-900">
                          Option {String.fromCharCode(65 + index)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`option-type-${option.id}`}
                              value="text"
                              checked={option.contentType === "text"}
                              onChange={() =>
                                handleOptionContentTypeChange(option.id, "text")
                              }
                              className="w-4 h-4 text-blue-600"
                            />
                            <FileText size={16} className="text-gray-600" />
                            <span className="text-sm">Text</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`option-type-${option.id}`}
                              value="image"
                              checked={option.contentType === "image"}
                              onChange={() =>
                                handleOptionContentTypeChange(
                                  option.id,
                                  "image"
                                )
                              }
                              className="w-4 h-4 text-blue-600"
                            />
                            <Image size={16} className="text-gray-600" />
                            <span className="text-sm">Image</span>
                          </label>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer bg-green-50 px-3 py-1 rounded-md border border-green-200">
                          <input
                            type="checkbox"
                            checked={option.isCorrect}
                            onChange={() =>
                              handleCorrectAnswerChange(option.id)
                            }
                            className="w-4 h-4 text-green-600 rounded"
                          />
                          <span className="text-sm font-medium text-green-800">
                            Correct Answer
                          </span>
                        </label>
                      </div>
                    </div>

                    {option.contentType === "text" ? (
                      <Input
                        value={option.text || ""}
                        onChange={(e) =>
                          handleOptionChange(option.id, e.target.value)
                        }
                        placeholder={`Enter option ${String.fromCharCode(
                          65 + index
                        )} text...`}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="space-y-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleOptionImageUpload(option.id, e)
                          }
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer"
                        />
                        {option.imageUrl && (
                          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                            <img
                              src={option.imageUrl}
                              alt={`Option ${String.fromCharCode(
                                65 + index
                              )} preview`}
                              className="max-w-full h-auto max-h-32 border rounded"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Question Settings Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Question Settings
                </h3>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Difficulty Level
                  </Label>
                  <select
                    value={difficulty}
                    onChange={(e) =>
                      setDifficulty(
                        e.target.value as "easy" | "medium" | "hard"
                      )
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="easy">🟢 Easy</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="hard">🔴 Hard</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Marks
                  </Label>
                  <Input
                    type="number"
                    value={marks}
                    onChange={(e) => setMarks(Number(e.target.value))}
                    min="1"
                    max="10"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Explanation Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Explanation
                </h3>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <Label className="text-sm font-medium text-gray-700">
                  Answer Explanation (Optional)
                </Label>
                <Textarea
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Provide an explanation for the correct answer to help students understand..."
                  className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will be shown to students after they submit their answer.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsQuestionDialogOpen(false);
                setEditingQuestion(null);
                resetQuestionForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={
                editingQuestion ? handleUpdateQuestion : handleAddQuestion
              }
              disabled={addingQuestion || updatingQuestion}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addingQuestion ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : updatingQuestion ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>{editingQuestion ? "Update Question" : "Add Question"}</>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MCQEditPage;
