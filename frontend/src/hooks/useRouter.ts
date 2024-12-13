import { useNavigate, useLocation, useParams } from "react-router-dom";


export interface Router{
    pathname: string;
    query: unknown;
    push: (path: string) => void;
    replace: (path: string) => void;
}

export function useRouter(): Router{
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();


    return{
        pathname: location.pathname,
        query: params,
        push: (path: string)=>navigate(path),
        replace: (path:string)=>navigate(path, {replace: true}),
    }
}