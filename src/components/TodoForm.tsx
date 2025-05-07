import { useAtom } from 'jotai';
import { Plus } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { addTodoAtom } from '../store/todo-store';
import { isValidTodoText } from '../types/branded-types';
import { Button } from './ui/button';
import { Input } from './ui/input';

const TodoForm: React.FC = () => {
  const [, addTodo] = useAtom(addTodoAtom);
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isValidTodoText(text)) {
      const success = addTodo(text);
      if (success) {
        setText('');
        setError('');
      }
    } else {
      setError('タスクは空にできません');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-col space-y-2">
        <div className="flex space-x-2">
          <Input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="新しいタスクを入力..."
            className={error ? 'border-red-500' : ''}
          />
          <Button type="submit">
            <Plus className="h-4 w-4 mr-2" />
            追加
          </Button>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </form>
  );
};

export default TodoForm;
