import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


type ParentDetailsFormProps = {
  gurdianName: string;
  setGurdiandName: (gurdiandName: string) => void;
  gurdianPhone: string;
  setGurdianPhone: (gurdianPhone: string) => void;
  address: string;
  setAddress: (address: string) => void;
};

const ParentDetailsForm = ({
  address,
  gurdianName,
  gurdianPhone,
  setAddress,
  setGurdianPhone,
  setGurdiandName,
}: ParentDetailsFormProps) => {
  return (
    <div className="w-[80%] ml-auto mr-auto mt-5 text-[#243642] flex flex-col gap-3 md:grid grid-cols-1 md:grid-cols-2 text-left">
      <div>
        <Label htmlFor="gurdianName" className="text-[#787e81]">
          Guardian Name
        </Label>
        <Input
          type="text"
          id="gurdianName"
          value={gurdianName}
          onChange={(e) => setGurdiandName(e.target.value)}
          required
          placeholder="Gurdian Name"
          className="focus-visible:ring-blue-500"
        />
      </div>

      <div>
        <Label htmlFor="phone" className="text-[#787e81]">
          Guardian Phone
        </Label>
        <Input
          type="text"
          id="phone"
          value={gurdianPhone}
          onChange={(e) => setGurdianPhone(e.target.value)}
          required
          placeholder="07xxxxxxxx"
          className="focus-visible:ring-blue-500"
        />
      </div>

      <div className="col-span-2">
        <Label htmlFor="firstName" className="text-[#787e81]">
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
    </div>
  );
};
export default ParentDetailsForm;
