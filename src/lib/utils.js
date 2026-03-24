/**
 * @file utils.js
 * @description Utility functions shared across the application.
 *
 *              cn() is the most-used — it merges Tailwind classes safely.
 *              Without it, conditional classes can conflict:
 *              e.g. 'text-red-500' and 'text-blue-500' both present.
 *              tailwind-merge handles that automatically.
 */
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * @function cn
 * @description Combines clsx (conditional classes) with tailwind-merge
 *              (deduplicates conflicting Tailwind classes).
 *
 * @example
 * cn('text-sm font-bold', isActive && 'text-primary', 'text-sm') 
 * // → 'font-bold text-primary text-sm' (deduped)
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * @function formatTime
 * @description Format a date/ISO string to a human-readable time like "2:34 PM"
 */
export function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * @function formatDate
 * @description Format a date for the sidebar conversation list.
 *              Shows "Today", "Yesterday", or the date string.
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) return 'Yesterday';

  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}
