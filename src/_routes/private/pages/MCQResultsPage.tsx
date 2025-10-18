import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/firebase/config";
import { useData } from "@/hooks/useData";
import { MCQResult } from "@/types";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { ArrowLeft, CheckCircle, Eye, RotateCcw, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MCQResultsPage = () => {
  const { currentUserData } = useData();
  const navigate = useNavigate();
  const [results, setResults] = useState<MCQResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUserData) {
      fetchResults();
    }
  }, [currentUserData]);

  const fetchResults = async () => {
    if (!currentUserData) return;

    try {
      const resultsQuery = query(
        collection(db, "users", currentUserData.uid, "mcqTests"),
        orderBy("completedAt", "desc")
      );

      const querySnapshot = await getDocs(resultsQuery);
      const resultsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        completedAt: doc.data().completedAt?.toDate() || new Date(),
      })) as MCQResult[];

      setResults(resultsData);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRetakeTest = (packId: string) => {
    navigate(`/dashboard/mcq/${packId}/test`);
  };

  const handleViewDetails = (result: MCQResult) => {
    // TODO: Navigate to detailed result view
    console.log("View details for:", result);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
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
              My MCQ Results
            </h1>
            <p className="text-gray-600">
              View your performance in multiple choice question tests
            </p>
          </div>
        </div>
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No Results Yet</h3>
              <p className="text-gray-600 mb-4">
                You haven't taken any MCQ tests yet. Start taking tests to see
                your results here.
              </p>
              <Button
                onClick={() => navigate("/dashboard/mcq")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Browse MCQ Tests
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {results.map((result) => (
            <Card key={result.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {result.packTitle}
                    </CardTitle>
                    <CardDescription>
                      Completed on {result.completedAt.toLocaleDateString()} at{" "}
                      {result.completedAt.toLocaleTimeString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.isPassed ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600" />
                    )}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        result.isPassed
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {result.isPassed ? "PASSED" : "FAILED"}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {result.percentage.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Score</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {result.score}/{result.totalMarks}
                    </div>
                    <div className="text-sm text-gray-600">Marks</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {result.timeSpent.toFixed(1)}m
                    </div>
                    <div className="text-sm text-gray-600">Time Spent</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {result.answers.length}
                    </div>
                    <div className="text-sm text-gray-600">Questions</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(result)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRetakeTest(result.packId)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Retake Test
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
            <CardDescription>Your overall MCQ test performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {results.length}
                </div>
                <div className="text-sm text-gray-600">Tests Taken</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {results.filter((r) => r.isPassed).length}
                </div>
                <div className="text-sm text-gray-600">Tests Passed</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {results.length > 0
                    ? (
                        results.reduce((sum, r) => sum + r.percentage, 0) /
                        results.length
                      ).toFixed(1)
                    : 0}
                  %
                </div>
                <div className="text-sm text-gray-600">Average Score</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {results.length > 0
                    ? (
                        results.reduce((sum, r) => sum + r.timeSpent, 0) /
                        results.length
                      ).toFixed(1)
                    : 0}
                  m
                </div>
                <div className="text-sm text-gray-600">Avg Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MCQResultsPage;
