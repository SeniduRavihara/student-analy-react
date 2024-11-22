import TiltCard from "@/components/TiltCard";

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

const CardsSection = () => {
  return (
    <div className="w-full h-full">
      {/* <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className=""
        >
          <path
            fill="#243642"
            fill-opacity="1"
            d="M0,256L48,250.7C96,245,192,235,288,213.3C384,192,480,160,576,170.7C672,181,768,235,864,245.3C960,256,1056,224,1152,218.7C1248,213,1344,235,1392,245.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div> */}
      <div className="w-full min-h-[500px] flex flex-wrap justify-center items-center gap-6 p-4 md:p-8">
        {cardContent.map((data, index) => (
          <TiltCard key={index} content={data} />
        ))}
      </div>
    </div>
  );
};
export default CardsSection;
