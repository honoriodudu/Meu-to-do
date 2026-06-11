/**
 * Converte data do banco para o formato esperado pelo input datetime-local.
 *
 * @param value - Valor vindo do banco ou string vazia.
 * @returns Valor no formato YYYY-MM-DDTHH:mm.
 */
export function toDateTimeLocalValue(value?: string | null): string {
  if (!value) return "";

  const date = new Date(value);

  if (!Number.isNaN(date.getTime())) {
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return localDate.toISOString().slice(0, 16);
  }

  return value.slice(0, 16);
}

/**
 * Converte data de início do formulário para ISO antes de salvar no Supabase.
 *
 * @param value - Valor no formato datetime-local.
 * @returns ISO string ou null quando vazio.
 */
export function toDatabaseStartDate(value?: string): string | null {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString();
}

/**
 * Converte prazo final do formulário para ISO antes de salvar no Supabase.
 *
 * @param value - Valor no formato datetime-local.
 * @returns ISO string ou null quando vazio.
 */
export function toDatabaseDueDate(value?: string): string | null {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString();
}

/**
 * Formata uma data e horário de tarefa para exibição em pt-BR.
 *
 * @param value - Valor ISO ou string vazia.
 * @returns Texto formatado para o usuário.
 */
export function formatTodoDate(value?: string | null): string {
  if (!value) return "Sem data";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Data inválida";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * Mantém compatibilidade com chamadas antigas que usavam o nome específico de prazo.
 *
 * @param value - Valor ISO ou string vazia.
 * @returns Texto formatado para o usuário.
 */
export function formatTodoDueDate(value?: string | null): string {
  return formatTodoDate(value);
}