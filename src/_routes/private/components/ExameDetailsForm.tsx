import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CLASSES, CLASSES_TO_YEARS, EXAM_YEARS } from "@/constants";
import { cn } from "@/lib/utils";
import { SquareCheck } from "lucide-react";

type ClassType = (typeof CLASSES)[number]; // This will be 'THEORY' | 'REVISION'

type ExameDetailsFormProps = {
  school: string;
  setSchool: (school: string) => void;
  exameYear: string;
  setExamYear: (examYear: string) => void;
  media: string;
  setMedia: (media: string) => void;
  stream: string;
  setStream: (stream: string) => void;
  classes: ClassType[];
  setClasses: React.Dispatch<React.SetStateAction<ClassType[]>>;
};

const ExameDetailsForm = ({
  school,
  setSchool,
  exameYear,
  setExamYear,
  // media,
  setMedia,
  // stream,
  setStream,
  classes,
  setClasses,
}: ExameDetailsFormProps) => {
  const toggleClass = (classType: ClassType) => {
    setClasses(
      (prevClasses) =>
        prevClasses.includes(classType)
          ? prevClasses.filter((c) => c !== classType) // Remove if exists
          : [...prevClasses, classType] // Add if not exists
    );
  };

  return (
    <div className="w-[80%] ml-auto mr-auto mt-5 text-[#243642] flex flex-col gap-3 md:grid grid-cols-1 md:grid-cols-2 text-left">
      <div>
        <Label htmlFor="firstName" className="text-[#787e81]">
          School
        </Label>
        <Input
          type="text"
          id="firstName"
          value={school}
          onChange={(e) => setSchool(e.target.value)}
          required
          placeholder="School"
          className="focus-visible:ring-blue-500"
        />
      </div>

      <div>
        <Label htmlFor="firstName" className="text-[#787e81]">
          Exam Year
        </Label>
        <Select onValueChange={setExamYear} defaultValue={EXAM_YEARS[0].year}>
          <SelectTrigger className="">
            <SelectValue placeholder={EXAM_YEARS[0].year} />
          </SelectTrigger>
          <SelectContent>
            {EXAM_YEARS.map((year) => (
              <SelectItem key={year.year} value={year.year}>
                {year.label}
              </SelectItem>
            ))}
            {/* <SelectItem value="2024">2024 A/L</SelectItem>
          <SelectItem value="2025">2025 A/L</SelectItem>
          <SelectItem value="2026">2026 A/L</SelectItem> */}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="firstName" className="text-[#787e81]">
          Stram
        </Label>
        <Select onValueChange={setStream} defaultValue="maths">
          <SelectTrigger className="">
            <SelectValue placeholder="Mathematics" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="maths">Mathematics</SelectItem>
            <SelectItem value="bio">Biology</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="firstName" className="text-[#787e81]">
          Language
        </Label>
        <Select onValueChange={setMedia} defaultValue="sinhala">
          <SelectTrigger className="">
            <SelectValue placeholder="සිංහල" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sinhala">සිංහල</SelectItem>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="tamil">தமிழ்</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="col-span-2 flex justify-between gap-5">
        {CLASSES_TO_YEARS[exameYear as keyof typeof CLASSES_TO_YEARS].map(
          (classItem) => (
            <Card
              key={classItem}
              onClick={() => toggleClass(classItem)}
              className={cn(
                "py-2 px-3 text-center relative text-[#787e81] hover:bg-blue-300  duration-200 cursor-pointer w-full",
                classes.includes(classItem)
                  ? "bg-blue-400 text-white hover:bg-blue-300"
                  : "bg-white text-[#787e81] hover:bg-blue-300"
              )}
            >
              <div>{classItem}</div>

              <SquareCheck
                className={cn(
                  "absolute top-2 right-2",
                  classes.includes(classItem) ? "block" : "hidden"
                )}
              />
            </Card>
          )
        )}
      </div>
    </div>
  );
};

export default ExameDetailsForm;
