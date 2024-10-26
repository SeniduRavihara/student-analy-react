import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Social = () => {

  const navigate = useNavigate()

  const handleGooglesignin = async () => {
    // await googleSignIn()
    navigate("/")
  };

  return (
    <div className="w-full flex justify-center items-center gap-x-2">
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={handleGooglesignin}
      >
        <FcGoogle className="h-5 w-5" />
      </Button>
      <Button size="lg" className="w-full" variant="outline" onClick={() => {}}>
        <FaGithub className="h-5 w-5" />
      </Button>
    </div>
  );
};
export default Social;
