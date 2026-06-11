import type { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { TodoFormValues } from "../todo.types";

/** Props dos campos de data e horário da tarefa. */
interface TodoDateFieldsProps {
  /** Controle do React Hook Form usado para registrar os campos. */
  control: Control<TodoFormValues>;
}

/**
 * Campos compartilhados de data de início e prazo final.
 *
 * Centraliza os dois inputs para evitar duplicação entre criação e edição.
 */
export function TodoDateFields({ control }: TodoDateFieldsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField
        control={control}
        name="start_datetime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data de início</FormLabel>
            <FormControl>
              <Input type="datetime-local" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="due_datetime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Prazo final</FormLabel>
            <FormControl>
              <Input type="datetime-local" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}