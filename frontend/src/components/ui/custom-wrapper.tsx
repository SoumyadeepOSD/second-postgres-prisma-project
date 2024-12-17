import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { ReactNode } from "react";

interface customTooltipWrapperType{
    icon: ReactNode;
    tooltipText: string;
}


const CustomTooltipWrapper = ({icon, tooltipText}:customTooltipWrapperType)=>{
    return(
        <TooltipProvider>
        <Tooltip>
            <TooltipTrigger className="bg-transparent p-1">
                {icon}
            </TooltipTrigger>
            <TooltipContent>
                <p>{tooltipText}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>  
    );
}

export default CustomTooltipWrapper;