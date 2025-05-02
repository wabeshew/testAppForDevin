import { atom } from 'jotai';
import { v4 as uuidv4 } from 'uuid';
import { TodoId, TodoText, createTodoId, createTodoText } from '../types/branded-types';

export interface Todo {
  id: TodoId;
  text: TodoText;
  completed: boolean;
}

const initialTodos: Todo[] = [];

export const todosAtom = atom<Todo[]>(initialTodos);

export const filteredTodosAtom = atom((get) => get(todosAtom));

export type FilterType = 'all' | 'active' | 'completed';

export const filterAtom = atom<FilterType>('all');

export const filteredTodosByStatusAtom = atom((get) => {
  const todos = get(todosAtom);
  const filter = get(filterAtom);
  
  switch (filter) {
    case 'active':
      return todos.filter(todo => !todo.completed);
    case 'completed':
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
});

export const addTodoAtom = atom(
  null,
  (get, set, text: string) => {
    try {
      const todoText = createTodoText(text);
      const newTodo: Todo = {
        id: createTodoId(uuidv4()),
        text: todoText,
        completed: false
      };
      set(todosAtom, [...get(todosAtom), newTodo]);
      return true;
    } catch (error) {
      console.error('Failed to add todo:', error);
      return false;
    }
  }
);

export const toggleTodoAtom = atom(
  null,
  (get, set, id: TodoId) => {
    const todos = get(todosAtom);
    set(
      todosAtom,
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }
);

export const deleteTodoAtom = atom(
  null,
  (get, set, id: TodoId) => {
    const todos = get(todosAtom);
    set(todosAtom, todos.filter(todo => todo.id !== id));
  }
);

export const updateTodoTextAtom = atom(
  null,
  (get, set, id: TodoId, text: string) => {
    try {
      const todoText = createTodoText(text);
      const todos = get(todosAtom);
      set(
        todosAtom,
        todos.map(todo => 
          todo.id === id ? { ...todo, text: todoText } : todo
        )
      );
      return true;
    } catch (error) {
      console.error('Failed to update todo:', error);
      return false;
    }
  }
);

export const clearCompletedTodosAtom = atom(
  null,
  (get, set) => {
    const todos = get(todosAtom);
    set(todosAtom, todos.filter(todo => !todo.completed));
  }
);

export const setFilterAtom = atom(
  null,
  (_, set, filter: FilterType) => {
    set(filterAtom, filter);
  }
);
