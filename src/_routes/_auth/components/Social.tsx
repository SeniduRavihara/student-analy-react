import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getRegisteredStatus, getUserRole, googleSignIn } from "@/firebase/api";

const Social = () => {
  const navigate = useNavigate();

  const handleGooglesignin = async () => {
    const user = await googleSignIn();
    const roles = await getUserRole(user.uid);
    const isRegistered = await getRegisteredStatus(user.uid);

    if (roles && roles == "ADMIN") {
      navigate("/admin");
    } else {
      if (isRegistered) {
        navigate("/dashboard");
      } else {
        navigate("/register-as-new");
      }
    }
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
