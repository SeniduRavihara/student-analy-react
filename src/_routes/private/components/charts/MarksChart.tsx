import { useEffect, useRef } from "react";
import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  TooltipProps,
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

// Custom tooltip component
const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;
    return (
      <div className="p-2 bg-white border border-gray-200 rounded shadow-md text-sm">
        <div className="font-semibold">{label}</div>
        <div>Mark: {data?.Mark}</div>
        <div>Average Result: {data?.avgResult}</div>
      </div>
    );
  }
  return null;
};

// Chart component
export function MarksChart({
  chartData = [],
}: {
  chartData: Array<{
    exam: string;
    Mark: number;
    avgResult: number;
    isAbsent: boolean;
  }>;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the end on component mount
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft =
        scrollContainerRef.current.scrollWidth;
    }
  }, [chartData]);

  // Filter out absent students from the chart data
  const filteredChartData = chartData.map((data) =>
    data.isAbsent
      ? { ...data, Mark: null, avgResult: null } // Replace absent data with null
      : data
  );

  const paddedChartData = [
    ...filteredChartData,
    { exam: "", Mark: null, avgResult: null }, // Padding at the end
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Average Marks Per Exam</CardTitle>
        <CardDescription>Scrollable for multiple exams</CardDescription>
      </CardHeader>
      <CardContent className="flex">
        {/* Scrollable chart container */}
        <div className="overflow-x-auto" ref={scrollContainerRef}>
          <LineChart
            width={paddedChartData.length * 100} // Extend width based on data points
            height={400}
            data={paddedChartData}
            margin={{ top: 10, bottom: 100 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            {/* X Axis for exam names */}
            <XAxis
              dataKey="exam"
              tickLine={false}
              axisLine={false}
              tickMargin={1}
              angle={45}
              textAnchor="start"
              interval={0}
              className="text-[12px]"
            />
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
            {/* Tooltip */}
            <Tooltip content={<CustomTooltip />} />
            {/* Line for average marks */}
            <Line
              dataKey="Mark"
              type="natural"
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

