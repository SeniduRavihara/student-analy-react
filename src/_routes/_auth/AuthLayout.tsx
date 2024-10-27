import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
  const { currentUser } = useAuth();

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      {!currentUser ? <Outlet /> : <Navigate to="/" />}
    </div>
  );
};
export default AuthLayout;
