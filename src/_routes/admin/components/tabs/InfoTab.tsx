import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UserDataType } from "@/types";

const InfoTab = ({ userInfo }: { userInfo: UserDataType | null }) => {
  return (
    <Card className="w-full h-full mb-5">
      {/* Add max height and scroll */}
      {userInfo ? (
        <CardContent className="max-h-[500px] overflow-y-auto p-4 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-  mb-20">
            <div>
              <Label className="text-[#787e81]">First Name</Label>
              <p>{userInfo.firstName || "N/A"}</p>
            </div>
            <div>
              <Label className="text-[#787e81]">Last Name</Label>
              <p>{userInfo.lastName || "N/A"}</p>
            </div>
            <div>
              <Label className="text-[#787e81]">Phone Number</Label>
              <p>{userInfo.phone || "N/A"}</p>
            </div>
            <div>
              <Label className="text-[#787e81]">WhatsApp Number</Label>
              <p>{userInfo.whatsapp || "N/A"}</p>
            </div>
            <div>
              <Label className="text-[#787e81]">NIC Number</Label>
              <p>{userInfo.nic || "N/A"}</p>
            </div>
            <div>
              <Label className="text-[#787e81]">Birth Date</Label>
              <p>
                {userInfo.bDate
                  ? new Date(userInfo.bDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div>
              <Label className="text-[#787e81]">School</Label>
              <p>{userInfo.school || "N/A"}</p>
            </div>
            <div>
              <Label className="text-[#787e81]">Exam Year</Label>
              <p>{userInfo.examYear || "N/A"}</p>
            </div>
            <div>
              <Label className="text-[#787e81]">Stream</Label>
              <p>{userInfo.stream || "N/A"}</p>
            </div>
            <div>
              <Label className="text-[#787e81]">Medium</Label>
              <p>{userInfo.media || "N/A"}</p>
            </div>
            <div>
              <Label className="text-[#787e81]">Guardian's Name</Label>
              <p>{userInfo.gurdianName || "N/A"}</p>
            </div>
            <div>
              <Label className="text-[#787e81]">Guardian's Phone</Label>
              <p>{userInfo.gurdianPhone || "N/A"}</p>
            </div>
            <div className="md:col-span-2">
              <Label className="text-[#787e81]">Address</Label>
              <p>{userInfo.address || "N/A"}</p>
            </div>
          </div>
        </CardContent>
      ) : (
        <>Loading...</>
      )}
    </Card>
  );
};

export default InfoTab;
