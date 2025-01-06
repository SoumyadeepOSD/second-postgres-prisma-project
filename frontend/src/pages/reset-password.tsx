import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import useAuth from "@/hooks/useAuth"
import { useRouter } from "@/hooks/useRouter"
import { Label } from "@radix-ui/react-label"
import { Button } from "@/components/ui/button"
import { SubmitHandler, useForm } from "react-hook-form"


type Inputs = {
    password: string;
    confirmPassword: string;
}

const ResetPassword = () => {
    const { handleResetPassword, loading } = useAuth();
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<Inputs>();

    const token = window.location.href.split("?")[1].split("=")[1];

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        const { password } = data;
        handleResetPassword({ password, token });
    }
    return (
        <div className="flex flex-col items-center justify-center w-full h-[100vh]">
            <h2 className="bg-gradient-to-br from-blue-500 to-pink-500 text-3xl bg-clip-text text-transparent font-bold">Reset New Password</h2>
            <Card className="w-[350px] flex flex-col justify-start my-3">
                <CardHeader className="items-start">
                    <CardTitle className="font-bold text-2xl">Reset password</CardTitle>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid w-full items-start gap-4">
                                <div className="flex flex-col items-start space-y-1.5">
                                    <Label htmlFor="password">New Password</Label>
                                    <Input
                                        id="password"
                                        placeholder="Put your Password"
                                        {...register("password", { required: true })}
                                    />
                                    {errors.password && <span className="text-red-500">Password is required</span>}
                                </div>
                                <div className="flex flex-col items-start space-y-1.5">
                                <Label htmlFor="confirm-password">Confirm New Password</Label>
                                    <Input
                                        id="confirm-password"
                                        placeholder="Put your Confirm Password"
                                        {...register("confirmPassword", { 
                                            required: "Confirm Password is required", 
                                            validate:(value)=>value===getValues("password") || "Passwords do not match"
                                        })}
                                    />
                                    {errors.confirmPassword && <span className="text-red-500">Confirm Password is required</span>}
                                </div>
                            </div>
                            <Button type="submit" className={`w-full my-3 ${loading ? "animate-pulse" : "animate-none"}`}>{loading ? "Loading..." : "Update Password"}</Button>
                            <p className="text-slate-800 text-sm font-semibold">Got your password? <span onClick={() => { router.replace("/login") }} className="text-blue-700 hover:cursor-pointer">Return to login</span></p>
                        </form>
                    </CardContent>
                </CardHeader>
            </Card>
        </div>
    )
}

export default ResetPassword