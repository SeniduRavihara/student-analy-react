import { forwardRef, useState } from "react";

const cardContent = [
  {
    title: "Theory",
    content:
      "වෙන් වෙන් වශයෙන් සියලුම සිසුන් කෙරෙහි අවධානය යොමු කරමින්, විෂය නිර්දේශයෙහි ඇතුළත් සියලුම සිද්ධාන්ත කොටස් සහ ප්‍රායෝගික පරීක්ෂණ නිබන්ධන ඇසුරින් ක්‍රමානුකූලව අවසන් කිරීම.",
  },
  {
    title: "Paper class",
    content:
      "විෂය නිර්දේශයේ පළමු පාඩම අවසන් වනවාත් සමඟම, සිසුන්ට පන්ති කාමරය තුළදී මෙන්ම online Zoom තාක්ෂණය හරහා ද, ප්‍රශ්න පත්‍ර නියමිත කාලය තුළ ලිවීමට සැළැස්වීමෙන් සිසුන්ව විභාග රටාවට හුරු කිරීම",
  },
  {
    title: "Model Papers + Past papers discussion",
    content:
      "සතියකට දින 2ක්, පැය 4 බැගින්, මසකට දින 8ක් ක්‍රමානුකූලව ගැටලු  සාකච්චා කරමින්, විෂය සමගාමීව සිසුන් ඉදිරිපත් කරන ගැටලු ද සාකච්ඡා කිරීම",
  },
  {
    title: "Memory Refresh Program",
    content:
      "විෂය කරුණු නැවත නැවතත් මතක් කරමින් සහ අවසන් කරන ලද කොටස් සඳහා Model ප්‍රශ්න ලබා දෙමින්, සිසුන්හට විෂය කරුණු  අමතක වීමට නොදීම සඳහා ආකර්ෂණය වැඩපිළිවෙළක්",
  },
];

const PhysicsSVG = () => (
  <svg
    viewBox="0 0 120 120"
    className="absolute top-0 right-0 w-32 h-32 opacity-10"
  >
    <g fill="currentColor">
      <circle cx="60" cy="60" r="10" />
      <ellipse
        cx="60"
        cy="60"
        rx="30"
        ry="10"
        transform="rotate(0)"
        className="animate-spin-slow"
        style={{ transformOrigin: "center", animationDuration: "12s" }}
      />
      <ellipse
        cx="60"
        cy="60"
        rx="30"
        ry="10"
        transform="rotate(60)"
        className="animate-spin-slow"
        style={{ transformOrigin: "center", animationDuration: "10s" }}
      />
      <ellipse
        cx="60"
        cy="60"
        rx="30"
        ry="10"
        transform="rotate(120)"
        className="animate-spin-slow"
        style={{ transformOrigin: "center", animationDuration: "8s" }}
      />
    </g>
  </svg>
);

const AtomSVG = () => (
  <svg
    viewBox="0 0 100 100"
    className="absolute -bottom-6 -left-6 w-24 h-24 opacity-10"
  >
    <g fill="currentColor">
      <circle cx="50" cy="50" r="5" />
      <circle
        cx="50"
        cy="20"
        r="3"
        className="animate-pulse"
        style={{ animationDuration: "2s" }}
      />
      <circle
        cx="80"
        cy="50"
        r="3"
        className="animate-pulse"
        style={{ animationDuration: "2.5s" }}
      />
      <circle
        cx="50"
        cy="80"
        r="3"
        className="animate-pulse"
        style={{ animationDuration: "3s" }}
      />
      <circle
        cx="20"
        cy="50"
        r="3"
        className="animate-pulse"
        style={{ animationDuration: "3.5s" }}
      />
      <path
        d="M50,50 C50,30 70,50 50,50 C30,50 50,70 50,50 C50,30 30,50 50,50 C70,50 50,70 50,50"
        className="animate-spin-slow"
        style={{
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "1",
          transformOrigin: "center",
          animationDuration: "15s",
        }}
      />
    </g>
  </svg>
);

const FormulasSVG = () => (
  <svg
    viewBox="0 0 80 80"
    className="absolute -bottom-4 -right-4 w-20 h-20 opacity-10"
  >
    <g fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M10,40 L70,40" />
      <path d="M20,20 L60,60" />
      <path d="M20,60 L60,20" />
      <path d="M40,10 L40,70" />
      <circle cx="40" cy="40" r="30" />
      <text x="25" y="30" fill="currentColor" fontSize="8">
        E=mc²
      </text>
      <text x="45" y="55" fill="currentColor" fontSize="8">
        F=ma
      </text>
      <text x="15" y="55" fill="currentColor" fontSize="8">
        v=λf
      </text>
    </g>
  </svg>
);

const WavesSVG = ({ isAnimating }: { isAnimating: boolean }) => {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-16 mt-4">
      <path
        d="M0,40 Q20,20 40,40 Q60,60 80,40 Q100,20 120,40 Q140,60 160,40 Q180,20 200,40"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray={isAnimating ? "200" : "0"}
        strokeDashoffset={isAnimating ? "400" : "0"}
        className="transition-all duration-1000"
        style={{
          animation: isAnimating ? "dash 3s linear infinite" : "none",
        }}
      />
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </svg>
  );
};

interface PhysicsClassCardProps {
  title: string;
  content: string;
  index: number;
}

const PhysicsClassCard = ({ title, content, index }: PhysicsClassCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const bgColors = [
    "from-blue-50 to-cyan-50 text-blue-900",
    "from-purple-50 to-indigo-50 text-purple-900",
    "from-emerald-50 to-teal-50 text-emerald-900",
    "from-amber-50 to-orange-50 text-amber-900",
  ];

  const svgIcons = [
    <PhysicsSVG key="physics" />,
    <AtomSVG key="atom" />,
    <FormulasSVG key="formulas" />,
    <svg
      key="brain"
      viewBox="0 0 100 100"
      className="absolute top-4 left-4 w-20 h-20 opacity-10"
    >
      <path
        d="M50,10 C70,10 80,30 80,50 C80,65 70,80 50,80 C30,80 20,65 20,50 C20,30 30,10 50,10 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M50,30 C55,30 60,35 60,40 C60,45 55,50 50,50 C45,50 40,45 40,40 C40,35 45,30 50,30 Z"
        fill="currentColor"
      />
      <path
        d="M30,40 C35,40 40,45 40,50 C40,55 35,60 30,60 C25,60 20,55 20,50 C20,45 25,40 30,40 Z"
        fill="currentColor"
        className="animate-pulse"
        style={{ animationDuration: "3s" }}
      />
      <path
        d="M70,40 C75,40 80,45 80,50 C80,55 75,60 70,60 C65,60 60,55 60,50 C60,45 65,40 70,40 Z"
        fill="currentColor"
        className="animate-pulse"
        style={{ animationDuration: "3.5s" }}
      />
    </svg>,
  ];

  return (
    <div
      className={`relative overflow-hidden rounded-xl transition-all duration-500 ease-in-out transform ${
        isHovered ? "scale-105" : ""
      } bg-gradient-to-br ${
        bgColors[index % bgColors.length]
      } shadow-lg border border-opacity-20 border-white`}
      style={{
        perspective: "1000px",
        backfaceVisibility: "hidden",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {svgIcons[index % svgIcons.length]}

      <div className="p-6 z-10 relative">
        <div
          className={`h-12 flex items-center transition-all duration-500 ${
            isHovered ? "mb-2" : "mb-4"
          }`}
        >
          <h3 className="text-xl font-bold">{title}</h3>
        </div>

        <div
          className={`transition-all duration-500 ${
            isHovered ? "opacity-100" : "opacity-90"
          }`}
        >
          <p className="text-sm">{content}</p>
        </div>

        <WavesSVG isAnimating={isHovered} />
      </div>

      <div
        className="absolute inset-0 bg-gradient-to-tr from-white to-transparent opacity-0 transition-opacity duration-500"
        style={{
          opacity: isHovered ? 0.2 : 0,
          transform: `rotate(${isHovered ? -3 : 0}deg)`,
          transition: "opacity 500ms, transform 500ms",
        }}
      />
    </div>
  );
};

const CardsSection = forwardRef<HTMLDivElement, object>((_props, ref) => {
  return (
    <div
      ref={ref}
      id="card-section"
      className="py-16 px-4 bg-gradient-to-br from-blue-50 to-white overflow-hidden"
    >
      <div className="max-w-6xl mx-auto relative">
        {/* Background decorative elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-100 opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-cyan-100 opacity-20 blur-3xl"></div>

        <div className="text-center mb-16 relative">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900">
            Physics Class Programs
          </h2>
          <div className="mt-4 w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>

          <svg
            viewBox="0 0 200 40"
            className="w-full h-10 mt-4 text-blue-800 opacity-10"
          >
            <path
              d="M0,20 Q40,5 80,20 Q120,35 160,20 Q200,5 240,20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            <circle
              cx="40"
              cy="10"
              r="2"
              fill="currentColor"
              className="animate-bounce"
              style={{ animationDuration: "2s" }}
            />
            <circle
              cx="100"
              cy="30"
              r="2"
              fill="currentColor"
              className="animate-bounce"
              style={{ animationDuration: "2.3s" }}
            />
            <circle
              cx="160"
              cy="15"
              r="2"
              fill="currentColor"
              className="animate-bounce"
              style={{ animationDuration: "1.8s" }}
            />
          </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cardContent.map((data, index) => (
            <PhysicsClassCard
              key={index}
              title={data.title}
              content={data.content}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

export default CardsSection;
