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
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/firebase/config";
import { toast } from "@/hooks/use-toast";
import { MCQOption, MCQQuestion, MCQTest } from "@/types";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Edit, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const MCQEditPage = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const [test, setTest] = useState<MCQTest | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<MCQQuestion | null>(
    null
  );

  // Question form state
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState<MCQOption[]>([
    { id: "1", text: "", isCorrect: false },
    { id: "2", text: "", isCorrect: false },
    { id: "3", text: "", isCorrect: false },
    { id: "4", text: "", isCorrect: false },
  ]);
  const [explanation, setExplanation] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium"
  );

  useEffect(() => {
    if (testId) {
      fetchTest();
    }
  }, [testId]);

  const fetchTest = async () => {
    try {
      const testDoc = await getDoc(doc(db, "mcqTests", testId!));
      if (testDoc.exists()) {
        const testData = {
          id: testDoc.id,
          ...testDoc.data(),
          createdAt: testDoc.data().createdAt?.toDate() || new Date(),
          updatedAt: testDoc.data().updatedAt?.toDate() || new Date(),
        } as MCQTest;
        setTest(testData);
      } else {
        toast({
          title: "Error",
          description: "Test not found",
          variant: "destructive",
        });
        navigate("/admin/mcq");
      }
    } catch (error) {
      console.error("Error fetching test:", error);
      toast({
        title: "Error",
        description: "Failed to load test",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTest = async () => {
    if (!test) return;

    setSaving(true);
    try {
      await updateDoc(doc(db, "mcqTests", test.id), {
        ...test,
        updatedAt: new Date(),
      });

      toast({
        title: "Success",
        description: "Test saved successfully!",
      });
    } catch (error) {
      console.error("Error saving test:", error);
      toast({
        title: "Error",
        description: "Failed to save test",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddQuestion = () => {
    if (!questionText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a question",
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

    const newQuestion: MCQQuestion = {
      id: Date.now().toString(),
      question: questionText,
      options: options.filter((opt) => opt.text.trim()),
      explanation,
      difficulty,
    };

    const updatedTest = {
      ...test!,
      questions: [...test!.questions, newQuestion],
      totalMarks: test!.questions.length + 1,
    };

    setTest(updatedTest);
    resetQuestionForm();
    setIsQuestionDialogOpen(false);

    toast({
      title: "Success",
      description: "Question added successfully!",
    });
  };

  const handleEditQuestion = (question: MCQQuestion) => {
    setEditingQuestion(question);
    setQuestionText(question.question);
    setOptions(question.options);
    setExplanation(question.explanation || "");
    setDifficulty(question.difficulty);
    setIsQuestionDialogOpen(true);
  };

  const handleUpdateQuestion = () => {
    if (!editingQuestion || !test) return;

    const updatedQuestions = test.questions.map((q) =>
      q.id === editingQuestion.id
        ? {
            ...q,
            question: questionText,
            options: options.filter((opt) => opt.text.trim()),
            explanation,
            difficulty,
          }
        : q
    );

    setTest({
      ...test,
      questions: updatedQuestions,
    });

    resetQuestionForm();
    setIsQuestionDialogOpen(false);
    setEditingQuestion(null);

    toast({
      title: "Success",
      description: "Question updated successfully!",
    });
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (!test) return;

    const updatedQuestions = test.questions.filter((q) => q.id !== questionId);
    setTest({
      ...test,
      questions: updatedQuestions,
      totalMarks: updatedQuestions.length,
    });

    toast({
      title: "Success",
      description: "Question deleted successfully!",
    });
  };

  const resetQuestionForm = () => {
    setQuestionText("");
    setOptions([
      { id: "1", text: "", isCorrect: false },
      { id: "2", text: "", isCorrect: false },
      { id: "3", text: "", isCorrect: false },
      { id: "4", text: "", isCorrect: false },
    ]);
    setExplanation("");
    setDifficulty("medium");
  };

  const handleOptionChange = (optionId: string, text: string) => {
    setOptions(
      options.map((opt) => (opt.id === optionId ? { ...opt, text } : opt))
    );
  };

  const handleCorrectAnswerChange = (optionId: string) => {
    setOptions(
      options.map((opt) =>
        opt.id === optionId ? { ...opt, isCorrect: !opt.isCorrect } : opt
      )
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading test...</p>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Test not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Edit MCQ Test
            </h1>
            <p className="text-gray-600">{test.title}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/admin/mcq")}>
              Back to Tests
            </Button>
            <Button
              onClick={handleSaveTest}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Test"}
            </Button>
          </div>
        </div>
      </div>

      {/* Test Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={test.title}
                onChange={(e) => setTest({ ...test, title: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={test.description}
                onChange={(e) =>
                  setTest({ ...test, description: e.target.value })
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
                  value={test.timeLimit}
                  onChange={(e) =>
                    setTest({ ...test, timeLimit: Number(e.target.value) })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Passing Marks (%)</Label>
                <Input
                  type="number"
                  value={test.passingMarks}
                  onChange={(e) =>
                    setTest({ ...test, passingMarks: Number(e.target.value) })
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
                <CardTitle>Questions ({test.questions.length})</CardTitle>
                <CardDescription>
                  Total Marks: {test.totalMarks}
                </CardDescription>
              </div>
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
            </div>
          </CardHeader>
          <CardContent>
            {test.questions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No questions added yet.</p>
                <p className="text-sm">Click "Add Question" to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {test.questions.map((question, index) => (
                  <Card
                    key={question.id}
                    className="border-l-4 border-l-blue-500"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                              Q{index + 1}
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
                          <p className="font-medium mb-2">
                            {question.question}
                          </p>
                          <div className="space-y-1">
                            {question.options.map((option, optIndex) => (
                              <div
                                key={option.id}
                                className="flex items-center gap-2"
                              >
                                <span className="text-sm text-gray-500 w-6">
                                  {String.fromCharCode(65 + optIndex)}.
                                </span>
                                <span
                                  className={`text-sm ${
                                    option.isCorrect
                                      ? "font-medium text-green-600"
                                      : ""
                                  }`}
                                >
                                  {option.text}
                                </span>
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
                            onClick={() => handleDeleteQuestion(question.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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

          <div className="space-y-4">
            <div>
              <Label>Question *</Label>
              <Textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Enter your question..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label>Difficulty</Label>
              <select
                value={difficulty}
                onChange={(e) =>
                  setDifficulty(e.target.value as "easy" | "medium" | "hard")
                }
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <Label>Options *</Label>
              <div className="space-y-2 mt-2">
                {options.map((option, index) => (
                  <div key={option.id} className="flex items-center gap-2">
                    <span className="text-sm font-medium w-6">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <Input
                      value={option.text}
                      onChange={(e) =>
                        handleOptionChange(option.id, e.target.value)
                      }
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      className="flex-1"
                    />
                    <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={option.isCorrect}
                        onChange={() => handleCorrectAnswerChange(option.id)}
                        className="rounded"
                      />
                      <span className="text-sm">Correct</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Explanation (Optional)</Label>
              <Textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Explain why this is the correct answer..."
                className="mt-1"
                rows={2}
              />
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
              className="bg-blue-600 hover:bg-blue-700"
            >
              {editingQuestion ? "Update Question" : "Add Question"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MCQEditPage;
