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
import { useState } from "react"

type Inputs = {
    title: string
    description: string
}


type TodoCreationCardProps = {
    onCreateSuccess: () => void; // Notify parent when todo is created
};

const TodoCreationCard = ({ onCreateSuccess }: TodoCreationCardProps) => {
    const { createTodo } = useTodo();
    const [selectedLabels, setSelectedLabels] = useState<number[]>([]);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        await createTodo({ title: data.title, description: data.description, labels:selectedLabels });
        onCreateSuccess();
    };


    const onHandleSetLabels = (e:any)=>{
        setSelectedLabels((prev)=>[...prev, e])
    };

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
                    <SelectItem value="light">Gardening</SelectItem>
                    <SelectItem value="dark">Cutting</SelectItem>
                    <SelectItem value="system">Cooking</SelectItem>
                </SelectContent>
            </Select>

            <Button type="submit">
                Create
            </Button>
        </form>
    )
}

export default TodoCreationCard
