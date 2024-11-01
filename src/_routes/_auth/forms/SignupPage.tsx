import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import CardWrapper from "../components/CardWrapper";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { registerSchema } from "@/schemas";
import { signup } from "@/firebase/api";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  // const submitButtonRef = useRef<HTMLInputElement>(null);

  // const [name, setName] = useState("");
  // const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  // const [email, setEmail] = useState("");
  // const [gender, setGender] = useState("Male");
  // const [profileImage, setProfileImage] = useState<File | null>(null);
  // const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 1. Define your form.
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof registerSchema>) {
    try {
      await signup(values);

      // if (!user.emailVerified) {
      //   await logout();
      //   form.reset();
      //   navigate("/login");
      //   return;
      // }

      navigate("/register-as-new");
    } catch (error) {
      console.log(error);
    }
  }

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   if (password === confirmPassword) {
  //     try {
  //       const uid = await signup({
  //         name,
  //         email,
  //         password,
  //         gender,
  //         profileImage,
  //       });
  //       const roles = await getUserRole(uid);
  //       if (roles.includes("admin")) {
  //         navigate("/admin");
  //       }
  //       navigate("/");
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   setLoading(false);
  // };

  // const handleClickRegister = async () => {
  //   if (submitButtonRef.current) {
  //     submitButtonRef.current.click();
  //   }
  // };

  return (
    <CardWrapper
      headerLabel="Create an account"
      backButtonLabel="Already have an account?"
      backButtonHref="/login"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter name"
                      // disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email"
                      // disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      // disabled={isPending}
                      placeholder="Enter password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      // disabled={isPending}
                      placeholder="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </div>

          <Button
            type="submit"
            className="w-full bg-[#277aa0] hover:bg-[#277aa0]/90"
          >
            Signup
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default SignupPage;
