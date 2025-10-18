import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/firebase/config";
import { McqService } from "@/firebase/services/McqService";
import { MCQPack, MCQPackAnalytics, MCQQuestion, MCQResult } from "@/types";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle,
  Clock,
  Target,
  Users,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const MCQViewPage = () => {
  const { packId } = useParams<{ packId: string }>();
  const navigate = useNavigate();
  const [pack, setPack] = useState<MCQPack | null>(null);
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [results, setResults] = useState<MCQResult[]>([]);
  const [analytics, setAnalytics] = useState<MCQPackAnalytics | null>(null);
  const [questionAnalytics, setQuestionAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (packId) {
      fetchMCQData();
    }
  }, [packId]);

  const fetchMCQData = async () => {
    console.log("MCQ View Page: Starting fetchMCQData for packId:", packId);
    try {
      // Fetch MCQ pack details
      console.log("MCQ View Page: Fetching pack details...");
      const packDoc = await getDoc(doc(db, "mcqTests", packId!));
      if (packDoc.exists()) {
        console.log("MCQ View Page: Pack found, processing...");
        const packData = {
          id: packDoc.id,
          ...packDoc.data(),
          createdAt: packDoc.data().createdAt?.toDate() || new Date(),
          updatedAt: packDoc.data().updatedAt?.toDate() || new Date(),
        } as MCQPack;
        setPack(packData);

        // Fetch questions
        console.log("MCQ View Page: Fetching questions...");
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
        console.log("MCQ View Page: Questions loaded:", questionsData.length);

        // Fetch analytics from the new structure
        console.log("Fetching pack analytics for packId:", packId);
        const analyticsResult = await McqService.getMCQPackAnalytics(packId!);
        console.log("Pack analytics result:", analyticsResult);
        if (analyticsResult.data) {
          setAnalytics(analyticsResult.data);
        } else {
          console.log("No analytics data found, will show empty state");
        }

        // Fetch detailed question analytics
        console.log("Fetching question analytics for packId:", packId);
        const questionAnalyticsResult =
          await McqService.getAllQuestionAnalytics(packId!);
        console.log("Question analytics result:", questionAnalyticsResult);
        if (questionAnalyticsResult.data) {
          setQuestionAnalytics(questionAnalyticsResult.data);
        }

        // Still fetch individual results for detailed view (optional)
        await fetchStudentResults(packId!);
      }
    } catch (error) {
      console.error("Error fetching MCQ data:", error);
    } finally {
      console.log("MCQ View Page: Setting loading to false");
      setLoading(false);
    }
  };

  const fetchStudentResults = async (packId: string) => {
    try {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const allResults: MCQResult[] = [];

      for (const userDoc of usersSnapshot.docs) {
        const mcqRef = doc(db, "users", userDoc.id, "mcqTests", packId);
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

      setResults(allResults);
    } catch (error) {
      console.error("Error fetching student results:", error);
    }
  };

  // Use analytics data from the new structure, fallback to calculated data
  const analyticsData = analytics || {
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
      results.length > 0 ? Math.max(...results.map((r) => r.percentage)) : 0,
    lowestScore:
      results.length > 0 ? Math.min(...results.map((r) => r.percentage)) : 0,
  };

  console.log("Debug - MCQ View Page Data:");
  console.log("- Pack:", pack);
  console.log("- Questions:", questions);
  console.log("- Results:", results);
  console.log("- Analytics:", analytics);
  console.log("- Question Analytics:", questionAnalytics);
  console.log("- Analytics Data:", analyticsData);

  // Debug question analytics structure
  if (questionAnalytics.length > 0) {
    console.log("First question analytics structure:", questionAnalytics[0]);
    console.log(
      "First question analytics.analytics:",
      questionAnalytics[0]?.analytics
    );
    console.log(
      "First question optionStats:",
      questionAnalytics[0]?.analytics?.optionStats
    );
    console.log(
      "First question timeStats:",
      questionAnalytics[0]?.analytics?.timeStats
    );
  }

  // Question analysis (use analytics data if available) - Not used in current UI
  // const questionAnalysis =
  //   analytics?.questionStats ||
  //   questions.map((question) => {
  //     const correctAnswers = results.reduce((count, result) => {
  //       const answer = result.answers.find((a) => a.questionId === question.id);
  //       return count + (answer?.isCorrect ? 1 : 0);
  //     }, 0);

  //     return {
  //       questionId: question.id,
  //       question: question.question,
  //       difficulty: question.difficulty,
  //       correctAnswers,
  //       totalAttempts: results.length,
  //       accuracy:
  //         results.length > 0 ? (correctAnswers / results.length) * 100 : 0,
  //     };
  //   });

  // Score distribution data (use analytics data if available)
  const scoreDistribution = analytics?.scoreDistribution || [
    {
      range: "0-20%",
      count: results.filter((r) => r.percentage >= 0 && r.percentage <= 20)
        .length,
    },
    {
      range: "21-40%",
      count: results.filter((r) => r.percentage >= 21 && r.percentage <= 40)
        .length,
    },
    {
      range: "41-60%",
      count: results.filter((r) => r.percentage >= 41 && r.percentage <= 60)
        .length,
    },
    {
      range: "61-80%",
      count: results.filter((r) => r.percentage >= 61 && r.percentage <= 80)
        .length,
    },
    {
      range: "81-100%",
      count: results.filter((r) => r.percentage >= 81 && r.percentage <= 100)
        .length,
    },
  ];

  // Pass/Fail distribution (use analytics data if available)
  const passFailData = [
    {
      name: "Passed",
      value:
        analytics?.passFailDistribution?.passed ||
        results.filter((r) => r.isPassed).length,
      color: "#10b981",
    },
    {
      name: "Failed",
      value:
        analytics?.passFailDistribution?.failed ||
        results.filter((r) => !r.isPassed).length,
      color: "#ef4444",
    },
  ];

  if (loading) {
    console.log("MCQ View Page: Still loading...");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading MCQ analytics...</p>
        </div>
      </div>
    );
  }

  if (!pack) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">MCQ pack not found</p>
        <Button onClick={() => navigate("/admin/mcq")} className="mt-4">
          Back to MCQ Packs
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/admin/mcq")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to MCQ Packs
              </Button>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {pack.title}
            </h1>
            <p className="text-gray-600">{pack.description}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/admin/mcq/${packId}/edit`)}
            >
              Edit Pack
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Attempts
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.totalAttempts}
            </div>
            <p className="text-xs text-muted-foreground">Students attempted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.averageScore.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Across all attempts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.passRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Students passed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.averageTimeSpent.toFixed(1)}m
            </div>
            <p className="text-xs text-muted-foreground">Time per attempt</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
            <CardDescription>Distribution of student scores</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pass/Fail Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Pass/Fail Distribution</CardTitle>
            <CardDescription>Overall pass and fail rates</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={passFailData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {passFailData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Individual Question Summary */}
      {questionAnalytics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Individual Question Summary</CardTitle>
            <CardDescription>
              Quick overview of each question's performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {questionAnalytics.map((qa, index) => (
                <div key={qa.questionId} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Q{index + 1}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        qa.analytics.accuracy >= 80
                          ? "bg-green-100 text-green-800"
                          : qa.analytics.accuracy >= 60
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {qa.analytics.accuracy.toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {qa.analytics.correctAnswers}/{qa.analytics.totalAttempts}{" "}
                    correct
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        qa.analytics.accuracy >= 80
                          ? "bg-green-500"
                          : qa.analytics.accuracy >= 60
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${qa.analytics.accuracy}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Question Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Question Analysis</CardTitle>
          <CardDescription>
            Individual question performance with option selection stats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {questionAnalytics.length > 0 ? (
              questionAnalytics.map((qa, index) => (
                <div key={qa.questionId} className="border rounded-lg p-6">
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">
                          Q{index + 1}
                        </span>
                        <span
                          className={`text-sm font-medium px-3 py-1 rounded ${
                            qa.difficulty === "easy"
                              ? "bg-green-100 text-green-800"
                              : qa.difficulty === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {qa.difficulty}
                        </span>
                      </div>
                      <p className="font-medium text-lg mb-3">
                        {qa.questionText}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {qa.analytics.accuracy.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-500">
                        {qa.analytics.correctAnswers}/
                        {qa.analytics.totalAttempts} correct
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {qa.analytics.incorrectAnswers} incorrect
                      </div>
                    </div>
                  </div>

                  {/* Performance Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        qa.analytics.accuracy >= 80
                          ? "bg-green-500"
                          : qa.analytics.accuracy >= 60
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${qa.analytics.accuracy}%` }}
                    ></div>
                  </div>

                  {/* Option Selection Stats */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm text-gray-700 mb-3">
                      Option Selection Statistics:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {qa.analytics.optionStats?.length > 0 ? (
                        qa.analytics.optionStats.map(
                          (option: any, optIndex: number) => (
                            <div
                              key={option.optionId}
                              className={`p-3 rounded-lg border-2 ${
                                option.isCorrect
                                  ? "border-green-200 bg-green-50"
                                  : "border-gray-200 bg-gray-50"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-sm">
                                  {String.fromCharCode(65 + optIndex)}.{" "}
                                  {option.optionText}
                                </span>
                                <span
                                  className={`text-xs px-2 py-1 rounded ${
                                    option.isCorrect
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {option.isCorrect ? "Correct" : "Incorrect"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{
                                      width: `${
                                        qa.analytics.totalAttempts > 0
                                          ? (option.selectedCount /
                                              qa.analytics.totalAttempts) *
                                            100
                                          : 0
                                      }%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium text-gray-600">
                                  {option.selectedCount} (
                                  {qa.analytics.totalAttempts > 0
                                    ? (
                                        (option.selectedCount /
                                          qa.analytics.totalAttempts) *
                                        100
                                      ).toFixed(1)
                                    : 0}
                                  %)
                                </span>
                              </div>
                            </div>
                          )
                        )
                      ) : (
                        <div className="col-span-2 text-center text-gray-500 py-4">
                          No option statistics available yet
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Time Statistics */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">Average Time</div>
                      <div className="font-semibold">
                        {qa.analytics.timeStats?.averageTime?.toFixed(1) || 0}s
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">Fastest</div>
                      <div className="font-semibold text-green-600">
                        {qa.analytics.timeStats?.fastestTime?.toFixed(1) || 0}s
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">Slowest</div>
                      <div className="font-semibold text-red-600">
                        {qa.analytics.timeStats?.slowestTime?.toFixed(1) || 0}s
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                No detailed question analytics available yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Student Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Results</CardTitle>
          <CardDescription>Individual student performance</CardDescription>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No students have attempted this MCQ pack yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Student</th>
                    <th className="text-left p-2">Score</th>
                    <th className="text-left p-2">Percentage</th>
                    <th className="text-left p-2">Time Spent</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result.id} className="border-b">
                      <td className="p-2 font-medium">{result.packTitle}</td>
                      <td className="p-2">
                        {result.score}/{result.totalMarks}
                      </td>
                      <td className="p-2">{result.percentage.toFixed(1)}%</td>
                      <td className="p-2">{result.timeSpent.toFixed(1)}m</td>
                      <td className="p-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            result.isPassed
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {result.isPassed ? (
                            <>
                              <CheckCircle className="h-3 w-3" /> Passed
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3" /> Failed
                            </>
                          )}
                        </span>
                      </td>
                      <td className="p-2 text-sm text-gray-500">
                        {result.completedAt.toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MCQViewPage;
