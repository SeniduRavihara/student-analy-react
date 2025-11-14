import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CLASSES_TO_YEARS, ClassesType, EXAM_YEARS } from "@/constants";
import { cn } from "@/lib/utils";
import { MCQPack } from "@/types";
import { Globe, Lock, Save, SquareCheck } from "lucide-react";

interface MCQPackInfoProps {
  pack: MCQPack;
  saving: boolean;
  onPackUpdate: (pack: MCQPack) => void;
  onPublishPack: () => void;
  onSavePack: () => void;
  onBack: () => void;
}

export const MCQPackInfo = ({
  pack,
  saving,
  onPackUpdate,
  onPublishPack,
  onSavePack,
  onBack,
}: MCQPackInfoProps) => {
  return (
    <>
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Edit MCQ Pack
            </h1>
            <p className="text-gray-600">{pack.title}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onBack}>
              Back to Packs
            </Button>
            <Button
              variant="outline"
              onClick={onPublishPack}
              className={
                pack.status === "published"
                  ? "text-orange-600 hover:text-orange-700 border-orange-200"
                  : "text-green-600 hover:text-green-700 border-green-200"
              }
            >
              {pack.status === "published" ? (
                <Lock className="h-4 w-4 mr-2" />
              ) : (
                <Globe className="h-4 w-4 mr-2" />
              )}
              {pack.status === "published" ? "Unpublish" : "Publish"}
            </Button>
            <Button
              onClick={onSavePack}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Pack"}
            </Button>
          </div>
        </div>
      </div>

      {/* Pack Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Pack Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={pack.title}
              onChange={(e) => onPackUpdate({ ...pack, title: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={pack.description}
              onChange={(e) =>
                onPackUpdate({ ...pack, description: e.target.value })
              }
              className="mt-1"
              rows={3}
            />
          </div>

          <div>
            <Label>Exam Years</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
              {EXAM_YEARS.map((year) => (
                <Card
                  key={year.year}
                  onClick={() => {
                    const currentYears = pack.examYears || [];
                    const isSelected = currentYears.includes(year.year);
                    let newYears: string[];
                    const currentClassTypes = pack.classTypes || {};
                    let newClassTypes = { ...currentClassTypes };

                    if (isSelected) {
                      // Remove year
                      newYears = currentYears.filter((y) => y !== year.year);
                      delete newClassTypes[year.year];
                    } else {
                      // Add year
                      newYears = [...currentYears, year.year];
                      newClassTypes[year.year] = [];
                    }

                    onPackUpdate({
                      ...pack,
                      examYears: newYears,
                      classTypes: newClassTypes,
                    });
                  }}
                  className={cn(
                    "p-3 flex items-center justify-between cursor-pointer transition-all",
                    (pack.examYears || []).includes(year.year)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  )}
                >
                  <span className="font-medium">{year.label}</span>
                  {(pack.examYears || []).includes(year.year) && (
                    <SquareCheck className="h-5 w-5" />
                  )}
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label>Class Types by Exam Year</Label>
            {(pack.examYears || []).length === 0 ? (
              <p className="text-sm text-gray-500">Select exam years first</p>
            ) : (
              <div className="space-y-4">
                {(pack.examYears || []).map((year) => (
                  <div key={year} className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">
                      {EXAM_YEARS.find((y) => y.year === year)?.label || year}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {CLASSES_TO_YEARS[
                        year as keyof typeof CLASSES_TO_YEARS
                      ]?.map((classItem) => (
                        <Card
                          key={classItem}
                          onClick={() => {
                            const currentClassTypes = pack.classTypes || {};
                            const yearClasses = currentClassTypes[year] || [];
                            const isSelected = yearClasses.includes(
                              classItem as ClassesType
                            );
                            const newYearClasses = isSelected
                              ? yearClasses.filter((c) => c !== classItem)
                              : [...yearClasses, classItem as ClassesType];

                            onPackUpdate({
                              ...pack,
                              classTypes: {
                                ...currentClassTypes,
                                [year]: newYearClasses,
                              },
                            });
                          }}
                          className={cn(
                            "p-3 flex items-center justify-between cursor-pointer transition-all",
                            ((pack.classTypes || {})[year] || []).includes(
                              classItem as ClassesType
                            )
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-accent"
                          )}
                        >
                          <span className="font-medium">{classItem}</span>
                          {((pack.classTypes || {})[year] || []).includes(
                            classItem as ClassesType
                          ) && <SquareCheck className="h-5 w-5" />}
                        </Card>
                      )) || (
                        <p className="text-sm text-gray-500 col-span-full">
                          No class types available for this year
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Time Limit (min)</Label>
              <Input
                type="number"
                value={pack.timeLimit}
                onChange={(e) =>
                  onPackUpdate({ ...pack, timeLimit: Number(e.target.value) })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label>Passing Marks (%)</Label>
              <Input
                type="number"
                value={pack.passingMarks}
                onChange={(e) =>
                  onPackUpdate({
                    ...pack,
                    passingMarks: Number(e.target.value),
                  })
                }
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
