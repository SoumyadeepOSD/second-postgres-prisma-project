import useTodo from "@/hooks/useTodo"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"
import { useForm, SubmitHandler } from "react-hook-form"

type Inputs = {
    title: string
    description: string
}

type TodoCreationCardProps = {
    onCreateSuccess: () => void; // Notify parent when todo is created
};

const TodoCreationCard = ({onCreateSuccess}:TodoCreationCardProps) => {
    const {createTodo} = useTodo();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = async(data) => {
        await createTodo({title:data.title, description:data.description});
        onCreateSuccess();
    };

    
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
                <Label>Todo title</Label>
                <Input {...register("title",{required:true})}/>
                {errors.title && <span className="text-red-500">Title is required</span>}
            </div>

            <div className="flex flex-col gap-3">
                <Label>Todo description</Label>
                <Input {...register("description", {required:true})}/>
                {errors.description && <span className="text-red-500">Description is required</span>}
            </div>

            <Button type="submit">
                Create
            </Button>
        </form>
    )
}

export default TodoCreationCard
