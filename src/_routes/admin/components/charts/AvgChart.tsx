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
    <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Average Marks Per Exam
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Performance trends across all exams
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <TrendingUp className="h-4 w-4" />
            <span className="font-medium">Latest Trends</span>
          </div>
        </div>
      </div>

      <div className="p-6">
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
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Displaying average marks for completed exams in {chartData.length}{" "}
          exam{chartData.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
