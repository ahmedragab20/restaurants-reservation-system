// this file contains custom console loggers
// helps to decrease the unneeded amount of console logs in production

/**
 * checks if the current hostname is localhost
 * @type {boolean}
 */
export const usingLocalhost =
  window && "location" in window && location?.hostname === "localhost";

/**
 * custom logger for the console
 * @note use printout("prod", ...args) to log to prod otherwise it will only log to localhost
 */
export function printout(...args) {
  if (!args?.length) return;
  try {
    const loggable = args[0] === "prod" ? true : usingLocalhost;

    if (loggable) {
      let rest = args;
      if (args[0] === "prod") {
        rest = args.slice(1);
      }
      console.log(...rest);
    }
  } catch (error) {
    printerr(error);
  }
}

/**
 * custom error logger for the console
 * @note use printerr("prod", ...args) to log to prod otherwise it will only log to localhost
 */
export function printerr(...args) {
  if (!args?.length) return;
  try {
    const loggable = args[0] === "prod" ? true : usingLocalhost;

    if (loggable) {
      let rest = args;
      if (args[0] === "prod") {
        rest = args.slice(1);
      }
      console.error(...rest);
    }
  } catch (error) {
    printerr(error);
  }
}

/**
 * custom warning logger for the console
 * @note use printwarn("prod", ...args) to log to prod otherwise it will only log to localhost
 */
export function printwarn(...args) {
  if (!args?.length) return;
  try {
    const loggable = args[0] === "prod" ? true : usingLocalhost;

    if (loggable) {
      let rest = args;
      if (args[0] === "prod") {
        rest = args.slice(1);
      }
      console.warn(...rest);
    }
  } catch (error) {
    printerr(error);
  }
}

/**
 * custom erorr logger for the console
 * @note use printinfo("prod", ...args) to log to prod otherwise it will only log to localhost
 */
export function printinfo(...args) {
  if (!args?.length) return;
  try {
    const loggable = args[0] === "prod" ? true : usingLocalhost;

    if (loggable) {
      let rest = args;
      if (args[0] === "prod") {
        rest = args.slice(1);
      }
      console.info(...rest);
    }
  } catch (error) {
    printerr(error);
  }
}
