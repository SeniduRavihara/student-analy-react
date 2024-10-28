import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

const ProfileImageCard = () => {
  const { currentUser } = useAuth();

  return (
    <Card className="w-60 h-60 p-5">
      {/* <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader> */}
      <CardContent className="flex flex-col gap-4 items-center justify-center">
        <img
          src={currentUser.photoURL}
          className="w-22 h-22 rounded-full cursor-pointer"
        />
        <p className="text-center text-nowrap text-[#858796]">
          {currentUser?.displayName}
        </p>
      </CardContent>
      {/* <CardFooter>
        <p>Card Footer</p>
      </CardFooter> */}
    </Card>
  );
};
export default ProfileImageCard;
