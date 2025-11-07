import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MCQGridSkeleton } from "@/components/ui/skeleton";
import { db } from "@/firebase/config";
import { useData } from "@/hooks/useData";
import { MCQPack } from "@/types";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { CheckCircle, Clock, Play, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserMCQPage = () => {
  const navigate = useNavigate();
  const { currentUserData } = useData();
  const [mcqPacks, setMcqPacks] = useState<MCQPack[]>([]);
  const [completedTests, setCompletedTests] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserData?.uid) return;

    // Load all MCQ documents ordered by creation date
    const collectionRef = query(
      collection(db, "mcqTests"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      collectionRef,
      async (querySnapshot) => {
        const packsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as MCQPack[];

        // Load student's completed tests
        try {
          const userResultsRef = collection(
            db,
            "users",
            currentUserData.uid,
            "mcqTests"
          );
          const userResultsSnapshot = await getDocs(userResultsRef);
          const completedTestIds = new Set(
            userResultsSnapshot.docs.map((doc) => doc.id)
          );
          setCompletedTests(completedTestIds);
        } catch (error) {
          console.error("Error fetching user results:", error);
        }

        setMcqPacks(packsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching MCQ packs:", error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [currentUserData?.uid]);

  const handleStartTest = (packId: string) => {
    navigate(`/dashboard/mcq/${packId}/test`);
  };

  // Filter MCQ packs based on user's exam year and classes
  const filteredPacks = mcqPacks.filter((pack) => {
    const matchesYear = pack.examYear === currentUserData?.examYear;
    const matchesClass =
      currentUserData?.classes?.some((userClass) =>
        pack.classType?.includes(userClass)
      ) ?? false;
    return matchesYear && matchesClass;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading MCQ tests...</p>
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">MCQ Tests</h1>
            <p className="text-gray-600">
              {filteredPacks.length} total tests • {completedTests.size}{" "}
              completed •{" "}
              {filteredPacks.length -
                [...completedTests].filter((id) =>
                  filteredPacks.some((pack) => pack.id === id)
                ).length}{" "}
              available
            </p>
          </div>
        </div>
      </div>

      {/* MCQ Tests Grid */}
      {loading ? (
        <MCQGridSkeleton count={6} />
      ) : filteredPacks.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-12">
          <div className="flex flex-col items-center justify-center text-gray-500">
            <Users className="h-12 w-12 mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">
              {mcqPacks.length === 0
                ? "No MCQ Tests Available"
                : "No Tests Match Your Criteria"}
            </h3>
            <p className="text-center">
              {mcqPacks.length === 0
                ? "There are currently no MCQ tests in the database."
                : "No MCQ tests are available for your exam year and class combination."}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPacks.map((pack) => {
            const isCompleted = completedTests.has(pack.id);
            return (
              <Card
                key={pack.id}
                className={`hover:shadow-md transition-shadow ${
                  isCompleted ? "bg-gray-50 border-gray-300" : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">
                        {pack.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {pack.description}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          pack.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {pack.status}
                      </span>
                      {isCompleted && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Test Info */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{pack.totalQuestions} Questions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{pack.timeLimit} min</span>
                      </div>
                    </div>

                    {/* Class Types */}
                    <div className="flex flex-wrap gap-1">
                      {pack.classType?.map((type, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {type}
                        </span>
                      ))}
                    </div>

                    {/* Passing Marks */}
                    <div className="text-sm text-gray-600">
                      Passing Marks: {pack.passingMarks}%
                    </div>

                    {/* Action Button */}
                    {isCompleted ? (
                      <Button
                        disabled
                        className="w-full bg-gray-400 cursor-not-allowed"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Already Completed
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleStartTest(pack.id)}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Test
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserMCQPage;
