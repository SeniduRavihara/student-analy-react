import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CLASSES, CLASSES_TO_YEARS, EXAM_YEARS } from "@/constants";
import { fetchUserInfo, updateUserInfo } from "@/firebase/api";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { UserDataType } from "@/types";
import { format } from "date-fns";
import { CalendarIcon, SquareCheck } from "lucide-react";
import { useEffect, useState } from "react";

type ClassDataType = (typeof CLASSES)[number]; // This will be 'THEORY' | 'REVISION'


const StudentInfo = () => {
  const { currentUser } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [nic, setNic] = useState("");
  const [bDate, setBDate] = useState<Date>();
  const [phone, setPhone] = useState("");
  const [school, setSchool] = useState("");
  const [examYear, setExamYear] = useState(EXAM_YEARS[0].year);
  const [classes, setClasses] = useState<(typeof CLASSES)[number][]>([]);

  const [media, setMedia] = useState("");
  const [stream, setStream] = useState("");
  const [gurdianName, setGurdiandName] = useState("");
  const [gurdianPhone, setGurdianPhone] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (currentUser) {
      const fetchData = async () => {
        const userInfo = (await fetchUserInfo(
          currentUser?.uid
        )) as UserDataType;
        // console.log(userInfo);

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
        setClasses(userInfo.classes || []);
      };

      fetchData();
    }
  }, [currentUser]);

  const updateInfo = async () => {
    if (!currentUser) return;
    setLoading(true);

    try {
      const userInfo = {
        firstName,
        lastName,
        whatsapp,
        nic,
        bDate,
        phone,
        school,
        examYear,
        media,
        stream,
        gurdianName,
        gurdianPhone,
        address,
        classes,
      };

      console.log(userInfo.bDate);

      await updateUserInfo(currentUser.uid, userInfo);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

    const toggleClass = (classType: ClassDataType) => {
      setClasses(
        (prevClasses) =>
          prevClasses.includes(classType)
            ? prevClasses.filter((c) => c !== classType) // Remove if exists
            : [...prevClasses, classType] // Add if not exists
      );
    };

  return (
    <Card className="w-full h-full mb-5">
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
              {EXAM_YEARS.map((year) => (
                <SelectItem key={year.year} value={year.year}>
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-2 flex justify-between gap-5 my-2">
          {CLASSES_TO_YEARS[examYear as keyof typeof CLASSES_TO_YEARS].map(
            (classItem) => (
              <Card
                key={classItem}
                onClick={() => toggleClass(classItem)}
                className={cn(
                  "py-2 px-3 text-center relative text-[#787e81] hover:bg-blue-300  duration-200 cursor-pointer w-full",
                  classes.includes(classItem)
                    ? "bg-blue-400 text-white hover:bg-blue-300"
                    : "bg-white text-[#787e81] hover:bg-blue-300"
                )}
              >
                <div>{classItem}</div>

                <SquareCheck
                  className={cn(
                    "absolute top-2 right-2",
                    classes.includes(classItem) ? "block" : "hidden"
                  )}
                />
              </Card>
            )
          )}
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
          <Button className="w-full" onClick={updateInfo} disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentInfo;
