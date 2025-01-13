import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import useAuth from "@/hooks/useAuth"
import { useRouter } from "@/hooks/useRouter"
import { Button } from "@/components/ui/button"
import { SubmitHandler, useForm } from "react-hook-form"
import { CheckCircle2, XCircle } from "lucide-react"


type Inputs = {
    password: string;
    confirmPassword: string;
}

const PreIcon = ({ isValid }: { isValid: boolean }) => {
    return isValid ? (
        <CheckCircle2 color="green" size={13} />
    ) : (
        <XCircle color="red" size={13} />
    );
}

const Checker = ({ text, isValid }: { text: string; isValid:boolean }) => {
    return (
        <div className="flex flex-row items-center justify-start">
            <PreIcon isValid={isValid} />
            <p className="ml-1 text-gray-400">{text}</p>
        </div>
    );
}

const ResetPassword = () => {
    const { handleResetPassword, loading } = useAuth();
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        watch,
    } = useForm<Inputs>();

    const token = window.location.href.split("?")[1].split("=")[1];

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        const { password } = data;
        handleResetPassword({ password, token });
    }

    const password = watch("password", "");

    const validations = {
        hasLowerCase: /[a-z]/.test(password),
        hasUpperCase: /[A-Z]/.test(password),
        hasNumber: /\d/.test(password),        
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        isMinLen: password?.length >= 8,
    }
    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen">
            <h2 className="bg-gradient-to-br from-blue-500 to-pink-500 text-3xl bg-clip-text text-transparent font-bold mb-4">
                Reset New Password
            </h2>
            <Card className="w-[420px] flex flex-col justify-start my-3 bg-white p-4 shadow-lg rounded-md">
                <CardHeader className="items-start">
                    <CardTitle className="font-bold text-2xl mb-2">Set New Password</CardTitle>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid gap-4">
                                {/* Password Field */}
                                <div className="flex flex-col space-y-1.5 items-start">
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Password*"
                                        {...register("password", { required: true })}
                                    />
                                    {password.length > 0 && (!validations.hasLowerCase || !validations.hasNumber || !validations.hasSpecialChar || !validations.hasUpperCase || !validations.isMinLen) && <span className="text-red-500">Please fullfill the conditions below</span>}
                                </div>
                                {/* Confirm Password Field */}
                                <div className="flex flex-col space-y-1.5">
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        placeholder="Password (Confirm)*"
                                        {...register("confirmPassword", {
                                            required: "Confirm Password is required",
                                            validate: (value) => value === getValues("password") || "Passwords do not match",
                                        })}
                                    />
                                    {errors.confirmPassword && (
                                        <span className="text-red-500">{errors.confirmPassword.message}</span>
                                    )}
                                </div>
                                {/* Password Instructions */}
                                <p>Your password must contain:</p>
                                <div className="grid grid-cols-2 gap-4 text-xs">
                                    <ul className="list-inside flex flex-col items-start">
                                        <li><Checker text="One lowercase letter" isValid={validations.hasLowerCase}/></li>
                                        <li><Checker text="One special character" isValid={validations.hasSpecialChar}/></li>
                                        <li><Checker text="One uppercase letter" isValid={validations.hasUpperCase}/></li>
                                    </ul>
                                    <ul className="list-inside flex flex-col items-start">
                                        <li><Checker text="8 characters minimum" isValid={validations.isMinLen}/></li>
                                    </ul>
                                </div>
                            </div>
                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className={`w-full my-3 ${loading ? "animate-pulse" : "animate-none"}`}
                                disabled={!validations.hasLowerCase || !validations.hasNumber || !validations.hasSpecialChar || !validations.hasUpperCase || !validations.isMinLen}
                            >   
                                {loading ? "Loading..." : "Update Password"}
                            </Button>
                            <p className="text-slate-800 text-sm font-semibold">
                                Got your password?{" "}
                                <span
                                    onClick={() => router.replace("/login")}
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
}

export default ResetPassword