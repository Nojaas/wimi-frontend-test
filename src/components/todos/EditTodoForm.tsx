import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateTodo } from "@/hooks/useTodos";
import { cn } from "@/lib/utils";
import {
  createTodoSchema,
  type CreateTodoInput,
} from "@/lib/validations/todoSchema";
import type { Todo } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface EditTodoFormProps {
  todo: Todo;
  onSuccess?: () => void;
}

export function EditTodoForm({ todo, onSuccess }: EditTodoFormProps) {
  const { mutate: updateTodo, isPending } = useUpdateTodo();
  const [date, setDate] = useState<Date | undefined>(
    todo.dueDate ? new Date(todo.dueDate) : undefined
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateTodoInput>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      title: todo.title,
      description: todo.description || "",
      priority: todo.priority,
      dueDate: todo.dueDate,
      todoListId: todo.todoListId,
    },
  });

  const priority = watch("priority");

  const onSubmit = (data: CreateTodoInput) => {
    updateTodo(
      {
        todoId: todo.id,
        data: {
          title: data.title,
          description: data.description,
          priority: data.priority,
          dueDate: data.dueDate,
        },
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      }
    );
  };

  // Auto-focus on title input when form mounts
  useEffect(() => {
    const titleInput = document.getElementById("edit-todo-title");
    titleInput?.focus();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="edit-todo-title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="edit-todo-title"
          placeholder="Enter task title..."
          {...register("title")}
          disabled={isPending}
          className={errors.title ? "border-destructive" : ""}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-todo-description">Description (optional)</Label>
        <Input
          id="edit-todo-description"
          placeholder="Add more details..."
          {...register("description")}
          disabled={isPending}
        />
        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-todo-priority">Priority (optional)</Label>
          <Select
            value={priority}
            onValueChange={(value) =>
              setValue("priority", value as "low" | "medium" | "high")
            }
            disabled={isPending}
          >
            <SelectTrigger id="edit-todo-priority">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-todo-dueDate">Due Date (optional)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="edit-todo-dueDate"
                variant="outline"
                disabled={isPending}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate);
                  setValue(
                    "dueDate",
                    newDate ? format(newDate, "yyyy-MM-dd") : undefined
                  );
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Task"
          )}
        </Button>
      </div>
    </form>
  );
}
