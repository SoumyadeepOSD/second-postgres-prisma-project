/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import "../App.css";
import { companyLogo } from "@/constants/images";
import { PlusCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import TodoCreationCard from "@/components/ui/todo-creation-card";
import { useEffect, useState } from "react";
import useTodo from "@/hooks/useTodo";
import { toast } from "@/hooks/use-toast";
import TodoSection from "@/components/ui/todo-section";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { ColumnType, TasksType } from "@/constants/types/todo-type";



const Home = () => {
  const displayName = window.localStorage.getItem("user_name");
  const [todoList, setTodoList] = useState<TasksType[]>([]);
  const { fetchTodo, editTodo } = useTodo();
  const [refresh, setRefresh] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  // const {drag, setDragging} = useContext(AuthContext);

  async function handleFetchData() {
    try {
      const fetchedTodos = await fetchTodo();
      console.log("=========Fetch todo from home=============");
      console.log(fetchedTodos);
      setTodoList(fetchedTodos);
    } catch (error) {
      toast({
        title: "failed!",
        description: `Failed to fetch data ${error}`
      });
    }
  }

  const handleTodoChange = () => {
    setRefresh((prev) => !prev); // Toggle `refresh` to trigger fetch
  };

  const handleCreateSuccess = () => {
    setIsOpen(false); // Close the dialog
    handleFetchData();
  };

  const handleDeleteSuccess = () => {
    handleFetchData();
  }


  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return; // Exit if there's no drop target

    const taskId = active.id as number; // ID of the dragged task
    const newStatus = over.id as string; // ID of the drop target column
    console.log("New Status:", newStatus);

    // Find the dragged task
    const taskToUpdate = todoList.find((task) => task.id === taskId);

    if (!taskToUpdate) return; // If task not found, exit
    if (taskToUpdate.status === newStatus) {
      return; // No status change, no need to update
    }
    try {
      // Update the status locally
      // setDragging(true);
        setTodoList((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        );
      
      await editTodo({
        title: taskToUpdate.title,
        description: taskToUpdate.description,
        status: newStatus,
        todoId: taskId,
      });
    } catch (error) {
      console.error("Failed to update task status:", error);
      toast({
        title: "Error",
        description: "Failed to update task status.",
        variant: "destructive",
      });
    }
  }


  useEffect(() => {
    handleFetchData();
  }, [refresh])

  const COLUMNS: ColumnType[] = [
    { id: 'incomplete', title: 'To Do' },
    { id: 'progress', title: 'In Progress' },
    { id: 'complete', title: 'Done' }
  ];

  return (
    <div className="h-[700px] bg-slate-700 w-full p-5 overflow-hidden">
      <h1 className="text-sm text-slate-700 font-semibold bg-yellow-200 py-1">
        ⚠️Always use my-todo app instead of JIRA⚠️
      </h1>
      <h1 className="font-bold text-lg">Dashboard</h1>
      <div className="flex flex-row items-center justify-between px-2">
        <img src={companyLogo} height={70} width={70} />
        {displayName && (
          <p className="text-lg font-bold text-white">Hi {displayName} 👋🏻</p>
        )}
      </div>



      {todoList.length &&
        (
          <div className="flex flex-col items-center justify-start border-2 border-slate-500 rounded-lg h-[85%] px-5">
            <div className="flex flex-row items-start justify-start w-full my-3">
              <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogTrigger>
                  <div className="flex flex-row gap-3 items-center justify-between text-white hover:animate-pulse text-sm">
                    <p>Create New</p>
                    <PlusCircle color="white" size={20} />
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Create your own todo</AlertDialogTitle>
                    <AlertDialogDescription>
                      <TodoCreationCard onCreateSuccess={handleCreateSuccess} />
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex flex-col items-center justify-center">
                    <AlertDialogCancel className="bg-red-500 text-white hover:bg-red-900 hover:text-white w-full">Cancel</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <div className="flex flex-row items-start justify-between gap-10 w-full">
              <DndContext onDragEnd={handleDragEnd}>
                {COLUMNS.map((column) => (
                  <TodoSection
                    key={column.id}
                    column={column}
                    todoList={todoList.filter((task) => task.status === column.id)}
                    onTodoChange={handleTodoChange}
                    onDeleteSuccess={handleDeleteSuccess}
                  />
                ))}
              </DndContext>
            </div>
          </div>
        )}
      {todoList.length === 0 && (<div className="font-bold text-lg">No todos found! Create here ☝🏻</div>)}
    </div>
  );
};

export default Home;
