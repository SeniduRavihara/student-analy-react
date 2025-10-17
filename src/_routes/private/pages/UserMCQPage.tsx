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
import { MCQPack } from "@/types";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { Clock, Play, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserMCQPage = () => {
  const { currentUserData } = useData();
  const navigate = useNavigate();
  const [mcqPacks, setMcqPacks] = useState<MCQPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllPacks, setShowAllPacks] = useState(false);

  useEffect(() => {
    console.log("UserMCQPage: useEffect triggered");
    console.log("User data:", currentUserData);
    console.log(
      "User data keys:",
      currentUserData ? Object.keys(currentUserData) : "No data"
    );

    if (!currentUserData) {
      console.log("UserMCQPage: No user data available");
      setLoading(false);
      return;
    }

    // Get user's year and class from their data
    const userYear = currentUserData.examYear;
    const userClasses = currentUserData.classes || [];

    console.log("UserMCQPage: User year:", userYear);
    console.log("UserMCQPage: User classes:", userClasses);

    if (!userYear || userClasses.length === 0) {
      console.log("UserMCQPage: Missing user year or classes");
      setLoading(false);
      return;
    }

    console.log("UserMCQPage: Setting up Firestore query...");
    const collectionRef = showAllPacks
      ? query(collection(db, "mcqTests"), orderBy("createdAt", "desc"))
      : query(
          collection(db, "mcqTests"),
          where("examYear", "==", userYear),
          where("status", "==", "published"),
          orderBy("createdAt", "desc")
        );

    const unsubscribe = onSnapshot(
      collectionRef,
      (querySnapshot) => {
        console.log("UserMCQPage: Firestore query result:", querySnapshot);
        console.log("UserMCQPage: Query snapshot size:", querySnapshot.size);

        const packsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as MCQPack[];

        console.log("UserMCQPage: All MCQ packs from Firestore:", packsData);

        // Filter by user's class types (only if not showing all packs)
        const filteredPacks = showAllPacks
          ? packsData
          : packsData.filter((pack) =>
              pack.classType.some((classType) =>
                userClasses.includes(classType)
              )
            );

        console.log("UserMCQPage: Filtered packs for user:", filteredPacks);
        console.log(
          "UserMCQPage: Filtering logic - pack.classType:",
          packsData.map((p) => p.classType)
        );
        console.log("UserMCQPage: User classes to match:", userClasses);

        setMcqPacks(filteredPacks);
        setLoading(false);
      },
      (error) => {
        console.error("UserMCQPage: Firestore query error:", error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [currentUserData, showAllPacks]);

  const handleStartTest = (packId: string) => {
    navigate(`/dashboard/mcq/${packId}/test`);
  };

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
              {showAllPacks
                ? "Showing all MCQ tests (debug mode)"
                : "Available multiple choice question tests for your class"}
            </p>
            {currentUserData && (
              <div className="mt-2 text-sm text-gray-500">
                <span className="font-medium">Your Info:</span> Year:{" "}
                {currentUserData.examYear}, Classes:{" "}
                {currentUserData.classes?.join(", ") || "None"}
              </div>
            )}
          </div>
          <Button
            variant="outline"
            onClick={() => setShowAllPacks(!showAllPacks)}
            className={showAllPacks ? "bg-green-100 text-green-800" : ""}
          >
            {showAllPacks ? "Show Filtered" : "Show All Tests"}
          </Button>
        </div>
      </div>

      {/* MCQ Tests Grid */}
      {mcqPacks.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-12">
          <div className="flex flex-col items-center justify-center text-gray-500">
            <Users className="h-12 w-12 mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No MCQ Tests Available</h3>
            <p className="text-center">
              There are currently no published MCQ tests for your class.
              <br />
              Check back later or contact your teacher.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mcqPacks.map((pack) => (
            <Card key={pack.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{pack.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {pack.description}
                    </CardDescription>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                    Published
                  </span>
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
                    {pack.classType.map((type, index) => (
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

                  {/* Start Test Button */}
                  <Button
                    onClick={() => handleStartTest(pack.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Test
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserMCQPage;
