import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";
import { TrendingUp, Award, Users, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data for the chart
const mockData = [
  { month: "Jan", marks: 65, average: 60 },
  { month: "Feb", marks: 68, average: 62 },
  { month: "Mar", marks: 72, average: 63 },
  { month: "Apr", marks: 69, average: 65 },
  { month: "May", marks: 74, average: 66 },
  { month: "Jun", marks: 78, average: 67 },
  { month: "Jul", marks: 82, average: 69 },
  { month: "Aug", marks: 86, average: 70 },
];

// Animated MockGraph component
type GraphData = { month: string; marks: number; average: number };

const MockGraph = () => {
  const [data, setData] = useState<GraphData[]>([]);
  const [showData, setShowData] = useState(false);
  const [currentRank, setCurrentRank] = useState("--");
  const [improvement, setImprovement] = useState("--");

  // Animation on mount
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowData(true);
          animateData();
          animateStats();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    const graphElement = document.getElementById("animated-graph");
    if (graphElement) observer.observe(graphElement);

    return () => {
      if (graphElement) observer.disconnect();
    };
  }, []);

  // Animate the graph data
  const animateData = () => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex > mockData.length) {
        clearInterval(interval);
        return;
      }
      setData(mockData.slice(0, currentIndex));
      currentIndex++;
    }, 200);
  };

  // Animate the stats
  const animateStats = () => {
    let iterations = 0;
    const interval = setInterval(() => {
      if (iterations >= 20) {
        clearInterval(interval);
        setCurrentRank("8");
        setImprovement("+14%");
        return;
      }
      setCurrentRank(Math.floor(Math.random() * 30).toString());
      setImprovement(`+${Math.floor(Math.random() * 20)}%`);
      iterations++;
    }, 50);
  };

  return (
    <div
      id="animated-graph"
      className="w-full max-w-xl bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Performance Tracking
          </h3>
          <div className="flex space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Monthly
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              2023-2024
            </span>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={showData ? data : []}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorMarks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "none",
                  borderRadius: "0.5rem",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="average"
                stroke="#6366f1"
                fillOpacity={1}
                fill="url(#colorAvg)"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6, stroke: "#4f46e5", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="marks"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6, stroke: "#2563eb", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <TrendingUp className="mx-auto text-blue-600 mb-1" size={20} />
            <p className="text-sm text-gray-600">Current Rank</p>
            <p className="text-xl font-bold text-blue-800">{currentRank}</p>
          </div>
          <div className="bg-indigo-50 rounded-lg p-3 text-center">
            <Award className="mx-auto text-indigo-600 mb-1" size={20} />
            <p className="text-sm text-gray-600">Improvement</p>
            <p className="text-xl font-bold text-indigo-800">{improvement}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <Users className="mx-auto text-purple-600 mb-1" size={20} />
            <p className="text-sm text-gray-600">Class Size</p>
            <p className="text-xl font-bold text-purple-800">42</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wave SVG component for decorative purposes
const WaveSVG = () => (
  <svg
    className="absolute bottom-0 left-0 w-full opacity-10"
    viewBox="0 0 1440 320"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="#4f46e5"
      fillOpacity="0.8"
      d="M0,128L48,138.7C96,149,192,171,288,176C384,181,480,171,576,138.7C672,107,768,53,864,48C960,43,1056,85,1152,106.7C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
    ></path>
    <path
      fill="#3b82f6"
      fillOpacity="0.5"
      d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,170.7C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
    ></path>
  </svg>
);

// Main GraphAnalysisSection component
const GraphAnalysisSection = () => {
   const navigate = useNavigate();

  return (
    <div className="py-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      <WaveSVG />

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Marks Analysis System
          </h2>
          <div className="mt-3 w-24 h-1 bg-indigo-600 mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Empowering students with data-driven insights
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            <MockGraph />
          </div>

          <div className="w-full lg:w-2/5 order-1 lg:order-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-4">
              <Activity className="text-indigo-600 mr-3" size={24} />
              <h2 className="text-2xl font-bold text-gray-800">
                Performance Tracking
              </h2>
            </div>

            <p className="text-gray-600 mb-6">
              තනි තනි වශයෙන් සිසුන්ට තමන්ගේ ලකුණු මට්ටමේ විචලනය සහ තමන්ගේ rank
              එක අධ්‍යයනය කිරීම මඟින් ලකුණු මට්ටම ඉහළ නංවා ගැනීමට පෙළඹවීමක්.
            </p>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                  <span className="text-blue-600 text-sm font-medium">1</span>
                </div>
                <p className="ml-3 text-sm text-gray-600">
                  Track individual progress over time
                </p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                  <span className="text-blue-600 text-sm font-medium">2</span>
                </div>
                <p className="ml-3 text-sm text-gray-600">
                  Compare with class average performance
                </p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                  <span className="text-blue-600 text-sm font-medium">3</span>
                </div>
                <p className="ml-3 text-sm text-gray-600">
                  Identify improvement opportunities
                </p>
              </div>
            </div>

            <button onClick={()=> navigate("/dashboard")} className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center">
              <span>Explore Your Analytics</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute top-40 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-20 right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
    </div>
  );
};

export default GraphAnalysisSection;
