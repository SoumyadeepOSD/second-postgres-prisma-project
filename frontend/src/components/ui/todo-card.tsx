/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { BabyIcon, CheckCircle2, TrashIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Input } from "./input";
import useTodo from "@/hooks/useTodo";
import { toast } from "@/hooks/use-toast";
import { LabelsType, TasksType } from "@/constants/types/todo-type";
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
import { priorityMapping } from "@/lib/helpers";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";


const TodoCard = ({ task, onTodoChange, onDeleteSuccess }: { task: TasksType, onTodoChange: () => void, onDeleteSuccess: () => void }) => {
  const { editTodo, deleteTodo } = useTodo();
  const [editableTitle, setEditableTitle] = useState(false);
  const [editableDesc, setEditableDesc] = useState(false);
  const [editablePriority, setEditablePriority] = useState(false);

  const [newTitle, setNewTitle] = useState(task.title || "");
  const [newDesc, setNewDesc] = useState(task.description || "");
  const [newPriority, setNewPriority] = useState(task.priority || 4);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descInputRef = useRef<HTMLInputElement>(null);
  const priorities = [1, 2, 3, 4];

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
    } else if (type === "priority") {
      setNewPriority(+e); //transform the priority text to number and set into the state
    }
  }

  async function handleKeyPress(e: React.KeyboardEvent, title: string, description: string, status: string, tododId: number, type: string, creationDateTime: string, updationDateTime: string, labels: LabelsType[], priority: number) {
    if (e.key === "Enter") {
      try {
        await editTodo({
          title: title,
          description: description,
          status: status,
          todoId: tododId,
          creationDateTime: creationDateTime,
          updationDateTime: updationDateTime,
          labels: labels?.map((e) => e.id!),
          priority: priority
        });
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


  const handleSelect = async ({ labels, tododId }: { labels: LabelsType[], tododId: number }) => {
    try {
      await editTodo({
        ...task,
        labels: labels?.map((e) => e.id!),
        todoId: tododId,
        priority: newPriority,
      });
      console.log(`After setting priority ${task} ${newPriority}`);

      setEditablePriority(false); // Exit edit mode after successful update
      onTodoChange(); // Refresh the todo list to reflect the updated priority
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update priority.",
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
                onKeyDown={(e) => { handleKeyPress(e, newTitle, task.description!, task.status!, task.id!, "title", task.creationDateTime!, task.updationDateTime!, task.labels!, task.priority!); }}
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
              onKeyDown={(e) => { handleKeyPress(e, task.title!, newDesc, task.status!, task.id!, "desc", task.creationDateTime!, task.updationDateTime!, task.labels!, task.priority!); }}
              ref={descInputRef}
              className="bg-transparent ring-0 caret-white border-transparent block overflow-auto"
            />
          ) : (
            newDesc
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-between gap-2">
          <div className="flex flex-row items-center justify-between w-full">
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
            <div className="flex flex-row items-center justify-center gap-3">
              <BabyIcon size={20} className="text-slate-500" />
              <p className="text-white text-xs">{task.creationDateTime}</p>
            </div>
            {
              editablePriority ? (
                <div className="flex flex-row items-center justify-start">
                  <Select
                    onValueChange={(value) => setNewPriority(+value)} // Store the selected priority as a number
                    defaultValue={newPriority.toString()} // Set the current priority as default
                  >
                    <SelectTrigger className="w-[70px] text-white">
                      <SelectValue placeholder={newPriority.toString()} />
                    </SelectTrigger>
                    <SelectContent className="text-white bg-slate-500">
                      {priorities.map((priority, index) => (
                        <SelectItem key={index} value={priority.toString()}>
                          {priorityMapping({ priority: priority })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <CheckCircle2 color="white" onClick={() => { handleSelect({ labels: task.labels!, tododId: task.id! }) }} />
                </div>
              ) : (
                <p
                  onDoubleClick={() => setEditablePriority(true)} // Enable editing on double-click
                  className={`cursor-pointer px-3 py-1 rounded-xl text-xs border-2 border-slate-500 ${newPriority===1?"bg-red-600":newPriority===2?"bg-orange-600":newPriority===3?"bg-yellow-500":newPriority==4?"bg-blue-400":"bg-slate-600"}`}
                >
                  {priorityMapping({ priority: newPriority })}
                </p>
              )
            }
          </div>
          <div className="w-full grid grid-cols-5 items-start gap-2">
            {
              task.labels?.map((l, i) =>
              (<div key={i || l.id} className="text-xs font-semibold text-blue-200 bg-gradient-to-br from-blue-700 to-blue-950 border-[1px] border-white px-2 py-1 rounded-xl w-fit">
                {l.name}
              </div>)
              )
            }
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TodoCard;
