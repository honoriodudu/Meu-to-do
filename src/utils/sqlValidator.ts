import { toast } from "sonner";

/**
 * Validates a raw SQL string for safe execution.
 *
 * Security measures:
 * - Allows only SELECT, INSERT, UPDATE, DELETE statements
 * - Blocks statement stacking (multiple statements separated by semicolons)
 * - Blocks dangerous keywords (DROP, ALTER, TRUNCATE, CREATE, EXEC, etc.)
 * - Enforces maximum length to prevent DoS
 * - Validates semicolons are not used for statement stacking
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

  // Whitelist of allowed commands (must start with one of these)
  const allowedCommand = /^(SELECT|INSERT|UPDATE|DELETE)\b/i;
  if (!allowedCommand.test(trimmed)) {
    toast.error("Apenas consultas SELECT, INSERT, UPDATE ou DELETE são permitidas.");
    return false;
  }

  // Check for semicolons used for statement stacking
  // This regex finds semicolons that are:
  // - Not inside single quotes (string literals)
  // - Not inside double dashes (single-line comments)
  // - Not inside /* */ (multi-line comments)
  if (hasStatementStacking(trimmed)) {
    toast.error("Múltiplas declarações SQL não são permitidas. Use apenas uma consulta por vez.");
    return false;
  }

  // Block dangerous keywords
  const forbidden = /\b(DROP|ALTER|TRUNCATE|CREATE|EXEC|EXECUTE)\b/i;
  if (forbidden.test(trimmed)) {
    toast.error("A consulta contém palavras reservadas proibidas.");
    return false;
  }

  return true;
}

/**
 * Detects if a SQL string contains multiple statements (statement stacking).
 * Checks for semicolons outside of string literals and comments.
 *
 * @param sql The SQL string to check.
 * @returns true if statement stacking is detected.
 */
function hasStatementStacking(sql: string): boolean {
  let inString = false;
  let inSingleLineComment = false;
  let inMultiLineComment = false;
  let i = 0;

  while (i < sql.length) {
    const char = sql[i];
    const nextChar = sql[i + 1];

    // Handle multi-line comments
    if (!inString && !inSingleLineComment && char === "/" && nextChar === "*") {
      inMultiLineComment = true;
      i += 2;
      continue;
    }

    if (inMultiLineComment && char === "*" && nextChar === "/") {
      inMultiLineComment = false;
      i += 2;
      continue;
    }

    // Handle single-line comments
    if (!inString && !inMultiLineComment && char === "-" && nextChar === "-") {
      inSingleLineComment = true;
      i += 2;
      continue;
    }

    // End of single-line comment
    if (inSingleLineComment && char === "\n") {
      inSingleLineComment = false;
      i++;
      continue;
    }

    // Handle string literals
    if (!inSingleLineComment && !inMultiLineComment && char === "'") {
      // Check for escaped single quote
      if (nextChar === "'") {
        i += 2;
        continue;
      }
      inString = !inString;
      i++;
      continue;
    }

    // Check for semicolon outside strings and comments
    if (char === ";" && !inString && !inSingleLineComment && !inMultiLineComment) {
      return true;
    }

    i++;
  }

  return false;
}
</dyad-file> <dyad-write path="src/utils/sqlValidator.ts"> import { toast } from "sonner"; /** * Validates a raw SQL string for safe execution. * * Security measures: * - Allows only SELECT, INSERT, UPDATE, DELETE statements * - Blocks statement stacking (multiple statements separated by semicolons) * - Blocks dangerous keywords (DROP, ALTER, TRUNCATE, CREATE, EXEC, etc.) * - Enforces maximum length to prevent DoS * - Validates semicolons are not used for statement stacking * * @param sql The raw SQL query entered by the user. * @returns true if the query is safe, false otherwise (toast error shown). */ export function validateSQL(sql: string): boolean { const trimmed = sql.trim(); // Length limit to prevent DoS if (trimmed.length === 0) { toast.error("A consulta não pode estar vazia."); return false; } if (trimmed.length > 500) { toast.error("A consulta excede o tamanho máximo de 500 caracteres."); return false; } // Whitelist of allowed commands (must start with one of these) const allowedCommand = /^(SELECT|INSERT|UPDATE|DELETE)\b/i; if (!allowedCommand.test(trimmed)) { toast.error("Apenas consultas SELECT, INSERT, UPDATE ou DELETE são permitidas."); return false; } // Check for semicolons used for statement stacking // This regex finds semicolons that are: // - Not inside single quotes (string literals) // - Not inside double dashes (single-line comments) // - Not inside /* */ (multi-line comments) if (hasStatementStacking(trimmed)) { toast.error("Múltiplas declarações SQL não são permitidas. Use apenas uma consulta por vez."); return false; } // Block dangerous keywords const forbidden = /\b(DROP|ALTER|TRUNCATE|CREATE|EXEC|EXECUTE)\b/i; if (forbidden.test(trimmed)) { toast.error("A consulta contém palavras reservadas proibidas."); return false; } return true; } /** * Detects if a SQL string contains multiple statements (statement stacking). * Checks for semicolons outside of string literals and comments. * * @param sql The SQL string to check. * @returns true if statement stacking is detected. */ function hasStatementStacking(sql: string): boolean { let inString = false; let inSingleLineComment = false; let inMultiLineComment = false; let i = 0; while (i < sql.length) { const char = sql[i]; const nextChar = sql[i + 1]; // Handle multi-line comments if (!inString && !inSingleLineComment && char === "/" && nextChar === "*") { inMultiLineComment = true; i += 2; continue; } if (inMultiLineComment && char === "*" && nextChar === "/") { inMultiLineComment = false; i += 2; continue; } // Handle single-line comments if (!inString && !inMultiLineComment && char === "-" && nextChar === "-") { inSingleLineComment = true; i += 2; continue; } // End of single-line comment if (inSingleLineComment && char === "\n") { inSingleLineComment = false; i++; continue; } // Handle string literals if (!inSingleLineComment && !inMultiLineComment && char === "'") { // Check for escaped single quote if (nextChar === "'") { i += 2; continue; } inString = !inString; i++; continue; } // Check for semicolon outside strings and comments if (char === ";" && !inString && !inSingleLineComment && !inMultiLineComment) { return true; } i++; } return false; } </dyad-file>

I see there was a syntax error in my previous response. Let me fix the SQL validator file properly:
<dyad-write path="src/utils/sqlValidator.ts">
import { toast } from "sonner";

/**
 * Validates a raw SQL string for safe execution.
 *
 * Security measures:
 * - Allows only SELECT, INSERT, UPDATE, DELETE statements
 * - Blocks statement stacking (multiple statements separated by semicolons)
 * - Blocks dangerous keywords (DROP, ALTER, TRUNCATE, CREATE, EXEC, etc.)
 * - Enforces maximum length to prevent DoS
 * - Validates semicolons are not used for statement stacking
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

  // Whitelist of allowed commands (must start with one of these)
  const allowedCommand = /^(SELECT|INSERT|UPDATE|DELETE)\b/i;
  if (!allowedCommand.test(trimmed)) {
    toast.error("Apenas consultas SELECT, INSERT, UPDATE ou DELETE são permitidas.");
    return false;
  }

  // Check for semicolons used for statement stacking
  // This detects semicolons outside of string literals and comments
  if (hasStatementStacking(trimmed)) {
    toast.error("Múltiplas declarações SQL não são permitidas. Use apenas uma consulta por vez.");
    return false;
  }

  // Block dangerous keywords
  const forbidden = /\b(DROP|ALTER|TRUNCATE|CREATE|EXEC|EXECUTE)\b/i;
  if (forbidden.test(trimmed)) {
    toast.error("A consulta contém palavras reservadas proibidas.");
    return false;
  }

  return true;
}

/**
 * Detects if a SQL string contains multiple statements (statement stacking).
 * Checks for semicolons outside of string literals and comments.
 *
 * @param sql The SQL string to check.
 * @returns true if statement stacking is detected.
 */
function hasStatementStacking(sql: string): boolean {
  let inString = false;
  let inSingleLineComment = false;
  let inMultiLineComment = false;
  let i = 0;

  while (i < sql.length) {
    const char = sql[i];
    const nextChar = sql[i + 1];

    // Handle multi-line comments
    if (!inString && !inSingleLineComment && char === "/" && nextChar === "*") {
      inMultiLineComment = true;
      i += 2;
      continue;
    }

    if (inMultiLineComment && char === "*" && nextChar === "/") {
      inMultiLineComment = false;
      i += 2;
      continue;
    }

    // Handle single-line comments
    if (!inString && !inMultiLineComment && char === "-" && nextChar === "-") {
      inSingleLineComment = true;
      i += 2;
      continue;
    }

    // End of single-line comment
    if (inSingleLineComment && char === "\n") {
      inSingleLineComment = false;
      i++;
      continue;
    }

    // Handle string literals
    if (!inSingleLineComment && !inMultiLineComment && char === "'") {
      // Check for escaped single quote
      if (nextChar === "'") {
        i += 2;
        continue;
      }
      inString = !inString;
      i++;
      continue;
    }

    // Check for semicolon outside strings and comments
    if (char === ";" && !inString && !inSingleLineComment && !inMultiLineComment) {
      return true;
    }

    i++;
  }

  return false;
}