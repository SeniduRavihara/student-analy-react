import { useAuth } from "@/hooks/useAuth";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { logout } from "@/firebase/api";
import { LogOut, SquareMenu, LogIn } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Link, useNavigate } from "react-router-dom";
import { forwardRef } from "react";
import { useData } from "@/hooks/useData";

const ProfileDropdown = () => {
  const { currentUser } = useAuth();
  const { currentUserData } = useData();

  const navigate = useNavigate();

  return (
    <>
      {!currentUser ? (
        <Link
          to="/login"
          className="rounded-md text-white font-semibold
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
                    src={currentUser.photoURL}
                    className="w-10 h-10 rounded-full cursor-pointer"
                  />
                ) : (
                  <HiOutlineUserCircle className="text-3xl cursor-pointer" />
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                <SquareMenu className="mr-2 h-4 w-4 text-[#d1d3e2]" />
                <span className="text-[#65656d] active:text-white">
                  Dashboard
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
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
