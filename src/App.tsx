import AuthLayout from "@/_routes/_auth/AuthLayout";
import LoginPage from "@/_routes/_auth/forms/LoginPage";
import AdminLayout from "@/_routes/admin/AdminLayout";
import AdminDashboard from "@/_routes/admin/pages/AdminDashboard";
import StudentDetailsPage from "@/_routes/admin/pages/StudentDetailsPage";
import StudentProfilePage from "@/_routes/private/pages/StudentProfilePage";
import PrivateLayout from "@/_routes/private/PrivateLayout";
import HomePage from "@/_routes/public/pages/HomePage";
import PublicLayout from "@/_routes/public/PublicLayout";
import RootLayout from "@/_routes/RootLayout";
import AuthContextProvider from "@/context/AuthContext";
import DataContextProvider from "@/context/DataContext";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import SignupPage from "./_routes/_auth/forms/SignupPage";
import AddResultsPage from "./_routes/admin/pages/AddResultsPage";
import AnalyticsPage from "./_routes/admin/pages/AnalyticsPage";
import CalendarPage from "./_routes/admin/pages/CalendarPage";
import ExamsPage from "./_routes/admin/pages/ExamsPage";
import MCQEditPage from "./_routes/admin/pages/MCQEditPage";
import MCQPage from "./_routes/admin/pages/MCQPage";
import MCQViewPage from "./_routes/admin/pages/MCQViewPage";
import DashboardPage from "./_routes/private/pages/DashboardPage";
import MCQResultsPage from "./_routes/private/pages/MCQResultsPage";
import MCQTestPage from "./_routes/private/pages/MCQTestPage";
import RegisterAsNewPage from "./_routes/private/pages/RegisterAsNewPage";
import StudentAnalyticsPage from "./_routes/private/pages/StudentAnalyticsPage";
import StudentCalendarPage from "./_routes/private/pages/StudentCalendarPage";
import UserMCQPage from "./_routes/private/pages/UserMCQPage";

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
          <Route path="mcq" element={<UserMCQPage />} />
          <Route path="mcq/:packId/test" element={<MCQTestPage />} />
          <Route path="mcq/results" element={<MCQResultsPage />} />
          <Route path="calendar" element={<StudentCalendarPage />} />
          <Route path="profile" element={<StudentProfilePage />} />
        </Route>
        <Route path="register-as-new" element={<RegisterAsNewPage />} />
      </Route>

      {/* admin routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<StudentDetailsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="exams" element={<ExamsPage />} />
        <Route path="mcq" element={<MCQPage />} />
        <Route path="mcq/:packId/edit" element={<MCQEditPage />} />
        <Route path="mcq/:packId/view" element={<MCQViewPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route
          path="exams/add-results/:examIdName"
          element={<AddResultsPage />}
        />
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
