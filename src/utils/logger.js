/**
 * Lightweight logger with timestamped levels to avoid external dependencies
 * while maintaining consistent observability across the project.
 */
export class Logger {
  constructor(context = "app") {
    this.context = context;
  }

  formatMessage(level, message) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] [${this.context}] ${message}`;
  }

  info(message) {
    console.log(this.formatMessage("info", message));
  }

  warn(message) {
    console.warn(this.formatMessage("warn", message));
  }

  error(message, error) {
    if (error) {
      console.error(this.formatMessage("error", `${message} :: ${error.message}`));
    } else {
      console.error(this.formatMessage("error", message));
    }
  }
}

export default Logger;
