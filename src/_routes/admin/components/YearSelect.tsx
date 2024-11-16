import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EXAM_YEARS } from "@/constants";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

type ExamYearSelectProps = {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
};

const ExamYearSelect: React.FC<ExamYearSelectProps> = ({
  selectedYear,
  setSelectedYear,
}) => {
  const [disabled, setDisabled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("/add-results/")) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [location.pathname]);

  return (
    <div className="w-36">
      <Select
        disabled={disabled}
        onValueChange={setSelectedYear}
        defaultValue={selectedYear}
      >
        <SelectTrigger
          className="border rounded p-2"
          defaultValue={EXAM_YEARS[0].year}
        >
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
  );
};

export default ExamYearSelect;
