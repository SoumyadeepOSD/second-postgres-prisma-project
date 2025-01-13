import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "@/hooks/useRouter";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  email: string;
};

const ForgetPassword = () => {
  const { handleForgotPassword, loading, sent } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch, // Add watch to observe email value
  } = useForm<Inputs>();

  const email = watch("email"); // Watch the email field value
  const isValidEmail = email && email.includes("@");

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const { email } = data;
    handleForgotPassword({ email });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-[100vh]">
      <h2 className="bg-gradient-to-br from-blue-500 to-pink-500 text-3xl bg-clip-text text-transparent font-bold">
        Forgot Password
      </h2>
      <Card className="w-[350px] flex flex-col justify-start my-3">
        <CardHeader className="items-start">
          <CardTitle className="font-bold text-2xl">Recover your password</CardTitle>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid w-full items-start gap-4">
                <div className="flex flex-col items-start space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Put your Email"
                    {...register("email", { required: true })}
                  />
                  {errors.email && <span className="text-red-500">Email is required</span>}
                </div>
              </div>
              <Button
                type="submit"
                disabled={!isValidEmail || loading} // Disable button if email is empty or loading is true
                className={`w-full my-3 ${
                  loading ? "animate-pulse" : "animate-none"
                }`}
              >
                {loading ? "Loading..." : sent ? "Resend Email" : "Send Email"}
              </Button>
              <p className="text-slate-800 text-sm font-semibold">
                Got your password?{" "}
                <span
                  onClick={() => {
                    router.replace("/login");
                  }}
                  className="text-blue-700 hover:cursor-pointer"
                >
                  Return to login
                </span>
              </p>
            </form>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
};

export default ForgetPassword;
