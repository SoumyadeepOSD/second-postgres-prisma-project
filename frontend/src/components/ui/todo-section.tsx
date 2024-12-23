import TodoCard from "@/components/ui/todo-card";
import { ColumnType, TasksType } from "@/constants/types/todo-type";
import { useDroppable } from "@dnd-kit/core";
import InfiniteScroll from "react-infinite-scroll-component";
import { useState, useEffect } from "react";

interface TodoSectionProps {
  todoList: TasksType[];
  column: ColumnType;
  onTodoChange: () => void;
  onDeleteSuccess: () => void;
}

const TodoSection = ({ todoList, column, onTodoChange, onDeleteSuccess }: TodoSectionProps) => {
  const { setNodeRef } = useDroppable({ id: column.id! });
  const itemsPerPage = 5;
  const [visibleTasks, setVisibleTasks] = useState<TasksType[]>([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setVisibleTasks(todoList.slice(0, itemsPerPage));
    setHasMore(todoList.length > itemsPerPage);
  }, [todoList]);

  const fetchMoreData = () => {
    setTimeout(() => {
      const nextPageTasks = todoList.slice(visibleTasks.length, visibleTasks.length + itemsPerPage);
      setVisibleTasks((prev) => [...prev, ...nextPageTasks]);
      if (visibleTasks.length + nextPageTasks.length >= todoList.length) {
        setHasMore(false);
      }
    }, 3000);
  };

  return (
    <div ref={setNodeRef} className="flex flex-col items-center justify-start bg-gradient-to-br from-teal via-teal-800 to-black bg-black/50 w-1/3 h-[65vh] py-5 overflow-hidden rounded-lg relative">
      <p
        className={`text-xs font-bold mb-3 ${column.id === "incomplete" ? "bg-red-300 text-red-700" : column.id === "progress" ? "bg-blue-300 text-blue-700" : "bg-green-300 text-green-700"} rounded-lg px-3 py-[1px]`}
      >
        {column.title}
      </p>
      <div className="relative z-10 w-full h-full overflow-auto flex flex-col items-center">
        <InfiniteScroll
          dataLength={visibleTasks.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<div className="text-white text-sm">Loading more tasks...</div>}
          endMessage={<p className="text-slate-400">All tasks loaded!</p>}
        >
          {
            visibleTasks.length === 0 ? (
              <div className="text-slate-400">
                No tasks here
              </div>
            ) : (
              visibleTasks.map((task) => (
                <TodoCard
                  key={task.id}
                  task={task}
                  onTodoChange={onTodoChange}
                  onDeleteSuccess={onDeleteSuccess}
                />
              ))
            )
          }
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default TodoSection;
