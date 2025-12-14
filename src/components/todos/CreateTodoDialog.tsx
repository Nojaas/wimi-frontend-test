import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateTodoForm } from "./CreateTodoForm";

interface CreateTodoDialogProps {
  todoListId: string;
  todoListTitle: string;
}

export function CreateTodoDialog({
  todoListId,
  todoListTitle,
}: CreateTodoDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task to{" "}
            <span className="font-semibold">{todoListTitle}</span>
          </DialogDescription>
        </DialogHeader>
        <CreateTodoForm todoListId={todoListId} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
