import { fetchTodoLists } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useTodoLists(userId: string | undefined) {
  return useQuery({
    queryKey: ["todoLists", userId],
    queryFn: () => fetchTodoLists(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
