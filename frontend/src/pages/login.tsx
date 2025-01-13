import { useForm, SubmitHandler } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardTitle,
    CardHeader,
    CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useAuth from "@/hooks/useAuth"
import { useRouter } from "@/hooks/useRouter"

type Inputs = {
    email: string
    password: string
}

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = (data) => {
        const {email, password} = data;
        handleLogin({email, password});
    }
    const { handleLogin, loading } = useAuth();
    const router = useRouter();
    return (
        <div className="flex flex-col h-screen items-center justify-center py-20">
            <h2 className="bg-gradient-to-br from-blue-500 to-pink-500 text-3xl bg-clip-text text-transparent font-bold">Advance todo application</h2>
            <Card className="w-[350px] flex flex-col justify-start my-3">
                <CardHeader className="items-start">
                    <CardTitle className="font-bold text-2xl">Sign in</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid w-full items-start gap-4">
                            <div className="flex flex-col items-start space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    placeholder="Put your Email"
                                    {...register("email", { required: true })}
                                />
                                {errors.email && <span className="text-red-500">Email is required</span>}
                            </div>
                            <div className="flex flex-col items-start space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    placeholder="Put your Password"
                                    {...register("password", { required: true })}
                                />
                                {errors.password && <span className="text-red-500">Password is required</span>}
                            </div>
                            <p className="text-slate-800 text-sm font-semibold">Forgot password? <span onClick={() => { router.replace("/forget-password") }} className="text-blue-700 hover:cursor-pointer">Click here</span></p>
                        </div>
                        <Button type="submit" className={`w-full my-3 ${loading?"animate-pulse":"animate-none"}`}>{loading ? "Loading...":"Sign-in"}</Button>
                        <p className="text-slate-800 text-sm font-semibold">Don't have account? <span onClick={()=>{router.replace("/signup")}} className="text-blue-700 hover:cursor-pointer">Signup</span></p>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default Login;