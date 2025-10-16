import StudentInfo from "../components/StudentInfo";

const StudentProfilePage = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">
          Manage your personal information and view your exam history
        </p>
      </div>

      {/* Profile Content */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <StudentInfo />
      </div>
    </div>
  );
};
export default StudentProfilePage;
