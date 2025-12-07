import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { EditorView, keymap, drawSelection } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { history, indentWithTab } from "@codemirror/commands";
import { vim } from "@replit/codemirror-vim";
import { ReplPlaygroundState } from "./repl-playground-state.js";
import prettier from "prettier/standalone";
import prettierBabel from "prettier/plugins/babel";
import prettierEstree from "prettier/plugins/estree";

interface ExecutionResult {
  type: "execution-result";
  output: Array<{ type: string; message: string }>;
  result?: string;
}

interface ExecutionError {
  type: "execution-error";
  error: string;
  output: Array<{ type: string; message: string }>;
}

@customElement("repl-playground")
export class ReplPlayground extends LitElement {
  @state() private output: string[] = [];
  @state() private isExecuting = false;
  @state() private initialCode = "";
  @state() private vimMode = false; // This will be synced with global state

  private editor?: EditorView;
  private sandboxFrame?: HTMLIFrameElement;
  private stateChangeCallback?: (newState: {
    vimMode: "enabled" | "disabled";
  }) => void;
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 500px;
      border: 1px solid #333;
      border-radius: 8px;
      overflow: hidden;
      background: #1a1a1a;
      font-family: "Fira Code", "Monaco", "Cascadia Code", monospace;
    }

    .container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      height: 100%;
    }

    .editor-pane {
      border-right: 1px solid #333;
      background: #1e1e1e;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .editor-container {
      flex: 1;
      min-height: 0;
      overflow: hidden;
    }

    .controls {
      height: 40px;
      background: #2d2d2d;
      display: flex;
      align-items: center;
      padding: 0 12px;
      border-top: 1px solid #333;
      gap: 8px;
      flex-shrink: 0;
    }

    .run-button {
      background: #007acc;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      transition: background 0.2s;
    }

    .run-button:hover {
      background: #005a9e;
    }

    .run-button:disabled {
      background: #555;
      cursor: not-allowed;
    }

    .clear-button {
      background: #666;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      transition: background 0.2s;
    }

    .clear-button:hover {
      background: #777;
    }

    .reset-button {
      background: #666;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      transition: background 0.2s;
    }

    .reset-button:hover {
      background: #777;
    }

    .format-button {
      background: #666;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      transition: background 0.2s;
    }

    .format-button:hover {
      background: #777;
    }

    .keyboard-hint {
      margin-left: auto;
      font-size: 11px;
      color: #888;
      font-style: italic;
    }

    .vim-toggle {
      background: #666;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      transition: background 0.2s;
      margin-left: 8px;
    }

    .vim-toggle:hover {
      background: #777;
    }

    .vim-toggle.active {
      background: #007acc;
      color: white;
    }

    .vim-toggle.active:hover {
      background: #005a9e;
    }

    .output-pane {
      background: #1e1e1e;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .output-header {
      background: #2d2d2d;
      padding: 8px 12px;
      border-bottom: 1px solid #333;
      font-size: 12px;
      color: #ccc;
      font-weight: 500;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .terminal-output {
      flex: 1;
      padding: 12px;
      font-family: inherit;
      font-size: 13px;
      line-height: 1.2;
      overflow-y: auto;
      white-space: pre-wrap;
      color: #e6e6e6;
      background: #1e1e1e;
      min-height: 0;
    }

    .output-line {
      margin: 0 0 2px 0;
      padding: 0;
    }

    .output-error {
      color: #ff6b6b;
    }

    .output-success {
      color: #51cf66;
    }

    .output-info {
      color: #74c0fc;
    }

    .execution-sandbox {
      display: none;
      width: 0;
      height: 0;
      border: none;
    }

    @media (max-width: 768px) {
      .container {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr;
      }

      .editor-pane {
        border-right: none;
        border-bottom: 1px solid #333;
      }
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.extractInitialCode();

    // Initialize global state management
    ReplPlaygroundState.initializeStorageListener();

    // Set initial vim mode from global state
    this.vimMode = ReplPlaygroundState.getVimMode();

    // Subscribe to global state changes
    this.stateChangeCallback = newState => {
      const newVimMode = newState.vimMode === "enabled";
      if (this.vimMode !== newVimMode) {
        this.vimMode = newVimMode;
        this.buildEditor(); // Rebuild editor when vim mode changes
      }
    };
    ReplPlaygroundState.subscribe(this.stateChangeCallback);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    // Unsubscribe from global state changes
    if (this.stateChangeCallback) {
      ReplPlaygroundState.unsubscribe(this.stateChangeCallback);
    }
  }

  private extractInitialCode() {
    // Look for a template element with script content
    const template = this.querySelector("template");
    if (template) {
      const scriptElement = template.content.querySelector("script");
      if (scriptElement && scriptElement.textContent) {
        // Clean up the script content by removing extra indentation
        const lines = scriptElement.textContent.split("\n");

        // Remove empty lines from start and end
        while (lines.length > 0 && lines[0].trim() === "") {
          lines.shift();
        }
        while (lines.length > 0 && lines[lines.length - 1].trim() === "") {
          lines.pop();
        }

        // Find minimum indentation (excluding empty lines)
        const nonEmptyLines = lines.filter(line => line.trim() !== "");
        let minIndent = Infinity;

        for (const line of nonEmptyLines) {
          const match = line.match(/^(\s*)/);
          if (match) {
            minIndent = Math.min(minIndent, match[1].length);
          }
        }

        // Remove common indentation
        if (minIndent > 0 && minIndent !== Infinity) {
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim() !== "") {
              lines[i] = lines[i].substring(minIndent);
            }
          }
        }

        this.initialCode = lines.join("\n");
      } else {
        this.initialCode = '// Write your JavaScript code here and click "Run"';
      }
    } else {
      this.initialCode = '// Write your JavaScript code here and click "Run"';
    }
  }

  firstUpdated() {
    this.initializeEditor();
    this.initializeSandbox();
  }

  private initializeEditor() {
    const editorContainer = this.shadowRoot?.querySelector(".editor-container");
    if (!editorContainer) return;

    this.buildEditor();
  }

  private buildEditor() {
    const editorContainer = this.shadowRoot?.querySelector(".editor-container");
    if (!editorContainer) return;

    // Build extensions array following replit/codemirror-vim basic setup
    const extensions = [];

    // Add vim mode first if enabled (must be before other keymaps)
    if (this.vimMode) {
      extensions.push(vim());
    }

    // Add drawSelection for proper vim visual mode rendering
    extensions.push(drawSelection());

    // Add history for undo/redo functionality
    extensions.push(history());

    // Add other extensions
    extensions.push(
      javascript(),
      oneDark,
      keymap.of([
        indentWithTab,
        {
          key: "Mod-Enter",
          run: () => {
            this.runCode();
            return true;
          },
        },
      ]),
      EditorView.theme(
        {
          "&": {
            height: "100%",
            backgroundColor: "#1a1b26",
            maxHeight: "100%",
          },
          ".cm-content": {
            caretColor: "#c0caf5",
            color: "#c0caf5",
          },
          ".cm-scroller": {
            fontSize: "14px",
            fontFamily: "inherit",
            backgroundColor: "#1a1b26",
            maxHeight: "100%",
            overflow: "auto",
          },
          ".cm-focused": {
            outline: "none",
          },
          ".cm-editor": {
            height: "100%",
            maxHeight: "100%",
          },
          ".cm-editor.cm-focused": {
            backgroundColor: "#1a1b26",
          },
          ".cm-line": {
            color: "#c0caf5",
          },
          ".cm-cursor": {
            borderColor: "#c0caf5",
          },
          "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
            backgroundColor: "#364A82",
          },
          ".cm-vim-panel": {
            backgroundColor: "#1a1b26",
            color: "#c0caf5",
            border: "1px solid #333",
            borderRadius: "4px",
          },
          ".cm-vim-panel input": {
            backgroundColor: "#1a1b26",
            color: "#c0caf5",
            border: "none",
            outline: "none",
            fontFamily: "inherit",
            fontSize: "14px",
          },
        },
        { dark: true }
      )
    );

    const startState = EditorState.create({
      doc: this.editor?.state.doc.toString() || this.initialCode,
      extensions,
    });

    // Dispose of old editor if it exists
    if (this.editor) {
      this.editor.destroy();
    }

    this.editor = new EditorView({
      state: startState,
      parent: editorContainer as Element,
    });
  }

  private initializeSandbox() {
    this.sandboxFrame = this.shadowRoot?.querySelector(
      ".execution-sandbox"
    ) as HTMLIFrameElement;
    if (!this.sandboxFrame) return;

    // Create secure sandbox content
    const sandboxHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body>
          <script>
            // Override console methods to capture output
            const originalConsole = { ...console };
            const capturedOutput = [];
            
            // Enhanced object formatting similar to Node.js REPL
            function formatValue(value, isReturnValue = false, depth = 0, maxDepth = 10) {
              const indent = '  '.repeat(depth);
              const nextIndent = '  '.repeat(depth + 1);
              
              if (value === null) return 'null';
              if (value === undefined) return 'undefined';
              if (typeof value === 'string') return isReturnValue ? '"' + value + '"' : value;
              if (typeof value === 'number' || typeof value === 'boolean') return String(value);
              if (typeof value === 'function') {
                return '[Function: ' + (value.name || 'anonymous') + ']';
              }
              
              // Prevent infinite recursion
              if (depth > maxDepth) {
                return '[Object: too deep]';
              }
              
              if (typeof value === 'object') {
                // Handle circular references with a simple check
                try {
                  JSON.stringify(value);
                } catch (e) {
                  return '[Circular Object]';
                }
                
                // Handle arrays
                if (Array.isArray(value)) {
                  if (value.length === 0) return '[]';
                  
                  if (isReturnValue) {
                    const formatted = value.map(item => 
                      nextIndent + formatValue(item, true, depth + 1, maxDepth)
                    );
                    return '[\\n' + formatted.join(',\\n') + '\\n' + indent + ']';
                  } else {
                    return '[' + value.map(item => formatValue(item, false, depth + 1, maxDepth)).join(', ') + ']';
                  }
                }
                
                // Handle class instances - show constructor name
                if (value.constructor && value.constructor.name && value.constructor.name !== 'Object') {
                  const className = value.constructor.name;
                  const props = Object.getOwnPropertyNames(value);
                  
                  if (props.length === 0) {
                    return className + ' {}';
                  }
                  
                  const propStrings = props.map(prop => {
                    try {
                      const val = value[prop];
                      const formattedVal = formatValue(val, isReturnValue, depth + 1, maxDepth);
                      return (isReturnValue ? nextIndent : '') + prop + ': ' + formattedVal;
                    } catch {
                      return (isReturnValue ? nextIndent : '') + prop + ': [Getter]';
                    }
                  });
                  
                  if (isReturnValue) {
                    return className + ' {\\n' + propStrings.join(',\\n') + '\\n' + indent + '}';
                  } else {
                    return className + ' { ' + propStrings.join(', ') + ' }';
                  }
                }
                
                // Handle plain objects
                const keys = Object.keys(value);
                if (keys.length === 0) return '{}';
                
                if (isReturnValue) {
                  const propStrings = keys.map(key => {
                    try {
                      const val = value[key];
                      const formattedVal = formatValue(val, true, depth + 1, maxDepth);
                      return nextIndent + '"' + key + '": ' + formattedVal;
                    } catch {
                      return nextIndent + '"' + key + '": [Getter]';
                    }
                  });
                  return '{\\n' + propStrings.join(',\\n') + '\\n' + indent + '}';
                } else {
                  const propStrings = keys.map(key => {
                    try {
                      const val = value[key];
                      return key + ': ' + formatValue(val, false, depth + 1, maxDepth);
                    } catch {
                      return key + ': [Getter]';
                    }
                  });
                  return '{ ' + propStrings.join(', ') + ' }';
                }
              }
              return String(value);
            }

            ['log', 'info', 'warn', 'error'].forEach(method => {
              console[method] = (...args) => {
                const message = args.map(formatValue).join(' ');
                capturedOutput.push({ type: method, message });
                originalConsole[method](...args);
              };
            });

            // Listen for code execution requests
            window.addEventListener('message', (event) => {
              // Reset output for each execution
              capturedOutput.length = 0;
              
              try {
                // Execute the code and show the final result
                const result = eval(event.data.code);
                
                // Send results back to parent
                event.source.postMessage({
                  type: 'execution-result',
                  output: capturedOutput,
                  result: result !== undefined ? formatValue(result, true) : undefined
                }, event.origin);
              } catch (error) {
                event.source.postMessage({
                  type: 'execution-error',
                  error: error.message,
                  output: capturedOutput
                }, event.origin);
              }
            });
          </script>
        </body>
      </html>
    `;

    // Configure sandbox with minimal permissions
    this.sandboxFrame.sandbox = "allow-scripts";
    this.sandboxFrame.srcdoc = sandboxHtml;

    // Listen for execution results
    window.addEventListener("message", event => {
      if (event.source === this.sandboxFrame?.contentWindow) {
        this.handleExecutionResult(event.data);
      }
    });
  }

  private handleExecutionResult(data: ExecutionResult | ExecutionError) {
    this.isExecuting = false;

    if (data.type === "execution-result") {
      const newOutput = [...data.output.map(item => item.message)];
      if (data.result !== undefined) {
        newOutput.push(`→ ${data.result}`);
      }
      this.output = newOutput;
    } else if (data.type === "execution-error") {
      const errorOutput = [...data.output.map(item => item.message)];
      errorOutput.push(`Error: ${data.error}`);
      this.output = errorOutput;
    }

    this.requestUpdate();
  }

  private getOutputClass(line: string): string {
    if (line.startsWith("Error:")) return "output-error";
    if (line.startsWith("→")) return "output-success";
    if (line.startsWith("Executing...")) return "output-info";
    return "";
  }

  private getKeyboardHint(): string {
    // Detect if user is on Mac
    const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
    return isMac ? "⌘+Enter to run" : "Ctrl+Enter to run";
  }

  private runCode() {
    if (!this.editor || !this.sandboxFrame || this.isExecuting) return;

    const code = this.editor.state.doc.toString();
    this.isExecuting = true;
    this.output = ["Executing..."];
    this.requestUpdate();

    // Send code to sandbox for execution
    this.sandboxFrame.contentWindow?.postMessage(
      {
        code: code,
      },
      "*"
    );

    // Set timeout to prevent infinite execution
    setTimeout(() => {
      if (this.isExecuting) {
        this.isExecuting = false;
        this.output = ["Execution timeout after 5 seconds"];
        this.requestUpdate();
      }
    }, 5000);
  }

  private clearOutput() {
    this.output = [];
    this.requestUpdate();
  }

  private resetCode() {
    if (!this.editor) return;

    this.editor.dispatch({
      changes: {
        from: 0,
        to: this.editor.state.doc.length,
        insert: this.initialCode,
      },
    });
    this.clearOutput();
  }

  private async formatCode() {
    if (!this.editor) return;

    try {
      const code = this.editor.state.doc.toString();
      const formatted = await prettier.format(code, {
        parser: "babel",
        plugins: [prettierBabel, prettierEstree],
        semi: true,
        singleQuote: false,
        tabWidth: 2,
        printWidth: 80,
      });

      this.editor.dispatch({
        changes: {
          from: 0,
          to: this.editor.state.doc.length,
          insert: formatted,
        },
      });
    } catch (error) {
      console.error("Failed to format code:", error);
      // Optionally show an error message to the user
    }
  }

  private toggleVimMode() {
    // Update global state - this will automatically notify all other instances
    ReplPlaygroundState.setVimMode(!this.vimMode);
  }

  render() {
    return html`
      <div class="container">
        <div class="editor-pane">
          <div class="editor-container"></div>
          <div class="controls">
            <button
              class="run-button"
              ?disabled=${this.isExecuting}
              @click=${this.runCode}
            >
              ${this.isExecuting ? "Running..." : "Run"}
            </button>
            <button class="format-button" @click=${this.formatCode}>
              Format
            </button>
            <button class="reset-button" @click=${this.resetCode}>Reset</button>
            <button
              class="vim-toggle ${this.vimMode ? "active" : ""}"
              @click=${this.toggleVimMode}
            >
              Vim mode
            </button>
            <span class="keyboard-hint">${this.getKeyboardHint()}</span>
          </div>
        </div>

        <div class="output-pane">
          <div class="output-header">
            <span>Console Output</span>
            <button class="clear-button" @click=${this.clearOutput}>
              Clear
            </button>
          </div>
          <div class="terminal-output">${this.outputTemplate}</div>
        </div>

        <iframe class="execution-sandbox"></iframe>
      </div>
    `;
  }

  get outputTemplate() {
    return this.output.length === 0
      ? 'Click "Run" to execute your code...'
      : this.output.map(
          line =>
            // prettier-ignore This needs no white space to render correctly
            html`<div class="output-line ${this.getOutputClass(line)}">${line}</div>`
        );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "repl-playground": ReplPlayground;
  }
}
