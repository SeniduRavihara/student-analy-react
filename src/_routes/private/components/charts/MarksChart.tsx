import { useEffect, useRef } from "react";
import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const description =
  "A scrollable line chart showing average exam scores";

// Sample chart data
const chartData = [
  { exam: "Exam 1", avgMark: 78 },
  { exam: "Exam 2", avgMark: 85 },
  { exam: "Exam 3", avgMark: 68 },
  { exam: "Exam 4", avgMark: 74 },
  { exam: "Exam 5", avgMark: 90 },
  { exam: "Exam 6", avgMark: 82 },
  { exam: "Exam 7", avgMark: 76 },
  { exam: "Exam 8", avgMark: 88 },
];

// Chart component
export function MarksChart() {
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    // Scroll to the end on component mount
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft =
        scrollContainerRef.current.scrollWidth;
    }
  }, []);

  return (
    <Card className="w-full max-w-[600px]">
      <CardHeader>
        <CardTitle>Average Marks Per Exam</CardTitle>
        <CardDescription>Scrollable for multiple exams</CardDescription>
      </CardHeader>
      <CardContent className="flex">
        {/* Fixed Y-axis container */}
        <div className="flex items-center mr-4">
          <LineChart width={50} height={300} data={chartData}>
            <YAxis
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              label={{
                value: "Average Mark",
                angle: -90,
                position: "insideLeft",
              }}
            />
          </LineChart>
        </div>

        {/* Scrollable chart container */}
        <div className="overflow-x-auto" ref={scrollContainerRef}>
          <LineChart
            width={chartData.length * 100} // Extend width based on data points
            height={300}
            data={chartData}
            margin={{ top: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            {/* X Axis for exam names */}
            <XAxis
              dataKey="exam"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            {/* Tooltip */}
            <Tooltip />
            {/* Line for average marks */}
            <Line
              dataKey="avgMark"
              type="linear"
              stroke="hsl(210, 70%, 50%)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Latest exam trend <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Displaying average marks for recent exams
        </div>
      </CardFooter>
    </Card>
  );
}
