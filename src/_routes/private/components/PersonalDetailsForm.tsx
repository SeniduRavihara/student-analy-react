import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PersonalDetailsFormProps = {
  firstName: string;
  lastName: string;
  whatsapp: string;
  nic: string;
  bDate: Date;
  phone: string;
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setWhatsapp: (whatsapp: string) => void;
  setNic: (nic: string) => void;
  setBDate: (bDate: Date) => void;
  setPhone: (phone: string) => void;
};

const PersonalDetailsForm = ({
  firstName,
  lastName,
  whatsapp,
  nic,
  bDate,
  phone,
  setFirstName,
  setLastName,
  setWhatsapp,
  setNic,
  setBDate,
  setPhone,
}: PersonalDetailsFormProps) => {
  // Convert Date object to string in "YYYY-MM-DD" format
  const formatDate = (date: Date | undefined): string => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  // Handle date input change and convert it back to a Date object
  const handleDateChange = (dateString: string) => {
    if (dateString) {
      setBDate(new Date(dateString));
    } else {
      setBDate(new Date());
    }
  };

  return (
    <div className="w-[80%] ml-auto mr-auto mt-5 text-[#243642] flex flex-col gap-3 md:grid grid-cols-1 md:grid-cols-2 text-left">
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
        <Input
          type="date"
          id="bDate"
          value={formatDate(bDate)} // Convert Date to string
          onChange={(e) => handleDateChange(e.target.value)} // Convert string back to Date
          required
          className="focus-visible:ring-blue-500 text-[#243642] bg-white rounded-md border border-gray-300 shadow-sm"
        />
      </div>
    </div>
  );
};

export default PersonalDetailsForm;
