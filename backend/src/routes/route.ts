export const authRoutes = {
    SIGNUP:"/signup",
    LOGIN:"/login",
    VALIDITY:"/valid/{tokenType}",
    FORGOTPASSWORD: "/forgot-password",
    DELETEUSER:"/delete",
    VIEWUSER:"/view"
};

export const todoRoutes = {
    CREATE:"/create_todo",
    VIEWTODO:"/view_todo",
    UPDATETODO: "/update_todo/{todoId}",
    DELETETODO:"/delete_todo/{todoId}",
    VIEW_ALL: "/fetch_all_todos/{userId}"
};