export const authUserRoutes = {
    SIGNUP:"/signup",
    LOGIN:"/login",
    VALIDITY:"/valid/{tokenType}",
    FORGOTPASSWORD: "/forgot-password",
    RESETTOKEN: "/verify-reset-token",
    RESETPASSWORD: "/reset-password",
    DELETEUSER:"/delete",
    VIEWUSER:"/view"
};

export const todoRoutes = {
    CREATE:"/create_todo",
    VIEWTODO:"/view_todo",
    UPDATETODO: "/update_todo/{todoId}",
    DELETETODO:"/delete_todo/{todoId}",
    VIEW_ALL: "/fetch_all_todos"
};

export const labelRoutes = {
    CREATE:"/create_label",
    VIEWLABEL:"/view_label",
    UPDATELABEL: "/update_label/{labelId}",
    DELETELABEL:"/delete_label/{labelId}",
    VIEW_ALL_LABELS: "/fetch_all_labels"
};