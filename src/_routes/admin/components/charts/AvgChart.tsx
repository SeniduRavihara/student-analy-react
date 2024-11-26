import { useEffect, useRef, useState } from "react";
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
        <div>Average Result: {data?.avgMark}</div>
      </div>
    );
  }
  return null;
};

// Chart component
export function AvgChart({
  chartData = [],
}: {
  chartData: Array<{ exam: string; avgMark: number }>;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [screenWidth] = useState(window.innerWidth);
  const [widthMultiplier, setWidthMultiplier] = useState(screenWidth / 4 + 10); // State for chart width multiplier

  // console.log(widthMultiplier, screenWidth);

  useEffect(() => {
    // Scroll to the end on component mount
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft =
        scrollContainerRef.current.scrollWidth;
    }
  }, []);

  // Add padding data points to fill the chart
  const paddedChartData = [
    // { exam: "", avgMark: 0 }, 
    ...chartData,
    { exam: "", avgMark: null }, 
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Average Marks Per Exam</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Slider to adjust width */}
        <div className="flex items-center gap-2">
          <label htmlFor="chart-slider" className="text-sm">
            Adjust Chart Width
          </label>
          <input
            id="chart-slider"
            type="range"
            min={100} // Minimum width per data point
            max={300} // Maximum width per data point
            value={widthMultiplier}
            onChange={(e) => setWidthMultiplier(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="flex">
          {/* Fixed Y-axis container */}
          <div className="flex items-center mr-4">
            <LineChart
              width={50}
              height={400}
              data={paddedChartData}
              margin={{ top: 1, right: 10, bottom: 120, left: 5 }}
              // className="gap-10"
            >
              <YAxis
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                label={{
                  value: "Average Mark",
                  angle: -90,
                  position: "insideLeft",
                  dy: 50,
                }}
              />
            </LineChart>
          </div>

          {/* Scrollable chart container */}
          <div className="overflow-x-auto w-full" ref={scrollContainerRef}>
            <LineChart
              width={Math.max(
                widthMultiplier,
                chartData.length * widthMultiplier
              )} // Dynamic width
              height={400}
              data={paddedChartData}
              margin={{ top: 10, bottom: 100 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
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
              <Tooltip content={<CustomTooltip />} />
              <Line
                dataKey="avgMark"
                type="linear"
                stroke="hsl(210, 70%, 50%)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </div>
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
