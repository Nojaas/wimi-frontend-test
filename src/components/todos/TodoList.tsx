import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTodos, useToggleTodo } from "@/hooks/useTodos";
import type { TodoList as TodoListType } from "@/types";
import { AlertCircle } from "lucide-react";
import { CreateTodoDialog } from "./CreateTodoDialog";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
  todoList: TodoListType;
}

export function TodoList({ todoList }: TodoListProps) {
  const { data: todos, isLoading, isError, error } = useTodos(todoList.id);
  const { mutate: toggleTodo, isPending } = useToggleTodo();

  const handleToggle = (todoId: string, currentCompleted: boolean) => {
    toggleTodo({ todoId, completed: !currentCompleted });
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center gap-3 mb-3">
          {todoList.color && (
            <div
              className="h-4 w-4 rounded-full shrink-0"
              style={{ backgroundColor: todoList.color }}
            />
          )}
          <CardTitle className="text-xl flex-1">{todoList.title}</CardTitle>
          {isLoading && <Skeleton className="ml-auto h-5 w-12" />}
          {!isLoading && todos && todos.length > 0 && (
            <span className="ml-auto text-sm font-medium text-muted-foreground">
              {todos.filter((t) => t.completed).length} / {todos.length}
            </span>
          )}
        </div>
        <CreateTodoDialog
          todoListId={todoList.id}
          todoListTitle={todoList.title}
        />
      </CardHeader>
      <CardContent className="flex-1 p-4">
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg border bg-card p-4"
              >
                <Skeleton className="mt-0.5 h-4 w-4 rounded shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <div className="flex gap-2 pt-1">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <p>
              Error loading todos:{" "}
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
          </div>
        )}

        {!isLoading && !isError && todos && todos.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No tasks yet in this list
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Create your first task to get started
            </p>
          </div>
        )}

        {!isLoading && !isError && todos && todos.length > 0 && (
          <div className="space-y-2">
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={() => handleToggle(todo.id, todo.completed)}
                isDisabled={isPending}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
