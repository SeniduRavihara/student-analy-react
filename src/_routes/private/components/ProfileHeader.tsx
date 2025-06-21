import { medal, trophy } from "@/assets";
import { Card, CardContent } from "@/components/ui/card";
import { useData } from "@/hooks/useData";
import ProfileImageCard from "./ProfileImageCard";

const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string | number | undefined;
}) => (
  <div className="flex items-center gap-4">
    <img src={icon} alt={label} className="w-12 h-12" />
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold">{value || "N/A"}</p>
    </div>
  </div>
);

const ProfileHeader = () => {
  const { currentUserData } = useData();

  return (
    <Card className="w-full">
      <CardContent className="p-4 flex flex-col md:flex-row items-center gap-6">
        <ProfileImageCard />
        <div className="flex-grow text-center md:text-left">
          <h2 className="text-2xl font-bold">{currentUserData?.userName}</h2>
          <p className="text-muted-foreground">{currentUserData?.email}</p>
        </div>
        <div className="flex gap-6">
          <StatCard
            icon={trophy}
            label="Last Result"
            value={currentUserData?.lastResult ?? undefined}
          />
          <StatCard
            icon={medal}
            label="Last Rank"
            value={currentUserData?.lastRank}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
