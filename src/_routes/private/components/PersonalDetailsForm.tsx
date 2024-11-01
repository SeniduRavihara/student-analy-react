import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type PersonalDetailsFormProps = {
  firstName: string;
  lastName: string;
  whatsapp: string;
  nic: string;
  bDate: Date | undefined;
  phone: string;
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setWhatsapp: (whatsapp: string) => void;
  setNic: (nic: string) => void;
  setBDate: (bDate: Date | undefined) => void;
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
        <Label htmlFor="bdate" className="text-[#787e81]">
          WhatsApp Number
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
    </div>
  );
};
export default PersonalDetailsForm;
