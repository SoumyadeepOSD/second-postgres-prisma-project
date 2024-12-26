/* eslint-disable @typescript-eslint/no-explicit-any */
import useTodo from "@/hooks/useTodo";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { useForm, SubmitHandler } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import useLabel from "@/hooks/useLabel";
import { fetchedLabelType } from "@/constants/types/label-tyep";

type Inputs = {
    title: string;
    description: string;
};

type TodoCreationCardProps = {
    onCreateSuccess: () => void; // Notify parent when todo is created
};

const TodoCreationCard = ({ onCreateSuccess }: TodoCreationCardProps) => {
    const { createTodo } = useTodo();
    const { getLabel } = useLabel();
    const [fetchedLabels, setFetchedLabels] = useState<fetchedLabelType[] | null>(null); // Allow for null state
    const [selectedLabels, setSelectedLabels] = useState<number[]>([]);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        await createTodo({
            title: data.title,
            description: data.description,
            labels: selectedLabels,
        });
        onCreateSuccess();
    };

    const onHandleSetLabels = (e: any) => {
        const number = parseInt(e, 10);
        if (!isNaN(number)) {
            setSelectedLabels((prev) => {
                if (!prev.includes(number)) {
                    return [...prev, number];
                }
                return prev; // Return the unmodified array if the element is already included
            });
        }
    };

    const fetchLabels = async () => {
        try {
            const labels = await getLabel();
            setFetchedLabels(labels || []); // Default to an empty array if null
        } catch (error) {
            console.error("Error fetching labels:", error);
            setFetchedLabels([]); // Handle errors gracefully by setting an empty array
        }
    };

    useEffect(() => {
        fetchLabels();
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
                {errors.description && (
                    <span className="text-red-500">Description is required</span>
                )}
            </div>

            <Select onValueChange={onHandleSetLabels}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Labels" />
                </SelectTrigger>
                <SelectContent>
                    {fetchedLabels?.length === 0 ? (
                        <div className="text-red-500 text-xs">No labels found</div>
                    ) : (
                        fetchedLabels?.map((item, index) => (
                            <SelectItem key={index || item.id} value={item.id!.toString()}>
                                {item.name}
                            </SelectItem>
                        ))
                    )}
                </SelectContent>
            </Select>

            <p className="text-black text-xs">All selected labels:</p>
            <p className="text-black text-xs">
                {JSON.stringify(selectedLabels.map((e) => +e))}
            </p>
            
            <Button type="submit">Create</Button>
        </form>
    );
};

export default TodoCreationCard;
