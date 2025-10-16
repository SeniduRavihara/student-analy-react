import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/firebase/config";
import { ExamDataType, UserDataType } from "@/types";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { BarChart3, BookOpen, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

type OutletContextType = {
  usersData: UserDataType[];
  selectedYear: string;
  selectedClass: string;
};

const RealAdminDashboard = () => {
  const { usersData, selectedYear, selectedClass } =
    useOutletContext<OutletContextType>();
  const [examsData, setExamsData] = useState<ExamDataType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const collectionRef = query(
      collection(db, "exams"),
      where("examYear", "==", selectedYear),
      where("classType", "array-contains", selectedClass),
      orderBy("examDate", "desc")
    );

    const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
      const examsDataArr = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        examId: doc.id,
      })) as ExamDataType[];
      setExamsData(examsDataArr);
      setLoading(false);
    });

    return unsubscribe;
  }, [selectedYear, selectedClass]);

  // Calculate real statistics
  const totalStudents = usersData?.length || 0;
  const activeExams = examsData.filter(
    (exam) => exam.examStatus === "upcoming"
  ).length;
  const completedExams = examsData.filter(
    (exam) => exam.examStatus === "completed"
  ).length;

  // Calculate average score from completed exams
  const completedExamsWithResults = examsData.filter(
    (exam) =>
      exam.examStatus === "completed" &&
      exam.avgResult !== null &&
      exam.avgResult !== undefined
  );
  const averageScore =
    completedExamsWithResults.length > 0
      ? (
          completedExamsWithResults.reduce(
            (sum, exam) => sum + (exam.avgResult || 0),
            0
          ) / completedExamsWithResults.length
        ).toFixed(1)
      : "0.0";

  // Calculate success rate (students with results > 50%)
  const studentsWithResults =
    usersData?.filter(
      (user) =>
        user.lastResult !== null &&
        user.lastResult !== undefined &&
        user.lastResult > 50
    ).length || 0;
  const successRate =
    totalStudents > 0
      ? ((studentsWithResults / totalStudents) * 100).toFixed(1)
      : "0.0";

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome to PHY6LK Dashboard
          </h1>
          <p className="text-blue-100">Loading dashboard data...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Loading...
                </CardTitle>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to PHY6LK Dashboard</h1>
        <p className="text-blue-100">
          Real-time analytics for {selectedYear} - {selectedClass} class
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Registered in {selectedYear}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Exams</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeExams}</div>
            <p className="text-xs text-muted-foreground">
              {completedExams} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore}%</div>
            <p className="text-xs text-muted-foreground">
              Across {completedExamsWithResults.length} exams
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate}%</div>
            <p className="text-xs text-muted-foreground">
              Students scoring above 50%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates in your system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">
                {totalStudents} students registered
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">{activeExams} upcoming exams</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm">{completedExams} completed exams</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm">Average score: {averageScore}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and navigation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">View all students</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Create new exam</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm">View analytics</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm">Manage calendar</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Button className="bg-blue-600 hover:bg-blue-700">
          View Students ({totalStudents})
        </Button>
        <Button variant="outline">View Analytics</Button>
        <Button variant="outline">
          Manage Exams ({activeExams + completedExams})
        </Button>
      </div>
    </div>
  );
};

export default RealAdminDashboard;
