/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import { useToast } from "./use-toast";
import { useState } from "react";

const useAuth = ()=>{
    const {toast} = useToast();
    const [loading, setLoading] = useState(false);
    const handleLogin = async({email, password}:{email:string; password:string;})=>{
        setLoading(true);
        try {
            const refresh_token = window.localStorage.getItem("refresh_token");
            const URL = "http://localhost:3000/login"
            const payloadBody = {
                email: email,
                password: password
            };
            const config = {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${refresh_token}`, // Add token here if needed
                },
            };
            const response = await axios.post(URL, payloadBody, config);
            if(response.status===201||response.status===200){
                console.log(response.data);
                toast({
                    title:"Login Successful",
                    variant:"default",
                    description: response.data
                });
                setLoading(false);
                window.localStorage.setItem("refresh_token", response.data.refreshToken!)
                window.localStorage.setItem("access_token", response.data.accessToken!)
                window.location.href="/home";
            }
            setLoading(false);
            //^Log the signin data
            console.log(response.data);
        } catch (error:unknown) {
            setLoading(false);
            console.log(`=================Error is ${error}`);
            toast({
                title:"Login Failed",
                variant:"destructive",
                description:`Can't logged in!`
            });
        }
    };


    const handleSignup = async({email, password, firstName, lastName}:{email:string; password:string;firstName:string;lastName:string})=>{
        setLoading(true);
        try {
            const URL = "http://localhost:3000/signup"
            const payloadBody = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            };
            const response = await axios.post(URL, payloadBody);
            if(response.status===201||response.status===200){
                console.log(response.data);
                toast({
                    title:"Signup Successful",
                    variant:"default",
                    description: response.data
                });
                setLoading(false);
                //^Log the signup data
                console.log(response.data); 
                window.localStorage.setItem("access_token", response.data.user.accessToken!);
                window.localStorage.setItem("user_name", firstName);
                window.localStorage.setItem("refresh_token", response.data.user.refreshToken!);
                window.location.href="/login";
            }
            setLoading(false);
        } catch (error:unknown) {
            setLoading(false);
            toast({
                title:"Login Failed",
                variant:"destructive",
                description:`Can't logged in!`
            });
        }
    };
    return {handleLogin, handleSignup, loading, setLoading};
}

export default useAuth;