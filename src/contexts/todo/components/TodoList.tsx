"use client";

import { CircleDashed } from "lucide-react";
import { TodoItem } from "./TodoItem";
import type { TodoTask } from "../todo.types";

interface TodoListProps {
  tasks: TodoTask[];
  isLoading: boolean;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onEdit: (task: TodoTask) => void;
  onDelete: (id: string) => Promise<void>;
}

export function TodoList({ tasks, isLoading, onToggle, onEdit, onDelete }: TodoListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-20 animate-pulse rounded-lg border bg-muted/40" />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <CircleDashed className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
        <h3 className="font-medium">Nenhuma tarefa cadastrada</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Crie sua primeira tarefa com título, descrição, data e horário.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TodoItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}