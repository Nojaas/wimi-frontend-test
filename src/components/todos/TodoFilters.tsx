import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type TodoFilter = "all" | "active" | "completed";

interface TodoFiltersProps {
  activeFilter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
  counts: {
    all: number;
    active: number;
    completed: number;
  };
}

export function TodoFilters({
  activeFilter,
  onFilterChange,
  counts,
}: TodoFiltersProps) {
  const filters = [
    { key: "all" as const, label: "All", count: counts.all },
    { key: "active" as const, label: "Active", count: counts.active },
    { key: "completed" as const, label: "Done", count: counts.completed },
  ];

  return (
    <div className="flex items-center gap-1 rounded-lg border bg-muted/50 p-1">
      {filters.map(({ key, label, count }) => {
        const isActive = activeFilter === key;

        return (
          <Button
            key={key}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => onFilterChange(key)}
            className="flex-1"
          >
            {label}
            <span
              className={cn(
                "ml-1.5 px-1.5 py-0.5 text-xs",
                isActive ? "text-white" : "rounded-full bg-background/80"
              )}
            >
              {count}
            </span>
          </Button>
        );
      })}
    </div>
  );
}
