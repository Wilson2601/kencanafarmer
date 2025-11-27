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


  // Remove completed tasks older than 48 hours (default)
  const EXPIRY_HOURS = 48;
  const now = Date.now();
  const filterExpired = (tasks: Task[]) =>
    tasks.filter(
      (t) =>
        !t.completed ||
        !t.completedAt ||
        now - t.completedAt < EXPIRY_HOURS * 60 * 60 * 1000
    );

  // Wrap setTasks to always filter expired
  const safeSetTasks = useCallback((updater: (prev: Task[]) => Task[]) => {
    setTasks((prev) => filterExpired(updater(filterExpired(prev))));
  }, [setTasks]);

  const addTask = useCallback((task: Omit<Task, "id" | "completed" | "completedAt">) => {
    safeSetTasks((prev) => {
      const nextId = prev.length ? Math.max(...prev.map((t) => t.id)) + 1 : 1;
      return [...prev, { ...task, id: nextId, completed: false }];
    });
  }, [safeSetTasks]);

  const toggleComplete = useCallback((id: number) => {
    safeSetTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? t.completed
            ? { ...t, completed: false, completedAt: undefined }
            : { ...t, completed: true, completedAt: Date.now() }
          : t
      )
    );
  }, [safeSetTasks]);

  const deleteTask = useCallback((id: number) => {
    safeSetTasks((prev) => prev.filter((t) => t.id !== id));
  }, [safeSetTasks]);

  const updateTask = useCallback((id: number, patch: Partial<Task>) => {
    safeSetTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, [safeSetTasks]);

  // Filter expired tasks on every read
  const filteredTasks = filterExpired(tasks);
  return {
    tasks: filteredTasks,
    setTasks: safeSetTasks,
    addTask,
    toggleComplete,
    deleteTask,
    updateTask,
  } as const;
}
