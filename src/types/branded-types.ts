/**
 * Branded Types for type safety
 */

export type TodoId = string & { readonly __brand: unique symbol };

export function createTodoId(id: string): TodoId {
  return id as TodoId;
}

export type TodoText = string & { readonly __brand: unique symbol };

export function createTodoText(text: string): TodoText {
  if (text.trim().length === 0) {
    throw new Error('Todo text cannot be empty');
  }
  return text as TodoText;
}

export function isValidTodoText(text: string): boolean {
  return text.trim().length > 0;
}
