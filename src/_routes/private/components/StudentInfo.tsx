import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import UserService from "@/firebase/services/UserService";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { UserDataType } from "@/types";
import { format } from "date-fns";
import { CalendarIcon, SquareCheck } from "lucide-react";
import { useEffect, useState } from "react";

type ClassDataType = (typeof CLASSES)[number];

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
  const [classes, setClasses] = useState<ClassDataType[]>([]);
  const [media, setMedia] = useState("");
  const [stream, setStream] = useState("");
  const [gurdianName, setGurdiandName] = useState("");
  const [gurdianPhone, setGurdianPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      const fetchData = async () => {
        try {
          setDataLoading(true);
          const userInfo = (await UserService.fetchUserInfo(
            currentUser.uid
          )) as UserDataType;
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
        } catch (error) {
          console.error("Error fetching user info:", error);
        } finally {
          setDataLoading(false);
        }
      };
      fetchData();
    } else {
      setDataLoading(false);
    }
  }, [currentUser]);

  const handleExamYearChange = (year: string) => {
    setExamYear(year);
    setClasses([]);
  };

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
      await UserService.updateUserInfo(currentUser.uid, userInfo);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const toggleClass = (selectedClass: ClassDataType) => {
    setClasses((prevClasses) =>
      prevClasses.includes(selectedClass)
        ? prevClasses.filter((c) => c !== selectedClass)
        : [...prevClasses, selectedClass]
    );
  };

  if (dataLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Personal Details Skeleton */}
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic Details Skeleton */}
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Guardian Details Skeleton */}
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={["item-1", "item-2"]}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Personal & Contact Details</AccordionTrigger>
            <AccordionContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  placeholder="First Name"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  placeholder="Last Name"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  type="text"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="07xxxxxxxx"
                />
              </div>
              <div>
                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                <Input
                  type="text"
                  id="whatsapp"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  required
                  placeholder="07xxxxxxxx"
                />
              </div>
              <div>
                <Label htmlFor="nic">NIC Number</Label>
                <Input
                  type="text"
                  id="nic"
                  value={nic}
                  onChange={(e) => setNic(e.target.value)}
                  required
                  placeholder="200xxxxxxxxx"
                />
              </div>
              <div>
                <Label htmlFor="bDate">Birth Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !bDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
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
              <div className="md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  placeholder="Address"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Academic Details</AccordionTrigger>
            <AccordionContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div>
                <Label htmlFor="school">School</Label>
                <Input
                  type="text"
                  id="school"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  required
                  placeholder="School"
                />
              </div>
              <div>
                <Label htmlFor="examYear">Exam Year</Label>
                <Select onValueChange={handleExamYearChange} value={examYear}>
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
              <div className="col-span-2">
                <Label>Classes</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {CLASSES_TO_YEARS[
                    examYear as keyof typeof CLASSES_TO_YEARS
                  ].map((classItem) => (
                    <Card
                      key={classItem}
                      onClick={() => toggleClass(classItem)}
                      className={cn(
                        "p-3 flex items-center justify-between cursor-pointer transition-all",
                        classes.includes(classItem)
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent"
                      )}
                    >
                      <span className="font-medium">{classItem}</span>
                      {classes.includes(classItem) && (
                        <SquareCheck className="h-5 w-5" />
                      )}
                    </Card>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="stream">Stream</Label>
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
                <Label htmlFor="media">Medium</Label>
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
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Guardian Details</AccordionTrigger>
            <AccordionContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div>
                <Label htmlFor="gurdianName">Guardian's Name</Label>
                <Input
                  type="text"
                  id="gurdianName"
                  value={gurdianName}
                  onChange={(e) => setGurdiandName(e.target.value)}
                  required
                  placeholder="Guardian's Name"
                />
              </div>
              <div>
                <Label htmlFor="gurdianPhone">Guardian's Phone Number</Label>
                <Input
                  type="text"
                  id="gurdianPhone"
                  value={gurdianPhone}
                  onChange={(e) => setGurdianPhone(e.target.value)}
                  required
                  placeholder="07xxxxxxxx"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={updateInfo} disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StudentInfo;
