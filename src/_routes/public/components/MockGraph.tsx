import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useEffect, useState } from "react";

export const description =
  "A scrollable line chart showing average exam scores";

// Sample chart data
const chartData = [
  { exam: "Exam 1", Mark: 50 },
  { exam: "Exam 2", Mark: 85 },
  { exam: "Exam 3", Mark: 45 },
  { exam: "Exam 4", Mark: 74 },
];

export default function MockGraph() {
  // Detect if the screen is mobile
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Track screen width dynamically
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex -ml-8">
      {/* Fixed Y-axis container */}
      <div className="flex items-center mr-4">
        <LineChart
          width={50}
          height={300}
          data={chartData}
          margin={{ top: 10, right: 10, bottom: 40, left: 5 }}
        >
          <YAxis
            domain={[0, 100]}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            // label={{
            //   value: "Average Mark",
            //   angle: -90,
            //   position: "insideLeft",
            //   dy: 50,
            // }}
          />
        </LineChart>
      </div>

      {/* Scrollable chart container */}
      <div className="overflow-x-auto">
        <LineChart
          width={isMobile ? screenWidth - 100 : chartData.length * 100} // Adjust width for mobile or desktop
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
            dataKey="Mark"
            type="linear"
            stroke="hsl(210, 70%, 50%)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </div>
    </div>
  );
}
