import { useSidebar } from "@/context/SidebarContext";
import {
  BarChart3,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Students", href: "/admin/students", icon: Users },
  { name: "Exams", href: "/admin/exams", icon: BookOpen },
  { name: "Calendar", href: "/admin/calendar", icon: Calendar },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

export default function ModernAdminSidebar() {
  const { isOpen, isCollapsed, closeSidebar, toggleCollapse } = useSidebar();
  const location = useLocation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Mobile sidebar overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Dark overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={closeSidebar}
        />

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-blue-600">PHY6LK Admin</h1>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 p-2 rounded-md hover:bg-gray-100 transition-colors"
              onClick={closeSidebar}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={closeSidebar}
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors no-underline ${
                    isActive
                      ? "bg-blue-100 text-blue-700 border-r-2 border-blue-500"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                      isActive
                        ? "text-blue-500"
                        : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div
        className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? "lg:w-16" : "lg:w-64"
        }`}
      >
        <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200 shadow-sm">
          {/* Header with collapse button */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            {!isCollapsed && (
              <h1 className="text-xl font-bold text-blue-600 transition-opacity duration-200">
                PHY6LK Admin
              </h1>
            )}
            <button
              type="button"
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors ml-auto"
              onClick={toggleCollapse}
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 no-underline ${
                    isActive
                      ? "bg-blue-100 text-blue-700 border-r-2 border-blue-500"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } ${isCollapsed ? "justify-center" : ""}`}
                  title={isCollapsed ? item.name : ""}
                >
                  <item.icon
                    className={`h-5 w-5 flex-shrink-0 transition-colors ${
                      isActive
                        ? "text-blue-500"
                        : "text-gray-400 group-hover:text-gray-500"
                    } ${isCollapsed ? "" : "mr-3"}`}
                  />
                  {!isCollapsed && (
                    <span className="transition-opacity duration-200">
                      {item.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
