/**
 * Client-safe logger that excludes server-only functionality
 * This prevents "next/headers" import issues in client components
 * 
 * @module ClientLogger
 * @author Board the Z Team
 * @version 1.0.0
 */

/**
 * Available log levels
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

/**
 * Log entry metadata interface
 */
export interface LogMetadata {
  [key: string]: string | number | boolean | object | null | undefined;
}

/**
 * Configuration for the logger
 */
export interface LoggerConfig {
  level: LogLevel;
  environment: 'development' | 'production' | 'test';
  enableConsole: boolean;
  enableFile: boolean;
  enableDatabase: boolean;
}

/**
 * Client-safe logger class
 * Only includes console logging functionality
 */
export class ClientLogger {
  private config: LoggerConfig;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: LogLevel.INFO,
      environment: 'development',
      enableConsole: true,
      enableFile: false,
      enableDatabase: false,
      ...config
    };
  }

  /**
   * Log a debug message (client-side only)
   */
  debug(message: string, context?: string, metadata?: LogMetadata): void {
    if (this.config.level <= LogLevel.DEBUG) {
      this.logToConsole(LogLevel.DEBUG, message, context, metadata);
    }
  }

  /**
   * Log an info message (client-side only)
   */
  info(message: string, context?: string, metadata?: LogMetadata): void {
    if (this.config.level <= LogLevel.INFO) {
      this.logToConsole(LogLevel.INFO, message, context, metadata);
    }
  }

  /**
   * Log a warning message (client-side only)
   */
  warn(message: string, context?: string, metadata?: LogMetadata): void {
    if (this.config.level <= LogLevel.WARN) {
      this.logToConsole(LogLevel.WARN, message, context, metadata);
    }
  }

  /**
   * Log an error message (client-side only)
   */
  error(message: string, context?: string, metadata?: LogMetadata): void {
    if (this.config.level <= LogLevel.ERROR) {
      this.logToConsole(LogLevel.ERROR, message, context, metadata);
    }
  }

  /**
   * Log a fatal error message (client-side only)
   */
  fatal(message: string, context?: string, metadata?: LogMetadata): void {
    this.logToConsole(LogLevel.FATAL, message, context, metadata);
  }

  /**
   * Client-side function entry logging
   */
  enter(functionName: string, context?: string, metadata?: LogMetadata): void {
    this.debug(`→ Entering ${functionName}`, context, metadata);
  }

  /**
   * Client-side function exit logging
   */
  exit(functionName: string, context?: string, metadata?: LogMetadata): void {
    this.debug(`← Exiting ${functionName}`, context, metadata);
  }

  /**
   * Write log to console only (client-safe)
   */
  private logToConsole(level: LogLevel, message: string, context?: string, metadata?: LogMetadata): void {
    const timestamp = new Date().toISOString();
    const levelName = LogLevel[level];
    const contextStr = context ? `[${context}]` : '';
    const metadataStr = metadata ? JSON.stringify(metadata, null, 2) : '';
    
    const logMessage = `${timestamp} ${levelName} ${contextStr} ${message}`;
    
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(logMessage, metadataStr);
        break;
      case LogLevel.INFO:
        console.info(logMessage, metadataStr);
        break;
      case LogLevel.WARN:
        console.warn(logMessage, metadataStr);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(logMessage, metadataStr);
        break;
    }
  }
}

/**
 * Default client logger instance
 */
export const clientLogger = new ClientLogger({
  level: process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO,
  environment: process.env.NODE_ENV as 'development' | 'production' | 'test',
  enableConsole: true
});
