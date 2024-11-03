import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchUserInfo } from "@/firebase/api";
import { useAuth } from "@/hooks/useAuth";
import { UserInfoType } from "@/types";
import { useEffect, useState } from "react";

const StudentInfo = () => {
  const { currentUser } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [nic, setNic] = useState("");
  const [bDate, setBDate] = useState<Date>();
  const [phone, setPhone] = useState("");

  const [school, setSchool] = useState("");
  const [examYear, setExamYear] = useState("");
  const [media, setMedia] = useState("");
  const [stream, setStream] = useState("");

  useEffect(() => {
    if (currentUser) {
      const fetchData = async () => {
        const userInfo = (await fetchUserInfo(
          currentUser?.uid
        )) as UserInfoType;
        console.log(userInfo);

        setFirstName(userInfo.firstName);
        setLastName(userInfo.lastName);
        setWhatsapp(userInfo.whatsapp);
        setNic(userInfo.nic);
        setBDate(userInfo.bDate ? new Date(userInfo.bDate) : undefined);
        setPhone(userInfo.phone);
        setSchool(userInfo.school);
        setExamYear(userInfo.examYear);
        setMedia(userInfo.media);
        setStream(userInfo.stream);
      };

      fetchData();
    }
  }, [currentUser]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Card>
        <CardContent>
          <div>
            <Label htmlFor="firstName" className="text-[#787e81]">
              First Name
            </Label>
            <Input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              placeholder="First Name"
              className="focus-visible:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="lastName" className="text-[#787e81]">
              Last Name
            </Label>
            <Input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              placeholder="name"
              className="focus-visible:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-[#787e81]">
              Phone Number
            </Label>
            <Input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="07xxxxxxxx"
              className="focus-visible:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="whatsapp" className="text-[#787e81]">
              WhatsApp Number
            </Label>
            <Input
              type="text"
              id="whatsapp"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              required
              placeholder="07xxxxxxxx"
              className="focus-visible:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default StudentInfo;
