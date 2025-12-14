import { createTodo, deleteTodo, fetchTodos, updateTodo } from "@/lib/api";
import type { Todo } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useTodos(todoListId: string | undefined) {
  return useQuery({
    queryKey: ["todos", todoListId],
    queryFn: () => fetchTodos(todoListId!),
    enabled: !!todoListId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useToggleTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      todoId,
      completed,
    }: {
      todoId: string;
      completed: boolean;
    }) => updateTodo(todoId, { completed }),
    onSuccess: (updatedTodo) => {
      // Invalidate todos query to refetch
      queryClient.invalidateQueries({
        queryKey: ["todos", updatedTodo.todoListId],
      });

      // Show success toast
      toast.success(
        updatedTodo.completed ? "Task marked as complete! ✓" : "Task reopened"
      );
    },
    onError: (error) => {
      toast.error(
        `Failed to update task: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    },
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Todo, "id" | "createdAt">) => createTodo(data),
    onSuccess: (newTodo) => {
      // Invalidate todos query to refetch and show new todo
      queryClient.invalidateQueries({
        queryKey: ["todos", newTodo.todoListId],
      });

      // Show success toast
      toast.success("Task created successfully! ✨");
    },
    onError: (error) => {
      toast.error(
        `Failed to create task: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      todoId,
      data,
    }: {
      todoId: string;
      data: Partial<Omit<Todo, "id">>;
    }) => updateTodo(todoId, data),
    onSuccess: (updatedTodo) => {
      queryClient.invalidateQueries({
        queryKey: ["todos", updatedTodo.todoListId],
      });
      toast.success("Task updated successfully! ✓");
    },
    onError: (error) => {
      toast.error(
        `Failed to update task: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Task deleted successfully! 🗑️");
    },
    onError: (error) => {
      toast.error(
        `Failed to delete task: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    },
  });
}
