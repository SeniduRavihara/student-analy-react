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
import { toast } from "@/hooks/use-toast";
import { useData } from "@/hooks/useData";
import { MCQOption, MCQPack, MCQQuestion, MCQQuestionInput } from "@/types";
import { FileText, Image, Loader2, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

interface MCQQuestionDialogProps {
  open: boolean;
  pack: MCQPack | null;
  editingQuestion: MCQQuestion | null;
  onOpenChange: (open: boolean) => void;
  onQuestionAdded: (question: MCQQuestionInput) => void;
  onQuestionUpdated: (question: MCQQuestionInput) => void;
  addingQuestion?: boolean;
  updatingQuestion?: boolean;
}

export const MCQQuestionDialog = ({
  open,
  pack,
  editingQuestion,
  onOpenChange,
  onQuestionAdded,
  onQuestionUpdated,
  addingQuestion = false,
  updatingQuestion = false,
}: MCQQuestionDialogProps) => {
  const { currentUserData } = useData();

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
      setDifficulty(editingQuestion.difficulty);
      setMarks(editingQuestion.marks || 1);
    }
  }, [editingQuestion]);

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
    ]);
    setExplanation("");
    setDifficulty("medium");
    setMarks(1);
  };

  // Image upload handlers
  const handleQuestionImageUpload = async (
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
      } catch (error) {
        console.error("Upload error:", error);
        toast({
          title: "Error",
          description: "Failed to upload image.",
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
          setOptions((prev) =>
            prev.map((option) =>
              option.id === optionId
                ? {
                    ...option,
                    imageUrl: imageUrl,
                    contentType: "image" as const,
                  }
                : option
            )
          );
          toast({
            title: "Success",
            description: "Option image uploaded successfully!",
          });
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Upload error:", error);
        toast({
          title: "Error",
          description: "Failed to upload image.",
          variant: "destructive",
        });
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

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSubmit = () => {
    // Validation will be done in parent component
    // This just passes data back
    const questionData: MCQQuestionInput = {
      questionText,
      questionImageUrl,
      questionImageBeforeUrl,
      questionImageAfterUrl,
      questionContentType,
      options,
      explanation,
      difficulty,
      marks,
    };

    if (editingQuestion) {
      onQuestionUpdated({ ...editingQuestion, ...questionData });
    } else {
      onQuestionAdded(questionData);
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
                      Option {String.fromCharCode(65 + index)}
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
                          alt={`Option ${String.fromCharCode(65 + index)}`}
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
          <div className="space-y-4">
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
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
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
  );
};
