import { z } from "zod";

export interface TodoTask {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface TodoInput {
  title: string;
  description: string;
  completed: boolean;
  due_datetime?: string;
}

export interface TodoChangeInput {
  id: string;
  input: TodoInput;
}

export const todoFormSchema = z.object({
  title: z.string().trim().min(1, "Informe um título.").max(120, "Máximo de 120 caracteres."),
  description: z.string().trim().max(500, "Máximo de 500 caracteres.").optional(),
  completed: z.boolean().default(false),
  due_datetime: z
    .string()
    .optional()
    .refine((value) => !value || !Number.isNaN(new Date(value).getTime()), "Informe uma data e horário válidos."),
});

export type TodoFormValues = z.infer<typeof todoFormSchema>;

export const defaultTodoFormValues: TodoFormValues = {
  title: "",
  description: "",
  completed: false,
  due_datetime: "",
};