import Column from "@/components/dnd-components/column";
import { INITIAL_TASKS } from "@/constants/data";
import { ColumnType, TasksType } from "@/constants/types/todo-type";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useState } from "react";


const COLUMNS: ColumnType[] = [
    { id: 'incomplete', title: 'To Do' },
    { id: 'progress', title: 'In Progress' },
    { id: 'done', title: 'Done' }
];




const Testing = () => {
    const [tasks, setTasks] = useState<TasksType[]>(INITIAL_TASKS);

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
    
        if (!over) return; // Exit if there's no drop target
    
        const taskId = active.id as number; // ID of the dragged task
        const newStatus = over.id as string; // ID of the drop target column
    
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId
                    ? { ...task, status: newStatus }
                    : task
            )
        );
    }
    

    return (
        <div>
            <h1>Todo List</h1>
            <div className="flex flex-row items-start justify-evenly bg-blue-950 h-[100vh] py-10">
                <DndContext onDragEnd={handleDragEnd}>
                    {
                        COLUMNS.map((column) => {
                            return (
                                <Column
                                    key={column.id}
                                    column={column}
                                    tasks={tasks.filter((task) => task.status === column.id)}
                                />
                            );

                        })
                    }
                </DndContext>
            </div>
        </div>
    );
}

export default Testing;