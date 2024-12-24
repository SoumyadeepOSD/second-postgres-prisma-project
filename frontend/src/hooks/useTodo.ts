import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "./use-toast";
import AuthContext from "@/context/authContext";

const BASE_URL = import.meta.env.VITE_BASE_URL!;
const access_token = localStorage.getItem("access_token");   
const currentDateAndTime = new Date().toISOString().toString().split('T')[0];



const useTodo = () => {
    
    const [loading, setLoading] = useState(false);
    const {startDate, endDate} = useContext(AuthContext);
    interface createTodoTypes {
        title?: string;
        description?: string;
        labels?: number[];
    };

    interface editTodoTypes {
        title?: string;
        description?: string;
        status?: string;
        todoId?: number;
        creationDateTime?:string;
        updationDateTime?: string;
        labels?: number[];
        priority?:number;
    };


    

    const createTodo = async ({ title, description, labels }: createTodoTypes) => {
        setLoading(true);
        try {
            const URL = `${BASE_URL}/create_todo`;
            const payloadBody = {
                title: title,
                description: description,
                status: "incomplete",
                creationDateTime: currentDateAndTime,
                updationDateTime: currentDateAndTime,
                priority: 4,
                labels: labels
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



    const fetchTodo = async (searchQuery={qParam:"",priority:0,cat:-1}) => {
        setLoading(true);
        try {
            // Build the query string dynamically based on provided start and end
            const queryParams = new URLSearchParams();
            if (startDate) queryParams.append("start", startDate.toISOString());
            if (endDate) queryParams.append("end", endDate.toISOString());
            if(searchQuery) queryParams.append("keyword", searchQuery.qParam);
            if(searchQuery) queryParams.append("priority", searchQuery.priority.toString());
            if(searchQuery) queryParams.append("category", searchQuery.cat.toString());
            
            console.log("Query Params", queryParams);
    
            // Construct the complete URL with query parameters
            const url = `${BASE_URL}/view_todo${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
            // const url = `${BASE_URL}/view_todo${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                }
            });
    
            // Check for successful response
            if (response.status === 200 || response.status === 201) {
                console.log("Fetched todos:", response.data, url);
                toast({
                    title: "Successfully fetched todos!",
                    variant: "default"
                });
                return response?.data?.todos;
            } else {
                // Handle other response statuses
                toast({
                    title: "Failed to fetch todos",
                    description: `Unexpected response status: ${response.status}`,
                    variant: "destructive"
                });
            }
        } catch (error: unknown) {
            // Handle errors during the fetch operation
            toast({
                title: "Failed to fetch todos",
                variant: "destructive",
                description: `Can't fetch todos! ${error instanceof Error ? error.message : error}`
            });
        } finally {
            // Ensure loading is stopped after the operation
            setLoading(false);
        }
    };
        
        
    const editTodo = async ({title, description, status, todoId, creationDateTime, updationDateTime, labels, priority}:editTodoTypes) => {
        setLoading(true);
        try {
            const URL = `${BASE_URL}/update_todo/${todoId}`;
            const payloadBody = {
                title: title,
                description: description,
                status: status,
                creationDateTime:creationDateTime,
                updationDateTime:updationDateTime,
                labels:labels,
                priority:priority
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





