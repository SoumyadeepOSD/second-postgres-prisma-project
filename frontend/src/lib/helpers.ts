const priorityMapping = ({priority}:{priority:number})=>{
    let actualPriority="";
    switch (priority) {
        case 1:
            actualPriority = "Urgent";
            break;
        case 2:
            actualPriority = "High";
            break;
        case 3:
            actualPriority = "Moderate";
            break;
        default:
            actualPriority = "Base";
            break;
    }
    return actualPriority;
}
const handleLogout = () => {
    window.localStorage.removeItem("access_token");
    window.localStorage.removeItem("data");
    window.location.href="/login";    
}
export {priorityMapping, handleLogout};