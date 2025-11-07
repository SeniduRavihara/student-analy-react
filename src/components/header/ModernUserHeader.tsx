import { useSidebar } from "@/context/SidebarContext";
import AuthService from "@/firebase/services/AuthService";
import { useAuth } from "@/hooks/useAuth";
import { useData } from "@/hooks/useData";
import { Bell, LogOut, Menu, User } from "lucide-react";
import { useState } from "react";

export default function ModernUserHeader() {
  const { toggleSidebar } = useSidebar();
  const { currentUser } = useAuth();
  const { currentUserData } = useData();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple clicks

    setIsLoggingOut(true);
    try {
      console.log("Logging out...");
      await AuthService.logout();
      console.log("Sign out successful, redirecting...");
      // Use window.location.href for more reliable redirect in production
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      // Force redirect even if there's an error
      window.location.href = "/";
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden -m-2.5 p-2.5 text-gray-400 hover:text-gray-600 transition-colors"
          onClick={toggleSidebar}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" />
        </button>

        <div className="flex flex-1"></div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Notifications */}
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" />
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />

          {/* Profile dropdown */}
          <div className="flex items-center gap-x-2">
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-100 flex items-center justify-center bg-blue-100">
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-blue-600" />
              )}
            </div>
            <span className="hidden lg:block text-sm font-medium text-gray-700">
              {currentUserData?.userName ||
                currentUser?.displayName ||
                "Student"}
            </span>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Sign out"
          >
            {isLoggingOut ? (
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            <span className="hidden lg:block">
              {isLoggingOut ? "Signing out..." : "Sign out"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
