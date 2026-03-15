const capturedOutput = [];

function formatValue(value, isReturnValue = false, depth = 0, maxDepth = 10) {
  const indent = "  ".repeat(depth);
  const nextIndent = "  ".repeat(depth + 1);

  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "string")
    return isReturnValue ? '"' + value + '"' : value;
  if (typeof value === "number" || typeof value === "boolean")
    return String(value);
  if (typeof value === "bigint") return value.toString() + "n";
  if (typeof value === "function") {
    return "[Function: " + (value.name || "anonymous") + "]";
  }

  if (depth > maxDepth) {
    return "[Object: too deep]";
  }

  if (typeof value === "object") {
    try {
      JSON.stringify(value, (_, v) => (typeof v === "bigint" ? v.toString() : v));
    } catch {
      return "[Circular Object]";
    }

    if (Array.isArray(value)) {
      if (value.length === 0) return "[]";

      if (isReturnValue) {
        const formatted = value.map(
          (item) => nextIndent + formatValue(item, true, depth + 1, maxDepth)
        );
        return "[\n" + formatted.join(",\n") + "\n" + indent + "]";
      } else {
        return (
          "[" +
          value
            .map((item) => formatValue(item, false, depth + 1, maxDepth))
            .join(", ") +
          "]"
        );
      }
    }

    if (
      value.constructor &&
      value.constructor.name &&
      value.constructor.name !== "Object"
    ) {
      const className = value.constructor.name;
      const props = Object.getOwnPropertyNames(value);

      if (props.length === 0) {
        return className + " {}";
      }

      const propStrings = props.map((prop) => {
        try {
          const val = value[prop];
          const formattedVal = formatValue(val, isReturnValue, depth + 1, maxDepth);
          return (isReturnValue ? nextIndent : "") + prop + ": " + formattedVal;
        } catch {
          return (isReturnValue ? nextIndent : "") + prop + ": [Getter]";
        }
      });

      if (isReturnValue) {
        return (
          className + " {\n" + propStrings.join(",\n") + "\n" + indent + "}"
        );
      } else {
        return className + " { " + propStrings.join(", ") + " }";
      }
    }

    const keys = Object.keys(value);
    if (keys.length === 0) return "{}";

    if (isReturnValue) {
      const propStrings = keys.map((key) => {
        try {
          const val = value[key];
          const formattedVal = formatValue(val, true, depth + 1, maxDepth);
          return nextIndent + '"' + key + '": ' + formattedVal;
        } catch {
          return nextIndent + '"' + key + '": [Getter]';
        }
      });
      return "{\n" + propStrings.join(",\n") + "\n" + indent + "}";
    } else {
      const propStrings = keys.map((key) => {
        try {
          const val = value[key];
          return key + ": " + formatValue(val, false, depth + 1, maxDepth);
        } catch {
          return key + ": [Getter]";
        }
      });
      return "{ " + propStrings.join(", ") + " }";
    }
  }
  return String(value);
}

["log", "info", "warn", "error"].forEach((method) => {
  const original = console[method].bind(console);
  console[method] = (...args) => {
    const message = args.map((v) => formatValue(v)).join(" ");
    capturedOutput.push({ type: method, message });
    original(...args);
    self.postMessage({ type: "console-output", method, message });
  };
});

const timers = new Map();

console.time = (label = "default") => {
  timers.set(label, performance.now());
};

console.timeLog = (label = "default", ...args) => {
  const start = timers.get(label);
  if (start === undefined) {
    console.warn(`Timer '${label}' does not exist`);
    return;
  }
  const elapsed = (performance.now() - start).toFixed(3);
  const extra = args.length ? " " + args.map((v) => formatValue(v)).join(" ") : "";
  const message = `${label}: ${elapsed}ms${extra}`;
  capturedOutput.push({ type: "log", message });
  self.postMessage({ type: "console-output", method: "log", message });
};

console.timeEnd = (label = "default") => {
  const start = timers.get(label);
  if (start === undefined) {
    console.warn(`Timer '${label}' does not exist`);
    return;
  }
  const elapsed = (performance.now() - start).toFixed(3);
  timers.delete(label);
  const message = `${label}: ${elapsed}ms`;
  capturedOutput.push({ type: "log", message });
  self.postMessage({ type: "console-output", method: "log", message });
};

self.addEventListener("message", (event) => {
  capturedOutput.length = 0;
  try {
    const wrapped = `(async () => {\n${event.data.code}\n})()`;
    const result = eval(wrapped); // eslint-disable-line no-eval
    // result is a Promise from the async IIFE
    result
      .then((r) => {
        self.postMessage({
          type: "execution-result",
          output: capturedOutput,
          result: r !== undefined ? formatValue(r, true) : undefined,
        });
      })
      .catch((error) => {
        self.postMessage({
          type: "execution-error",
          error: error.message,
          output: capturedOutput,
        });
      });
  } catch (error) {
    // Catches synchronous parse errors (e.g. syntax errors)
    self.postMessage({
      type: "execution-error",
      error: error.message,
      output: capturedOutput,
    });
  }
});
