/**
 * Structured logging utility
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private enableDebug = import.meta.env.VITE_ENABLE_DEBUG === 'true';

  private log(level: LogLevel, message: string, context?: Record<string, any>): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context
    };

    if (level === 'debug' && !this.enableDebug) {
      return;
    }

    const logFn = console[level] || console.log;
    
    if (this.isDevelopment) {
      logFn(`[${entry.level.toUpperCase()}] ${entry.message}`, context || '');
    } else {
      // In production, send to monitoring service
      this.sendToMonitoring(entry);
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: Record<string, any>): void {
    this.log('error', message, context);
  }

  private sendToMonitoring(entry: LogEntry): void {
    // Placeholder for production monitoring integration
    // Could integrate with Sentry, LogRocket, etc.
    console.log(entry);
  }
}

export const logger = new Logger();
