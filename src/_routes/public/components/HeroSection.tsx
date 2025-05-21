import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useState, useEffect } from "react";

const HeroSection = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div
      className={`w-full mt-20 bg-gradient-to-r from-blue-50 to-indigo-50 transition-opacity duration-700 ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div
          className={`flex ${isMobile ? "flex-col" : "flex-row"} items-center`}
        >
          {/* Left Content - Text */}
          <div
            className={`${isMobile ? "w-full text-center mb-8" : "w-1/2 pr-8"}`}
          >
            <div className="inline-block mb-2 px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
              Physics Fundamentals
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
              <span className="text-blue-600">Smart</span>
              <span className="text-gray-700"> PHYSICS</span>
            </h1>

            <p className="text-gray-600 mb-6 text-lg">
              Explore the laws of the universe through engaging lessons and
              practical demonstrations.
            </p>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg">
                Join Class
              </button>
              <button className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-200 px-6 py-3 rounded-lg font-medium transition-all shadow-sm hover:shadow-md">
                View Syllabus
              </button>
            </div>

            {/* Class Info Cards */}
            <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="bg-white p-3 rounded-lg shadow-sm flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray-700">
                  Tuesdays & Thursdays
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg shadow-sm flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray-700">Room 301</span>
              </div>
            </div>
          </div>

          {/* Right Content - Teacher Image */}
          <div className={`${isMobile ? "w-full" : "w-1/2"}`}>
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-yellow-100 rounded-full z-0 opacity-70"></div>
              <div className="absolute -bottom-6 -right-2 w-24 h-24 bg-blue-100 rounded-full z-0 opacity-70"></div>
              <div className="absolute top-1/3 -right-2 w-8 h-8 bg-indigo-100 rounded-full z-0 opacity-70"></div>

              {/* Teacher image container with border */}
              <div className="bg-white p-3 rounded-xl shadow-lg relative z-10">
                <div className="aspect-[4/3] rounded-lg overflow-hidden relative">
                  {/* This is a placeholder - replace with your actual teacher image */}
                  <img
                    src="/api/placeholder/500/400"
                    alt="Physics Teacher"
                    className="w-full h-full object-cover"
                  />

                  {/* Teacher info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/70 to-transparent p-4">
                    <h3 className="text-white font-bold text-lg">
                      Dr. Sarah Johnson
                    </h3>
                    <p className="text-gray-200 text-sm">
                      PhD in Theoretical Physics
                    </p>
                  </div>
                </div>
              </div>

              {/* Teacher stats */}
              <div className="absolute bottom-4 -left-4 bg-white shadow-md rounded-lg px-4 py-2 z-20">
                <div className="flex gap-3">
                  <div className="text-center">
                    <p className="text-blue-600 font-bold text-xl">15+</p>
                    <p className="text-xs text-gray-500">Years Experience</p>
                  </div>
                  <div className="text-center border-l border-gray-200 pl-3">
                    <p className="text-blue-600 font-bold text-xl">96%</p>
                    <p className="text-xs text-gray-500">Student Success</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
