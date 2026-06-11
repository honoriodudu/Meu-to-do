"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Clock3, Pencil, Trash2 } from "lucide-react";
import type { TodoTask } from "../todo.types";
import { formatTodoDueDate } from "../todo.utils";

interface TodoItemProps {
  task: TodoTask;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onEdit: (task: TodoTask) => void;
  onDelete: (id: string) => Promise<void>;
}

export function TodoItem({ task, onToggle, onEdit, onDelete }: TodoItemProps) {
  const handleToggle = (completed: boolean) => {
    void onToggle(task.id, completed);
  };

  return (
    <div className="flex items-start gap-3 rounded-lg border p-4">
      <Checkbox
        checked={task.completed}
        onCheckedChange={(checked) => handleToggle(checked === true)}
        className="mt-1"
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p
            className={cn(
              "font-medium leading-6",
              task.completed && "line-through text-muted-foreground",
            )}
          >
            {task.title}
          </p>
          <Badge variant={task.completed ? "secondary" : "outline"}>
            {task.completed ? "Realizada" : "Pendente"}
          </Badge>
        </div>

        {task.description && (
          <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
        )}

        <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock3 className="h-3.5 w-3.5" />
          <span>{formatTodoDueDate(task.due_date)}</span>
        </div>
      </div>

      <Select
        value={task.completed ? "completed" : "pending"}
        onValueChange={(value) => handleToggle(value === "completed")}
      >
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pendente</SelectItem>
          <SelectItem value="completed">Realizada</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="ghost" size="icon" onClick={() => onEdit(task)} aria-label="Editar tarefa">
        <Pencil className="h-4 w-4" />
      </Button>

      <Button variant="ghost" size="icon" onClick={() => void onDelete(task.id)} aria-label="Excluir tarefa">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}