import { useTodoLists } from "@/hooks/useTodoLists";
import { fetchTodos } from "@/lib/api";
import type { Todo } from "@/types";
import { useQueries } from "@tanstack/react-query";

interface UserStats {
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  completionRate: number;
  totalLists: number;
}

interface UserStatsReturn {
  data: UserStats;
  isLoading: boolean;
}

export function useUserStats(userId: string | undefined): UserStatsReturn {
  // Get todo lists (reactive)
  const { data: todoLists, isLoading: isLoadingLists } = useTodoLists(userId);

  // Get all todos for each list (reactive)
  const todosQueries = useQueries({
    queries: (todoLists || []).map((list) => ({
      queryKey: ["todos", list.id],
      queryFn: () => fetchTodos(list.id),
      staleTime: 1000 * 60 * 2,
    })),
  });

  // Check if lists or todos are loading
  const isLoading =
    isLoadingLists || todosQueries.some((query) => query.isLoading);

  const stats: UserStats = (() => {
    if (!todoLists || isLoading) {
      return {
        totalTasks: 0,
        completedTasks: 0,
        activeTasks: 0,
        completionRate: 0,
        totalLists: 0,
      };
    }

    // Aggregate all todos
    const allTodos: Todo[] = todosQueries
      .filter((query) => query.data)
      .flatMap((query) => query.data!);

    const totalTasks = allTodos.length;
    const completedTasks = allTodos.filter((todo) => todo.completed).length;
    const activeTasks = totalTasks - completedTasks;
    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalTasks,
      completedTasks,
      activeTasks,
      completionRate,
      totalLists: todoLists.length,
    };
  })();

  return { data: stats, isLoading };
}
