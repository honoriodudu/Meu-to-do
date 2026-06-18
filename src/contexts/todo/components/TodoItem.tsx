"use client";

import { useState } from "react";
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
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = (completed: boolean) => {
    void onToggle(task.id, completed);
  };

  const handleEditClick = () => {
    setShowEditConfirm(true);
  };

  const confirmEdit = () => {
    setShowEditConfirm(false);
    onEdit(task);
  };

  const cancelEdit = () => {
    setShowEditConfirm(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setShowDeleteConfirm(false);
    setIsDeleting(true);
    try {
      await onDelete(task.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
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

        <Button variant="ghost" size="icon" onClick={handleEditClick} aria-label="Editar tarefa">
          <Pencil className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleDeleteClick}
          disabled={isDeleting}
          aria-label="Excluir tarefa"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Edit Confirmation Dialog */}
      {showEditConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
            <h3 className="text-lg font-semibold">Confirmar Edição</h3>
            <p className="mt-2 text-muted-foreground">
              Tem certeza que deseja editar a tarefa "{task.title}"?
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                onClick={cancelEdit}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmEdit}
                className="flex-1"
              >
                Confirmar Edição
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-destructive">Confirmar Exclusão</h3>
            <p className="mt-2 text-muted-foreground">
              Tem certeza que deseja excluir a tarefa "{task.title}"? Esta ação não pode ser desfeita.
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                onClick={cancelDelete}
                className="flex-1"
                disabled={isDeleting}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                className="flex-1"
                disabled={isDeleting}
              >
                {isDeleting ? "Excluindo..." : "Excluir Tarefa"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}