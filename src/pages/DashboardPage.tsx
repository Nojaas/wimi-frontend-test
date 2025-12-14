import { TodoList } from "@/components/todos/TodoList";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useTodoLists } from "@/hooks/useTodoLists";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

export function DashboardPage() {
  const { logout, user } = useAuth();
  const { data: todoLists, isLoading, isError, error } = useTodoLists(user?.id);

  useEffect(() => {
    if (isError) {
      toast.error(
        `Failed to load todo lists: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }, [isError, error]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div>
            <h1 className="text-2xl font-bold">My Todo Lists</h1>
            {user && (
              <p className="text-sm text-muted-foreground">
                Welcome back, {user.name}
              </p>
            )}
          </div>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        {isLoading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col rounded-lg border bg-card">
                {/* Header skeleton */}
                <div className="border-b p-6">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-4 rounded-full shrink-0" />
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="ml-auto h-5 w-12" />
                  </div>
                </div>
                {/* Content skeleton */}
                <div className="flex-1 p-4 space-y-3">
                  {[1, 2, 3].map((j) => (
                    <div
                      key={j}
                      className="flex items-start gap-3 rounded-lg border p-4"
                    >
                      <Skeleton className="mt-0.5 h-4 w-4 rounded shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <div>
              <p className="font-semibold">Failed to load todo lists</p>
              <p className="text-sm">
                {error instanceof Error ? error.message : "Unknown error"}
              </p>
            </div>
          </div>
        )}

        {!isLoading && !isError && todoLists && todoLists.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-24 text-center">
            <p className="text-lg font-semibold">No todo lists found</p>
            <p className="mt-2 text-sm text-muted-foreground">
              You don't have any todo lists yet
            </p>
          </div>
        )}

        {!isLoading && !isError && todoLists && todoLists.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {todoLists.map((todoList) => (
              <TodoList key={todoList.id} todoList={todoList} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
