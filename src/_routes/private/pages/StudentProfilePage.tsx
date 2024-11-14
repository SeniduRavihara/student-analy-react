import ProfileSidebar from "../components/ProfileSidebar";
import StudentInfo from "../components/StudentInfo";

const StudentProfilePage = () => {
  return (
    <div className="w-full h-full overflow-scroll flex justify-between bg-[#ededed]">
      <StudentInfo />
      <ProfileSidebar />
    </div>
  );
};
export default StudentProfilePage;
