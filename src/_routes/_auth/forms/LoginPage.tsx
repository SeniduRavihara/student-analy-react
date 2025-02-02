
// import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import Social from "../components/Social";


const LoginPage = () => {
  // const navigate = useNavigate();

  // // 2. Define a submit handler.
  // async function onSubmit(values: z.infer<typeof loginSchema>) {
  //   try {
  //     const user = await login(values);
  //     const roles = await getUserRole(user.uid);
  //     const isRegistered = await getRegisteredStatus(user.uid);

  //     if (roles && roles == "ADMIN") {
  //       navigate("/admin");
  //     } else {
  //       if (isRegistered) {
  //         navigate("/dashboard");
  //       } else {
  //         navigate("/register-as-new");
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  return (
    <Card className=" h-[500px] w-[90%] md:w-[900px] p-4">
      <CardContent className="flex gap-5 items-center justify-between w-full h-full p-0">
        <img
          src="/loginImage2.jpg"
          alt=""
          className="h-[450px] object-cover rounded-l-xl hidden md:block"
        />

        <div className="flex flex-col items-center justify-between w-full h-full">
          <div className="flex flex-col items-center justify-between">
            <img src="./pasan.png" alt="" className="w-64" />
            <img src="/physics_nam_think.png" alt="" className="w-56 mt-4" />
            <img src="./loginWadana.png" alt="" className="w-64" />
          </div>
          <Social />
          <p className="text-sm font-bold">Hotline : 0779556843</p>
        </div>
      </CardContent>
    </Card>
  );
};
export default LoginPage;
