import {
  // Card,
  CardContent,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useData } from "@/hooks/useData";

const ProfileImageCard = () => {
  const { currentUser } = useAuth();
  const { currentUserData } = useData();

  return (
    <div className="w-60 h-60 pt-2 bg-[#fff]">
      {/* <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader> */}
      <CardContent className="flex flex-col items-center justify-center text-[#858796]">
        <img
          src={currentUser?.photoURL || ""}
          className="w-36 h-36 rounded-full cursor-pointer"
        />
        <p className="text-center text-nowrap mt-2 text-xl">
          {currentUser?.displayName}
        </p>
        <p className="text-2xl">{currentUserData?.regNo}</p>
      </CardContent>
      {/* <CardFooter>
        <p>Card Footer</p>
      </CardFooter> */}
    </div>
  );
};
export default ProfileImageCard;
