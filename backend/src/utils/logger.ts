/**
 * ArcLock Backend — Logger Utility
 */

const getTimestamp = (): string => {
  return new Date().toISOString().replace('T', ' ').replace('Z', '');
};

export const logger = {
  info: (message: string, ...args: unknown[]) => {
    console.log(`${getTimestamp()} | INFO  | ${message}`, ...args);
  },

  warn: (message: string, ...args: unknown[]) => {
    console.warn(`${getTimestamp()} | WARN  | ${message}`, ...args);
  },

  error: (message: string, ...args: unknown[]) => {
    console.error(`${getTimestamp()} | ERROR | ${message}`, ...args);
  },

  debug: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`${getTimestamp()} | DEBUG | ${message}`, ...args);
    }
  },
};
