/**
 * MCP-safe logging utilities
 * 
 * This module provides logging that never pollutes STDIO output, which is critical
 * for MCP protocol compliance when using STDIO transport.
 * 
 * - Uses stderr for all log output in STDIO mode (STDIO transport uses stdout)
 * - Uses stdout for INFO/DEBUG and stderr for WARN/ERROR in HTTP mode
 * - Provides structured logging with timestamps and levels
 * - Can be safely used in both STDIO and HTTP server contexts
 * - Supports environment-based log level configuration
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/**
 * Detects if we're running in HTTP server mode (vs STDIO mode).
 * HTTP mode is detected by the presence of PORT or HTTP_PORT env vars.
 */
function isHttpMode(): boolean {
  return !!(process.env.PORT || process.env.HTTP_PORT);
}

/**
 * Logger class for MCP-safe logging.
 *
 * In STDIO mode: All log output is sent to stderr to avoid interfering with STDIO protocol.
 * In HTTP mode: INFO/DEBUG go to stdout, WARN/ERROR go to stderr (for proper log categorization).
 * Log level can be set via the LOG_LEVEL environment variable.
 */
class Logger {
  private level: LogLevel;

  constructor() {
    // Default to 'info' level, can be overridden by environment
    this.level = (process.env.LOG_LEVEL as LogLevel) || 'info';
  }

  setLevel(level: LogLevel) {
    this.level = level;
  }

  getLevel(): LogLevel {
    return this.level;
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.level];
  }

  protected writeLog(level: LogLevel, message: string, ...args: any[]) {
    if (!this.shouldLog(level)) {
      return;
    }

    const timestamp = new Date().toISOString();
    const levelStr = level.toUpperCase().padEnd(5);
    const prefix = `[${timestamp}] ${levelStr}`;
    
    // In HTTP mode: INFO/DEBUG go to stdout, WARN/ERROR go to stderr
    // In STDIO mode: Everything goes to stderr to avoid polluting protocol
    const useStdout = isHttpMode() && (level === 'info' || level === 'debug');
    const stream = useStdout ? process.stdout : process.stderr;
    
    if (args.length > 0) {
      stream.write(`${prefix} ${message}\n`);
      args.forEach(arg => {
        stream.write(`${prefix} ${typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)}\n`);
      });
    } else {
      stream.write(`${prefix} ${message}\n`);
    }
  }

  debug(message: string, ...args: any[]) {
    this.writeLog('debug', message, ...args);
  }

  info(message: string, ...args: any[]) {
    this.writeLog('info', message, ...args);
  }

  warn(message: string, ...args: any[]) {
    this.writeLog('warn', message, ...args);
  }

  error(message: string, ...args: any[]) {
    this.writeLog('error', message, ...args);
  }

  /**
   * Create a child logger with a context prefix
   */
  /**
   * Create a child logger with a context prefix.
   * @param context - Context string to prefix log messages.
   * @returns A new Logger instance with context-aware output.
   */
  child(context: string): Logger {
    const childLogger = new Logger();
    childLogger.level = this.level;
    // Override write method to include context
    const originalWrite = childLogger.writeLog.bind(childLogger);
    childLogger.writeLog = (level: LogLevel, message: string, ...args: any[]) => {
      originalWrite(level, `[${context}] ${message}`, ...args);
    };
    return childLogger;
  }
}

/**
 * Singleton logger instance for general use.
 */
export const logger = new Logger();

/**
 * Logger factory for creating context-specific loggers.
 * @param context - Optional context string for log messages.
 * @returns A Logger instance (child if context provided, otherwise singleton).
 */
export function createLogger(context?: string): Logger {
  return context ? logger.child(context) : logger;
}