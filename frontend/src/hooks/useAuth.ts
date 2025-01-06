/* eslint-disable @typescript-eslint/no-unused-vars */

import AuthContext from "@/context/authContext";
import { useContext, useState } from "react";
import Client from "@/constants/config";
import { useToast } from "./use-toast";
import axios from "axios";

const useAuth = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [verify, setVerify] = useState(false);
    const [sent, setSent] = useState(false);
    const { setAccessToken } = useContext(AuthContext);

    const handleLogin = async ({ email, password }: { email: string; password: string; }) => {
        setLoading(true);
        try {
            const URL = "/login"; // Base URL is already set in the client
            const payloadBody = { email, password };
            const response = await Client.post(URL, payloadBody);

            if (response.status === 201 || response.status === 200) {
                console.log(response.data);
                toast({
                    title: "Login Successful",
                    variant: "default",
                    description: response.data.message,
                });
                setAccessToken(response?.data?.accessToken);
                window.localStorage.setItem("data", JSON.stringify(response.data));
                window.localStorage.setItem("access_token", response?.data?.accessToken);
                window.location.href = "/home";
            }
        } catch (error: unknown) {
            console.error(`Login Error:`, error);
            toast({
                title: "Login Failed",
                variant: "destructive",
                description: "Can't log in!",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async ({ email, password, firstName, lastName }: { email: string; password: string; firstName: string; lastName: string }) => {
        setLoading(true);
        try {
            const URL = "/signup"; // Base URL is already set in the client
            const payloadBody = { firstName, lastName, email, password };
            const response = await Client.post(URL, payloadBody);

            if (response.status === 201 || response.status === 200) {
                console.log(response.data);
                window.location.href="/login";
            }
        } catch (error: unknown) {
            console.error(`Signup Error:`, error);
            toast({
                title: "Signup Failed",
                variant: "destructive",
                description: "Can't sign up!",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async({email}:{email:string})=>{
        try {
            const URL = "/forgot-password";
            const bodyPayload = { email };
            const response = await Client.post(URL, bodyPayload);
            if(response.status===201 || response.status===200){
                toast({
                    title: "Token has been sent to your email",
                    variant: "default",
                });
                console.log(response.data);
                setSent(true);            
            }
        } catch (error) {
            toast({
                title: "Reset Password Creation",
                variant: "destructive",
                description: "Can't create reset token!",
            });
            setSent(false);
        }
    };


    const handleVerifyToken = async({token}:{token:string;})=>{
        try {
            const URL = `http://localhost:8000/verify-reset-token?token=${token}`;
            const response = await axios.post(URL);
            if(response.status===200 || response.status===201){
                toast({
                    title: "Verification done successfully✅",
                    variant: "default",
                });
                setVerify(true);
                console.log(response.data);
            }
        } catch (error) {
            toast({
                title: "Reset Token is invalid",
                variant: "destructive",
            });
            setVerify(false);
        }
    }

    const handleResetPassword = async({password,token}:{password:string;token:string;})=>{
        try {
            const encodedToken = encodeURIComponent(token); // URL encode the token
            const URL = `/reset-password?token=${encodedToken}`;
            const bodyPayload = { password };
            const response = await Client.patch(URL, bodyPayload);
            if(response.status===201 || response.status===200){
                toast({
                    title: "Password has been updated",
                    variant: "default",
                });
                console.log(response.data);
            }
        } catch (error) {
            toast({
                title: "Reset Password Creation",
                variant: "destructive",
                description: "Can't create reset token!",
            });
        }
    };


    return { 
        handleForgotPassword, 
        handleResetPassword,
        handleVerifyToken, 
        handleSignup, 
        handleLogin, 
        setLoading, 
        loading, 
        verify,
        sent,
    };
};

export default useAuth;
