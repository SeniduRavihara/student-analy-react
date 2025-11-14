import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QuestionCardSkeleton } from "@/components/ui/skeleton";
import { MCQQuestion } from "@/types";
import { Edit, Plus, Trash2 } from "lucide-react";
import { toRomanNumeral } from "@/lib/utils";

interface MCQQuestionsListProps {
  questions: MCQQuestion[];
  loading: boolean;
  currentPage: number;
  questionsPerPage: number;
  onPageChange: (page: number) => void;
  onAddQuestion: () => void;
  onEditQuestion: (question: MCQQuestion) => void;
  onDeleteQuestion: (questionId: string) => void;
  onTestStorage: () => void;
  totalMarks: number;
}

export const MCQQuestionsList = ({
  questions,
  loading,
  currentPage,
  questionsPerPage,
  onPageChange,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
  onTestStorage,
  totalMarks,
}: MCQQuestionsListProps) => {
  const totalQuestions = questions.length;
  const totalPages = Math.ceil(totalQuestions / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = questions.slice(startIndex, endIndex);

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Questions ({totalQuestions})</CardTitle>
            <CardDescription>Total Marks: {totalMarks}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={onAddQuestion}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
            <Button
              onClick={onTestStorage}
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
        ) : totalQuestions === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No questions added yet.</p>
            <p className="text-sm">Click "Add Question" to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentQuestions.map((question, index) => (
              <Card key={question.id} className="border-l-4 border-l-blue-500">
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
                              <p className="text-sm">{question.question}</p>
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
                              {toRomanNumeral(optIndex + 1)}.
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
                              <span className="text-green-600 text-xs">✓</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-1 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditQuestion(question)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteQuestion(question.id)}
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
                  {Math.min(endIndex, totalQuestions)} of {totalQuestions}{" "}
                  questions
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNumber =
                        Math.max(1, Math.min(totalPages - 4, currentPage - 2)) +
                        i;
                      if (pageNumber > totalPages) return null;

                      return (
                        <Button
                          key={pageNumber}
                          variant={
                            pageNumber === currentPage ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => onPageChange(pageNumber)}
                          className={`w-8 h-8 p-0 ${
                            pageNumber === currentPage
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "bg-white border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
