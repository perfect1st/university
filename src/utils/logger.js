/**
 * Logger utility to manage console logs across the application.
 * Logs are only displayed when running on localhost.
 */

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "[::1]"
);

const logger = {
  log: (...args) => {
    if (isLocalhost) {
      console.log(...args);
    }
  },
  warn: (...args) => {
    if (isLocalhost) {
      console.warn(...args);
    }
  },
  error: (...args) => {
    if (isLocalhost) {
      console.error(...args);
    }
  },
  info: (...args) => {
    if (isLocalhost) {
      console.info(...args);
    }
  },
  debug: (...args) => {
    if (isLocalhost) {
      console.debug(...args);
    }
  },
};

export default logger;
