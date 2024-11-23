import MockGraph from "./MockGraph";

const GraphAnalysisSection = () => {
  return (
    <div className="flex md:flex-row flex-col justify-between items-center w-full p-3">
      <MockGraph />

      <div className="flex flex-col items-center text-center p-3">
        <h1 className="font-bold">Marks Analysis System</h1>
        <p className="mt-4">
          තනි තනි වශයෙන් සිසුන්ට තමන්ගේ ලකුණු මට්ටමේ විචලනය සහ තමන්ගේ rank එක
          අධ්‍යයනය කිරීම මඟින් ලකුණු මට්ටම ඉහළ නංවා ගැනීමට පෙළඹවීමක්.
        </p>
      </div>
    </div>
  );
};
export default GraphAnalysisSection;
