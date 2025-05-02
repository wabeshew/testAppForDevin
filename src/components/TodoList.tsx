import React from 'react';
import { useAtom } from 'jotai';
import { filteredTodosByStatusAtom, filterAtom, FilterType, clearCompletedTodosAtom } from '../store/todo-store';
import TodoItem from './TodoItem';
import { Button } from './ui/button';

const TodoList: React.FC = () => {
  const [todos] = useAtom(filteredTodosByStatusAtom);
  const [filter, setFilter] = useAtom(filterAtom);
  const [, clearCompleted] = useAtom(clearCompletedTodosAtom);

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">タスク一覧</h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {todos.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            タスクがありません
          </div>
        ) : (
          todos.map(todo => <TodoItem key={todo.id.toString()} todo={todo} />)
        )}
      </div>
      
      <div className="p-4 bg-gray-50 flex items-center justify-between">
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
