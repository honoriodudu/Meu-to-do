import { toast } from "sonner";

/**
 * Validates a raw SQL string.
 *
 * - Allows only SELECT, INSERT, UPDATE, DELETE statements.
 * - Disallows dangerous keywords (DROP, ALTER, TRUNCATE, CREATE, EXEC, ;).
 * - Enforces a maximum length of 500 characters.
 *
 * @param sql The raw SQL query entered by the user.
 * @returns true if the query is safe, false otherwise (toast error shown).
 */
export function validateSQL(sql: string): boolean {
  const trimmed = sql.trim();

  // Length limit to prevent DoS
  if (trimmed.length === 0) {
    toast.error("A consulta não pode estar vazia.");
    return false;
  }
  if (trimmed.length > 500) {
    toast.error("A consulta excede o tamanho máximo de 500 caracteres.");
    return false;
  }

  // Whitelist of allowed commands
  const allowedCommand = /^(SELECT|INSERT|UPDATE|DELETE)\b/i;
  if (!allowedCommand.test(trimmed)) {
    toast.error("Apenas consultas SELECT, INSERT, UPDATE ou DELETE são permitidas.");
    return false;
  }

  // Block dangerous keywords and multiple statements
  const forbidden = /\b(DROP|ALTER|TRUNCATE|CREATE|EXEC|;)\b/i;
  if (forbidden.test(trimmed)) {
    toast.error("A consulta contém palavras reservadas proibidas.");
    return false;
  }

  return true;
}