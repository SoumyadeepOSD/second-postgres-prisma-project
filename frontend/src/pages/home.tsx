/* eslint-disable @typescript-eslint/no-explicit-any */
import "../App.css";
import { useForm, SubmitHandler } from "react-hook-form"
import { companyLogo } from "@/constants/images";
import {
  Tags,
  PlusCircle,
  CalendarCheck,
  CalendarFoldIcon,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog"
import TodoCreationCard from "@/components/ui/todo-creation-card";
import {
  useContext,
  useEffect,
  useState
} from "react";
import useTodo from "@/hooks/useTodo";
import { toast } from "@/hooks/use-toast";
import TodoSection from "@/components/ui/todo-section";
import {
  DndContext,
  DragEndEvent
} from "@dnd-kit/core";
import {
  queryType,
  TasksType,
} from "@/constants/types/todo-type";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button";
import useLabel from "@/hooks/useLabel";
import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label";
import AuthContext from "@/context/authContext";
import { fetchedLabelType } from "@/constants/types/label-tyep";
import { COLUMNS } from "@/constants/components";

type Inputs = {
  label: string;
}

const Home = () => {
  const { fetchTodo, editTodo } = useTodo();
  const [isOpen, setIsOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const { createLabel, getLabel } = useLabel();
  const [refresh, setRefresh] = useState(false);
  const [option, setOption] = useState<string>("");
  const [todoList, setTodoList] = useState<TasksType[]>([]);
  const [fetchedLabels, setFetchedLabels] = useState<fetchedLabelType[]>([]);
  const [query, setQuery] = useState<queryType>({
    qParam: "",
    priority: 0,
    cat: -1
  });
  const debouncedInputValue = useDebounce(query, 2000);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    onCreateLabel({ label: data.label });
    reset();
    setSheetOpen((sheetOpen) => !sheetOpen);
  };


  async function handleFetchData(searchQuery?: queryType) {
    try {
      const fetchedTodos = await fetchTodo(searchQuery);
      setTodoList(fetchedTodos);
    } catch (error) {
      toast({
        title: "failed!",
        description: `Failed to fetch data ${error}`
      });
    }
  }

  const fetchLabels = async () => {
    const labels = await getLabel();
    setFetchedLabels(labels);
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
      setTodoList((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
      console.log(`New Update time ${new Date(new Date()).toString()}`);

      await editTodo({
        title: taskToUpdate.title,
        description: taskToUpdate.description,
        status: newStatus,
        todoId: taskId,
        creationDateTime: taskToUpdate.creationDateTime,
        updationDateTime: new Date(new Date()).toString(),
        labels: taskToUpdate.labels?.map((e) => +e.id!),
        priority: taskToUpdate.priority
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


  const onCreateLabel = async ({ label }: { label: string }) => {
    try {
      await createLabel({ name: label });
    } catch (error) {
      toast({
        title: "Failure",
        description: `Can't create new label ${error}`,
        variant: "destructive"
      });
    }
  }



  useEffect(() => {
    handleFetchData();
    fetchLabels();
  }, [refresh]);


  useEffect(() => {
    handleFetchData(debouncedInputValue);
  }, [debouncedInputValue]);



  const handleSearchByFilter = () => {
    handleFetchData();
  }

  const handleLogout = () => {
    window.localStorage.setItem("access_token", "");
    window.location.href = "/login";
  }

  const { startDate, endDate, setStartDate, setEndDate } = useContext(AuthContext);

  return (
    <div className="h-[700px] bg-slate-700 w-full p-5 overflow-hidden">
      <h1 className="text-sm text-slate-700 font-semibold bg-yellow-200 py-1">
        ⚠️Always use my-todo app instead of JIRA⚠️
      </h1>
      <h1 className="font-bold text-lg">Dashboard</h1>
      <p className="text-white text-xs">{startDate?.toString()} {endDate?.toString()}</p>
      <p className="text-white text-xs">DQ {debouncedInputValue.qParam}</p>
      <div className="flex flex-row items-center justify-between px-2">
        <img src={companyLogo} height={70} width={70} />
        <Button onClick={handleLogout} className="text-xs font-semibold text-white">Logout</Button>
      </div>


      {todoList.length + 1 && fetchLabels.length + 1 &&
        (
          <div className="flex flex-col items-center justify-start border-2 border-slate-500 rounded-lg h-[85%] px-5">
            <div className="flex flex-row items-center justify-start w-full my-3">
              <Sheet open={sheetOpen} onOpenChange={() => {
                setSheetOpen((sheetOpen) => !sheetOpen);
                reset();
              }}>
                <SheetTrigger className="mr-2 text-xs py-1">
                  <Tags color="white" />
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Create New Label</SheetTitle>
                    <SheetDescription>
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <Label>Label name</Label>
                        <Input
                          {...register("label", { required: true })}
                          type="text"
                          placeholder="enter label name"
                        />
                        {errors.label && <span className="text-red-500 text-xs">This field is required</span>}
                        <Button type="submit" className="w-full my-3">Create ✅</Button>
                      </form>
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>

              <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogTrigger>
                  <div className="flex flex-row gap-1 items-center justify-between text-white hover:animate-pulse text-sm">
                    <p className="text-xs">Create</p>
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
              <div className="mx-3 w-[90%] my-2 caret-white text-white flex flex-row items-center justify-between gap-3">
                <Input
                  placeholder={`Search todos...`}
                  value={query.qParam}
                  onChange={(e) => {
                    setQuery((prev) => ({
                      ...prev,
                      qParam: e.target.value
                    }))
                  }}
                />
                <Select onValueChange={(e) => { setOption(e); }}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter" onChange={(e) => { console.log(e.currentTarget.textContent); }} />
                  </SelectTrigger>
                  <SelectContent >
                    <SelectItem value="dateandtime">Date & Time</SelectItem>
                    <SelectItem value="priority">Proirity</SelectItem>
                    <SelectItem value="cat">Category/Labels</SelectItem>
                  </SelectContent>
                </Select>
                {option === "dateandtime" && (<div className="bg-slate-600 p-2 rounded-lg flex flex-row items-center justify-center gap-2">
                  <Popover>
                    <PopoverTrigger className="px-4 text-xs font-bold">
                      <CalendarFoldIcon color="white" />
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        className="rounded-md border text-blue-500"
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger className="px-4 text-xs font-bold">
                      <CalendarCheck color="white" />
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        className="rounded-md border text-blue-500"
                      />
                    </PopoverContent>
                  </Popover>
                  <Button onClick={handleSearchByFilter} disabled={!endDate}>Search</Button>
                </div>)}
                {option === "priority" && (
                  <Select onValueChange={(e) => {
                    setQuery((prev) => ({
                      ...prev,
                      priority: +e
                    }))
                  }}>
                    <SelectTrigger className="w-[80px]">
                      <SelectValue placeholder="Label" onChange={(e) => { console.log(e.currentTarget.textContent); }} />
                    </SelectTrigger>
                    <SelectContent >
                      <SelectItem value="1">Urgent</SelectItem>
                      <SelectItem value="2">High</SelectItem>
                      <SelectItem value="3">Moderate</SelectItem>
                      <SelectItem value="4">Base</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                {option === "cat" && (
                  <Select onValueChange={(e) => {
                    setQuery((prev) => ({
                      ...prev,
                      cat: +e
                    }))
                  }}>
                    <SelectTrigger className="w-[80px]">
                      <SelectValue
                        placeholder="Label"
                        onChange={(e) => {
                          console.log(e.currentTarget.textContent);
                        }}
                      />
                    </SelectTrigger>
                    <SelectContent >
                      {fetchedLabels?.map((e: fetchedLabelType) => (
                        <SelectItem
                          key={e.id}
                          value={e.id?.toString() || ""}
                        >
                          {e.name}
                        </SelectItem>
                      ))
                      }
                    </SelectContent>
                  </Select>
                )}
              </div>
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
      {/* {todoList.length === 0 && (<div className="font-bold text-lg">No todos found! Create here ☝🏻</div>)} */}
    </div>
  );
};

export default Home;
