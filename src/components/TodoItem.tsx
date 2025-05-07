import { useAtom } from 'jotai';
import { Check, Pencil, Trash, X } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { type Todo, deleteTodoAtom, toggleTodoAtom, updateTodoTextAtom } from '../store/todo-store';
import { isValidTodoText } from '../types/branded-types';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [, toggleTodo] = useAtom(toggleTodoAtom);
  const [, deleteTodo] = useAtom(deleteTodoAtom);
  const [, updateTodoText] = useAtom(updateTodoTextAtom);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text.toString());
  const [error, setError] = useState('');

  const handleToggle = () => {
    toggleTodo(todo.id);
  };

  const handleDelete = () => {
    deleteTodo(todo.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(todo.text.toString());
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
  };

  const handleSave = () => {
    if (isValidTodoText(editText)) {
      updateTodoText(todo.id, editText);
      setIsEditing(false);
      setError('');
    } else {
      setError('タスクは空にできません');
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      {isEditing ? (
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2">
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className={error ? 'border-red-500' : ''}
              autoFocus
            />
            <Button variant="ghost" size="icon" onClick={handleSave}>
              <Check className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 flex-1">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={handleToggle}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className={`text-gray-700 ${todo.completed ? 'line-through text-gray-400' : ''}`}>
              {todo.text.toString()}
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleEdit} disabled={todo.completed}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default TodoItem;
