// export const generateDateAndTimeToString = () => {
//     const dt = new Date();

//     // Convert to IST timezone
//     const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
//     const istDate = new Date(dt.getTime() + istOffset);

//     // Format date and time components
//     const day = String(istDate.getUTCDate()).padStart(2, '0');
//     const month = String(istDate.getUTCMonth() + 1).padStart(2, '0'); // Month is 0-based
//     const year = istDate.getUTCFullYear();

//     const hours = String(istDate.getUTCHours()).padStart(2, '0');
//     const minutes = String(istDate.getUTCMinutes()).padStart(2, '0');
//     const seconds = String(istDate.getUTCSeconds()).padStart(2, '0');

//     // Combine into desired format
//     const formattedDateTime = `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
//     return formattedDateTime;
// }


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

export {priorityMapping};