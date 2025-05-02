export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  deadline?: Date; // Optional deadline field
}
