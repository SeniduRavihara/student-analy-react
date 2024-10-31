import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

type SidebarItemProps = {
  icon: LucideIcon;
  label: string;
  href: string;
};

function SidebarItem({ icon: Icon, label, href }: SidebarItemProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive =
    (location.pathname === "/" && href === "/") ||
    location.pathname === href 
    // location.pathname.startsWith(`${href}/`);

  const onClick = () => {
    navigate(href);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-x-2 text-[#E2F1E7] text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-[#e2f1e77a]",
        isActive &&
          "text-[#243642] bg-[#e2f1e77a] hover:bg-sky-200/20 hover:text-sky-700"
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn("text-[#E2F1E7]", isActive && "text-[#243642]")}
        />
        {label}
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-sky-700 h-full transition-all",
          isActive && "opacity-100"
        )}
      ></div>
    </button>
  );
}

export default SidebarItem;
