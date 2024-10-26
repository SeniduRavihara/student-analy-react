import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import AuthLayout from "@/_routes/_auth/AuthLayout";
import AuthContextProvider from "./context/AuthContext";
import HomePage from "@/_routes/public/pages/HomePage";
import RootLayout from "@/_routes/RootLayout";
import DataContextProvider from "./context/DataContext";
import LoginPage from "./_routes/_auth/forms/LoginPage";
import PublicLayout from "./_routes/public/PublicLayout";
import PrivateLayout from "./_routes/private/PrivateLayout";
import AdminLayout from "./_routes/admin/AdminLayout";
import StudentDetailsPage from "./_routes/admin/pages/StudentDetailsPage";
import StudentProfilePage from "./_routes/private/pages/StudentProfilePage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />}>
      {/* public routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* public routes */}
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
      </Route>

      {/* private routes */}
      <Route element={<PrivateLayout />}>
        <Route index element={<StudentProfilePage />} />
      </Route>

      {/* admin routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<StudentDetailsPage />} />
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
