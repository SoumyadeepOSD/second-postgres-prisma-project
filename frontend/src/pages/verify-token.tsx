/* eslint-disable @typescript-eslint/no-explicit-any */
import useAuth from "@/hooks/useAuth"
import { CheckCircle2Icon, CircleX } from "lucide-react"
import { useEffect } from "react";

const VerifyToken = () => {
    const {verify, handleVerifyToken} = useAuth();
    const token = window.location.href.split("?token=")[1];
    useEffect(()=>{
        handleVerifyToken({token});
    },[token]);
    const Icon = ()=> verify ? (<CheckCircle2Icon color="green" size={100} />):(<CircleX color="red" size={100}/>);
    return (
        <div className="w-full h-[100vh] py-10 flex flex-col items-center justify-center">
            <h2 className="bg-gradient-to-br from-blue-500 to-pink-500 text-3xl bg-clip-text text-transparent font-bold">VerifyToken</h2>
            <div className="flex flex-col items-center justify-center my-10">
                <Icon/>
                {verify && (<h2 className="text-green-700 font-semibold">Token is Verified, Please go to <a className="font-bold hover:cursor-pointer" href={`/reset-password?token=${token}`}>reset password</a></h2>)}
                {!verify && (<h2 className="text-red-500 font-thin">Token is not verified, Please go to <a className="font-bold hover:cursor-pointer" href="/forget-password">resend token</a></h2>)}
            </div>
        </div>
    )
}

export default VerifyToken