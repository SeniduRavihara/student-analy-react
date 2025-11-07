import { useAuth } from "@/hooks/useAuth";
import { LogOut, SquareMenu, LogIn } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Link, useNavigate } from "react-router-dom";
import { useData } from "@/hooks/useData";
import AuthService from "@/firebase/services/AuthService";

const ProfileDropdown = () => {
  const { currentUser } = useAuth();
  const { currentUserData } = useData();

  const navigate = useNavigate();

  return (
    <>
      {!currentUser ? (
        <Link
          to="/login"
          className="rounded-md text-black font-semibold
           text-xs md:text-base flex gap-2 no-underline"
          //  style={{textDecoration: "none"}}
        >
          <LogIn />
          <span>Signin</span>
        </Link>
      ) : (
        <div className="mt-1">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div>
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL ?? ""}
                    className="w-10 h-10 rounded-full cursor-pointer"
                  />
                ) : (
                  <img
                    src="/account.png"
                    className="w-10 h-10 rounded-full cursor-pointer"
                  />
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#e2f1e7c5]">
              {currentUserData?.roles == "ADMIN" ? (
                <DropdownMenuItem onClick={() => navigate("/admin")}>
                  <SquareMenu className="mr-2 h-4 w-4 text-[#15238f79]" />
                  <span className="text-[#65656d]">Admin Dashboard</span>
                </DropdownMenuItem>
              ) : currentUserData?.registered ? (
                <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                  <SquareMenu className="mr-2 h-4 w-4 text-[#d1d3e2]" />
                  <span className="text-[#65656d]">Dashboard</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => navigate("/register-as-new")}>
                  <SquareMenu className="mr-2 h-4 w-4 text-[#d1d3e2]" />
                  <span className="text-[#65656d]">Register</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="bg-[#d1d3e2]" />
              <DropdownMenuItem onClick={AuthService.logout}>
                <LogOut className="mr-2 h-4 w-4 text-[#d1d3e2]" />
                <span className="text-[#65656d]">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </>
  );
};
export default ProfileDropdown;
