import { AppSidebar } from "@/components/layout/AppSidebar";
import { TodoList } from "@/components/todos/TodoList";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useTodoLists } from "@/hooks/useTodoLists";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export function DashboardPage() {
  const { user } = useAuth();
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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="fixed top-0 z-10 flex h-16 w-full shrink-0 items-center gap-2 border-b bg-background transition-[left,width] duration-200 ease-linear  md:w-[calc(100%-var(--sidebar-width))]">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div>
              <h1 className="text-lg font-semibold">My Todo Lists</h1>
              {user && (
                <p className="text-xs text-muted-foreground">
                  Welcome back, {user.name}
                </p>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-16">
          <div className="mt-4">
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

            {!isError && todoLists && todoLists.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-24 text-center">
                <p className="text-lg font-semibold">No todo lists found</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  You don't have any todo lists yet
                </p>
              </div>
            )}

            {!isError && todoLists && todoLists.length > 0 && (
              <div className="overflow-x-auto -mx-4 px-4">
                <motion.div
                  className="flex gap-6 min-w-max"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {todoLists.map((todoList) => (
                    <motion.div
                      key={todoList.id}
                      variants={itemVariants}
                      transition={{ duration: 0.2 }}
                      className="w-[360px] md:w-[375px] shrink-0"
                    >
                      <TodoList todoList={todoList} />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
