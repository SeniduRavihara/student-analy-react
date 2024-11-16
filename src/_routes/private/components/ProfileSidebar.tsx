import { medal, trophy } from "@/assets";
import ProfileImageCard from "./ProfileImageCard";
import { Card, CardContent } from "@/components/ui/card";
import "./ProfileSidebar.css";

const ProfileSidebar = () => {
  return (
    <Card className="w-[280px] h-full flex p-3 justify-center">
      <CardContent className="flex flex-col items-center justify-between">
        <ProfileImageCard />

        <div className=" flex items-center justify-between">
          <div className="flex flex-col items-center justify-center">
            <img src={trophy} alt="trophy" className="w-24 h-24" />
            <h2 className="text-[#F2ED53] custom-border-text">87</h2>
          </div>

          <div className="flex flex-col items-center justify-center">
            <img src={medal} alt="medal" className="w-24 h-24" />
            <h2 className="text-[#F2ED53] custom-border-text">3</h2>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default ProfileSidebar;
