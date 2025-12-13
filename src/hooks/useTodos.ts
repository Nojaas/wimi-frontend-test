import { fetchTodos } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useTodos(todoListId: string | undefined) {
  return useQuery({
    queryKey: ["todos", todoListId],
    queryFn: () => fetchTodos(todoListId!),
    enabled: !!todoListId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
