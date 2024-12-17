import { useState } from "react";
import axios from "axios";
import { toast } from "./use-toast";


const BASE_URL = import.meta.env.VITE_BASE_URL!;
const access_token = localStorage.getItem("access_token");   

const useTodo = () => {
    
    const [loading, setLoading] = useState(false);

    interface createTodoTypes {
        title?: string;
        description?: string;
    };

    interface editTodoTypes {
        title?: string;
        description?: string;
        status?: string;
        todoId?: number;
    };

    

    const createTodo = async ({ title, description }: createTodoTypes) => {
        setLoading(true);
        try {
            const URL = `${BASE_URL}/create_todo`;
            const payloadBody = {
                title: title,
                description: description,
                status: "incomplete",
            };
            const response = await axios.post(URL, payloadBody,
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
            await fetchTodo();
            setLoading(false);
        } catch (error: unknown) {
            setLoading(false);
            toast({
                title: "Failed!",
                variant: "destructive",
                description: `Can't create new todo! ${error}`
            });
        }
    }



    const fetchTodo = async () => {
        setLoading(true);
        try {    
            const response = await axios.get(`${BASE_URL}/view_todo`, {
                headers: 
                {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${access_token}`               
                }
            });
            if (response.status === 201 || response.status === 200) {
                console.log(response.data);
                toast({
                    title: "Successfully fetched todos!",
                    variant: "default"
                });
                setLoading(false);
            }
            setLoading(false);
            console.log("=========Fetch todo from hooks=============");
            return response?.data?.todos;
        } catch (error: unknown) {
            setLoading(false);
            toast({
                title: "Failed to fetch all todos",
                variant: "destructive",
                description: `Can't fetch all todos! ${error}`
            });
        }
    };

    const editTodo = async ({title, description, status, todoId}:editTodoTypes) => {
        setLoading(true);
        try {
            const URL = `${BASE_URL}/update_todo/${todoId}`;
            const payloadBody = {
                title: title,
                description: description,
                status: status,
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
        } catch (error: unknown) {
            setLoading(false);
            toast({
                title: "Failed to update todo",
                variant: "destructive",
                description: `Can't update todo! ${error}`
            });
        }
    };

    const deleteTodo = async ({todoId}:{todoId:number}) => {
        setLoading(true);
        try {
            const URL = `${BASE_URL}/delete_todo/${todoId}`;
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
                title: "Failed to delete todo",
                variant: "destructive",
                description: `Can't delete todo! ${error}`
            });
        }
    };


    return {
        createTodo,
        fetchTodo,
        editTodo,
        deleteTodo,
        loading
    };
}

export default useTodo;





