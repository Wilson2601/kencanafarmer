import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { Task } from "../types/task";

const DEFAULT_TASKS: Task[] = [
  { id: 1, title: "Water Apple Trees", crop: "Section A", time: "09:00", type: "water", completed: false },
  { id: 2, title: "Prune Orange Trees", crop: "Section B", time: "11:00", type: "prune", completed: false },
  { id: 3, title: "Fertilize Mangoes", crop: "Section C", time: "15:00", type: "fertilize", completed: true },
];

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("kencana_tasks_v1", DEFAULT_TASKS);

  const addTask = useCallback((task: Omit<Task, "id" | "completed">) => {
    setTasks((prev) => {
      const nextId = prev.length ? Math.max(...prev.map((t) => t.id)) + 1 : 1;
      return [...prev, { ...task, id: nextId, completed: false }];
    });
  }, [setTasks]);

  const toggleComplete = useCallback((id: number) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }, [setTasks]);

  const deleteTask = useCallback((id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, [setTasks]);

  const updateTask = useCallback((id: number, patch: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, [setTasks]);

  return {
    tasks,
    setTasks,
    addTask,
    toggleComplete,
    deleteTask,
    updateTask,
  } as const;
}
