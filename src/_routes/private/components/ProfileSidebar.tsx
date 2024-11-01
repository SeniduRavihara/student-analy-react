import ProfileImageCard from "./ProfileImageCard";
import { Card, CardContent } from "@/components/ui/card";

const ProfileSidebar = () => {
  return (
    <div className="w-[300px] h-full flex p-3 justify-center">
      <Card className="w-[280px] h-full flex p-3 justify-center bg-[#E2F1E7]">
        <CardContent>
          <ProfileImageCard />
        </CardContent>
      </Card>
    </div>
  );
};
export default ProfileSidebar;
