import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteTodo } from "@/hooks/useTodos";
import { cn } from "@/lib/utils";
import type { Todo } from "@/types";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { EditTodoForm } from "./EditTodoForm";

interface TodoItemProps {
  todo: Todo;
  onToggle?: () => void;
  isDisabled?: boolean;
}

export function TodoItem({ todo, onToggle, isDisabled }: TodoItemProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { mutate: deleteTodo, isPending: isDeleting } = useDeleteTodo();

  const handleToggle = () => {
    if (onToggle && !isDisabled) {
      onToggle();
    }
  };

  const handleDelete = () => {
    deleteTodo(todo.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
      },
    });
  };

  return (
    <>
      <div
        className={cn(
          "group flex items-start gap-3 rounded-lg border bg-card p-4 transition-all duration-200 hover:shadow-md hover:scale-[1.01] min-h-[125px] max-h-[125px]",
          todo.completed && "bg-muted/50",
          isDisabled && "opacity-50 pointer-events-none"
        )}
      >
        <Checkbox
          id={`todo-${todo.id}`}
          checked={todo.completed}
          onCheckedChange={handleToggle}
          disabled={isDisabled}
          className="mt-0.5 cursor-pointer shrink-0"
        />
        <div className="flex-1 space-y-1 min-w-0 overflow-hidden">
          <label
            htmlFor={`todo-${todo.id}`}
            className={cn(
              "text-sm font-medium leading-none cursor-pointer transition-all duration-300 ease-in-out block",
              todo.completed && "line-through text-muted-foreground",
              !isDisabled && "hover:text-primary"
            )}
            title={todo.title}
          >
            {todo.title}
          </label>
          {todo.description && (
            <p
              className={cn(
                "text-sm text-muted-foreground transition-all duration-300 line-clamp-2",
                todo.completed && "line-through"
              )}
              title={todo.description}
            >
              {todo.description}
            </p>
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            {todo.priority && (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 font-medium shrink-0",
                  todo.priority === "high" &&
                    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                  todo.priority === "medium" &&
                    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                  todo.priority === "low" &&
                    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                )}
              >
                {todo.priority}
              </span>
            )}
            {todo.dueDate && (
              <span className="text-muted-foreground truncate">
                Due: {todo.dueDate}
              </span>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <EditTodoForm
            todo={todo}
            onSuccess={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete task?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{todo.title}"? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
