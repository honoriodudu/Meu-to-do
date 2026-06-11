"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useTodoTasks } from "../hooks/useTodoTasks";
import { TodoDateFields } from "./TodoDateFields";
import {
  defaultTodoFormValues,
  todoFormSchema,
  type TodoFormValues,
  type TodoInput,
  type TodoTask,
} from "../todo.types";
import { toDateTimeLocalValue } from "../todo.utils";

/** Props do diálogo de criação e edição de tarefas. */
interface TodoFormDialogProps {
  /** Controla a abertura do diálogo. */
  open: boolean;
  /** Callback chamado quando a abertura do diálogo muda. */
  onOpenChange: (open: boolean) => void;
  /** Tarefa sendo editada, quando aplicável. */
  editingTask?: TodoTask;
  /** ID do usuário autenticado. */
  userId?: string;
  /** Callback executado após criar ou editar com sucesso. */
  onSuccess?: () => void;
}

/**
 * Diálogo usado para criar ou editar uma tarefa.
 *
 * Inclui título, descrição, status, data de início e prazo final.
 */
export function TodoFormDialog({
  open,
  onOpenChange,
  editingTask,
  userId,
  onSuccess,
}: TodoFormDialogProps) {
  const form = useForm<TodoFormValues>({
    resolver: zodResolver(todoFormSchema),
    defaultValues: defaultTodoFormValues,
  });

  const { addTodo, changeTodo, isSaving } = useTodoTasks(userId);
  const isEditing = Boolean(editingTask);

  useEffect(() => {
    if (!open) {
      form.reset(defaultTodoFormValues);
      return;
    }

    form.reset(
      editingTask
        ? {
            title: editingTask.title,
            description: editingTask.description ?? "",
            completed: editingTask.completed,
            start_datetime: toDateTimeLocalValue(editingTask.start_date),
            due_datetime: toDateTimeLocalValue(editingTask.due_date),
          }
        : defaultTodoFormValues,
    );
  }, [editingTask, form, open]);

  const onSubmit = async (values: TodoFormValues) => {
    if (!userId) return;

    const input: TodoInput = {
      title: values.title.trim(),
      description: values.description?.trim() ?? "",
      completed: values.completed,
      start_datetime: values.start_datetime || undefined,
      due_datetime: values.due_datetime || undefined,
    };

    if (editingTask) {
      await changeTodo({ id: editingTask.id, input });
    } else {
      await addTodo(input);
    }

    onOpenChange(false);
    onSuccess?.();
    form.reset(defaultTodoFormValues);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {isEditing ? "Editar tarefa" : "Nova tarefa"}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? "Atualize os dados da tarefa." : "Cadastre uma nova tarefa com datas."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Entregar relatório" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detalhes opcionais"
                      className="min-h-24 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <TodoDateFields control={form.control} />

            <FormField
              control={form.control}
              name="completed"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3 rounded-md border p-3">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-medium">Marcar como concluída</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Use esta opção para alterar o status da tarefa.
                    </p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={!userId || isSaving}>
                {isSaving ? "Salvando..." : isEditing ? "Salvar alterações" : "Criar tarefa"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}