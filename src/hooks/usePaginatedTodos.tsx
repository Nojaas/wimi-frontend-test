import type { Todo } from "@/types";
import { useEffect, useMemo, useRef, useState } from "react";

type SortOption =
  | "default"
  | "priority-high"
  | "priority-low"
  | "date-nearest"
  | "date-farthest"
  | "created-newest"
  | "created-oldest";

type TodoFilter = "all" | "active" | "completed";

const PRIORITY_ORDER = { high: 3, medium: 2, low: 1 } as const;
const ITEMS_PER_PAGE = 10;

interface UsePaginatedTodosParams {
  todos: Todo[] | undefined;
  activeFilter: TodoFilter;
  sortOption: SortOption;
}

interface UsePaginatedTodosReturn {
  paginatedTodos: Todo[];
  totalPages: number;
  totalItems: number;
  startItem: number;
  endItem: number;
  currentPage: number;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
  getPageNumbers: () => (number | string)[];
}

export function usePaginatedTodos({
  todos,
  activeFilter,
  sortOption,
}: UsePaginatedTodosParams): UsePaginatedTodosReturn {
  const [currentPage, setCurrentPage] = useState(1);
  const prevFilterRef = useRef(activeFilter);
  const prevSortRef = useRef(sortOption);

  // Filter and sort todos
  const filteredAndSortedTodos = useMemo(() => {
    if (!todos) return [];

    // 1. Filter
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

    // 2. Sort
    const sorted = [...filtered];

    switch (sortOption) {
      case "priority-high":
        sorted.sort((a, b) => {
          const aPriority = a.priority ? PRIORITY_ORDER[a.priority] : 0;
          const bPriority = b.priority ? PRIORITY_ORDER[b.priority] : 0;
          return bPriority - aPriority;
        });
        break;

      case "priority-low":
        sorted.sort((a, b) => {
          const aPriority = a.priority ? PRIORITY_ORDER[a.priority] : 0;
          const bPriority = b.priority ? PRIORITY_ORDER[b.priority] : 0;
          return aPriority - bPriority;
        });
        break;

      case "date-nearest":
        sorted.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
        break;

      case "date-farthest":
        sorted.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        });
        break;

      case "created-newest":
        sorted.sort((a, b) => {
          if (!a.createdAt) return 1;
          if (!b.createdAt) return -1;
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
        break;

      case "created-oldest":
        sorted.sort((a, b) => {
          if (!a.createdAt) return 1;
          if (!b.createdAt) return -1;
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        });
        break;
    }

    return sorted;
  }, [todos, activeFilter, sortOption]);

  // Paginate
  const { paginatedTodos, totalPages, totalItems, startItem, endItem } =
    useMemo(() => {
      const total = Math.ceil(filteredAndSortedTodos.length / ITEMS_PER_PAGE);
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const paginated = filteredAndSortedTodos.slice(startIndex, endIndex);

      return {
        paginatedTodos: paginated,
        totalPages: total,
        totalItems: filteredAndSortedTodos.length,
        startItem: filteredAndSortedTodos.length > 0 ? startIndex + 1 : 0,
        endItem: Math.min(endIndex, filteredAndSortedTodos.length),
      };
    }, [filteredAndSortedTodos, currentPage]);

  // Reset to page 1 when filter or sort changes
  useEffect(() => {
    if (
      prevFilterRef.current !== activeFilter ||
      prevSortRef.current !== sortOption
    ) {
      prevFilterRef.current = activeFilter;
      prevSortRef.current = sortOption;
      // Defer state update to avoid synchronous setState in effect
      queueMicrotask(() => {
        setCurrentPage(1);
      });
    }
  }, [activeFilter, sortOption]);

  // Generate page numbers with ellipsis
  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  return {
    paginatedTodos,
    totalPages,
    totalItems,
    startItem,
    endItem,
    currentPage,
    setCurrentPage,
    getPageNumbers,
  };
}
