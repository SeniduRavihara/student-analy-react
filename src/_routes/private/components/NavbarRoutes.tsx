import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { LogOut, SquareMenu, User } from "lucide-react";
import { logout } from "@/firebase/api";
import { useAuth } from "@/hooks/useAuth";

function NavbarRoutes() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex gap-x-2 ml-auto items-center">
      <span className="text-[#858796]">{currentUser?.displayName}</span>
      <div className="">
        {!currentUser ? (
          <User />
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
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4 text-[#d1d3e2]" />
                  <span className="text-[#65656d]">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
}
export default NavbarRoutes;
