import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { Todo } from "@/types";

interface TodoItemProps {
  todo: Todo;
  onToggle?: (todoId: string) => void;
}

export function TodoItem({ todo, onToggle }: TodoItemProps) {
  const handleToggle = () => {
    if (onToggle) {
      onToggle(todo.id);
    }
  };

  return (
    <div
      className={cn(
        "group flex items-start gap-3 rounded-lg border bg-card p-4 transition-all duration-200 hover:shadow-md hover:scale-[1.01]",
        todo.completed && "bg-muted/50"
      )}
    >
      <Checkbox
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onCheckedChange={handleToggle}
        className="mt-0.5"
      />
      <div className="flex-1 space-y-1">
        <label
          htmlFor={`todo-${todo.id}`}
          className={cn(
            "text-sm font-medium leading-none cursor-pointer transition-all duration-200",
            todo.completed && "line-through text-muted-foreground"
          )}
        >
          {todo.title}
        </label>
        {todo.description && (
          <p
            className={cn(
              "text-sm text-muted-foreground",
              todo.completed && "line-through"
            )}
          >
            {todo.description}
          </p>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {todo.priority && (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 font-medium",
                todo.priority === "high" &&
                  "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                todo.priority === "medium" &&
                  "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                todo.priority === "low" &&
                  "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              )}
            >
              {todo.priority}
            </span>
          )}
          {todo.dueDate && (
            <span className="text-muted-foreground">Due: {todo.dueDate}</span>
          )}
        </div>
      </div>
    </div>
  );
}
