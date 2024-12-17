import { ColumnType, TasksType } from "@/constants/types/todo-type";
import TaskCard from "./taskcard";
import { useDroppable } from "@dnd-kit/core";
type ColumnProps = {
    column: ColumnType;
    tasks: TasksType[];
}

const Column = ({ column, tasks }: ColumnProps) => {
    const { setNodeRef } = useDroppable({ id: column.id! });

    return (
        <div
            ref={setNodeRef}
            className="bg-slate-700 border-2 border-slate-300 rounded-lg px-5 w-[300px] min-h-60"
        >
            <h2 className="text-white">{column.title}</h2>
            <div className="mt-3">
                {tasks.length === 0 ? (
                    <div className="text-slate-400">
                        No tasks here
                    </div>
                ) : (
                    tasks.map((task) => {
                        return <TaskCard key={task.id} task={task} />;
                    })
                )}
            </div>
        </div>
    )
}

export default Column