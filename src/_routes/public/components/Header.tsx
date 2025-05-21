import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const Header = ({
  footerRef,
  cardsRef,
}: {
  footerRef: React.RefObject<HTMLDivElement>;
  cardsRef: React.RefObject<HTMLDivElement>;
}) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Replace with your auth logic
  const [isHovered, setIsHovered] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
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

  // Mock user data - replace with your actual user data
  const user = {
    name: "Student Name",
    email: "student@example.com",
    avatar: "/api/placeholder/32/32",
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  const handleSignOut = () => {
    // Your sign out logic here
    setIsLoggedIn(false);
  };

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
          <button className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium">
            About
          </button>
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

        {/* Mobile Menu Button and Profile */}
        <div className="flex items-center space-x-3">
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

          {/* Enhanced Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            {isLoggedIn ? (
              // Logged in state
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 focus:outline-none group"
                aria-expanded={isOpen}
                aria-haspopup="true"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-100 group-hover:border-blue-300 transition-all">
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="hidden md:block text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
                  {user.name}
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

            {/* Dropdown menu */}
            {isOpen && isLoggedIn && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 py-1 z-50">
                <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                  <p className="text-sm font-medium text-gray-900">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>

                <div className="py-1">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center group transition-colors"
                    onClick={() => navigate("/profile")}
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
                    onClick={() => navigate("/dashboard")}
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

                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center group transition-colors"
                    onClick={() => navigate("/settings")}
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
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Settings
                  </button>
                </div>

                <div className="py-1 border-t border-gray-100">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center group transition-colors"
                    onClick={handleSignOut}
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
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`block md:hidden bg-white border-t border-gray-100 ${
          mobileMenuOpen ? "max-h-40" : "max-h-0"
        } overflow-hidden transition-all duration-300`}
      >
        <div className="flex flex-col px-4 pb-4">
          <button className="text-gray-700 py-3 border-b border-gray-100 text-left font-medium">
            About
          </button>
          <button
            onClick={() => handleScrollToRef(cardsRef)}
            className="text-gray-700 py-3 border-b border-gray-100 text-left font-medium"
          >
            Classes
          </button>
          <button
            onClick={() => handleScrollToRef(footerRef)}
            className="text-gray-700 py-3 text-left font-medium"
          >
            Contact
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
