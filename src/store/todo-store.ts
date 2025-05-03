import { atom } from 'jotai';
import { v4 as uuidv4 } from 'uuid';
import { TodoId, TodoText, createTodoId, createTodoText } from '../types/branded-types';
import { Priority } from '../types/todo';

export interface Todo {
  id: TodoId;
  text: TodoText;
  completed: boolean;
  deadline?: Date;
  priority: Priority;
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

export interface AddTodoParams {
  text: string;
  deadline?: Date;
  priority: Priority;
}

export const addTodoAtom = atom(
  null,
  (get, set, params: string | AddTodoParams) => {
    try {
      let todoText: TodoText;
      let deadline: Date | undefined;
      let priority: Priority = 'medium';
      
      if (typeof params === 'string') {
        todoText = createTodoText(params);
      } else {
        todoText = createTodoText(params.text);
        deadline = params.deadline;
        priority = params.priority;
      }
      
      const newTodo: Todo = {
        id: createTodoId(uuidv4()),
        text: todoText,
        completed: false,
        deadline,
        priority
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

export const updateTodoDeadlineAtom = atom(
  null,
  (get, set, id: TodoId, deadline: Date | undefined) => {
    const todos = get(todosAtom);
    set(
      todosAtom,
      todos.map(todo => 
        todo.id === id ? { ...todo, deadline } : todo
      )
    );
    return true;
  }
);

export const updateTodoPriorityAtom = atom(
  null,
  (get, set, id: TodoId, priority: Priority) => {
    const todos = get(todosAtom);
    set(
      todosAtom,
      todos.map(todo => 
        todo.id === id ? { ...todo, priority } : todo
      )
    );
    return true;
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
