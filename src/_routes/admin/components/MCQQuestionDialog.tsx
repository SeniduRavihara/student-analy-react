import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/context/ToastContext";
import { db } from "@/firebase/config";
import { StorageService } from "@/firebase/services/StorageService";
import { toRomanNumeral } from "@/lib/utils";
import { MCQOption, MCQPack, MCQQuestion } from "@/types";
import {
  addDoc,
  collection,
  doc,
  DocumentReference,
  updateDoc,
} from "firebase/firestore";
import { FileText, Image, Loader2, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

interface MCQQuestionDialogProps {
  open: boolean;
  pack: MCQPack | null;
  editingQuestion: MCQQuestion | null;
  onOpenChange: (open: boolean) => void;
  onQuestionSaved: (question: MCQQuestion) => void; // Changed from onQuestionAdded/onQuestionUpdated
}

export const MCQQuestionDialog = ({
  open,
  pack,
  editingQuestion,
  onOpenChange,
  onQuestionSaved,
}: MCQQuestionDialogProps) => {
  const { success: showSuccess, error: showError } = useToast();
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
    { id: "5", text: "", isCorrect: false, contentType: "text" },
  ]);
  const [explanation, setExplanation] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium"
  );
  const [marks, setMarks] = useState(1);

  // Loading state for save operation
  const [isSaving, setIsSaving] = useState(false);

  // File objects for upload (stored temporarily)
  const [questionImageFile, setQuestionImageFile] = useState<File | null>(null);
  const [questionImageBeforeFile, setQuestionImageBeforeFile] =
    useState<File | null>(null);
  const [questionImageAfterFile, setQuestionImageAfterFile] =
    useState<File | null>(null);
  const [optionImageFiles, setOptionImageFiles] = useState<
    Record<string, File>
  >({});

  // Explanation state
  const [explanationContentType, setExplanationContentType] = useState<
    "text" | "image"
  >("text");
  const [explanationImageFile, setExplanationImageFile] = useState<File | null>(
    null
  );
  const [explanationImageUrl, setExplanationImageUrl] = useState("");

  // Load editing question data
  useEffect(() => {
    if (editingQuestion) {
      setQuestionText(editingQuestion.question || "");
      setQuestionImageUrl(editingQuestion.questionImageUrl || "");
      setQuestionImageBeforeUrl(editingQuestion.questionImageBeforeUrl || "");
      setQuestionImageAfterUrl(editingQuestion.questionImageAfterUrl || "");
      setQuestionContentType(editingQuestion.questionContentType || "text");

      const optionsWithContentType = editingQuestion.options.map((option) => ({
        ...option,
        contentType: option.contentType || (option.imageUrl ? "image" : "text"),
      }));
      setOptions(optionsWithContentType);

      setExplanation(editingQuestion.explanation || "");
      setExplanationImageUrl(editingQuestion.explanationImageUrl || "");
      setExplanationContentType(
        editingQuestion.explanationContentType ||
          (editingQuestion.explanationImageUrl ? "image" : "text")
      );
      setDifficulty(editingQuestion.difficulty);
      setMarks(editingQuestion.marks || 1);
    } else if (open) {
      // Reset form when opening dialog for new question
      resetForm();
    }
  }, [editingQuestion, open]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      // Revoke object URLs to prevent memory leaks
      if (questionImageUrl && questionImageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(questionImageUrl);
      }
      if (
        questionImageBeforeUrl &&
        questionImageBeforeUrl.startsWith("blob:")
      ) {
        URL.revokeObjectURL(questionImageBeforeUrl);
      }
      if (questionImageAfterUrl && questionImageAfterUrl.startsWith("blob:")) {
        URL.revokeObjectURL(questionImageAfterUrl);
      }
      options.forEach((option) => {
        if (option.imageUrl && option.imageUrl.startsWith("blob:")) {
          URL.revokeObjectURL(option.imageUrl);
        }
      });
    };
  }, [
    questionImageUrl,
    questionImageBeforeUrl,
    questionImageAfterUrl,
    options,
  ]);

  // Reset form
  const resetForm = () => {
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
      { id: "5", text: "", isCorrect: false, contentType: "text" },
    ]);
    setExplanation("");
    setExplanationContentType("text");
    setExplanationImageUrl("");
    setDifficulty("medium");
    setMarks(1);
    // Reset file objects
    setQuestionImageFile(null);
    setQuestionImageBeforeFile(null);
    setQuestionImageAfterFile(null);
    setOptionImageFiles({});
    setExplanationImageFile(null);
  };

  // Image upload handlers (create local previews)
  const handleQuestionImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && pack) {
      try {
        // Create local preview URL
        const localUrl = URL.createObjectURL(file);
        setQuestionImageUrl(localUrl);
        setQuestionImageFile(file); // Store file for later upload

        showSuccess("Success", "Question image selected successfully");
      } catch (error) {
        console.error("Preview error:", error);
        showError("Error", "Failed to create image preview.");
      }
    }
  };

  const handleQuestionImageBeforeUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && pack) {
      try {
        // Create local preview URL
        const localUrl = URL.createObjectURL(file);
        setQuestionImageBeforeUrl(localUrl);
        setQuestionImageBeforeFile(file); // Store file for later upload

        showSuccess("Success", "Image before question selected successfully");
      } catch (error) {
        console.error("Preview error:", error);
        showError("Error", "Failed to create image preview");
      }
    }
  };

  const handleQuestionImageAfterUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && pack) {
      try {
        // Create local preview URL
        const localUrl = URL.createObjectURL(file);
        setQuestionImageAfterUrl(localUrl);
        setQuestionImageAfterFile(file); // Store file for later upload

        showSuccess("Success", "Image after question selected successfully");
      } catch (error) {
        console.error("Preview error:", error);
        showError("Error", "Failed to create image preview");
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
        // Create local preview URL
        const localUrl = URL.createObjectURL(file);
        setOptions((prev) =>
          prev.map((option) =>
            option.id === optionId
              ? {
                  ...option,
                  imageUrl: localUrl,
                  contentType: "image" as const,
                }
              : option
          )
        );
        // Store file for later upload
        setOptionImageFiles((prev) => ({ ...prev, [optionId]: file }));

        showSuccess("Success", "Option image selected successfully!");
      } catch (error) {
        console.error("Preview error:", error);
        showError("Error", "Failed to create image preview.");
      }
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
      options.map((opt) => {
        if (opt.id === optionId) {
          const updatedOption: MCQOption = {
            ...opt,
            contentType,
          };

          // Handle text field
          if (contentType === "text") {
            updatedOption.text = opt.text || "";
            delete updatedOption.imageUrl; // Remove imageUrl for text options
          } else {
            // contentType === "image"
            updatedOption.imageUrl = opt.imageUrl || "";
            delete updatedOption.text; // Remove text for image options
          }

          return updatedOption;
        }
        return opt;
      })
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

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    if (!pack) return;

    setIsSaving(true);
    try {
      let questionId: string;
      let docRef: DocumentReference;

      // Step 1: Create or get document reference
      if (editingQuestion) {
        // For updating existing question
        questionId = editingQuestion.id;
        docRef = doc(db, "mcqTests", pack.id, "questions", questionId);
      } else {
        // For new question: Create document first to get real ID
        const questionDataWithoutImages = {
          question: questionText || "",
          questionImageUrl: "",
          questionImageBeforeUrl: "",
          questionImageAfterUrl: "",
          questionContentType,
          options: options.map((opt) => {
            const optionData: MCQOption = {
              ...opt,
            };
            // Handle text field for text options
            if (opt.contentType === "text") {
              optionData.text = opt.text || "";
              delete optionData.imageUrl; // Ensure imageUrl is not present for text options
            } else {
              // Handle imageUrl for image options
              if (opt.imageUrl && !opt.imageUrl.startsWith("blob:")) {
                optionData.imageUrl = opt.imageUrl;
              } else {
                delete optionData.imageUrl; // Remove if undefined or blob URL
              }
              delete optionData.text; // Ensure text is not present for image options
            }
            return optionData;
          }),
          explanation: explanation || "",
          explanationImageUrl: "",
          explanationContentType,
          difficulty,
          marks,
          order: 0, // Default order, can be updated later
          createdAt: new Date(),
        };

        docRef = await addDoc(
          collection(db, "mcqTests", pack.id, "questions"),
          questionDataWithoutImages
        );
        questionId = docRef.id;
      }

      // Step 2: Upload all images to Firebase Storage using real questionId
      let finalQuestionImageUrl = questionImageUrl;
      let finalQuestionImageBeforeUrl = questionImageBeforeUrl;
      let finalQuestionImageAfterUrl = questionImageAfterUrl;
      const finalOptions = [...options];

      // Upload question image if file exists
      if (questionImageFile) {
        finalQuestionImageUrl = await StorageService.uploadQuestionImage(
          questionImageFile,
          pack.id,
          questionId
        );
      }

      // Upload before image if file exists
      if (questionImageBeforeFile) {
        finalQuestionImageBeforeUrl =
          await StorageService.uploadBeforeQuestionImage(
            questionImageBeforeFile,
            pack.id,
            questionId
          );
      }

      // Upload after image if file exists
      if (questionImageAfterFile) {
        finalQuestionImageAfterUrl =
          await StorageService.uploadAfterQuestionImage(
            questionImageAfterFile,
            pack.id,
            questionId
          );
      }

      // Upload option images
      for (const [optionId, file] of Object.entries(optionImageFiles)) {
        const optionLetter = toRomanNumeral(parseInt(optionId)); // 1 -> I, 2 -> II, etc.
        const imageUrl = await StorageService.uploadOptionImage(
          file,
          pack.id,
          questionId,
          optionLetter
        );

        // Update the option with the Firebase URL
        const optionIndex = finalOptions.findIndex(
          (opt) => opt.id === optionId
        );
        if (optionIndex !== -1) {
          finalOptions[optionIndex] = {
            ...finalOptions[optionIndex],
            imageUrl,
          };
        }
      }

      // Upload explanation image if file exists
      let finalExplanationImageUrl = explanationImageUrl;
      if (explanationImageFile) {
        finalExplanationImageUrl = await StorageService.uploadExplanationImage(
          explanationImageFile,
          pack.id,
          questionId
        );
      }

      // Step 3: Update document with final image URLs
      const updateData = {
        question: questionText,
        questionContentType,
        questionImageUrl: finalQuestionImageUrl,
        questionImageBeforeUrl: finalQuestionImageBeforeUrl,
        questionImageAfterUrl: finalQuestionImageAfterUrl,
        options: finalOptions,
        explanation: explanationContentType === "text" ? explanation : "",
        explanationImageUrl:
          explanationContentType === "image" ? finalExplanationImageUrl : "",
        explanationContentType,
        ...(editingQuestion ? { updatedAt: new Date() } : {}),
      };

      await updateDoc(docRef, updateData);

      // Step 4: Create complete question object for parent callback
      const completeQuestion: MCQQuestion = {
        id: questionId,
        question: questionText, // Use questionText from state
        questionImageUrl: finalQuestionImageUrl,
        questionImageBeforeUrl: finalQuestionImageBeforeUrl,
        questionImageAfterUrl: finalQuestionImageAfterUrl,
        questionContentType,
        options: finalOptions,
        explanation: explanationContentType === "text" ? explanation : "",
        explanationImageUrl:
          explanationContentType === "image" ? finalExplanationImageUrl : "",
        explanationContentType,
        difficulty,
        marks,
        order: editingQuestion?.order || 0,
        createdAt: editingQuestion?.createdAt || new Date(),
        ...(editingQuestion ? { updatedAt: new Date() } : {}),
      };

      // Step 5: Notify parent and close dialog
      onQuestionSaved(completeQuestion);
      onOpenChange(false);
      resetForm();

      showSuccess(
        "Success",
        editingQuestion
          ? "Question updated successfully!"
          : "Question created successfully with images uploaded!"
      );
    } catch (error) {
      console.error("Error saving question:", error);
      showError("Error", "Failed to save question. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                      setQuestionContentType(e.target.value as "text" | "image")
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
                      setQuestionContentType(e.target.value as "text" | "image")
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
                    <span className="font-medium text-gray-700">
                      Option {toRomanNumeral(index + 1)}
                    </span>
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
                              handleOptionContentTypeChange(option.id, "image")
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
                          onChange={() => handleCorrectAnswerChange(option.id)}
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
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleOptionImageUpload(option.id, e)}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer"
                      />
                      {option.imageUrl && (
                        <img
                          src={option.imageUrl}
                          alt={`Option ${toRomanNumeral(index + 1)}`}
                          className="max-w-full h-auto max-h-32 border rounded"
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Question Settings Section */}
          {/* <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Question Settings
              </h3>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <Label className="text-sm font-medium text-gray-700">
                  Difficulty Level *
                </Label>
                <div className="flex gap-2 mt-2">
                  {["easy", "medium", "hard"].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() =>
                        setDifficulty(level as "easy" | "medium" | "hard")
                      }
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        difficulty === level
                          ? level === "easy"
                            ? "bg-green-600 text-white"
                            : level === "medium"
                            ? "bg-yellow-600 text-white"
                            : "bg-red-600 text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <Label className="text-sm font-medium text-gray-700">
                  Marks *
                </Label>
                <Input
                  type="number"
                  value={marks}
                  onChange={(e) => setMarks(Number(e.target.value))}
                  min={1}
                  className="mt-2"
                />
              </div>
            </div>
          </div> */}

          {/* Explanation Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Explanation
              </h3>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Explanation Type
                </Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="explanation-type"
                      value="text"
                      checked={explanationContentType === "text"}
                      onChange={(e) =>
                        setExplanationContentType(
                          e.target.value as "text" | "image"
                        )
                      }
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm">Text</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="explanation-type"
                      value="image"
                      checked={explanationContentType === "image"}
                      onChange={(e) =>
                        setExplanationContentType(
                          e.target.value as "text" | "image"
                        )
                      }
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm">Image</span>
                  </label>
                </div>
              </div>

              {explanationContentType === "text" ? (
                <div>
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
                    This will be shown to students after they submit their
                    answer.
                  </p>
                </div>
              ) : (
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Explanation Image (Optional)
                  </Label>
                  <div className="mt-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setExplanationImageFile(file);
                          setExplanationImageUrl(URL.createObjectURL(file));
                        }
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {explanationImageUrl && (
                      <div className="mt-2">
                        <img
                          src={explanationImageUrl}
                          alt="Explanation preview"
                          className="max-w-full h-auto max-h-32 border rounded"
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Upload an image that explains the correct answer. This will
                    be shown to students after they submit their answer.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>{editingQuestion ? "Update Question" : "Add Question"}</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
