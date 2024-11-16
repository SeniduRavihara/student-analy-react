import ProfileSidebar from "../components/ProfileSidebar";
import StudentInfo from "../components/StudentInfo";

const StudentProfilePage = () => {
  return (
    <div className="w-full h-full flex flex-col-reverse xl:flex-row justify-center gap-5 bg-[#ededed] p-2 md:p-5 mb-10">
      <StudentInfo />
      <ProfileSidebar />
    </div>
  );
};
export default StudentProfilePage;
