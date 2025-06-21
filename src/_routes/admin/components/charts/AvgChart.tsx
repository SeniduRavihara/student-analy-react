import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  TooltipItem,
} from "chart.js";
import { TrendingUp } from "lucide-react";
import { Line } from "react-chartjs-2";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function AvgChart({
  chartData = [],
}: {
  chartData: Array<{ exam: string; avgMark: number | null }>;
}) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<"line">) {
            let label = context.dataset.label || "";

            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += `${context.parsed.y}`;
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Average Mark",
        },
      },
      x: {
        title: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
    },
    elements: {
      line: {
        tension: 0.4, // smooth lines
      },
    },
  };

  const labels = chartData.map((data) => data.exam);

  const data = {
    labels,
    datasets: [
      {
        label: "Average Mark",
        data: chartData.map((data) => data.avgMark),
        borderColor: "hsl(210, 70%, 50%)",
        backgroundColor: "hsla(210, 70%, 50%, 0.2)",
        fill: true,
      },
    ],
  };

  const dataPointWidth = 80; // pixels per data point
  const chartWidth = Math.max(400, labels.length * dataPointWidth);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Average Marks Per Exam</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div
            style={{
              position: "relative",
              height: "400px",
              width: `${chartWidth}px`,
            }}
          >
            <Line options={options} data={data} />
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
