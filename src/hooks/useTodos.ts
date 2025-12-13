import { fetchTodos, updateTodo } from "@/lib/api";
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
