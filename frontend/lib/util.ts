import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuid } from 'uuid'
import { validSessionStorageKeys } from "./types";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUUID() {
  return uuid()
}

export function setSessionStorage(key: validSessionStorageKeys, value: unknown) {
  if (typeof window === undefined) return;
  sessionStorage.setItem(key, JSON.stringify(value));
}

export function getSessionStorage<T = unknown>(key: validSessionStorageKeys): T | null {
  if (typeof window === "undefined") return null;

  const value = sessionStorage.getItem(key);

  if (value === null) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return value as T;
  }
}

export function clearSessionStorage(key?: string) {
  if (typeof window === "undefined") return;

  if (key) {
    sessionStorage.removeItem(key);
  } else {
    sessionStorage.clear();
  }
}