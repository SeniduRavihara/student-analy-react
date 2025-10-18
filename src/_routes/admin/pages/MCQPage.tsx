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
              options: [
                { id: "opt1", text: "20 m", isCorrect: true },
                { id: "opt2", text: "40 m", isCorrect: false },
                { id: "opt3", text: "10 m", isCorrect: false },
                { id: "opt4", text: "30 m", isCorrect: false },
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
              options: [
                { id: "opt1", text: "Newton (N)", isCorrect: true },
                { id: "opt2", text: "Joule (J)", isCorrect: false },
                { id: "opt3", text: "Watt (W)", isCorrect: false },
                { id: "opt4", text: "Pascal (Pa)", isCorrect: false },
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
              options: [
                { id: "opt1", text: "4 m/s²", isCorrect: true },
                { id: "opt2", text: "100 m/s²", isCorrect: false },
                { id: "opt3", text: "15 m/s²", isCorrect: false },
                { id: "opt4", text: "25 m/s²", isCorrect: false },
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
              options: [
                { id: "opt1", text: "100 J", isCorrect: true },
                { id: "opt2", text: "200 J", isCorrect: false },
                { id: "opt3", text: "50 J", isCorrect: false },
                { id: "opt4", text: "20 J", isCorrect: false },
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
              options: [
                { id: "opt1", text: "Newton's Third Law", isCorrect: true },
                { id: "opt2", text: "Newton's First Law", isCorrect: false },
                { id: "opt3", text: "Newton's Second Law", isCorrect: false },
                {
                  id: "opt4",
                  text: "Law of Conservation of Energy",
                  isCorrect: false,
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
              options: [
                {
                  id: "opt1",
                  text: "Temperature remains constant",
                  isCorrect: true,
                },
                {
                  id: "opt2",
                  text: "Pressure remains constant",
                  isCorrect: false,
                },
                {
                  id: "opt3",
                  text: "Volume remains constant",
                  isCorrect: false,
                },
                {
                  id: "opt4",
                  text: "Internal energy remains constant",
                  isCorrect: false,
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
              options: [
                {
                  id: "opt1",
                  text: "Energy cannot be created or destroyed",
                  isCorrect: true,
                },
                {
                  id: "opt2",
                  text: "Entropy always increases",
                  isCorrect: false,
                },
                {
                  id: "opt3",
                  text: "Heat flows from hot to cold",
                  isCorrect: false,
                },
                {
                  id: "opt4",
                  text: "Pressure and volume are inversely related",
                  isCorrect: false,
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
              options: [
                { id: "opt1", text: "100°C", isCorrect: true },
                { id: "opt2", text: "0°C", isCorrect: false },
                { id: "opt3", text: "50°C", isCorrect: false },
                { id: "opt4", text: "200°C", isCorrect: false },
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
              options: [
                { id: "opt1", text: "40%", isCorrect: true },
                { id: "opt2", text: "60%", isCorrect: false },
                { id: "opt3", text: "20%", isCorrect: false },
                { id: "opt4", text: "80%", isCorrect: false },
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
              options: [
                { id: "opt1", text: "Ice melting to water", isCorrect: true },
                { id: "opt2", text: "Water freezing to ice", isCorrect: false },
                {
                  id: "opt3",
                  text: "Water heating from 20°C to 30°C",
                  isCorrect: false,
                },
                {
                  id: "opt4",
                  text: "Gas compressing isothermally",
                  isCorrect: false,
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
        {
          title: "Electromagnetism Fundamentals",
          description:
            "Basic concepts of electricity and magnetism including fields, forces, and circuits.",
          examYear: "2027",
          classType: ["PAPER"],
          timeLimit: 55,
          passingMarks: 50,
          status: "published" as const,
          totalQuestions: 5,
          totalMarks: 12,
          createdBy: "admin",
          questions: [
            {
              question:
                "What is the electric field strength at a distance of 2m from a point charge of 4μC? (k = 9×10⁹ Nm²/C²)",
              options: [
                { id: "opt1", text: "9×10³ N/C", isCorrect: true },
                { id: "opt2", text: "18×10³ N/C", isCorrect: false },
                { id: "opt3", text: "4.5×10³ N/C", isCorrect: false },
                { id: "opt4", text: "36×10³ N/C", isCorrect: false },
              ],
              explanation:
                "Using E = kQ/r²: E = (9×10⁹ × 4×10⁻⁶)/(2)² = (36×10³)/4 = 9×10³ N/C",
              difficulty: "hard" as const,
              subject: "Electromagnetism",
              topic: "Electric Fields",
              order: 1,
              marks: 3,
            },
            {
              question: "What is the unit of electric current?",
              options: [
                { id: "opt1", text: "Ampere (A)", isCorrect: true },
                { id: "opt2", text: "Volt (V)", isCorrect: false },
                { id: "opt3", text: "Ohm (Ω)", isCorrect: false },
                { id: "opt4", text: "Coulomb (C)", isCorrect: false },
              ],
              explanation:
                "Electric current is measured in Amperes (A). 1 A = 1 C/s",
              difficulty: "easy" as const,
              subject: "Electromagnetism",
              topic: "Electric Current",
              order: 2,
              marks: 1,
            },
            {
              question:
                "What is the resistance of a conductor if 2A current flows through it when 10V is applied?",
              options: [
                { id: "opt1", text: "5 Ω", isCorrect: true },
                { id: "opt2", text: "20 Ω", isCorrect: false },
                { id: "opt3", text: "0.2 Ω", isCorrect: false },
                { id: "opt4", text: "12 Ω", isCorrect: false },
              ],
              explanation: "Using V = IR: R = V/I = 10/2 = 5 Ω",
              difficulty: "easy" as const,
              subject: "Electromagnetism",
              topic: "Ohm's Law",
              order: 3,
              marks: 2,
            },
            {
              question: "Which of the following is NOT a fundamental force?",
              options: [
                { id: "opt1", text: "Centripetal force", isCorrect: true },
                { id: "opt2", text: "Gravitational force", isCorrect: false },
                { id: "opt3", text: "Electromagnetic force", isCorrect: false },
                { id: "opt4", text: "Strong nuclear force", isCorrect: false },
              ],
              explanation:
                "Centripetal force is not a fundamental force but rather a description of the net force required for circular motion.",
              difficulty: "medium" as const,
              subject: "Electromagnetism",
              topic: "Forces",
              order: 4,
              marks: 2,
            },
            {
              question:
                "What happens to the magnetic field around a current-carrying wire when the current is doubled?",
              options: [
                { id: "opt1", text: "It doubles", isCorrect: true },
                { id: "opt2", text: "It halves", isCorrect: false },
                { id: "opt3", text: "It quadruples", isCorrect: false },
                { id: "opt4", text: "It remains the same", isCorrect: false },
              ],
              explanation:
                "The magnetic field around a current-carrying wire is directly proportional to the current (B ∝ I).",
              difficulty: "medium" as const,
              subject: "Electromagnetism",
              topic: "Magnetic Fields",
              order: 5,
              marks: 4,
            },
          ],
        },
        {
          title: "Waves and Oscillations",
          description:
            "Understanding wave properties, sound, and harmonic motion.",
          examYear: "2027",
          classType: ["REVISION"],
          timeLimit: 40,
          passingMarks: 35,
          status: "published" as const,
          totalQuestions: 5,
          totalMarks: 9,
          createdBy: "admin",
          questions: [
            {
              question:
                "A wave has a frequency of 50 Hz and a wavelength of 4 m. What is its speed?",
              options: [
                { id: "opt1", text: "200 m/s", isCorrect: true },
                { id: "opt2", text: "12.5 m/s", isCorrect: false },
                { id: "opt3", text: "54 m/s", isCorrect: false },
                { id: "opt4", text: "46 m/s", isCorrect: false },
              ],
              explanation:
                "Using the wave equation v = fλ: v = 50 Hz × 4 m = 200 m/s",
              difficulty: "easy" as const,
              subject: "Waves",
              topic: "Wave Properties",
              order: 1,
              marks: 1,
            },
            {
              question:
                "What is the frequency of a pendulum that completes 20 oscillations in 10 seconds?",
              options: [
                { id: "opt1", text: "2 Hz", isCorrect: true },
                { id: "opt2", text: "0.5 Hz", isCorrect: false },
                { id: "opt3", text: "200 Hz", isCorrect: false },
                { id: "opt4", text: "10 Hz", isCorrect: false },
              ],
              explanation:
                "Frequency = number of oscillations / time = 20 / 10 = 2 Hz",
              difficulty: "easy" as const,
              subject: "Waves",
              topic: "Simple Harmonic Motion",
              order: 2,
              marks: 2,
            },
            {
              question: "What type of wave requires a medium to travel?",
              options: [
                { id: "opt1", text: "Mechanical wave", isCorrect: true },
                { id: "opt2", text: "Electromagnetic wave", isCorrect: false },
                { id: "opt3", text: "Light wave", isCorrect: false },
                { id: "opt4", text: "Radio wave", isCorrect: false },
              ],
              explanation:
                "Mechanical waves (like sound) require a medium to travel, while electromagnetic waves can travel through vacuum.",
              difficulty: "easy" as const,
              subject: "Waves",
              topic: "Wave Types",
              order: 3,
              marks: 1,
            },
            {
              question:
                "What is the speed of sound in air at room temperature?",
              options: [
                { id: "opt1", text: "343 m/s", isCorrect: true },
                { id: "opt2", text: "300 m/s", isCorrect: false },
                { id: "opt3", text: "400 m/s", isCorrect: false },
                { id: "opt4", text: "500 m/s", isCorrect: false },
              ],
              explanation:
                "The speed of sound in air at 20°C is approximately 343 m/s (or 1235 km/h).",
              difficulty: "medium" as const,
              subject: "Waves",
              topic: "Sound Waves",
              order: 4,
              marks: 2,
            },
            {
              question:
                "What happens to the wavelength when frequency increases?",
              options: [
                { id: "opt1", text: "It decreases", isCorrect: true },
                { id: "opt2", text: "It increases", isCorrect: false },
                { id: "opt3", text: "It remains constant", isCorrect: false },
                {
                  id: "opt4",
                  text: "It depends on the medium",
                  isCorrect: false,
                },
              ],
              explanation:
                "Since v = fλ, if frequency increases and speed remains constant, wavelength must decrease.",
              difficulty: "medium" as const,
              subject: "Waves",
              topic: "Wave Relationships",
              order: 5,
              marks: 3,
            },
          ],
        },
        {
          title: "Modern Physics - Quantum Mechanics",
          description:
            "Introduction to quantum physics, atomic structure, and nuclear physics.",
          examYear: "2027",
          classType: ["PAPER"],
          timeLimit: 60,
          passingMarks: 55,
          status: "published" as const,
          totalQuestions: 5,
          totalMarks: 11,
          createdBy: "admin",
          questions: [
            {
              question: "What is the smallest unit of light energy?",
              options: [
                { id: "opt1", text: "Photon", isCorrect: true },
                { id: "opt2", text: "Electron", isCorrect: false },
                { id: "opt3", text: "Proton", isCorrect: false },
                { id: "opt4", text: "Neutron", isCorrect: false },
              ],
              explanation:
                "A photon is the smallest unit of light energy, representing a quantum of electromagnetic radiation.",
              difficulty: "medium" as const,
              subject: "Modern Physics",
              topic: "Quantum Mechanics",
              order: 1,
              marks: 2,
            },
            {
              question: "What is the atomic number of an element?",
              options: [
                { id: "opt1", text: "Number of protons", isCorrect: true },
                { id: "opt2", text: "Number of neutrons", isCorrect: false },
                { id: "opt3", text: "Number of electrons", isCorrect: false },
                {
                  id: "opt4",
                  text: "Total number of nucleons",
                  isCorrect: false,
                },
              ],
              explanation:
                "The atomic number is the number of protons in the nucleus, which determines the element's identity.",
              difficulty: "easy" as const,
              subject: "Modern Physics",
              topic: "Atomic Structure",
              order: 2,
              marks: 1,
            },
            {
              question:
                "What type of radiation has the highest penetrating power?",
              options: [
                { id: "opt1", text: "Gamma rays", isCorrect: true },
                { id: "opt2", text: "Alpha particles", isCorrect: false },
                { id: "opt3", text: "Beta particles", isCorrect: false },
                { id: "opt4", text: "X-rays", isCorrect: false },
              ],
              explanation:
                "Gamma rays have the highest penetrating power and can pass through several centimeters of lead.",
              difficulty: "medium" as const,
              subject: "Modern Physics",
              topic: "Nuclear Physics",
              order: 3,
              marks: 2,
            },
            {
              question:
                "What is the energy of a photon with frequency 6×10¹⁴ Hz? (h = 6.63×10⁻³⁴ J⋅s)",
              options: [
                { id: "opt1", text: "3.98×10⁻¹⁹ J", isCorrect: true },
                { id: "opt2", text: "1.99×10⁻¹⁹ J", isCorrect: false },
                { id: "opt3", text: "7.96×10⁻¹⁹ J", isCorrect: false },
                { id: "opt4", text: "2.49×10⁻¹⁹ J", isCorrect: false },
              ],
              explanation:
                "Using E = hf: E = 6.63×10⁻³⁴ × 6×10¹⁴ = 3.978×10⁻¹⁹ J ≈ 3.98×10⁻¹⁹ J",
              difficulty: "hard" as const,
              subject: "Modern Physics",
              topic: "Quantum Energy",
              order: 4,
              marks: 3,
            },
            {
              question: "What is the half-life of a radioactive element?",
              options: [
                {
                  id: "opt1",
                  text: "Time for half the nuclei to decay",
                  isCorrect: true,
                },
                {
                  id: "opt2",
                  text: "Time for all nuclei to decay",
                  isCorrect: false,
                },
                {
                  id: "opt3",
                  text: "Time for one nucleus to decay",
                  isCorrect: false,
                },
                {
                  id: "opt4",
                  text: "Time for quarter of nuclei to decay",
                  isCorrect: false,
                },
              ],
              explanation:
                "Half-life is the time required for half of the radioactive nuclei in a sample to decay.",
              difficulty: "easy" as const,
              subject: "Modern Physics",
              topic: "Radioactivity",
              order: 5,
              marks: 3,
            },
          ],
        },
        {
          title: "Chemistry Basics - Atomic Structure",
          description:
            "Fundamental chemistry concepts including atomic theory, bonding, and periodic trends.",
          examYear: "2027",
          classType: ["REVISION"],
          timeLimit: 45,
          passingMarks: 40,
          status: "published" as const,
          totalQuestions: 5,
          totalMarks: 8,
          createdBy: "admin",
          questions: [
            {
              question:
                "What is the maximum number of electrons in the first energy level?",
              options: [
                { id: "opt1", text: "2", isCorrect: true },
                { id: "opt2", text: "8", isCorrect: false },
                { id: "opt3", text: "18", isCorrect: false },
                { id: "opt4", text: "32", isCorrect: false },
              ],
              explanation:
                "The first energy level (n=1) can hold a maximum of 2 electrons according to the formula 2n².",
              difficulty: "easy" as const,
              subject: "Chemistry",
              topic: "Atomic Structure",
              order: 1,
              marks: 1,
            },
            {
              question:
                "What type of bond forms between a metal and a non-metal?",
              options: [
                { id: "opt1", text: "Ionic bond", isCorrect: true },
                { id: "opt2", text: "Covalent bond", isCorrect: false },
                { id: "opt3", text: "Metallic bond", isCorrect: false },
                { id: "opt4", text: "Hydrogen bond", isCorrect: false },
              ],
              explanation:
                "Ionic bonds form between metals and non-metals through the transfer of electrons.",
              difficulty: "easy" as const,
              subject: "Chemistry",
              topic: "Chemical Bonding",
              order: 2,
              marks: 2,
            },
            {
              question: "What is the pH of a neutral solution?",
              options: [
                { id: "opt1", text: "7", isCorrect: true },
                { id: "opt2", text: "0", isCorrect: false },
                { id: "opt3", text: "14", isCorrect: false },
                { id: "opt4", text: "1", isCorrect: false },
              ],
              explanation:
                "A neutral solution has a pH of 7, where [H⁺] = [OH⁻] = 10⁻⁷ M.",
              difficulty: "easy" as const,
              subject: "Chemistry",
              topic: "Acids and Bases",
              order: 3,
              marks: 1,
            },
            {
              question: "Which element has the highest electronegativity?",
              options: [
                { id: "opt1", text: "Fluorine", isCorrect: true },
                { id: "opt2", text: "Oxygen", isCorrect: false },
                { id: "opt3", text: "Chlorine", isCorrect: false },
                { id: "opt4", text: "Nitrogen", isCorrect: false },
              ],
              explanation:
                "Fluorine has the highest electronegativity value of 4.0 on the Pauling scale.",
              difficulty: "medium" as const,
              subject: "Chemistry",
              topic: "Periodic Trends",
              order: 4,
              marks: 2,
            },
            {
              question: "What is the molecular formula of methane?",
              options: [
                { id: "opt1", text: "CH₄", isCorrect: true },
                { id: "opt2", text: "C₂H₆", isCorrect: false },
                { id: "opt3", text: "CH₃", isCorrect: false },
                { id: "opt4", text: "C₄H₁₀", isCorrect: false },
              ],
              explanation:
                "Methane is the simplest hydrocarbon with one carbon atom bonded to four hydrogen atoms: CH₄.",
              difficulty: "easy" as const,
              subject: "Chemistry",
              topic: "Organic Chemistry",
              order: 5,
              marks: 2,
            },
          ],
        },
        {
          title: "Mathematics - Calculus Applications",
          description:
            "Calculus concepts applied to physics problems including derivatives and integrals.",
          examYear: "2027",
          classType: ["PAPER"],
          timeLimit: 50,
          passingMarks: 45,
          status: "published" as const,
          totalQuestions: 5,
          totalMarks: 10,
          createdBy: "admin",
          questions: [
            {
              question: "What is the derivative of x²?",
              options: [
                { id: "opt1", text: "2x", isCorrect: true },
                { id: "opt2", text: "x", isCorrect: false },
                { id: "opt3", text: "2x²", isCorrect: false },
                { id: "opt4", text: "x²/2", isCorrect: false },
              ],
              explanation: "Using the power rule: d/dx(x²) = 2x¹ = 2x",
              difficulty: "easy" as const,
              subject: "Mathematics",
              topic: "Calculus",
              order: 1,
              marks: 1,
            },
            {
              question: "What is the integral of 2x with respect to x?",
              options: [
                { id: "opt1", text: "x² + C", isCorrect: true },
                { id: "opt2", text: "2x² + C", isCorrect: false },
                { id: "opt3", text: "x + C", isCorrect: false },
                { id: "opt4", text: "2x + C", isCorrect: false },
              ],
              explanation:
                "Using the power rule for integration: ∫2x dx = 2(x²/2) + C = x² + C",
              difficulty: "easy" as const,
              subject: "Mathematics",
              topic: "Calculus",
              order: 2,
              marks: 2,
            },
            {
              question: "What is the derivative of sin(x)?",
              options: [
                { id: "opt1", text: "cos(x)", isCorrect: true },
                { id: "opt2", text: "-cos(x)", isCorrect: false },
                { id: "opt3", text: "sin(x)", isCorrect: false },
                { id: "opt4", text: "-sin(x)", isCorrect: false },
              ],
              explanation:
                "The derivative of sin(x) is cos(x). This is a fundamental trigonometric derivative.",
              difficulty: "medium" as const,
              subject: "Mathematics",
              topic: "Calculus",
              order: 3,
              marks: 2,
            },
            {
              question:
                "What is the limit of (x² - 4)/(x - 2) as x approaches 2?",
              options: [
                { id: "opt1", text: "4", isCorrect: true },
                { id: "opt2", text: "0", isCorrect: false },
                { id: "opt3", text: "∞", isCorrect: false },
                { id: "opt4", text: "2", isCorrect: false },
              ],
              explanation:
                "Factorizing: (x² - 4)/(x - 2) = (x + 2)(x - 2)/(x - 2) = x + 2. As x → 2, this approaches 4.",
              difficulty: "medium" as const,
              subject: "Mathematics",
              topic: "Calculus",
              order: 4,
              marks: 3,
            },
            {
              question:
                "What is the area under the curve y = x from x = 0 to x = 3?",
              options: [
                { id: "opt1", text: "4.5", isCorrect: true },
                { id: "opt2", text: "9", isCorrect: false },
                { id: "opt3", text: "3", isCorrect: false },
                { id: "opt4", text: "6", isCorrect: false },
              ],
              explanation:
                "Using integration: ∫₀³ x dx = [x²/2]₀³ = 9/2 - 0 = 4.5",
              difficulty: "hard" as const,
              subject: "Mathematics",
              topic: "Calculus",
              order: 5,
              marks: 2,
            },
          ],
        },
        {
          title: "Biology - Cell Structure",
          description:
            "Understanding cellular biology, organelles, and basic life processes.",
          examYear: "2027",
          classType: ["REVISION"],
          timeLimit: 40,
          passingMarks: 35,
          status: "published" as const,
          totalQuestions: 5,
          totalMarks: 7,
          createdBy: "admin",
          questions: [
            {
              question: "What is the powerhouse of the cell?",
              options: [
                { id: "opt1", text: "Mitochondria", isCorrect: true },
                { id: "opt2", text: "Nucleus", isCorrect: false },
                { id: "opt3", text: "Ribosome", isCorrect: false },
                { id: "opt4", text: "Chloroplast", isCorrect: false },
              ],
              explanation:
                "Mitochondria are called the powerhouse of the cell because they produce ATP through cellular respiration.",
              difficulty: "easy" as const,
              subject: "Biology",
              topic: "Cell Organelles",
              order: 1,
              marks: 1,
            },
            {
              question: "What type of cell has a nucleus?",
              options: [
                { id: "opt1", text: "Eukaryotic cell", isCorrect: true },
                { id: "opt2", text: "Prokaryotic cell", isCorrect: false },
                { id: "opt3", text: "Bacterial cell", isCorrect: false },
                { id: "opt4", text: "Viral cell", isCorrect: false },
              ],
              explanation:
                "Eukaryotic cells have a true nucleus enclosed by a nuclear membrane, unlike prokaryotic cells.",
              difficulty: "easy" as const,
              subject: "Biology",
              topic: "Cell Types",
              order: 2,
              marks: 1,
            },
            {
              question:
                "What is the process by which plants make their own food?",
              options: [
                { id: "opt1", text: "Photosynthesis", isCorrect: true },
                { id: "opt2", text: "Respiration", isCorrect: false },
                { id: "opt3", text: "Digestion", isCorrect: false },
                { id: "opt4", text: "Fermentation", isCorrect: false },
              ],
              explanation:
                "Photosynthesis is the process by which plants convert light energy, CO₂, and water into glucose and oxygen.",
              difficulty: "easy" as const,
              subject: "Biology",
              topic: "Plant Processes",
              order: 3,
              marks: 1,
            },
            {
              question: "What is the basic unit of heredity?",
              options: [
                { id: "opt1", text: "Gene", isCorrect: true },
                { id: "opt2", text: "Chromosome", isCorrect: false },
                { id: "opt3", text: "DNA", isCorrect: false },
                { id: "opt4", text: "Protein", isCorrect: false },
              ],
              explanation:
                "A gene is the basic unit of heredity, containing the instructions for making specific proteins.",
              difficulty: "medium" as const,
              subject: "Biology",
              topic: "Genetics",
              order: 4,
              marks: 2,
            },
            {
              question:
                "What is the process by which cells divide to produce identical daughter cells?",
              options: [
                { id: "opt1", text: "Mitosis", isCorrect: true },
                { id: "opt2", text: "Meiosis", isCorrect: false },
                { id: "opt3", text: "Fertilization", isCorrect: false },
                { id: "opt4", text: "Mutation", isCorrect: false },
              ],
              explanation:
                "Mitosis is the process of cell division that produces two identical daughter cells with the same number of chromosomes.",
              difficulty: "medium" as const,
              subject: "Biology",
              topic: "Cell Division",
              order: 5,
              marks: 2,
            },
          ],
        },
        {
          title: "Environmental Science",
          description:
            "Environmental concepts including ecosystems, pollution, and sustainability.",
          examYear: "2027",
          classType: ["PAPER"],
          timeLimit: 35,
          passingMarks: 30,
          status: "published" as const,
          totalQuestions: 5,
          totalMarks: 6,
          createdBy: "admin",
          questions: [
            {
              question: "What is the primary cause of global warming?",
              options: [
                { id: "opt1", text: "Greenhouse gases", isCorrect: true },
                { id: "opt2", text: "Ozone depletion", isCorrect: false },
                { id: "opt3", text: "Solar radiation", isCorrect: false },
                { id: "opt4", text: "Ocean currents", isCorrect: false },
              ],
              explanation:
                "Greenhouse gases like CO₂ trap heat in the atmosphere, causing global temperatures to rise.",
              difficulty: "easy" as const,
              subject: "Environmental Science",
              topic: "Climate Change",
              order: 1,
              marks: 1,
            },
            {
              question: "What is the largest carbon sink on Earth?",
              options: [
                { id: "opt1", text: "Oceans", isCorrect: true },
                { id: "opt2", text: "Forests", isCorrect: false },
                { id: "opt3", text: "Soil", isCorrect: false },
                { id: "opt4", text: "Atmosphere", isCorrect: false },
              ],
              explanation:
                "Oceans absorb about 25% of the CO₂ emitted by human activities, making them the largest carbon sink.",
              difficulty: "medium" as const,
              subject: "Environmental Science",
              topic: "Carbon Cycle",
              order: 2,
              marks: 1,
            },
            {
              question: "What is biodiversity?",
              options: [
                {
                  id: "opt1",
                  text: "Variety of life on Earth",
                  isCorrect: true,
                },
                { id: "opt2", text: "Number of species", isCorrect: false },
                { id: "opt3", text: "Size of ecosystems", isCorrect: false },
                { id: "opt4", text: "Amount of biomass", isCorrect: false },
              ],
              explanation:
                "Biodiversity refers to the variety of life on Earth, including species diversity, genetic diversity, and ecosystem diversity.",
              difficulty: "easy" as const,
              subject: "Environmental Science",
              topic: "Biodiversity",
              order: 3,
              marks: 1,
            },
            {
              question: "What is the main source of renewable energy?",
              options: [
                { id: "opt1", text: "Solar energy", isCorrect: true },
                { id: "opt2", text: "Nuclear energy", isCorrect: false },
                { id: "opt3", text: "Fossil fuels", isCorrect: false },
                { id: "opt4", text: "Coal", isCorrect: false },
              ],
              explanation:
                "Solar energy is the most abundant renewable energy source, providing clean and sustainable power.",
              difficulty: "easy" as const,
              subject: "Environmental Science",
              topic: "Renewable Energy",
              order: 4,
              marks: 1,
            },
            {
              question:
                "What is the process by which plants and animals break down organic matter?",
              options: [
                { id: "opt1", text: "Decomposition", isCorrect: true },
                { id: "opt2", text: "Photosynthesis", isCorrect: false },
                { id: "opt3", text: "Respiration", isCorrect: false },
                { id: "opt4", text: "Fermentation", isCorrect: false },
              ],
              explanation:
                "Decomposition is the process by which decomposers break down dead organic matter, returning nutrients to the ecosystem.",
              difficulty: "medium" as const,
              subject: "Environmental Science",
              topic: "Nutrient Cycling",
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
            await addDoc(collection(db, "mcqTests", packRef.id, "questions"), {
              ...question,
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
        // Delete all images from Firebase Storage first
        await StorageService.deleteMCQTestFolder(packId);

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
