import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings, UserCircle } from "lucide-react";
import { logout } from "@/firebase/api";
import { useAuth } from "@/hooks/useAuth";
import { useData } from "@/hooks/useData";

function NavbarRoutes() {
  const { currentUser } = useAuth();
  const { currentUserData } = useData();
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleSignOut = async () => {
    if (isSigningOut) return; // Prevent multiple simultaneous sign-out attempts

    try {
      setIsSigningOut(true);
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      if (isMountedRef.current) {
        setIsSigningOut(false); // Reset loading state on error
      }
    }
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  // Get first letter of name for avatar fallback
  const getInitials = (name: string | null | undefined): string => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  const isLoggedIn = !!currentUser;

  return (
    <div className="flex w-10 h-10 md:w-auto md:h-auto md:gap-x-3 md:py-2 md:px-5 ml-auto items-center">
      <span className="text-[#858796] hidden md:block font-medium">
        {isSigningOut 
          ? "Signing out..." 
          : currentUser?.displayName || currentUserData?.userName || "User"
        }
      </span>
      
      <div className="relative">
        {!isLoggedIn ? (
          // Enhanced Sign-in Button
          <button
            onClick={handleSignIn}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative overflow-hidden group bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-4 py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
          >
            {/* Background animation effect */}
            <div
              className={`absolute inset-0 w-full h-full transition-all duration-300 ${
                isHovered ? "scale-105 opacity-50" : "scale-100 opacity-0"
              }`}
            >
              <div className="absolute -inset-full top-0 left-1/2 w-40 h-40 bg-white rounded-full opacity-10 mix-blend-overlay transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            </div>

            {/* Button content */}
            <div className="relative flex items-center space-x-2 z-10">
              <User className="h-4 w-4 transform group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-medium text-sm group-hover:tracking-wide transition-all duration-300 hidden md:inline">
                Sign In
              </span>
            </div>
          </button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center space-x-2 focus:outline-none group"
                disabled={isSigningOut}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-100 group-hover:border-blue-300 transition-all flex items-center justify-center bg-blue-100">
                  {currentUser?.photoURL && !imgError ? (
                    <img
                      src={currentUser.photoURL}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <span className="text-blue-600 font-medium text-sm">
                      {getInitials(currentUser?.displayName || currentUserData?.userName)}
                    </span>
                  )}
                </div>
              </button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent className="w-64 p-0" align="end">
              {/* User Info Header */}
              <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                <p className="text-sm font-medium text-gray-900">
                  {currentUser?.displayName || currentUserData?.userName || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {currentUser?.email || "No email"}
                </p>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                {currentUserData?.roles?.includes("ADMIN") ? (
                  <DropdownMenuItem
                    onClick={() => navigate("/admin")}
                    className="px-4 py-2 cursor-pointer hover:bg-blue-50 hover:text-blue-600 flex items-center group transition-colors"
                  >
<svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-shield-user-icon lucide-shield-user"
                      >
                        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                        <path d="M6.376 18.91a6 6 0 0 1 11.249.003" />
                        <circle cx="12" cy="11" r="4" />
                      </svg>                    <span>Admin Dashboard</span>
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuItem
                      onClick={() => navigate("/dashboard/profile")}
                      className="px-4 py-2 cursor-pointer hover:bg-blue-50 hover:text-blue-600 flex items-center group transition-colors"
                    >
                      <UserCircle className="mr-3 h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      <span>Profile</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => navigate("/dashboard")}
                      className="px-4 py-2 cursor-pointer hover:bg-blue-50 hover:text-blue-600 flex items-center group transition-colors"
                    >
                      <Settings className="mr-3 h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                  </>
                )}
              </div>

              <DropdownMenuSeparator />

              {/* Sign Out */}
              <div className="py-1">
                <DropdownMenuItem
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="px-4 py-2 cursor-pointer text-red-600 hover:bg-red-50 flex items-center group transition-colors"
                >
                  <LogOut className="mr-3 h-4 w-4 text-red-400 group-hover:text-red-500 transition-colors" />
                  <span>{isSigningOut ? "Signing out..." : "Sign Out"}</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}

export default NavbarRoutes;