import { useSidebar } from "@/context/SidebarContext";
import { ReactNode } from "react";

interface ResponsiveContentProps {
  children: ReactNode;
}

export function ResponsiveContent({ children }: ResponsiveContentProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div
      className={`transition-all duration-300 ease-in-out ${
        isCollapsed ? "lg:pl-16" : "lg:pl-64"
      }`}
    >
      {children}
    </div>
  );
}
