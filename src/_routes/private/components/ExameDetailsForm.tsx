import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EXAM_YEARS } from "@/constants";

type ExameDetailsFormProps = {
  school: string;
  setSchool: (school: string) => void;
  exameYear: string;
  setExamYear: (examYear: string) => void;
  media: string;
  setMedia: (media: string) => void;
  stream: string;
  setStream: (stream: string) => void;
};

const ExameDetailsForm = ({
  school,
  setSchool,
  // exameYear,
  setExamYear,
  // media,
  setMedia,
  // stream,
  setStream,
}: ExameDetailsFormProps) => {
  return (
    <div className="w-[50%] ml-auto mr-auto mt-5 text-[#243642] flex flex-col gap-3 text-left">
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
  );
};
export default ExameDetailsForm;
