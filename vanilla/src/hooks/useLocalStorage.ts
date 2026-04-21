"use client";

import { useState, useEffect } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // Always start with initialValue so server and client render identically.
  // Load from localStorage only after mount to avoid hydration mismatch.
  const [stored, setStoredRaw] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) setStoredRaw(JSON.parse(item) as T);
    } catch {
      // corrupt data — keep initialValue
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setValue = (value: T | ((prev: T) => T)) => {
    setStoredRaw((prev) => {
      const next = typeof value === "function" ? (value as (p: T) => T)(prev) : value;
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // quota exceeded — silently fail
      }
      return next;
    });
  };

  return [stored, setValue];
}
