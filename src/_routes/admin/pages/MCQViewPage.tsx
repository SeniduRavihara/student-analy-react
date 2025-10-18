import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartSkeleton, StatsCardSkeleton } from "@/components/ui/skeleton";
import { db } from "@/firebase/config";
import { McqService } from "@/firebase/services/McqService";
import { MCQPack, MCQPackAnalytics, MCQQuestion } from "@/types";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { ArrowLeft, BarChart3, Clock, Target, Users } from "lucide-react";
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
      // Fetch all data in parallel for better performance
      const [
        packDoc,
        questionsSnapshot,
        analyticsResult,
        questionAnalyticsResult,
      ] = await Promise.all([
        // Fetch MCQ pack details
        getDoc(doc(db, "mcqTests", packId!)),

        // Fetch questions
        getDocs(
          query(
            collection(db, "mcqTests", packId!, "questions"),
            orderBy("order", "asc")
          )
        ),

        // Fetch analytics from the new structure
        McqService.getMCQPackAnalytics(packId!),

        // Fetch detailed question analytics
        McqService.getAllQuestionAnalytics(packId!),
      ]);

      if (packDoc.exists()) {
        console.log("MCQ View Page: Pack found, processing...");
        const packData = {
          id: packDoc.id,
          ...packDoc.data(),
          createdAt: packDoc.data().createdAt?.toDate() || new Date(),
          updatedAt: packDoc.data().updatedAt?.toDate() || new Date(),
        } as MCQPack;
        setPack(packData);

        // Process questions
        const questionsData = questionsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as MCQQuestion[];
        setQuestions(questionsData);
        console.log("MCQ View Page: Questions loaded:", questionsData.length);

        // Process analytics
        console.log("Pack analytics result:", analyticsResult);
        if (analyticsResult.data) {
          setAnalytics(analyticsResult.data);
        } else {
          console.log("No analytics data found, will show empty state");
        }

        // Process question analytics
        console.log("Question analytics result:", questionAnalyticsResult);
        if (questionAnalyticsResult.data) {
          setQuestionAnalytics(questionAnalyticsResult.data);
        }

        // Note: Removed fetchStudentResults as it's very slow and not essential for analytics view
        // Individual results can be fetched on-demand if needed
      }
    } catch (error) {
      console.error("Error fetching MCQ data:", error);
    } finally {
      console.log("MCQ View Page: Setting loading to false");
      setLoading(false);
    }
  };

  // Use analytics data from the new structure
  const analyticsData = analytics || {
    totalAttempts: 0,
    averageScore: 0,
    passRate: 0,
    averageTimeSpent: 0,
    highestScore: 0,
    lowestScore: 0,
    scoreDistribution: {
      "0-20": 0,
      "21-40": 0,
      "41-60": 0,
      "61-80": 0,
      "81-100": 0,
    },
    passFailDistribution: {
      pass: 0,
      fail: 0,
    },
    questionStats: [],
  };

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
  const scoreDistribution = analytics?.scoreDistribution
    ? analytics.scoreDistribution // Cloud Function already saves it in the correct format
    : [
        { range: "0-20%", count: 0 },
        { range: "21-40%", count: 0 },
        { range: "41-60%", count: 0 },
        { range: "61-80%", count: 0 },
        { range: "81-100%", count: 0 },
      ];

  // Pass/Fail distribution (use analytics data if available)
  const passFailData = [
    {
      name: "Passed",
      value: analytics?.passFailDistribution?.passed || 0,
      color: "#10b981",
    },
    {
      name: "Failed",
      value: analytics?.passFailDistribution?.failed || 0,
      color: "#ef4444",
    },
  ];

  console.log("Debug - MCQ View Page Data:");
  console.log("- Pack:", pack);
  console.log("- Questions:", questions);
  console.log("- Analytics:", analytics);
  console.log("- Question Analytics:", questionAnalytics);
  console.log("- Analytics Data:", analyticsData);
  console.log("- Score Distribution:", scoreDistribution);
  console.log("- Pass/Fail Data:", passFailData);

  if (loading) {
    console.log("MCQ View Page: Still loading...");
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>

        {/* Question Summary Skeleton */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-6">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="border rounded-lg p-4 animate-pulse">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-5 bg-gray-200 rounded w-16"></div>
                  <div className="h-5 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
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

      {/* Detailed Question Analysis section removed - redundant with Individual Question Summary above */}

      {/* Student Results Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Student Results Summary</CardTitle>
          <CardDescription>Overall performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>
              Individual student results are not loaded for performance
              optimization.
            </p>
            <p className="text-sm mt-2">
              Analytics data above shows the overall performance metrics.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MCQViewPage;
