import { medal, trophy } from "@/assets";
import ProfileImageCard from "./ProfileImageCard";
import { Card, CardContent } from "@/components/ui/card";
import "./ProfileSidebar.css";
import { useData } from "@/hooks/useData";

const ProfileSidebar = () => {
  const { currentUserData } = useData();

  return (
    <Card className="w-full xl:w-[280px] h-full flex p-3 justify-center">
      <CardContent className="flex flex-col md:flex-row xl:flex-col items-center justify-between">
        <ProfileImageCard />

        <div className=" flex items-center justify-between">
          <div className="flex flex-col items-center justify-center">
            <img src={trophy} alt="trophy" className="w-24 h-24" />
            <h2 className="text-[#F2ED53] custom-border-text">
              {currentUserData?.lastResult}
            </h2>
          </div>

          <div className="flex flex-col items-center justify-center">
            <img src={medal} alt="medal" className="w-24 h-24" />
            <h2 className="text-[#F2ED53] custom-border-text">
              {currentUserData?.lastRank}
            </h2>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default ProfileSidebar;
