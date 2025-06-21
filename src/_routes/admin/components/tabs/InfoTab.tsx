import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UserDataType } from "@/types";

const InfoSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold border-b pb-2 mb-4">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);

const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value: string | string[] | undefined;
}) => (
  <div>
    <Label className="text-sm text-muted-foreground">{label}</Label>
    {Array.isArray(value) ? (
      value.map((item, index) => (
        <p key={index} className="text-base">
          {item || "N/A"}
        </p>
      ))
    ) : (
      <p className="text-base">{value || "N/A"}</p>
    )}
  </div>
);

const InfoTab = ({ userInfo }: { userInfo: UserDataType | null }) => {
  return (
    <Card className="w-full h-full border-none shadow-none">
      {userInfo ? (
        <CardContent className="p-4">
          <InfoSection title="Personal Information">
            <InfoItem label="First Name" value={userInfo.firstName} />
            <InfoItem label="Last Name" value={userInfo.lastName} />
            <InfoItem label="NIC Number" value={userInfo.nic} />
            <InfoItem
              label="Birth Date"
              value={
                userInfo.bDate
                  ? new Date(userInfo.bDate).toLocaleDateString()
                  : undefined
              }
            />
          </InfoSection>

          <InfoSection title="Contact Details">
            <InfoItem label="Phone Number" value={userInfo.phone} />
            <InfoItem label="WhatsApp Number" value={userInfo.whatsapp} />
            <InfoItem label="Address" value={userInfo.address} />
          </InfoSection>

          <InfoSection title="Academic Information">
            <InfoItem label="School" value={userInfo.school} />
            <InfoItem label="Exam Year" value={userInfo.examYear} />
            <InfoItem label="Stream" value={userInfo.stream} />
            <InfoItem label="Medium" value={userInfo.media} />
            <InfoItem label="Classes" value={userInfo.classes} />
          </InfoSection>

          <InfoSection title="Guardian Information">
            <InfoItem label="Guardian's Name" value={userInfo.gurdianName} />
            <InfoItem label="Guardian's Phone" value={userInfo.gurdianPhone} />
          </InfoSection>
        </CardContent>
      ) : (
        <div className="text-center text-muted-foreground p-8">
          Loading student data...
        </div>
      )}
    </Card>
  );
};

export default InfoTab;
