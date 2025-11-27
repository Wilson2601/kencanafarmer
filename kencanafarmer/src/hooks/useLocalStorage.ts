import { useState, useEffect, useCallback } from "react";

// Global event system for cross-component synchronization
const listeners = new Map<string, Set<() => void>>();

function subscribe(key: string, callback: () => void) {
  if (!listeners.has(key)) {
    listeners.set(key, new Set());
  }
  listeners.get(key)!.add(callback);
  
  return () => {
    listeners.get(key)!.delete(callback);
  };
}

function notify(key: string) {
  listeners.get(key)?.forEach((callback) => callback());
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
      // Notify other listeners
      notify(key);
    } catch {}
  }, [key, state]);

  // Listen for localStorage changes (including other tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setState(JSON.parse(e.newValue) as T);
        } catch {}
      }
    };

    // Listen for local events (other components in the same tab)
    const unsubscribe = subscribe(key, () => {
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          setState(JSON.parse(raw) as T);
        }
      } catch {}
    });

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      unsubscribe();
    };
  }, [key]);

  return [state, setState] as const;
}
