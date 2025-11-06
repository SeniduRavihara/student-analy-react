import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ModernDataTable } from "@/components/ui/modern-data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { MCQGridSkeleton, TableRowSkeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
// import MockMCQDataButton from "@/components/MockMCQDataButton";
import { CLASSES_TO_YEARS, ClassesType, EXAM_YEARS } from "@/constants";
import { useModal } from "@/context/ModalContext";
import { useToast } from "@/context/ToastContext";
import { db } from "@/firebase/config";
import { StorageService } from "@/firebase/services/StorageService";
import { cn } from "@/lib/utils";
import { MCQPack } from "@/types";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import {
  Edit,
  Eye,
  Globe,
  Loader2,
  Lock,
  Plus,
  SquareCheck,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

type OutletContextType = {
  selectedYear: string;
  selectedClass: string;
};

// Mock Data Button Component
const MockDataButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { success: showSuccess, error: showError } = useToast();

  const generateMockMCQData = async () => {
    setIsLoading(true);
    try {
      const mockTestData = [
        {
          title: "Physics Fundamentals - Mechanics",
          description:
            "Basic mechanics concepts including motion, forces, and energy.",
          examYear: "2027",
          classType: ["THEORY"],
          timeLimit: 45,
          passingMarks: 40,
          status: "published" as const,
          totalQuestions: 5,
          totalMarks: 8,
          createdBy: "admin",
          questions: [
            {
              question:
                "A ball is thrown vertically upward with an initial velocity of 20 m/s. What is the maximum height it will reach? (Take g = 10 m/s²)",
              questionImageBeforeUrl: undefined,
              questionImageAfterUrl: undefined,
              questionImageUrl: undefined,
              questionContentType: "text" as const,
              options: [
                {
                  id: "opt1",
                  text: "20 m",
                  imageUrl: undefined,
                  isCorrect: true,
                  contentType: "text" as const,
                },
                {
                  id: "opt2",
                  text: "40 m",
                  imageUrl: undefined,
                  isCorrect: false,
                  contentType: "text" as const,
                },
                {
                  id: "opt3",
                  text: "10 m",
                  imageUrl: undefined,
                  isCorrect: false,
                  contentType: "text" as const,
                },
                {
                  id: "opt4",
                  text: "30 m",
                  imageUrl: undefined,
                  isCorrect: false,
                  contentType: "text" as const,
                },
              ],
              explanation:
                "Using the equation v² = u² - 2gh, where v = 0 at maximum height, u = 20 m/s, and g = 10 m/s². Solving: 0 = 400 - 20h, so h = 20 m.",
              difficulty: "medium" as const,
              subject: "Mechanics",
              topic: "Projectile Motion",
              order: 1,
              marks: 2,
            },
            {
              question: "What is the unit of force in the SI system?",
              questionImageBeforeUrl: undefined,
              questionImageAfterUrl: undefined,
              questionImageUrl: undefined,
              questionContentType: "text" as const,
              options: [
                {
                  id: "opt1",
                  text: "Newton (N)",
                  imageUrl: undefined,
                  isCorrect: true,
                  contentType: "text" as const,
                },
                {
                  id: "opt2",
                  text: "Joule (J)",
                  imageUrl: undefined,
                  isCorrect: false,
                  contentType: "text" as const,
                },
                {
                  id: "opt3",
                  text: "Watt (W)",
                  imageUrl: undefined,
                  isCorrect: false,
                  contentType: "text" as const,
                },
                {
                  id: "opt4",
                  text: "Pascal (Pa)",
                  imageUrl: undefined,
                  isCorrect: false,
                  contentType: "text" as const,
                },
              ],
              explanation:
                "Force is measured in Newtons (N) in the SI system. 1 N = 1 kg⋅m/s²",
              difficulty: "easy" as const,
              subject: "Mechanics",
              topic: "Units and Measurements",
              order: 2,
              marks: 1,
            },
            {
              question:
                "A car accelerates from rest to 20 m/s in 5 seconds. What is its acceleration?",
              questionImageBeforeUrl: undefined,
              questionImageAfterUrl: undefined,
              questionImageUrl: undefined,
              questionContentType: "text" as const,
              options: [
                {
                  id: "opt1",
                  text: "4 m/s²",
                  imageUrl: undefined,
                  isCorrect: true,
                  contentType: "text" as const,
                },
                {
                  id: "opt2",
                  text: "100 m/s²",
                  imageUrl: undefined,
                  isCorrect: false,
                  contentType: "text" as const,
                },
                {
                  id: "opt3",
                  text: "15 m/s²",
                  imageUrl: undefined,
                  isCorrect: false,
                  contentType: "text" as const,
                },
                {
                  id: "opt4",
                  text: "25 m/s²",
                  imageUrl: undefined,
                  isCorrect: false,
                  contentType: "text" as const,
                },
              ],
              explanation: "Using a = (v - u)/t: a = (20 - 0)/5 = 4 m/s²",
              difficulty: "easy" as const,
              subject: "Mechanics",
              topic: "Kinematics",
              order: 3,
              marks: 1,
            },
            {
              question:
                "What is the kinetic energy of a 2 kg object moving at 10 m/s?",
              questionImageBeforeUrl: undefined,
              questionImageAfterUrl: undefined,
              questionImageUrl: undefined,
              questionContentType: "text" as const,
              options: [
                {
                  id: "opt1",
                  text: "100 J",
                  imageUrl: undefined,
                  isCorrect: true,
                  contentType: "text" as const,
                },
                {
                  id: "opt2",
                  text: "200 J",
                  imageUrl: undefined,
                  isCorrect: false,
                  contentType: "text" as const,
                },
                {
                  id: "opt3",
                  text: "50 J",
                  imageUrl: undefined,
                  isCorrect: false,
                  contentType: "text" as const,
                },
                {
                  id: "opt4",
                  text: "20 J",
                  imageUrl: undefined,
                  isCorrect: false,
                  contentType: "text" as const,
                },
              ],
              explanation:
                "Using KE = ½mv²: KE = ½ × 2 × 10² = ½ × 2 × 100 = 100 J",
              difficulty: "medium" as const,
              subject: "Mechanics",
              topic: "Energy",
              order: 4,
              marks: 2,
            },
            {
              question:
                "Which law states that every action has an equal and opposite reaction?",
              questionImageBeforeUrl: undefined,
              questionImageAfterUrl: undefined,
              questionImageUrl: undefined,
              questionContentType: "text" as const,
              options: [
                {
                  id: "opt1",
                  text: "Newton's Third Law",
                  imageUrl: undefined,
                  isCorrect: true,
                  contentType: "text" as const,
                },
                {
                  id: "opt2",
                  text: "Newton's First Law",
                  imageUrl: undefined,
                  isCorrect: false,
                  contentType: "text" as const,
                },
                {
                  id: "opt3",
                  text: "Newton's Second Law",
                  imageUrl: undefined,
                  isCorrect: false,
                  contentType: "text" as const,
                },
                {
                  id: "opt4",
                  text: "Law of Conservation of Energy",
                  imageUrl: undefined,
                  isCorrect: false,
                  contentType: "text" as const,
                },
              ],
              explanation:
                "Newton's Third Law states that for every action, there is an equal and opposite reaction.",
              difficulty: "easy" as const,
              subject: "Mechanics",
              topic: "Newton's Laws",
              order: 5,
              marks: 2,
            },
          ],
        },
        {
          title: "Advanced Physics - Thermodynamics",
          description:
            "Thermodynamics concepts including heat, temperature, and gas laws.",
          examYear: "2027",
          classType: ["REVISION"],
          timeLimit: 50,
          passingMarks: 45,
          status: "published" as const,
          totalQuestions: 5,
          totalMarks: 10,
          createdBy: "admin",
          questions: [
            {
              question:
                "A gas undergoes an isothermal process. Which statement is correct?",
              questionImageBeforeUrl: undefined,
              questionImageAfterUrl: undefined,
              questionImageUrl: undefined,
              questionContentType: "text" as const,
              options: [
                {
                  id: "opt1",
                  text: "Temperature remains constant",
                  imageUrl: undefined,
                  isCorrect: true,
                  contentType: "text" as const,
                },
                {
                  id: "opt2",
                  text: "Pressure remains constant",
                  imageUrl: undefined,
                  isCorrect: false,
                  contentType: "text" as const,
                },
                {
                  id: "opt3",
                  text: "Volume remains constant",
                  imageUrl: undefined,
                  isCorrect: false,
                  contentType: "text" as const,
                },
                {
                  id: "opt4",
                  text: "Internal energy remains constant",
                  imageUrl: undefined,
                  isCorrect: false,
                  contentType: "text" as const,
                },
              ],
              explanation:
                "In an isothermal process, the temperature remains constant throughout the process.",
              difficulty: "medium" as const,
              subject: "Thermodynamics",
              topic: "Gas Laws",
              order: 1,
              marks: 2,
            },
            {
              question: "What is the first law of thermodynamics?",
              questionImageBeforeUrl: undefined,
              questionImageAfterUrl: undefined,
              questionImageUrl: undefined,
              questionContentType: "text" as const,
              options: [
                {
                  id: "opt1",
                  text: "Energy cannot be created or destroyed",
                  imageUrl: undefined,
                  isCorrect: true,
                  contentType: "text" as const,
                },
                {
                  id: "opt2",
                  text: "Entropy always increases",
                  imageUrl: undefined,
                  isCorrect: false,
                  contentType: "text" as const,
                },
                {
                  id: "opt3",
                  text: "Heat flows from hot to cold",
                  imageUrl: undefined,
                  isCorrect: false,
                  contentType: "text" as const,
                },
                {
                  id: "opt4",
                  text: "Pressure and volume are inversely related",
                  imageUrl: undefined,
                  isCorrect: false,
                  contentType: "text" as const,
                },
              ],
              explanation:
                "The first law of thermodynamics states that energy cannot be created or destroyed, only transferred or converted.",
              difficulty: "easy" as const,
              subject: "Thermodynamics",
              topic: "Laws of Thermodynamics",
              order: 2,
              marks: 2,
            },
            {
              question:
                "At what temperature does water boil at standard atmospheric pressure?",
              questionImageBeforeUrl: undefined,
              questionImageAfterUrl: undefined,
              questionImageUrl: undefined,
              questionContentType: "text" as const,
              options: [
                {
                  id: "opt1",
                  text: "100°C",
                  imageUrl: undefined,
                  isCorrect: true,
                  contentType: "text" as const,
                },
                {
                  id: "opt2",
                  text: "0°C",
                  imageUrl: undefined,
                  isCorrect: false,
                  contentType: "text" as const,
                },
                {
                  id: "opt3",
                  text: "50°C",
                  imageUrl: undefined,
                  isCorrect: false,
                  contentType: "text" as const,
                },
                {
                  id: "opt4",
                  text: "200°C",
                  imageUrl: undefined,
                  isCorrect: false,
                  contentType: "text" as const,
                },
              ],
              explanation:
                "Water boils at 100°C (212°F) at standard atmospheric pressure (1 atm).",
              difficulty: "easy" as const,
              subject: "Thermodynamics",
              topic: "Phase Changes",
              order: 3,
              marks: 1,
            },
            {
              question:
                "What is the efficiency of a heat engine operating between 500K and 300K?",
              questionImageBeforeUrl: undefined,
              questionImageAfterUrl: undefined,
              questionImageUrl: undefined,
              questionContentType: "text" as const,
              options: [
                {
                  id: "opt1",
                  text: "40%",
                  imageUrl: undefined,
                  isCorrect: true,
                  contentType: "text" as const,
                },
                {
                  id: "opt2",
                  text: "60%",
                  imageUrl: undefined,
                  isCorrect: false,
                  contentType: "text" as const,
                },
                {
                  id: "opt3",
                  text: "20%",
                  imageUrl: undefined,
                  isCorrect: false,
                  contentType: "text" as const,
                },
                {
                  id: "opt4",
                  text: "80%",
                  imageUrl: undefined,
                  isCorrect: false,
                  contentType: "text" as const,
                },
              ],
              explanation:
                "Using η = 1 - T_cold/T_hot: η = 1 - 300/500 = 1 - 0.6 = 0.4 = 40%",
              difficulty: "hard" as const,
              subject: "Thermodynamics",
              topic: "Heat Engines",
              order: 4,
              marks: 3,
            },
            {
              question: "Which process has the highest entropy change?",
              questionImageBeforeUrl: undefined,
              questionImageAfterUrl: undefined,
              questionImageUrl: undefined,
              questionContentType: "text" as const,
              options: [
                {
                  id: "opt1",
                  text: "Ice melting to water",
                  imageUrl: undefined,
                  isCorrect: true,
                  contentType: "text" as const,
                },
                {
                  id: "opt2",
                  text: "Water freezing to ice",
                  imageUrl: undefined,
                  isCorrect: false,
                  contentType: "text" as const,
                },
                {
                  id: "opt3",
                  text: "Water heating from 20°C to 30°C",
                  imageUrl: undefined,
                  isCorrect: false,
                  contentType: "text" as const,
                },
                {
                  id: "opt4",
                  text: "Gas compressing isothermally",
                  imageUrl: undefined,
                  isCorrect: false,
                  contentType: "text" as const,
                },
              ],
              explanation:
                "Phase change from solid to liquid (melting) involves the highest entropy change as it requires breaking molecular bonds.",
              difficulty: "medium" as const,
              subject: "Thermodynamics",
              topic: "Entropy",
              order: 5,
              marks: 2,
            },
          ],
        },
      ];

      let createdPacks = 0;
      const totalPacks = mockTestData.length;

      // Create each MCQ test
      for (const testData of mockTestData) {
        try {
          // Create the MCQ pack
          const packRef = await addDoc(collection(db, "mcqTests"), {
            title: testData.title,
            description: testData.description,
            examYear: testData.examYear,
            classType: testData.classType,
            timeLimit: testData.timeLimit,
            passingMarks: testData.passingMarks,
            status: testData.status,
            totalQuestions: testData.totalQuestions,
            totalMarks: testData.totalMarks,
            createdBy: testData.createdBy,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });

          console.log(`Created pack: ${testData.title} with ID: ${packRef.id}`);

          // Add questions to the pack
          for (const question of testData.questions) {
            // Clean function to remove undefined values and prepare for Firestore
            const cleanObject = (
              obj: Record<string, unknown>
            ): Record<string, unknown> => {
              const cleaned: Record<string, unknown> = {};
              for (const [key, value] of Object.entries(obj)) {
                if (value !== undefined) {
                  if (Array.isArray(value)) {
                    cleaned[key] = value
                      .map((item) =>
                        typeof item === "object" && item !== null
                          ? cleanObject(item as Record<string, unknown>)
                          : item
                      )
                      .filter((item) => item !== undefined);
                  } else if (typeof value === "object" && value !== null) {
                    cleaned[key] = cleanObject(
                      value as Record<string, unknown>
                    );
                  } else {
                    cleaned[key] = value;
                  }
                }
              }
              return cleaned;
            };

            const cleanQuestion = cleanObject(
              question as Record<string, unknown>
            );
            await addDoc(collection(db, "mcqTests", packRef.id, "questions"), {
              ...cleanQuestion,
              createdAt: serverTimestamp(),
            });
          }

          createdPacks++;
          console.log(
            `Added ${testData.questions.length} questions to ${testData.title}`
          );
        } catch (error) {
          console.error(`Error creating pack ${testData.title}:`, error);
        }
      }

      showSuccess(
        "Mock Data Added!",
        `Successfully created ${createdPacks} out of ${totalPacks} MCQ test packs`
      );
    } catch (error) {
      console.error("Error creating mock MCQ data:", error);
      showError("Error", "Failed to create mock data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={generateMockMCQData}
      disabled={isLoading}
      variant="outline"
      className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
          Adding Mock Data...
        </>
      ) : (
        "Add Mock MCQ Data"
      )}
    </Button>
  );
};

const MCQPage = () => {
  const { selectedYear, selectedClass } = useOutletContext<OutletContextType>();
  const [mcqPacks, setMcqPacks] = useState<MCQPack[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [packsLoading, setPacksLoading] = useState(true);
  const navigate = useNavigate();
  const { success: showSuccess, error: showError } = useToast();
  const { showConfirm } = useModal();

  // Form state
  const [packTitle, setPackTitle] = useState("");
  const [packDescription, setPackDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState(30);
  const [passingMarks, setPassingMarks] = useState(50);
  const [packYear, setPackYear] = useState(EXAM_YEARS[0].year);
  const [classTypes, setClassTypes] = useState<ClassesType[]>([]);
  const [showAllPacks, setShowAllPacks] = useState(true); // Show all by default

  useEffect(() => {
    // Load MCQ packs with ordering

    const collectionRef = query(
      collection(db, "mcqTests"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      collectionRef,
      (querySnapshot) => {
        const packsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as MCQPack[];

        // Filter by selected year and class (or show all for debugging)
        const filteredPacks = showAllPacks
          ? packsData
          : packsData.filter(
              (pack) =>
                pack.examYear === selectedYear &&
                pack.classType.includes(selectedClass)
            );

        setMcqPacks(filteredPacks);
        setPacksLoading(false);
      },
      (error) => {
        console.error("🔍 Admin: Firestore error:", error);
        console.error("🔍 Admin: Error code:", error.code);
        console.error("🔍 Admin: Error message:", error.message);
        setPacksLoading(false);
      }
    );

    return unsubscribe;
  }, [selectedYear, selectedClass, showAllPacks]);

  const toggleClassType = (classType: ClassesType) => {
    setClassTypes((prevClasses) =>
      prevClasses.includes(classType)
        ? prevClasses.filter((c) => c !== classType)
        : [...prevClasses, classType]
    );
  };

  const handlePublishPack = async (packId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "published" ? "draft" : "published";
      await updateDoc(doc(db, "mcqTests", packId), {
        status: newStatus,
        updatedAt: new Date(),
      });

      showSuccess(
        "Success",
        `MCQ pack ${
          newStatus === "published" ? "published" : "unpublished"
        } successfully!`
      );
    } catch (error) {
      console.error("Error updating pack status:", error);
      showError("Error", "Failed to update pack status. Please try again.");
    }
  };

  const handleDeletePack = async (packId: string, packTitle: string) => {
    const confirmed = await showConfirm(
      "Delete MCQ Pack",
      `Are you sure you want to delete "${packTitle}"? This action cannot be undone.`
    );

    if (confirmed) {
      try {
        // Try to delete all images from Firebase Storage first (optional)
        // try {
        //   await StorageService.deleteMCQTestFolder(packId);
        // } catch (storageError) {
        //   console.warn(
        //     "Failed to delete storage files (CORS issue in development):",
        //     storageError
        //   );
        //   // Continue with Firestore deletion even if storage deletion fails
        // }

        // Create a batch to delete both the main document and subcollection
        const batch = writeBatch(db);

        // Delete the main MCQ pack document
        const packRef = doc(db, "mcqTests", packId);
        batch.delete(packRef);

        // Get all questions in the subcollection and delete them
        const questionsRef = collection(db, "mcqTests", packId, "questions");
        const questionsSnapshot = await getDocs(questionsRef);

        questionsSnapshot.forEach((questionDoc) => {
          batch.delete(questionDoc.ref);
        });

        // Commit the batch
        await batch.commit();

        showSuccess(
          "Success",
          "MCQ pack and all questions deleted successfully!"
        );
      } catch (error) {
        console.error("Error deleting pack:", error);
        showError("Error", "Failed to delete pack. Please try again.");
      }
    }
  };

  const handleCreatePack = async () => {
    if (!packTitle.trim()) {
      showError("Error", "Please enter a pack title");
      return;
    }

    if (classTypes.length === 0) {
      showError("Error", "Please select at least one class type");
      return;
    }

    setLoading(true);
    try {
      const newPack = {
        title: packTitle,
        description: packDescription,
        examYear: packYear,
        classType: classTypes,
        timeLimit,
        passingMarks,
        status: "draft",
        createdBy: "admin", // You can get this from auth context
        totalQuestions: 0,
        totalMarks: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "mcqTests"), newPack);

      showSuccess("Success", "MCQ pack created successfully!");

      // Reset form
      setPackTitle("");
      setPackDescription("");
      setTimeLimit(30);
      setPassingMarks(50);
      setPackYear(EXAM_YEARS[0].year);
      setClassTypes([]);
      setIsCreateDialogOpen(false);

      // Navigate to edit the pack
      navigate(`/admin/mcq/${docRef.id}/edit`);
    } catch (error) {
      console.error("Error creating MCQ pack:", error);
      showError("Error", "Failed to create MCQ pack. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      accessorKey: "title",
      header: "Pack Title",
      cell: ({ row }: any) => (
        <div className="font-medium">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }: any) => (
        <div className="max-w-xs truncate">{row.getValue("description")}</div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "classType",
      header: "Class Types",
      cell: ({ row }: any) => {
        const classTypes = row.getValue("classType") as string[];
        return (
          <div className="flex flex-wrap gap-1">
            {classTypes.map((type, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {type}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "totalQuestions",
      header: "Questions",
      cell: ({ row }: any) => (
        <div className="text-center">{row.getValue("totalQuestions")}</div>
      ),
    },
    {
      accessorKey: "timeLimit",
      header: "Time Limit",
      cell: ({ row }: any) => (
        <div className="text-center">{row.getValue("timeLimit")} min</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.getValue("status");
        const statusColors = {
          draft: "bg-gray-100 text-gray-800",
          published: "bg-green-100 text-green-800",
          archived: "bg-red-100 text-red-800",
        };
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              statusColors[status as keyof typeof statusColors]
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const pack = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/admin/mcq/${pack.id}/edit`)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/admin/mcq/${pack.id}/view`)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePublishPack(pack.id, pack.status)}
              className={
                pack.status === "published"
                  ? "text-orange-600 hover:text-orange-700"
                  : "text-green-600 hover:text-green-700"
              }
            >
              {pack.status === "published" ? (
                <Lock className="h-4 w-4" />
              ) : (
                <Globe className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
              onClick={() => handleDeletePack(pack.id, pack.title)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">MCQ Packs</h1>
            <p className="text-gray-600">
              {showAllPacks
                ? "Showing all MCQ packs (debug mode)"
                : `Create and manage multiple choice question packs for ${selectedYear} - ${selectedClass}`}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAllPacks(!showAllPacks)}
              className={showAllPacks ? "bg-green-100 text-green-800" : ""}
            >
              {showAllPacks ? "Show Filtered" : "Show All Packs"}
            </Button>
            <MockDataButton />
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Pack
            </Button>
          </div>
        </div>
      </div>

      {/* MCQ Packs Table */}
      <ModernDataTable
        columns={columns}
        data={mcqPacks}
        searchPlaceholder="Search by pack title..."
        searchColumn="title"
        pageSize={8}
        title=""
        description=""
        loading={packsLoading}
      />

      {/* Create Pack Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New MCQ Pack</DialogTitle>
            <DialogDescription>
              Create a new multiple choice question pack for your students.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Pack Title *</label>
              <Input
                value={packTitle}
                onChange={(e) => setPackTitle(e.target.value)}
                placeholder="Enter pack title..."
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={packDescription}
                onChange={(e) => setPackDescription(e.target.value)}
                placeholder="Enter pack description..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Exam Year</label>
              <Select
                onValueChange={setPackYear}
                defaultValue={EXAM_YEARS[0].year}
                value={packYear}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select exam year" />
                </SelectTrigger>
                <SelectContent>
                  {EXAM_YEARS.map((year) => (
                    <SelectItem key={year.year} value={year.year}>
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Class Types *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CLASSES_TO_YEARS[
                  packYear as keyof typeof CLASSES_TO_YEARS
                ].map((classItem) => (
                  <Card
                    key={classItem}
                    onClick={() => toggleClassType(classItem as ClassesType)}
                    className={cn(
                      "p-3 flex items-center justify-between cursor-pointer transition-all",
                      classTypes.includes(classItem as ClassesType)
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    )}
                  >
                    <span className="font-medium">{classItem}</span>
                    {classTypes.includes(classItem as ClassesType) && (
                      <SquareCheck className="h-5 w-5" />
                    )}
                  </Card>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">
                  Time Limit (minutes)
                </label>
                <Input
                  type="number"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                  className="mt-1"
                  min="1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Passing Marks (%)</label>
                <Input
                  type="number"
                  value={passingMarks}
                  onChange={(e) => setPassingMarks(Number(e.target.value))}
                  className="mt-1"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreatePack}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Creating..." : "Create Pack"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MCQPage;
