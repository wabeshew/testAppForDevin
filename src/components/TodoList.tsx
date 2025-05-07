import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { 
  filteredTodosByStatusAtom, 
  filterAtom, 
  FilterType, 
  clearCompletedTodosAtom,
  addTodoAtom,
  toggleTodoAtom,
  deleteTodoAtom,
  updateTodoDeadlineAtom,
  updateTodoPriorityAtom,
  Todo
} from '../store/todo-store';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Calendar as CalendarIcon, Trash as TrashIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { Priority } from '../types/todo';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { isValidTodoText } from '../types/branded-types';

const TodoList: React.FC = () => {
  const [todos] = useAtom(filteredTodosByStatusAtom);
  const [filter, setFilter] = useAtom(filterAtom);
  const [, clearCompleted] = useAtom(clearCompletedTodosAtom);
  const [, addTodo] = useAtom(addTodoAtom);
  const [, toggleTodo] = useAtom(toggleTodoAtom);
  const [, deleteTodoAction] = useAtom(deleteTodoAtom);
  const [, updateDeadline] = useAtom(updateTodoDeadlineAtom);
  const [, updatePriority] = useAtom(updateTodoPriorityAtom);
  
  const [newTodoText, setNewTodoText] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedPriority, setSelectedPriority] = useState<Priority>('medium');
  const [error, setError] = useState('');

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
  };

  const handleAddTodo = () => {
    if (isValidTodoText(newTodoText)) {
      try {
        addTodo({
          text: newTodoText,
          deadline: selectedDate,
          priority: selectedPriority
        });
        setNewTodoText('');
        setSelectedDate(undefined);
        setSelectedPriority('medium');
        setError('');
      } catch {
        setError('タスクの追加に失敗しました');
      }
    } else {
      setError('タスクは空にできません');
    }
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
            className={error ? 'border-red-500' : 'flex-1'}
          />
          <Button onClick={handleAddTodo}>追加</Button>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
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
      
      <div className="divide-y divide-gray-200">
        {todos.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            タスクがありません
          </div>
        ) : (
          <div className="space-y-2">
            {todos.map((todo: Todo) => (
              <div 
                key={todo.id.toString()} 
                className={cn(
                  "flex items-center justify-between p-3 border rounded-md",
                  todo.completed ? "bg-gray-50" : ""
                )}
              >
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={todo.completed} 
                    onCheckedChange={() => toggleTodo(todo.id)}
                    id={`todo-${todo.id.toString()}`}
                  />
                  <div className="flex flex-col">
                    <label 
                      htmlFor={`todo-${todo.id.toString()}`}
                      className={cn(
                        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                        todo.completed ? "line-through text-gray-500" : ""
                      )}
                    >
                      {todo.text.toString()}
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
                  <Select 
                    defaultValue={todo.priority} 
                    onValueChange={(value: Priority) => updatePriority(todo.id, value as Priority)}
                  >
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
                    onClick={() => deleteTodoAction(todo.id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4 bg-gray-50 flex items-center justify-between mt-4">
        <div className="flex space-x-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleFilterChange('all')}
          >
            すべて
          </Button>
          <Button 
            variant={filter === 'active' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleFilterChange('active')}
          >
            未完了
          </Button>
          <Button 
            variant={filter === 'completed' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleFilterChange('completed')}
          >
            完了済み
          </Button>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => clearCompleted()}
        >
          完了済みを削除
        </Button>
      </div>
    </div>
  );
};

export default TodoList;
