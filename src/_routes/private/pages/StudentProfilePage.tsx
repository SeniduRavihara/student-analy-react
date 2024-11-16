import ProfileSidebar from "../components/ProfileSidebar";
import StudentInfo from "../components/StudentInfo";

const StudentProfilePage = () => {
  return (
    <div className="w-full h-full flex justify-center gap-5 bg-[#ededed] p-5">
      <StudentInfo />
      <ProfileSidebar />
    </div>
  );
};
export default StudentProfilePage;
