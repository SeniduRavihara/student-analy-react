import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchUserInfo } from "@/firebase/api";
import { useAuth } from "@/hooks/useAuth";
import { UserInfoType } from "@/types";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [gurdianName, setGurdiandName] = useState("");
  const [gurdianPhone, setGurdianPhone] = useState("");
  const [address, setAddress] = useState("");

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
        setGurdiandName(userInfo.gurdianName);
        setGurdianPhone(userInfo.gurdianPhone);
        setAddress(userInfo.address);
      };

      fetchData();
    }
  }, [currentUser]);

  return (
    <div className="w-full h-full flex items-center justify-center p-5">
      <Card className="w-full h-full">
        <CardContent className="flex flex-col relative gap-2 md:grid grid-cols-1 md:grid-cols-2 text-left p3">
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
              placeholder="Last Name"
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

          <div>
            <Label htmlFor="nic" className="text-[#787e81]">
              NIC Number
            </Label>
            <Input
              type="text"
              id="nic"
              value={nic}
              onChange={(e) => setNic(e.target.value)}
              required
              placeholder="200xxxxxxxxx"
              className="focus-visible:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="bDate" className="text-[#787e81]">
              Birth Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !bDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {bDate ? format(bDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={bDate}
                  onSelect={setBDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="school" className="text-[#787e81]">
              School
            </Label>
            <Input
              type="text"
              id="school"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              required
              placeholder="School"
              className="focus-visible:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="examYear" className="text-[#787e81]">
              Exam Year
            </Label>
            <Select onValueChange={setExamYear} value={examYear}>
              <SelectTrigger>
                <SelectValue placeholder="Exam Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024 A/L</SelectItem>
                <SelectItem value="2025">2025 A/L</SelectItem>
                <SelectItem value="2026">2026 A/L</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="stream" className="text-[#787e81]">
              Stream
            </Label>
            <Select onValueChange={setStream} value={stream}>
              <SelectTrigger>
                <SelectValue placeholder="Stream" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maths">Mathematics</SelectItem>
                <SelectItem value="bio">Biology</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="media" className="text-[#787e81]">
              Medium
            </Label>
            <Select onValueChange={setMedia} value={media}>
              <SelectTrigger>
                <SelectValue placeholder="Medium" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sinhala">සිංහල</SelectItem>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="tamil">தமிழ்</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Added fields for Guardian's Name, Guardian's Phone, and Address */}
          <div>
            <Label htmlFor="gurdianName" className="text-[#787e81]">
              Guardian's Name
            </Label>
            <Input
              type="text"
              id="gurdianName"
              value={gurdianName}
              onChange={(e) => setGurdiandName(e.target.value)}
              required
              placeholder="Guardian's Name"
              className="focus-visible:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="gurdianPhone" className="text-[#787e81]">
              Guardian's Phone Number
            </Label>
            <Input
              type="text"
              id="gurdianPhone"
              value={gurdianPhone}
              onChange={(e) => setGurdianPhone(e.target.value)}
              required
              placeholder="07xxxxxxxx"
              className="focus-visible:ring-blue-500"
            />
          </div>

          <div className="col-span-2">
            <Label htmlFor="address" className="text-[#787e81]">
              Address
            </Label>
            <Input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder="Address"
              className="focus-visible:ring-blue-500"
            />
          </div>

          <div className="absolute -bottom-14 left-0 right-0">
            <Button className="w-full" type="submit">
              Submit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentInfo;
