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
import { Textarea } from "@/components/ui/textarea";
import { CLASSES_TO_YEARS, ClassesType, EXAM_YEARS } from "@/constants";
import { db } from "@/firebase/config";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { MCQPack } from "@/types";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
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

const MCQPage = () => {
  const { selectedYear, selectedClass } = useOutletContext<OutletContextType>();
  const [mcqPacks, setMcqPacks] = useState<MCQPack[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      },
      (error) => {
        console.error("🔍 Admin: Firestore error:", error);
        console.error("🔍 Admin: Error code:", error.code);
        console.error("🔍 Admin: Error message:", error.message);
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

      toast({
        title: "Success",
        description: `MCQ pack ${
          newStatus === "published" ? "published" : "unpublished"
        } successfully!`,
      });
    } catch (error) {
      console.error("Error updating pack status:", error);
      toast({
        title: "Error",
        description: "Failed to update pack status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreatePack = async () => {
    if (!packTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a pack title",
        variant: "destructive",
      });
      return;
    }

    if (classTypes.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one class type",
        variant: "destructive",
      });
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

      toast({
        title: "Success",
        description: "MCQ pack created successfully!",
      });

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
      toast({
        title: "Error",
        description: "Failed to create MCQ pack. Please try again.",
        variant: "destructive",
      });
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
