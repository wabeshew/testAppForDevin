import { useState } from 'react';
import { Todo } from '../types/todo';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Calendar as CalendarIcon, Trash as TrashIcon } from 'lucide-react';
import { cn } from '../lib/utils';

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const addTodo = () => {
    if (newTodoText.trim() === '') return;
    
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: newTodoText,
      completed: false,
      deadline: selectedDate
    };
    
    setTodos([...todos, newTodo]);
    setNewTodoText('');
    setSelectedDate(undefined);
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const updateDeadline = (id: string, date: Date | undefined) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, deadline: date } : todo
      )
    );
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Todoリスト</h1>
      
      <div className="flex gap-2 mb-6">
        <Input
          type="text"
          placeholder="新しいタスクを入力..."
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          className="flex-1"
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-10 p-0">
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
              locale={ja}
            />
          </PopoverContent>
        </Popover>
        <Button onClick={addTodo}>追加</Button>
      </div>
      
      <div className="space-y-2">
        {todos.length === 0 ? (
          <p className="text-gray-500 text-center">タスクがありません</p>
        ) : (
          todos.map(todo => (
            <div 
              key={todo.id} 
              className={cn(
                "flex items-center justify-between p-3 border rounded-md",
                todo.completed ? "bg-gray-50" : ""
              )}
            >
              <div className="flex items-center gap-2">
                <Checkbox 
                  checked={todo.completed} 
                  onCheckedChange={() => toggleTodo(todo.id)}
                  id={`todo-${todo.id}`}
                />
                <label 
                  htmlFor={`todo-${todo.id}`}
                  className={cn(
                    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                    todo.completed ? "line-through text-gray-500" : ""
                  )}
                >
                  {todo.text}
                </label>
              </div>
              
              <div className="flex items-center gap-2">
                {todo.deadline && (
                  <span className="text-xs text-gray-500">
                    期限: {format(todo.deadline, 'yyyy/MM/dd', { locale: ja })}
                  </span>
                )}
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={todo.deadline}
                      onSelect={(date) => updateDeadline(todo.id, date)}
                      initialFocus
                      locale={ja}
                    />
                  </PopoverContent>
                </Popover>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0" 
                  onClick={() => deleteTodo(todo.id)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList;
