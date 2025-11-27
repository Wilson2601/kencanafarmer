import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 1. Define the structure of a single Task
export interface Task {
  id: string;
  title: string;
  date: string; // Format: YYYY-MM-DD
  completed: boolean;
  type: 'general' | 'crop_care' | 'harvest';
}

// 2. Define what data and functions are available in the Context
interface TaskContextType {
  tasks: Task[];
  addTask: (title: string, date: string, type: Task['type']) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
}

// Create the context with undefined initial value
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// 3. Create the Provider component
// This component wraps your app and provides the data
export function TaskProvider({ children }: { children: ReactNode }) {
  // Initialize state from LocalStorage so data persists after refresh
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('my_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to LocalStorage whenever 'tasks' state changes
  useEffect(() => {
    localStorage.setItem('my_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Function to add a new task
  const addTask = (title: string, date: string, type: Task['type'] = 'general') => {
    const newTask: Task = {
      id: Date.now().toString(), // Use timestamp as unique ID
      title,
      date,
      completed: false,
      type
    };
    setTasks(prev => [...prev, newTask]);
  };

  // Function to toggle completion status
  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  // Function to delete a task
  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, toggleTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
}

// 4. Custom Hook for easy usage in other components
export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}