import { FaGoogle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getRegisteredStatus, getUserRole, googleSignIn } from "@/firebase/api";

const Social = () => {
  const navigate = useNavigate();

  const handleGooglesignin = async () => {
    const user = await googleSignIn();
    const roles = await getUserRole(user.uid);
    const isRegistered = await getRegisteredStatus(user.uid);

    console.log("REGISTERED", isRegistered);

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
    <Button
      size="lg"
      className="rounded-full px-5 py-4 bg-blue-500 text-white hover:bg-blue-400 text-lg"
      variant="outline"
      onClick={handleGooglesignin}
    >
      <FaGoogle className="text-2xl hover:text-muted-foreground" />
      <div>Login with Google</div>
    </Button>
  );
};
export default Social;
