import axios from "axios";
import { toast } from "./use-toast";
import { useState } from "react";
import Client from "@/constants/config";


const BASE_URL = import.meta.env.VITE_BASE_URL!;
const access_token = localStorage.getItem("access_token");

const useLabel = () => {
    const [loading, setLoading] = useState(false);
    const createLabel = async ({ name }: { name: string }) => {
        setLoading(true);
        try {
            const URL = `${BASE_URL}/create_label`;
            const payloadBody = {
                name: name
            };
            const response = await Client.post(URL, payloadBody,
                {
                    headers:
                    {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access_token}`
                    }
                }
            );
            if (response.status === 201 || response.status === 200) {
                console.log(response.data);
                toast({
                    title: "Success!",
                    variant: "default",
                    description: response.data.message
                });
                setLoading(false);
            }
            setLoading(false);
        } catch (error: unknown) {
            setLoading(false);
            toast({
                title: "Failed!",
                variant: "destructive",
                description: `Can't create new label! ${error}`
            });
        }
    };


    const getLabel = async() => {
        setLoading(true);
        try {    
            const response = await axios.get(`${BASE_URL}/view_label`, {
                headers: 
                {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${access_token}`               
                }
            });
            if (response.status === 201 || response.status === 200) {
                console.log(response.data);
                toast({
                    title: "Successfully fetched labels!",
                    variant: "default"
                });
                setLoading(false);
            }
            setLoading(false);
            console.log("=========Fetch label from hooks=============");
            return response?.data?.labels;
        } catch (error: unknown) {
            setLoading(false);
            toast({
                title: "Failed to fetch all todos",
                variant: "destructive",
                description: `Can't fetch all todos! ${error}`
            });
        }
    };
    const editLabel = async({labelId, name}:{labelId:string; name:string;}) => {
        setLoading(true);
        try {
            const URL = `${BASE_URL}/update_label/${labelId}`;
            const payloadBody = {
                name:name
            };
            console.log("I am from useTodo", payloadBody);
            
            const response = await axios.patch(URL, payloadBody,
                {
                    headers: 
                    {
                        'Content-Type': 'application/json', 
                        'Authorization': `Bearer ${access_token}`               
                    }
                }
            );
            if (response.status === 201 || response.status === 200) {
                console.log(response.data);
                toast({
                    title: "Success!",
                    variant: "default",
                    description: response.data.message
                });
                setLoading(false);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast({
                title: "Failed to update the todo",
                variant: "destructive",
                description: `Can't update this todo! ${error}`
            });
        }
    };
    const deleteLabel = async({labelId}:{labelId:number}) => {
        setLoading(true);
        try {
            const URL = `${BASE_URL}/delete_label/${labelId}`;
            const response = await axios.delete(URL,
                {
                    headers: 
                    {
                        'Content-Type': 'application/json', 
                        'Authorization': `Bearer ${access_token}`               
                    }
                }
            );
            if (response.status === 201 || response.status === 200) {
                console.log(response.data);
                toast({
                    title: "Success!",
                    variant: "default",
                    description: response.data.message
                });
                setLoading(false);
                return response.status;
            }
            setLoading(false);
        } catch (error: unknown) {
            setLoading(false);
            toast({
                title: "Failed to delete label",
                variant: "destructive",
                description: `Can't delete label! ${error}`
            });
        }
    }

    return {
        loading,
        getLabel,
        setLoading,
        createLabel,
        editLabel,
        deleteLabel,
    };
}

export default useLabel;