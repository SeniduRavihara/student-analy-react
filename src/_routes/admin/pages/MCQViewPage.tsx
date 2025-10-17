import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/firebase/config";
import { MCQPack, MCQQuestion, MCQResult } from "@/types";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (packId) {
      fetchMCQData();
    }
  }, [packId]);

  const fetchMCQData = async () => {
    try {
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

        // Fetch all student results for this MCQ pack
        await fetchStudentResults(packId!);
      }
    } catch (error) {
      console.error("Error fetching MCQ data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentResults = async (packId: string) => {
    try {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const allResults: MCQResult[] = [];

      for (const userDoc of usersSnapshot.docs) {
        const mcqRef = doc(db, "users", userDoc.id, "mcqs", packId);
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

  // Calculate analytics data
  const analytics = {
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

  // Question analysis
  const questionAnalysis = questions.map((question) => {
    const correctAnswers = results.reduce((count, result) => {
      const answer = result.answers.find((a) => a.questionId === question.id);
      return count + (answer?.isCorrect ? 1 : 0);
    }, 0);

    return {
      questionId: question.id,
      question: question.question,
      difficulty: question.difficulty,
      correctAnswers,
      totalAttempts: results.length,
      accuracy:
        results.length > 0 ? (correctAnswers / results.length) * 100 : 0,
    };
  });

  // Score distribution data
  const scoreDistribution = [
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

  // Pass/Fail distribution
  const passFailData = [
    {
      name: "Passed",
      value: results.filter((r) => r.isPassed).length,
      color: "#10b981",
    },
    {
      name: "Failed",
      value: results.filter((r) => !r.isPassed).length,
      color: "#ef4444",
    },
  ];

  if (loading) {
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
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
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
            <div className="text-2xl font-bold">{analytics.totalAttempts}</div>
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
              {analytics.averageScore.toFixed(1)}%
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
              {analytics.passRate.toFixed(1)}%
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
              {analytics.averageTimeSpent.toFixed(1)}m
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

      {/* Question Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Question Analysis</CardTitle>
          <CardDescription>Performance breakdown by question</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {questionAnalysis.map((q, index) => (
              <div key={q.questionId} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                        Q{index + 1}
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          q.difficulty === "easy"
                            ? "bg-green-100 text-green-800"
                            : q.difficulty === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </div>
                    <p className="font-medium text-sm mb-2">{q.question}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {q.accuracy.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {q.correctAnswers}/{q.totalAttempts} correct
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      q.accuracy >= 80
                        ? "bg-green-500"
                        : q.accuracy >= 60
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${q.accuracy}%` }}
                  ></div>
                </div>
              </div>
            ))}
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
