/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { TrashIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Input } from "./input";
import useTodo from "@/hooks/useTodo";
import { toast } from "@/hooks/use-toast";
import { TasksType } from "@/constants/types/todo-type";
import { useDraggable } from "@dnd-kit/core";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


const TodoCard = ({ task, onTodoChange, onDeleteSuccess }: { task: TasksType, onTodoChange: () => void, onDeleteSuccess: () => void }) => {
  const { editTodo, deleteTodo } = useTodo();
  const [editableTitle, setEditableTitle] = useState(false);
  const [editableDesc, setEditableDesc] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title || "");
  const [newDesc, setNewDesc] = useState(task.description || "");
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descInputRef = useRef<HTMLInputElement>(null);




  const { attributes, listeners, setNodeRef, transform } = useDraggable(
    {
      id: task.id!,
      data: { ...task },
      disabled: editableTitle || editableDesc
    });
  const style = transform
    ?
    {
      transform: `translate(${transform.x}px, ${transform.y}px)`,
    } : undefined;

  function handleDoubleClick(type: string) {
    if (type === "title") {
      setEditableTitle(true);
    } else if (type === "desc") {
      setEditableDesc(true);
    }
  }


  function handleBlur(type: string) {
    if (type === "title") {
      setEditableTitle(false);
      setNewTitle(newTitle);
    } else if (type === "desc") {
      setEditableDesc(false);
      setNewDesc(newDesc);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>, type: string) {
    if (type === "title") {
      setNewTitle(e.target.value);
    } else if (type === "desc") {
      setNewDesc(e.target.value);
    }
  }

  async function handleKeyPress(e: React.KeyboardEvent, title: string, description: string, status: string, tododId: number, type: string) {
    if (e.key === "Enter") {
      try {
        await editTodo({ title: title, description: description, status: status, todoId: tododId });
        handleBlur(type);
        onTodoChange();
      } catch (error: any) {
        toast({
          title: "error",
          description: error,
          variant: "destructive"
        });
      }
    }
  }

  const handleDelete = async ({ itemId }: { itemId: number }) => {
    console.log("Deleting todo with ID:", itemId);
    try {
      await deleteTodo({ todoId: itemId });
      onDeleteSuccess(); // Verify this callback is working
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast({
        title: "Error",
        description: "Failed to delete todo.",
        variant: "destructive",
      });
    }
  };




  useEffect(() => {
    if (editableTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
    else if (editableDesc && descInputRef.current) {
      descInputRef.current.focus();
    }
  }, [editableTitle, editableDesc]);

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="cursor-grab p-[2px] rounded-lg bg-gradient-to-r from-purple-600 to-blue-800 mb-5"
    >
      {/* Card with transparent background to show gradient */}
      <Card className="w-full sm:w-80 md:w-96 bg-slate-800 backdrop-blur-md shadow-lg rounded-lg">
        <CardHeader className="text-center">
          <CardTitle
            className="font-bold text-xl bg-gradient-to-r from-orange-700 via-yellow-400 to-yellow-500 bg-clip-text text-transparent"
            onDoubleClick={() => { handleDoubleClick("title"); }}
          >
            {editableTitle ? (
              <Input
                type="text"
                value={newTitle}
                onChange={(e) => { handleChange(e, "title") }}
                onBlur={() => { handleBlur("title"); }}
                onKeyDown={(e) => { handleKeyPress(e, newTitle, task.description!, task.status!, task.id!, "title"); }}
                ref={titleInputRef}
                className="bg-transparent ring-0 caret-white border-transparent overflow-x-scroll"
              />
            ) : (
              newTitle
            )}
          </CardTitle>
        </CardHeader>
        <CardContent
          className="text-start bg-gradient-to-br from-blue-700 to-white bg-clip-text text-transparent"
          onDoubleClick={() => { handleDoubleClick("desc"); }}
        >
          {editableDesc ? (
            <Input
              type="text"
              value={newDesc}
              onChange={(e) => { handleChange(e, "desc") }}
              onBlur={() => { handleBlur("desc"); }}
              onKeyDown={(e) => { handleKeyPress(e, task.title!, newDesc, task.status!, task.id!, "desc"); }}
              ref={descInputRef}
              className="bg-transparent ring-0 caret-white border-transparent block overflow-auto"
            />
          ) : (
            newDesc
          )}
        </CardContent>
        <CardFooter className="flex flex-row items-center justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              {/* Removed the wrapping div and applied the trigger directly to the TrashIcon */}
              <TrashIcon className="text-red-500 hover:cursor-pointer hover:bg-red-200 rounded-full p-1" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="text-white bg-red-500 hover:bg-red-800" onClick={() => { handleDelete({ itemId: task.id! }) }}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TodoCard;
