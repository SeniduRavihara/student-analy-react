
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export const description =
  "A scrollable line chart showing average exam scores";

// Sample chart data
const chartData = [
  { exam: "Exam 1", Mark: 50 },
  { exam: "Exam 2", Mark: 85 },
  { exam: "Exam 3", Mark: 45 },
  { exam: "Exam 4", Mark: 74 },
];

// Chart component
export default function MockGraph() {
  return (
    <div className="flex">
      {/* Fixed Y-axis container */}
      <div className="flex items-center mr-4">
        <LineChart width={50} height={300} data={chartData}>
          <YAxis
            domain={[0, 100]}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            label={{
              value: "",
              angle: -90,
              position: "insideLeft",
            }}
          />
        </LineChart>
      </div>

      {/* Scrollable chart container */}
      <div className="overflow-x-auto">
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
