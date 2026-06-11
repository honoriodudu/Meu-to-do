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
import { formatTodoDate } from "../todo.utils";

/** Props de um item individual da lista de tarefas. */
interface TodoItemProps {
  /** Tarefa exibida na linha. */
  task: TodoTask;
  /** Callback chamado ao alternar conclusão. */
  onToggle: (id: string, completed: boolean) => Promise<void>;
  /** Callback chamado ao abrir edição. */
  onEdit: (task: TodoTask) => void;
  /** Callback chamado ao remover tarefa. */
  onDelete: (id: string) => Promise<void>;
}

/** Props do badge de data exibido na tarefa. */
interface DatePillProps {
  /** Rótulo da data, como início ou prazo final. */
  label: string;
  /** Texto formatado da data. */
  value: string;
}

/** Exibe um pequeno badge com uma data da tarefa. */
function DatePill({ label, value }: DatePillProps) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
      <Clock3 className="h-3.5 w-3.5" />
      <span>
        <span className="font-medium text-foreground">{label}:</span> {value}
      </span>
    </div>
  );
}

/**
 * Exibe uma tarefa com ações de conclusão, edição e exclusão.
 *
 * Mostra data de início e prazo final quando disponíveis.
 */
export function TodoItem({ task, onToggle, onEdit, onDelete }: TodoItemProps) {
  const handleToggle = (completed: boolean) => {
    void onToggle(task.id, completed);
  };

  const hasStartDate = Boolean(task.start_date);
  const hasDueDate = Boolean(task.due_date);

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-start">
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

        <div className="mt-3 flex flex-wrap gap-2">
          {hasStartDate && <DatePill label="Início" value={formatTodoDate(task.start_date)} />}
          {hasDueDate && <DatePill label="Prazo final" value={formatTodoDate(task.due_date)} />}
          {!hasStartDate && !hasDueDate && (
            <span className="text-sm text-muted-foreground">Sem datas definidas</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
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

        <Button
          variant="ghost"
          size="icon"
          onClick={() => void onDelete(task.id)}
          aria-label="Excluir tarefa"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}