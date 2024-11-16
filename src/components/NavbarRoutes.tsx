import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { logout } from "@/firebase/api";
import { useAuth } from "@/hooks/useAuth";
import { useData } from "@/hooks/useData";

function NavbarRoutes() {
  const { currentUser } = useAuth();
  const { currentUserData } = useData();
  const navigate = useNavigate();

  return (
    <div className="flex gap-x-3 py-2 ml-auto items-center border bg-white px-5 rounded-full">
      <span className="text-[#858796]">
        {currentUser?.displayName || currentUserData?.userName}
      </span>
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
                    <img
                      src="/account.png"
                      className="w-10 h-10 rounded-full cursor-pointer"
                    />
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
