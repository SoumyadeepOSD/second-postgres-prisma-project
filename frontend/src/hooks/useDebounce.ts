import { queryType } from "@/constants/types/todo-type";
import { useEffect, useState } from "react";


const useDebounce = (value:queryType, delay:number)=>{
    const [debounceValue, setDebounceValue] = useState(value);
    useEffect(()=>{
     const timer = setTimeout(()=>{
        setDebounceValue(value);
     }, delay);
     
     return ()=>{
        clearTimeout(timer);
     }
    },[value, delay]);
    
    return debounceValue;
}

export default useDebounce;