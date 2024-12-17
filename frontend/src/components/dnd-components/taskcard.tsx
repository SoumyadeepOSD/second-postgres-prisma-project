import { TasksType } from "@/constants/types/todo-type";
import { useDraggable } from "@dnd-kit/core";

interface TaskCardProps {
    task: TasksType;
};


const TaskCard = ({ task }: TaskCardProps) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: task.id! });
    
    const style = transform 
        ? 
        {
            transform: `translate(${transform.x}px, ${transform.y}px)`,
        } : undefined;
    
    return (
        <div 
        ref={setNodeRef}
        {...listeners}
        {...attributes}    
        style={style}
        className="cursor-grab flex flex-col items-start justify-center border-2 border-slate-400 rounded-lg p-3 mb-3"
        >
            <h3 className="text-white text-xs font-bold">{task.title}</h3>
            <p className="text-white text-xs font-semibold">{task.description}</p>
        </div>
    )
}

export default TaskCard