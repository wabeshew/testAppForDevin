import { Provider } from 'jotai';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import './App.css';

function App() {
  return (
    <Provider>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">Todoアプリ</h1>
          <TodoForm />
          <TodoList />
        </div>
      </div>
    </Provider>
  );
}

export default App;
