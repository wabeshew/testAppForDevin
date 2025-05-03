export type Priority = 'high' | 'medium' | 'low';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  deadline?: Date; // Optional deadline field
  priority: Priority; // Priority field
}
