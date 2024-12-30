/* eslint-disable @typescript-eslint/no-explicit-any */
import { handleLogout } from "@/lib/helpers";
import axios from "axios";


const Client = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL!,
    headers: {
        Accept: "application/json, text/plain, */*",
    },
});

Client.interceptors.response.use((res: any)=>{
    console.log(res)
    return res
},
(err:any)=>{
    if(err.status===401){
        handleLogout()
    }
    
});


export default Client;

