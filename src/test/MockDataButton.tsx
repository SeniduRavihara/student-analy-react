import { Button } from "@/components/ui/button";
import { useToast } from "@/context/ToastContext";
import { db } from "@/firebase/config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";

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

export default MockDataButton;
