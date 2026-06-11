# Contexto Todo

## Responsabilidade

Gerencia tarefas pessoais do usuário autenticado, incluindo criação, edição, conclusão, exclusão, data de início e prazo final.

## Tabelas usadas

- `public.todos`

## Campos da tarefa

- `id`
- `user_id`
- `title`
- `description`
- `completed`
- `start_date`
- `due_date`
- `created_at`
- `updated_at`

## Atualização necessária no Supabase

Para persistir a nova data de início, execute este SQL no SQL Editor do Supabase:

ALTER TABLE public.todos ADD COLUMN IF NOT EXISTS start_date TIMESTAMP WITH TIME ZONE;

A coluna é opcional para manter compatibilidade com tarefas antigas. O prazo final já usa a coluna existente `due_date`.

## Componentes

- `TodoFormDialog.tsx` — diálogo de criação e edição.
- `TodoDateFields.tsx` — campos de data de início e prazo final.
- `TodoItem.tsx` — item individual da lista.
- `TodoList.tsx` — lista, estado vazio e loading.

## Hooks

- `useTodoTasks.ts` — consultas e mutações via TanStack Query.

## Serviços

- `todo.service.ts` — chamadas ao Supabase para buscar, criar, editar, remover e concluir tarefas.