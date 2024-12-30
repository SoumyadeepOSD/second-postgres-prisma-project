/* eslint-disable @typescript-eslint/no-unused-vars */

import AuthContext from "@/context/authContext";
import { useContext, useState } from "react";
import Client from "@/constants/config";
import { useToast } from "./use-toast";

const useAuth = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
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
                toast({
                    title: "Signup Successful",
                    variant: "default",
                    description: response.data,
                });
                window.location.href = "/login";
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

    return { handleLogin, handleSignup, loading, setLoading };
};

export default useAuth;
