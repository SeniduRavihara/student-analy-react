import { logout } from "@/firebase/api";
import { useAuth } from "@/hooks/useAuth";
import { useData } from "@/hooks/useData";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = ({
  footerRef,
  cardsRef,
}: {
  footerRef: React.RefObject<HTMLDivElement>;
  cardsRef: React.RefObject<HTMLDivElement>;
}) => {
  const { currentUser } = useAuth();
  const { currentUserData } = useData();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false); // Add loading state
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true); // Track if component is mounted
  const [imgError, setImgError] = useState(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      if (!isMountedRef.current) return; // Check if component is still mounted

      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isMountedRef.current) return; // Check if component is still mounted

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleScrollToRef = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      const headerHeight = 70;
      const scrollPosition =
        ref.current.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({ top: scrollPosition, behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  const handleSignIn = () => {
    navigate("/login");
    setMobileMenuOpen(false); // Close mobile menu
  };

  const handleSignOut = async () => {
    if (isSigningOut) return; // Prevent multiple simultaneous sign-out attempts

    try {
      setIsSigningOut(true);
      setIsOpen(false); // Close dropdown immediately
      setMobileMenuOpen(false); // Close mobile menu

      await logout();
    } catch (error) {
      console.error("Error signing out:", error);
      if (isMountedRef.current) {
        setIsSigningOut(false); // Reset loading state on error
      }
    }
  };

  const handleMobileNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  // Get first letter of name for avatar fallback
  const getInitials = (name: string | null | undefined): string => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  const isLoggedIn = !!currentUser;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-white/90 backdrop-blur-lg"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center cursor-pointer"
        >
          <h1 className="text-2xl md:text-3xl font-extrabold text-blue-600">
            PHY<span className="text-gray-800">6LK</span>
          </h1>
          <div className="hidden md:block ml-2 px-2 py-1 bg-blue-100 rounded-full">
            <span className="text-xs text-blue-600 font-medium">
              Physics Education
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-1">
          <a
            href="#about"
            className="text-gray-700 no-underline hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
          >
            About
          </a>
          <button
            onClick={() => handleScrollToRef(cardsRef)}
            className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
          >
            Classes
          </button>
          <button
            onClick={() => handleScrollToRef(footerRef)}
            className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
          >
            Contact
          </button>
        </nav>

        {/* Desktop Profile and Mobile Menu Button */}
        <div className="flex items-center space-x-3">
          {/* Mobile Menu Button - Only show hamburger */}
          <div className="block md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50"
            >
              {mobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop Profile Dropdown - Hidden on mobile */}
          <div className="hidden md:block relative" ref={dropdownRef}>
            {isLoggedIn ? (
              // Logged in state
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 focus:outline-none group"
                aria-expanded={isOpen}
                aria-haspopup="true"
                disabled={isSigningOut} // Disable while signing out
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-100 group-hover:border-blue-300 transition-all flex items-center justify-center bg-blue-100">
                  {currentUser?.photoURL && !imgError ? (
                    <img
                      src={currentUser.photoURL}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <span className="text-blue-600 font-medium text-sm">
                      {getInitials(currentUser?.displayName)}
                    </span>
                  )}
                </div>
                <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
                  {isSigningOut
                    ? "Signing out..."
                    : currentUser?.displayName || "User"}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 text-gray-500 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  } group-hover:text-blue-600`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            ) : (
              // Enhanced Sign-in Button
              <button
                onClick={handleSignIn}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative overflow-hidden group bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-5 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 transform group-hover:rotate-12 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="font-medium text-sm group-hover:tracking-wide transition-all duration-300">
                    Sign In
                  </span>

                  {/* Small decorative dot */}
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-200 rounded-full opacity-70"></span>
                </div>
              </button>
            )}

            {/* Desktop Dropdown menu */}
            {isOpen && isLoggedIn && !isSigningOut && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 py-1 z-50">
                <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                  <p className="text-sm font-medium text-gray-900">
                    {currentUser?.displayName || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {currentUser?.email || "No email"}
                  </p>
                </div>

                <div className="py-1">
                  {currentUserData?.roles.includes("ADMIN") ? (
                    <button
                      className="w-full gap-3 text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center group transition-colors"
                      onClick={() => {
                        setIsOpen(false);
                        navigate("/admin");
                      }}
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
                      </svg>
                      Admin Dashboard
                    </button>
                  ) : (
                    <>
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center group transition-colors"
                        onClick={() => {
                          setIsOpen(false);
                          navigate("/dashboard/profile");
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2 text-gray-400 group-hover:text-blue-500 transition-colors"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Profile
                      </button>

                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center group transition-colors"
                        onClick={() => {
                          setIsOpen(false);
                          navigate("/dashboard");
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2 text-gray-400 group-hover:text-blue-500 transition-colors"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                        Dashboard
                      </button>
                    </>
                  )}
                </div>

                <div className="py-1 border-t border-gray-100">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center group transition-colors"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 text-red-400 group-hover:text-red-500 transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    {isSigningOut ? "Signing out..." : "Sign Out"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Menu with Authentication */}
      <div
        className={`block md:hidden bg-white border-t border-gray-100 ${
          mobileMenuOpen ? "max-h-[600px]" : "max-h-0"
        } overflow-hidden transition-all duration-300`}
      >
        <div className="flex flex-col px-4 pb-4">
          {/* User Info Section (if logged in) */}
          {isLoggedIn && (
            <div className="flex items-center space-x-3 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-transparent rounded-lg px-3 my-2">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-100 flex items-center justify-center bg-blue-100">
                {currentUser?.photoURL && !imgError ? (
                  <img
                    src={currentUser.photoURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <span className="text-blue-600 font-medium text-sm">
                    {getInitials(currentUser?.displayName)}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {currentUser?.displayName || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {currentUser?.email || "No email"}
                </p>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <a
            href="#about"
            className="text-gray-700 no-underline py-3 border-b border-gray-100 text-left font-medium hover:text-blue-600 hover:bg-blue-50 px-2 rounded transition-colors"
          >
            About
          </a>

          <button
            onClick={() => handleScrollToRef(cardsRef)}
            className="text-gray-700 py-3 border-b border-gray-100 text-left font-medium hover:text-blue-600 hover:bg-blue-50 px-2 rounded transition-colors"
          >
            Classes
          </button>

          <button
            onClick={() => handleScrollToRef(footerRef)}
            className="text-gray-700 py-3 border-b border-gray-100 text-left font-medium hover:text-blue-600 hover:bg-blue-50 px-2 rounded transition-colors"
          >
            Contact
          </button>

          {/* Authentication Section */}
          {isLoggedIn ? (
            <>
              {/* Profile Options */}
              <button
                onClick={() => handleMobileNavigation("/dashboard/profile")}
                className="text-gray-700 py-3 border-b border-gray-100 text-left font-medium hover:text-blue-600 hover:bg-blue-50 px-2 rounded transition-colors flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Profile
              </button>

              <button
                onClick={() => handleMobileNavigation("/dashboard")}
                className="text-gray-700 py-3 border-b border-gray-100 text-left font-medium hover:text-blue-600 hover:bg-blue-50 px-2 rounded transition-colors flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Dashboard
              </button>

              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="text-red-600 py-3 text-left font-medium hover:bg-red-50 px-2 rounded transition-colors flex items-center mt-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                {isSigningOut ? "Signing out..." : "Sign Out"}
              </button>
            </>
          ) : (
            // Sign In Button for Mobile
            <button
              onClick={handleSignIn}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg mt-3 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
