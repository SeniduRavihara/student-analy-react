import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import AuthLayout from "@/_routes/_auth/AuthLayout";
import AuthContextProvider from "@/context/AuthContext";
import HomePage from "@/_routes/public/pages/HomePage";
import RootLayout from "@/_routes/RootLayout";
import DataContextProvider from "@/context/DataContext";
import LoginPage from "@/_routes/_auth/forms/LoginPage";
import PublicLayout from "@/_routes/public/PublicLayout";
import PrivateLayout from "@/_routes/private/PrivateLayout";
import AdminLayout from "@/_routes/admin/AdminLayout";
import StudentDetailsPage from "@/_routes/admin/pages/StudentDetailsPage";
import StudentProfilePage from "@/_routes/private/pages/StudentProfilePage";
import AddNewStudentPage from "@/_routes/admin/pages/AddNewStudentPage";
import SignupPage from "./_routes/_auth/forms/SignupPage";
import DashboardPage from "./_routes/private/pages/DashboardPage";
import AnalyticsPage from "./_routes/admin/pages/AnalyticsPage";
import StudentAnalyticsPage from "./_routes/private/pages/StudentAnalyticsPage";
import RegisterAsNewPage from "./_routes/private/pages/RegisterAsNewPage";
import ExamsPage from "./_routes/admin/pages/ExamsPage";
import AddResultsPage from "./_routes/admin/pages/AddResultsPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />}>
      {/* auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      {/* public routes */}
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
      </Route>

      {/* private routes */}
      <Route element={<PrivateLayout />}>
        <Route path="/dashboard" element={<DashboardPage />}>
          <Route index element={<StudentAnalyticsPage />} />
          <Route path="profile" element={<StudentProfilePage />} />
        </Route>
        <Route path="register-as-new" element={<RegisterAsNewPage />} />
      </Route>

      {/* admin routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<StudentDetailsPage />} />
        <Route path="add-student" element={<AddNewStudentPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="exams" element={<ExamsPage />} />
        <Route path="exams/:examId" element={<AddResultsPage />} />
      </Route>
    </Route>
  )
);

const App = () => {
  return (
    <DataContextProvider>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </DataContextProvider>
  );
};
export default App;
