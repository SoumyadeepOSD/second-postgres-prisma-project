export const authRoutes = {
    SIGNUP:"/signup",
    LOGIN:"/login",
    FORGOTPASSWORD: "/forgot-password",
    DELETEUSER:"/delete",
    VIEWUSER:"/view"
};

export const todoRoutes = {
    CREATE:"/create_todo",
    VIEWTODO:"/view_todo/{userId}",
    UPDATETODO: "/update_todo/{todoId}",
    DELETETODO:"/delete_todo/{todoId}",
    VIEW_ALL: "/fetch_all_todos/{userId}"
};