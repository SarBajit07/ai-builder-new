"use client";
import { useState } from 'react';

import { Plus, Trash2, CheckCircle } from 'lucide-react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function Page() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos([...todos, { id: Date.now(), text: input.trim(), completed: false }]);
    setInput('');
  };

  const toggleComplete = (id: number) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4 sm:p-6 lg:p-8'> 
      <div className='w-full max-w-2xl'> 
        <h1 className='text-4xl sm:text-5xl font-extrabold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-10 tracking-tight'>Modern Todo App</h1> 
        <div className='bg-white/70 dark:bg-gray-950/70 backdrop-blur-lg border border-white/20 dark:border-gray-800/50 shadow-2xl rounded-3xl p-6 sm:p-10'> 
          <div className='flex flex-col sm:flex-row gap-4 mb-8'> 
            <input 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && addTodo()} 
              placeholder='Add a new task...' 
              className='flex-1 px-5 py-4 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-gray-900/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-lg' 
            /> 
            <button 
              onClick={addTodo} 
              className='px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-lg' 
            > 
              <Plus size={22} /> Add 
            </button> 
          </div> 
          {todos.length === 0 ? ( 
            <p className='text-center text-gray-500 dark:text-gray-400 text-lg py-12'>Your todo list is empty. Add your first task!</p> 
          ) : ( 
            <ul className='space-y-4'> 
              {todos.map(todo => (
                <li key={todo.id} className='flex items-center justify-between p-5 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all group'> 
                  <div className='flex items-center gap-4 flex-1'> 
                    <button onClick={() => toggleComplete(todo.id)}> 
                      <CheckCircle 
                        size={28} 
                        className={`transition-colors ${todo.completed ? 'text-green-500' : 'text-gray-400 hover:text-gray-500'}`} 
                      /> 
                    </button> 
                    <span className={`text-lg ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}> 
                      {todo.text} 
                    </span> 
                  </div> 
                  <button onClick={() => deleteTodo(todo.id)} className='text-red-500 hover:text-red-600 opacity-70 hover:opacity-100 transition-opacity'> 
                    <Trash2 size={22} /> 
                  </button> 
                </li> 
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}