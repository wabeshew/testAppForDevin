import { useState } from 'react';
import { Todo, Priority } from '../types/todo';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Calendar as CalendarIcon, Trash as TrashIcon } from 'lucide-react';
import { cn } from '../lib/utils';

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedPriority, setSelectedPriority] = useState<Priority>('medium');

  const addTodo = () => {
    if (newTodoText.trim() === '') return;
    
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: newTodoText,
      completed: false,
      deadline: selectedDate,
      priority: selectedPriority
    };
    
    setTodos([...todos, newTodo]);
    setNewTodoText('');
    setSelectedDate(undefined);
    setSelectedPriority('medium');
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

  const updatePriority = (id: string, priority: Priority) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, priority } : todo
      )
    );
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Todoリスト</h1>
      
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="新しいタスクを入力..."
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            className="flex-1"
          />
          <Button onClick={addTodo}>追加</Button>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPriority} onValueChange={(value: Priority) => setSelectedPriority(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="優先度を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">高</SelectItem>
              <SelectItem value="medium">中</SelectItem>
              <SelectItem value="low">低</SelectItem>
            </SelectContent>
          </Select>
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
        </div>
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
                <div className="flex flex-col">
                  <label 
                    htmlFor={`todo-${todo.id}`}
                    className={cn(
                      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                      todo.completed ? "line-through text-gray-500" : ""
                    )}
                  >
                    {todo.text}
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <span 
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        todo.priority === 'high' ? "bg-red-100 text-red-800" : 
                        todo.priority === 'medium' ? "bg-yellow-100 text-yellow-800" : 
                        "bg-green-100 text-green-800"
                      )}
                    >
                      {todo.priority === 'high' ? '高' : todo.priority === 'medium' ? '中' : '低'}
                    </span>
                    {todo.deadline && (
                      <span className="text-xs text-gray-500">
                        期限: {format(todo.deadline, 'yyyy/MM/dd', { locale: ja })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Select defaultValue={todo.priority} onValueChange={(value: Priority) => updatePriority(todo.id, value as Priority)}>
                  <SelectTrigger className="h-8 w-[80px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">高</SelectItem>
                    <SelectItem value="medium">中</SelectItem>
                    <SelectItem value="low">低</SelectItem>
                  </SelectContent>
                </Select>
                
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
