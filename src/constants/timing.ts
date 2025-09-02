/**
 * Timing Constants
 * Centralized timing values for animations, timeouts, and durations
 */

// Toast durations (in milliseconds)
export const TOAST_DURATIONS = {
  short: 2000,
  medium: 3000,
  long: 5000,
  persistent: 0 // No auto-dismiss
} as const;

// Animation durations (in milliseconds)
export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 200,
  slow: 300,
  verySlow: 500
} as const;

// Debounce delays (in milliseconds)
export const DEBOUNCE_DELAYS = {
  search: 300,
  input: 500,
  api: 1000
} as const;

// Timeout values (in milliseconds)
export const TIMEOUTS = {
  api: 10000,
  shortOperation: 5000,
  longOperation: 30000
} as const;

// Polling intervals (in milliseconds)
export const POLLING_INTERVALS = {
  frequent: 1000,
  normal: 5000,
  infrequent: 30000
} as const;

// Auto-save intervals (in milliseconds)
export const AUTOSAVE_INTERVALS = {
  frequent: 30000,
  normal: 60000,
  infrequent: 300000
} as const;

// Cache durations (in milliseconds)
export const CACHE_DURATIONS = {
  short: 5 * 1000,      // 5 seconds
  medium: 10 * 1000,    // 10 seconds  
  long: 60 * 1000,      // 1 minute
  veryLong: 300 * 1000  // 5 minutes
} as const;

// Random ID generation constants
export const ID_GENERATION = {
  length: 9,
  base: 36,
  startIndex: 2
} as const;
