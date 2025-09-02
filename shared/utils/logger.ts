/**
 * Centralized logging utility for the Board the Z application
 * Provides structured logging with different levels and environments
 * 
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
 * Metadata type for log entries
 */
export type LogMetadata = Record<string, string | number | boolean | null | undefined>;

/**
 * Log entry interface for structured logging
 */
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  metadata?: LogMetadata;
  error?: Error;
}

/**
 * Logger configuration interface
 */
export interface LoggerConfig {
  level: LogLevel;
  environment: 'development' | 'production' | 'test';
  enableConsole: boolean;
  enableFile?: boolean;
  filePath?: string;
}

/**
 * Check if we're running on the server side
 */
const isServer = typeof window === 'undefined';

/**
 * Centralized logger class with multiple output targets and structured logging
 */
class Logger {
  private config: LoggerConfig;
  private static instance: Logger;

  /**
   * Private constructor to enforce singleton pattern
   * @param config - Logger configuration
   */
  private constructor(config: LoggerConfig) {
    this.config = config;
  }

  /**
   * Get singleton instance of logger
   * @param config - Optional configuration for first initialization
   * @returns Logger instance
   */
  public static getInstance(config?: LoggerConfig): Logger {
    if (!Logger.instance) {
      const defaultConfig: LoggerConfig = {
        level: isServer && process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
        environment: (isServer ? process.env.NODE_ENV : 'development') as 'development' | 'production' | 'test' || 'development',
        enableConsole: true,
        enableFile: isServer && process.env.NODE_ENV === 'production'
      };
      Logger.instance = new Logger(config || defaultConfig);
    }
    return Logger.instance;
  }

  /**
   * Update logger configuration
   * @param config - New configuration to merge
   */
  public updateConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Create structured log entry
   * @param level - Log level
   * @param message - Log message
   * @param context - Optional context (component/module name)
   * @param metadata - Optional additional data
   * @param error - Optional error object
   * @returns Formatted log entry
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: string,
    metadata?: LogMetadata,
    error?: Error
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      metadata,
      error
    };
  }

  /**
   * Format log entry for console output
   * @param entry - Log entry to format
   * @returns Formatted string
   */
  private formatConsoleOutput(entry: LogEntry): string {
    const levelName = LogLevel[entry.level];
    const contextStr = entry.context ? `[${entry.context}]` : '';
    const metadataStr = entry.metadata ? ` | ${JSON.stringify(entry.metadata)}` : '';
    const errorStr = entry.error ? ` | Error: ${entry.error.message}` : '';
    
    return `[${entry.timestamp}] ${levelName} ${contextStr} ${entry.message}${metadataStr}${errorStr}`;
  }

  /**
   * Check if log level should be output based on configuration
   * @param level - Log level to check
   * @returns True if should log
   */
  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.level;
  }

  /**
   * Core logging method
   * @param level - Log level
   * @param message - Log message
   * @param context - Optional context
   * @param metadata - Optional metadata
   * @param error - Optional error
   */
  private async log(
    level: LogLevel,
    message: string,
    context?: string,
    metadata?: LogMetadata,
    error?: Error
  ): Promise<void> {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry = this.createLogEntry(level, message, context, metadata, error);

    // Console output
    if (this.config.enableConsole) {
      const formatted = this.formatConsoleOutput(entry);
      
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(formatted);
          break;
        case LogLevel.INFO:
          console.info(formatted);
          break;
        case LogLevel.WARN:
          console.warn(formatted);
          break;
        case LogLevel.ERROR:
        case LogLevel.FATAL:
          console.error(formatted);
          if (entry.error) {
            console.error(entry.error.stack);
          }
          break;
      }
    }

    // File output (if enabled and in server environment)
    if (this.config.enableFile && isServer) {
      this.writeToFile(entry);
    }

    // Database output (if enabled and in server environment)
    if (isServer && this.config.environment === 'production') {
      try {
        const { databaseLogger } = await import('./databaseLogger');
        await databaseLogger.log(entry);
      } catch (error) {
        // Silently fail database logging to prevent infinite loops
        console.error('Database logging failed:', error);
      }
    }
  }

  /**
   * Write log entry to file (server-side only)
   * @param entry - Log entry to write
   */
  private async writeToFile(entry: LogEntry): Promise<void> {
    // Only execute on server side
    if (!isServer) return;

    try {
      // Use dynamic imports for server-side modules to avoid bundling issues
      const { existsSync, mkdirSync, appendFileSync } = await import('fs');
      const { dirname } = await import('path');
      
      const logFilePath = this.config.filePath || './logs/app.log';
      const logDir = dirname(logFilePath);
      
      if (!existsSync(logDir)) {
        mkdirSync(logDir, { recursive: true });
      }

      const logLine = JSON.stringify(entry) + '\n';
      appendFileSync(logFilePath, logLine);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  /**
   * Log debug message
   * @param message - Debug message
   * @param context - Optional context
   * @param metadata - Optional metadata
   */
  public debug(message: string, context?: string, metadata?: LogMetadata): void {
    // Use void to handle async without waiting
    void this.log(LogLevel.DEBUG, message, context, metadata);
  }

  /**
   * Log info message
   * @param message - Info message
   * @param context - Optional context
   * @param metadata - Optional metadata
   */
  public info(message: string, context?: string, metadata?: LogMetadata): void {
    void this.log(LogLevel.INFO, message, context, metadata);
  }

  /**
   * Log warning message
   * @param message - Warning message
   * @param context - Optional context
   * @param metadata - Optional metadata
   */
  public warn(message: string, context?: string, metadata?: LogMetadata): void {
    void this.log(LogLevel.WARN, message, context, metadata);
  }

  /**
   * Log error message
   * @param message - Error message
   * @param context - Optional context
   * @param error - Optional error object
   * @param metadata - Optional metadata
   */
  public error(message: string, context?: string, error?: Error, metadata?: LogMetadata): void {
    void this.log(LogLevel.ERROR, message, context, metadata, error);
  }

  /**
   * Log fatal error message
   * @param message - Fatal error message
   * @param context - Optional context
   * @param error - Optional error object
   * @param metadata - Optional metadata
   */
  public fatal(message: string, context?: string, error?: Error, metadata?: LogMetadata): void {
    void this.log(LogLevel.FATAL, message, context, metadata, error);
  }

  /**
   * Log function entry for debugging
   * @param functionName - Name of function being entered
   * @param context - Optional context
   * @param params - Optional function parameters
   */
  public enter(functionName: string, context?: string, params?: LogMetadata): void {
    this.debug(`Entering function: ${functionName}`, context, params);
  }

  /**
   * Log function exit for debugging
   * @param functionName - Name of function being exited
   * @param context - Optional context
   * @param result - Optional function result
   */
  public exit(functionName: string, context?: string, result?: unknown): void {
    this.debug(`Exiting function: ${functionName}`, context, result ? { result: String(result) } : undefined);
  }

  /**
   * Log performance timing
   * @param operation - Operation name
   * @param duration - Duration in milliseconds
   * @param context - Optional context
   * @param metadata - Optional metadata
   */
  public performance(operation: string, duration: number, context?: string, metadata?: LogMetadata): void {
    this.info(`Performance: ${operation} took ${duration}ms`, context, metadata);
  }
}

// Export singleton instance
export const logger = Logger.getInstance();

// Export default instance for easier imports
export default logger;