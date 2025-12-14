import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useTodos, useToggleTodo } from "@/hooks/useTodos";
import type { Todo, TodoList as TodoListType } from "@/types";
import { AlertCircle, ArrowDownUp } from "lucide-react";
import { useMemo, useState } from "react";
import { CreateTodoDialog } from "./CreateTodoDialog";
import { TodoFilters, type TodoFilter } from "./TodoFilters";
import { TodoItem } from "./TodoItem";

type SortOption =
  | "default"
  | "priority-high"
  | "priority-low"
  | "date-nearest"
  | "date-farthest"
  | "created-newest"
  | "created-oldest";

const PRIORITY_ORDER = { high: 3, medium: 2, low: 1 } as const;

interface TodoListProps {
  todoList: TodoListType;
}

export function TodoList({ todoList }: TodoListProps) {
  const { data: todos, isLoading, isError, error } = useTodos(todoList.id);
  const { mutate: toggleTodo, isPending } = useToggleTodo();
  const [activeFilter, setActiveFilter] = useState<TodoFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("default");

  const handleToggle = (todoId: string, currentCompleted: boolean) => {
    toggleTodo({ todoId, completed: !currentCompleted });
  };

  // Filter and sort todos
  const filteredAndSortedTodos = useMemo(() => {
    if (!todos) return [];

    // First, filter
    let filtered: Todo[];
    switch (activeFilter) {
      case "active":
        filtered = todos.filter((todo) => !todo.completed);
        break;
      case "completed":
        filtered = todos.filter((todo) => todo.completed);
        break;
      default:
        filtered = todos;
    }

    // Then, sort
    const sorted = [...filtered];

    switch (sortOption) {
      case "priority-high":
        return sorted.sort((a, b) => {
          const aPriority = a.priority ? PRIORITY_ORDER[a.priority] : 0;
          const bPriority = b.priority ? PRIORITY_ORDER[b.priority] : 0;
          return bPriority - aPriority;
        });

      case "priority-low":
        return sorted.sort((a, b) => {
          const aPriority = a.priority ? PRIORITY_ORDER[a.priority] : 0;
          const bPriority = b.priority ? PRIORITY_ORDER[b.priority] : 0;
          return aPriority - bPriority;
        });

      case "date-nearest":
        return sorted.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });

      case "date-farthest":
        return sorted.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        });

      case "created-newest":
        return sorted.sort((a, b) => {
          if (!a.createdAt) return 1;
          if (!b.createdAt) return -1;
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });

      case "created-oldest":
        return sorted.sort((a, b) => {
          if (!a.createdAt) return 1;
          if (!b.createdAt) return -1;
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        });

      default:
        return sorted;
    }
  }, [todos, activeFilter, sortOption]);

  // Calculate counts for filter badges
  const filterCounts = useMemo(() => {
    if (!todos) {
      return { all: 0, active: 0, completed: 0 };
    }
    return {
      all: todos.length,
      active: todos.filter((t) => !t.completed).length,
      completed: todos.filter((t) => t.completed).length,
    };
  }, [todos]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center gap-3 mb-3">
          {isLoading ? (
            <>
              <Skeleton className="h-4 w-4 rounded-full shrink-0" />
              <Skeleton className="h-6 w-48 flex-1" />
              <Skeleton className="ml-auto h-5 w-12" />
            </>
          ) : (
            <>
              {todoList.color && (
                <div
                  className="h-4 w-4 rounded-full shrink-0"
                  style={{ backgroundColor: todoList.color }}
                />
              )}
              <CardTitle className="text-xl flex-1">{todoList.title}</CardTitle>
              {todos && todos.length > 0 && (
                <span className="ml-auto text-sm font-medium text-muted-foreground">
                  {filterCounts.completed} / {filterCounts.all}
                </span>
              )}
            </>
          )}
        </div>
        <div className="space-y-3">
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            todos &&
            todos.length > 0 && (
              <TodoFilters
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                counts={filterCounts}
              />
            )
          )}
          <div className="flex items-center gap-2">
            <CreateTodoDialog
              todoListId={todoList.id}
              todoListTitle={todoList.title}
            />
            {!isLoading && todos && todos.length > 0 && (
              <>
                <ArrowDownUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                <Select
                  value={sortOption}
                  onValueChange={(value) => setSortOption(value as SortOption)}
                >
                  <SelectTrigger className="h-9 flex-1">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default order</SelectItem>
                    <SelectItem value="priority-high">
                      Priority: High to Low
                    </SelectItem>
                    <SelectItem value="priority-low">
                      Priority: Low to High
                    </SelectItem>
                    <SelectItem value="date-nearest">
                      Due Date: Nearest first
                    </SelectItem>
                    <SelectItem value="date-farthest">
                      Due Date: Farthest first
                    </SelectItem>
                    <SelectItem value="created-newest">
                      Recently created
                    </SelectItem>
                    <SelectItem value="created-oldest">Oldest first</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        {isLoading && (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg border px-7 py-8"
              >
                <Skeleton className="h-5 w-5 shrink-0" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
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
          <>
            {filteredAndSortedTodos.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  {activeFilter === "all"
                    ? "No tasks in this list"
                    : `No ${activeFilter} tasks`}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredAndSortedTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={() => handleToggle(todo.id, todo.completed)}
                    isDisabled={isPending}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
