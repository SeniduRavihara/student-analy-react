import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/firebase/config";
import { toast } from "@/hooks/use-toast";
import { useData } from "@/hooks/useData";
import { MCQPack, MCQQuestion, MCQResult } from "@/types";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Play,
  RotateCcw,
  Save,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const MCQTestPage = () => {
  const { packId } = useParams<{ packId: string }>();
  const navigate = useNavigate();
  const { currentUserData } = useData();

  const [pack, setPack] = useState<MCQPack | null>(null);
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: string }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (packId) {
      fetchMCQData();
    }
  }, [packId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (testStarted && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [testStarted, timeLeft]);

  const fetchMCQData = async () => {
    try {
      if (!currentUserData?.uid) {
        toast({
          title: "Error",
          description: "User not authenticated",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      // Check if user has already attempted this test
      const userResultRef = doc(
        db,
        "users",
        currentUserData.uid,
        "mcqTests",
        packId!
      );
      const userResultDoc = await getDoc(userResultRef);

      if (userResultDoc.exists()) {
        toast({
          title: "Test Already Completed",
          description:
            "You have already attempted this MCQ test. You can only take each test once.",
          variant: "destructive",
        });
        navigate("/dashboard/mcq");
        return;
      }

      // Fetch MCQ pack details
      const packDoc = await getDoc(doc(db, "mcqTests", packId!));
      if (packDoc.exists()) {
        const packData = {
          id: packDoc.id,
          ...packDoc.data(),
          createdAt: packDoc.data().createdAt?.toDate() || new Date(),
          updatedAt: packDoc.data().updatedAt?.toDate() || new Date(),
        } as MCQPack;
        setPack(packData);

        // Fetch questions
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
        setQuestions(questionsData);
      } else {
        toast({
          title: "Error",
          description: "MCQ test not found",
          variant: "destructive",
        });
        navigate("/dashboard/mcq");
      }
    } catch (error) {
      console.error("Error fetching MCQ data:", error);
      toast({
        title: "Error",
        description: "Failed to load MCQ test",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startTest = () => {
    if (!pack || !currentUserData) return;

    setTestStarted(true);
    setTimeLeft(pack.timeLimit * 60); // Convert minutes to seconds
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTestCompleted(false);
  };

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmitTest = async () => {
    if (!pack || !currentUserData || submitting) return;

    setSubmitting(true);
    try {
      // Calculate results
      const testAnswers = questions.map((question) => {
        const selectedOptionId = answers[question.id];
        const selectedOption = question.options.find(
          (opt) => opt.id === selectedOptionId
        );
        const isCorrect = selectedOption?.isCorrect || false;

        return {
          questionId: question.id,
          selectedOptionId: selectedOptionId || "",
          isCorrect,
          timeSpent: 0, // Could be enhanced to track per-question time
        };
      });

      const score = testAnswers.filter((answer) => answer.isCorrect).length;
      const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 1), 0);
      const percentage = (score / questions.length) * 100;
      const isPassed = percentage >= pack.passingMarks;
      const timeSpent = (pack.timeLimit * 60 - timeLeft) / 60; // Convert to minutes

      const result: Omit<MCQResult, "id"> = {
        packId: pack.id,
        packTitle: pack.title,
        answers: testAnswers,
        score,
        totalMarks,
        percentage,
        timeSpent,
        completedAt: new Date(),
        isPassed,
        examYear: pack.examYear,
        classType: pack.classType,
      };

      // Save result to user's sub-collection
      await setDoc(doc(db, "users", currentUserData.uid, "mcqTests", pack.id), {
        ...result,
        completedAt: serverTimestamp(),
      });

      // Analytics will be updated automatically by Cloud Function
      // when the result is saved to users/{uid}/mcqTests/{packId}

      setTestCompleted(true);
      setTestStarted(false);

      toast({
        title: "Test Completed!",
        description: `You scored ${percentage.toFixed(1)}% - ${
          isPassed ? "Passed" : "Failed"
        }`,
      });
    } catch (error) {
      console.error("Error submitting test:", error);
      toast({
        title: "Error",
        description: "Failed to submit test. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading MCQ test...</p>
        </div>
      </div>
    );
  }

  if (!pack || questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">MCQ test not found or has no questions</p>
        <Button onClick={() => navigate("/dashboard/mcq")} className="mt-4">
          Back to MCQ Tests
        </Button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (!testStarted && !testCompleted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-6">
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/dashboard/mcq")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to MCQ Tests
            </Button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {pack.title}
          </h1>
          <p className="text-gray-600">{pack.description}</p>
        </div>

        {/* Test Info */}
        <Card>
          <CardHeader>
            <CardTitle>Test Information</CardTitle>
            <CardDescription>
              Review the test details before starting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Play className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Questions:</span>
                <span>{questions.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <span className="font-medium">Time Limit:</span>
                <span>{pack.timeLimit} minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">Passing Marks:</span>
                <span>{pack.passingMarks}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Save className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Total Marks:</span>
                <span>{pack.totalMarks}</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Instructions:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  • Read each question carefully before selecting an answer
                </li>
                <li>
                  • You can navigate between questions using the navigation
                  buttons
                </li>
                <li>• The test will auto-submit when time runs out</li>
                <li>
                  • You can submit the test early if you finish before time
                </li>
                <li>• Once submitted, you cannot change your answers</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Start Button */}
        <div className="text-center">
          <Button
            onClick={startTest}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3"
          >
            <Play className="h-5 w-5 mr-2" />
            Start Test
          </Button>
        </div>
      </div>
    );
  }

  if (testCompleted) {
    const score = questions.filter(
      (q) =>
        answers[q.id] &&
        questions
          .find((q2) => q2.id === q.id)
          ?.options.find((opt) => opt.id === answers[q.id])?.isCorrect
    ).length;
    const percentage = (score / questions.length) * 100;
    const isPassed = percentage >= pack.passingMarks;

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Test Completed!
          </h1>
          <p className="text-gray-600">{pack.title}</p>
        </div>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isPassed ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600" />
              )}
              Test Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{score}</div>
                <div className="text-sm text-gray-600">Correct Answers</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {percentage.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div
                className={`text-2xl font-bold ${
                  isPassed ? "text-green-600" : "text-red-600"
                }`}
              >
                {isPassed ? "PASSED" : "FAILED"}
              </div>
              <div className="text-sm text-gray-600">
                Passing Marks: {pack.passingMarks}%
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate("/dashboard/mcq")} variant="outline">
            Back to MCQ Tests
          </Button>
          <Button
            onClick={() => {
              setTestCompleted(false);
              setTestStarted(false);
              setCurrentQuestionIndex(0);
              setAnswers({});
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Retake Test
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with Timer */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{pack.title}</h1>
            <p className="text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <span className="font-mono text-lg font-bold">
                {formatTime(timeLeft)}
              </span>
            </div>
            <Button
              onClick={handleSubmitTest}
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {submitting ? "Submitting..." : "Submit Test"}
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Question */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">
              Q{currentQuestionIndex + 1}
            </span>
            <span
              className={`text-sm font-medium px-2 py-1 rounded ${
                currentQuestion.difficulty === "easy"
                  ? "bg-green-100 text-green-800"
                  : currentQuestion.difficulty === "medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {currentQuestion.difficulty}
            </span>
            <span className="bg-gray-100 text-gray-800 text-sm font-medium px-2 py-1 rounded">
              {currentQuestion.marks} Marks
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Question Content */}
          {currentQuestion.questionContentType === "text" ? (
            <p className="text-lg font-medium">{currentQuestion.question}</p>
          ) : (
            <div className="space-y-2">
              {currentQuestion.questionImageUrl && (
                <img
                  src={currentQuestion.questionImageUrl}
                  alt="Question"
                  className="max-w-full h-auto max-h-96 border rounded-lg"
                />
              )}
            </div>
          )}

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <label
                key={option.id}
                className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                  answers[currentQuestion.id] === option.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={option.id}
                  checked={answers[currentQuestion.id] === option.id}
                  onChange={() =>
                    handleAnswerSelect(currentQuestion.id, option.id)
                  }
                  className="w-4 h-4 text-blue-600 mt-1"
                />
                <span className="font-medium mt-1">
                  {String.fromCharCode(65 + index)}.
                </span>
                <div className="flex-1">
                  {option.contentType === "text" ? (
                    <span>{option.text}</span>
                  ) : (
                    <div>
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
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          onClick={previousQuestion}
          disabled={currentQuestionIndex === 0}
          variant="outline"
        >
          Previous
        </Button>

        {/* Question Navigation */}
        <div className="flex gap-2">
          {questions.map((_, index) => (
            <Button
              key={index}
              onClick={() => goToQuestion(index)}
              variant={index === currentQuestionIndex ? "default" : "outline"}
              size="sm"
              className={`w-10 h-10 ${
                answers[questions[index].id]
                  ? "bg-green-100 text-green-800 border-green-300"
                  : ""
              }`}
            >
              {index + 1}
            </Button>
          ))}
        </div>

        <Button
          onClick={nextQuestion}
          disabled={currentQuestionIndex === questions.length - 1}
          variant="outline"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default MCQTestPage;
