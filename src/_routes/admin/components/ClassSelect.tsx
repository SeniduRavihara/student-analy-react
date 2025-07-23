import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CLASSES_TO_YEARS,
  ClassesType as ClassesDataType,
  ClassesType,
} from "@/constants";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

type ClassSelectProps = {
  selectedYear: string;
  selectedClass: ClassesDataType;
  setSelectedClass: React.Dispatch<React.SetStateAction<ClassesDataType>>;
};

const ClassSelect: React.FC<ClassSelectProps> = ({
  selectedYear,
  selectedClass,
  setSelectedClass,
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

  // console.log("Selected Class: ", selectedClass);

  return (
    <div className="w-36">
      <Select
        disabled={disabled}
        onValueChange={(value) => setSelectedClass(value as ClassesType)}
        // defaultValue={EXAM_YEARS[0].year}
        value={selectedClass}
      >
        <SelectTrigger className="">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {CLASSES_TO_YEARS[selectedYear as keyof typeof CLASSES_TO_YEARS].map(
            (item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            )
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ClassSelect;
