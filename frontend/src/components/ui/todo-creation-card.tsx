/* eslint-disable @typescript-eslint/no-explicit-any */
import useTodo from "@/hooks/useTodo"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"
import { useForm, SubmitHandler } from "react-hook-form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"
import useLabel from "@/hooks/useLabel"

type Inputs = {
    title: string
    description: string
}

type TodoCreationCardProps = {
    onCreateSuccess: () => void; // Notify parent when todo is created
};

type fetchedLabelType = {
    id?: number;
    name?: string;
};


const TodoCreationCard = ({ onCreateSuccess }: TodoCreationCardProps) => {
    const { createTodo } = useTodo();
    const { getLabel } = useLabel();
    const [fetchedLabels, setFetchedLabels] = useState<fetchedLabelType[]>([]);
    const [selectedLabels, setSelectedLabels] = useState<number[]>([]);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        await createTodo(
            {
                title: data.title,
                description: data.description,
                labels: selectedLabels
            }
        );
        onCreateSuccess();
    };


    const onHandleSetLabels = (e: any) => {
        const number = parseInt(e, 10);
        if (!isNaN(number)) {
            setSelectedLabels((prev) => {
                if (!prev.includes(number)) {
                    return [...prev, e];
                }
                return prev; // Return the unmodified array if the element is already included
            });
        }
    };


    const fetchLabels = async () => {
        const labels = await getLabel();
        setFetchedLabels(labels);
    }



    useEffect(() => {
        fetchLabels();
        console.log("fetched labels", fetchedLabels);
        console.log("selected labels", selectedLabels);
    }, []);


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
                <Label>Todo title</Label>
                <Input {...register("title", { required: true })} />
                {errors.title && <span className="text-red-500">Title is required</span>}
            </div>

            <div className="flex flex-col gap-3">
                <Label>Todo description</Label>
                <Input {...register("description", { required: true })} />
                {errors.description && <span className="text-red-500">Description is required</span>}
            </div>
            <Select onValueChange={onHandleSetLabels}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Labels" />
                </SelectTrigger>
                <SelectContent>
                    {
                        fetchedLabels.map((item, index) => {
                            return (
                                <SelectItem key={index || item.id} value={item.id!.toString()}>
                                    {item.name}
                                </SelectItem>
                            );
                        })
                    }
                </SelectContent>
            </Select>
            <p className="text-black text-xs">all labels</p>
            {
                JSON.stringify(selectedLabels.map((e) => +e))
            }
            <Button type="submit">
                Create
            </Button>
        </form>
    )
}

export default TodoCreationCard
