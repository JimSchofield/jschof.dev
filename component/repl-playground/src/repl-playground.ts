import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { EditorView, keymap, drawSelection } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { indentOnInput } from "@codemirror/language";
import { oneDark } from "@codemirror/theme-one-dark";
import {
  history,
  indentWithTab,
  insertNewlineAndIndent,
} from "@codemirror/commands";
import { vim } from "@replit/codemirror-vim";
import { ReplPlaygroundState } from "./repl-playground-state.js";
import { styles } from "./repl-playground.styles.js";
import sandboxHtml from "./sandbox.html?raw";
import workerScript from "./worker.js?raw";
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

interface ConsoleOutput {
  type: "console-output";
  method: string;
  message: string;
}

@customElement("repl-playground")
export class ReplPlayground extends LitElement {
  @property({ type: Boolean, attribute: "start-collapsed" })
  startCollapsed = false;

  @property({ type: Boolean, attribute: "web-worker" })
  webWorker = false;

  @state() private output: string[] = [];
  @state() private isExecuting = false;
  @state() private initialCode = "";
  @state() private vimMode = false; // This will be synced with global state
  @state() private consoleCollapsed = false;

  private editor?: EditorView;
  private sandboxFrame?: HTMLIFrameElement;
  private activeWorker?: Worker;
  private activeWorkerUrl?: string;
  private stateChangeCallback?: (newState: {
    vimMode: "enabled" | "disabled";
  }) => void;

  static styles = styles;

  connectedCallback() {
    super.connectedCallback();
    this.consoleCollapsed = this.startCollapsed;
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

    // Terminate any in-flight worker
    if (this.activeWorker) {
      this.activeWorker.terminate();
      this.activeWorker = undefined;
    }
    if (this.activeWorkerUrl) {
      URL.revokeObjectURL(this.activeWorkerUrl);
      this.activeWorkerUrl = undefined;
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

    // Add smart indentation
    extensions.push(indentOnInput());

    // Add other extensions
    extensions.push(
      javascript(),
      oneDark,
      keymap.of([
        indentWithTab,
        {
          key: "Enter",
          run: insertNewlineAndIndent,
        },
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

    // Configure sandbox with minimal permissions
    this.sandboxFrame.sandbox = "allow-scripts allow-modals";
    this.sandboxFrame.srcdoc = sandboxHtml;

    // Listen for execution results
    window.addEventListener("message", event => {
      if (event.source === this.sandboxFrame?.contentWindow) {
        this.handleExecutionResult(event.data);
      }
    });
  }

  private handleExecutionResult(
    data: ExecutionResult | ExecutionError | ConsoleOutput
  ) {
    if (data.type === "console-output") {
      // Remove "Executing..." placeholder on first output
      const filtered = this.output.filter(l => l !== "Executing...");
      this.output = [...filtered, data.message];
      this.requestUpdate();
      return;
    }

    this.isExecuting = false;

    // Remove "Executing..." placeholder
    const current = this.output.filter(l => l !== "Executing...");

    if (data.type === "execution-result") {
      if (data.result !== undefined) {
        this.output = [...current, `→ ${data.result}`];
      } else if (current.length === 0) {
        // No console output and no return value
        this.output = [];
      } else {
        this.output = current;
      }
    } else if (data.type === "execution-error") {
      this.output = [...current, `Error: ${data.error}`];
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

  private runInWorker(code: string) {
    // Terminate any previously running worker
    if (this.activeWorker) {
      this.activeWorker.terminate();
      this.activeWorker = undefined;
    }
    if (this.activeWorkerUrl) {
      URL.revokeObjectURL(this.activeWorkerUrl);
      this.activeWorkerUrl = undefined;
    }

    const blob = new Blob([workerScript], { type: "application/javascript" });
    this.activeWorkerUrl = URL.createObjectURL(blob);
    const worker = new Worker(this.activeWorkerUrl);
    this.activeWorker = worker;

    worker.addEventListener("message", event => {
      this.handleExecutionResult(event.data);

      // On error, terminate immediately — no async callbacks expected
      if (event.data.type === "execution-error") {
        worker.terminate();
        if (this.activeWorkerUrl) {
          URL.revokeObjectURL(this.activeWorkerUrl);
          this.activeWorkerUrl = undefined;
        }
        this.activeWorker = undefined;
      }
      // On execution-result, keep the worker alive so async callbacks
      // (e.g. setTimeout, Promise resolutions) can still post console-output
      // messages. The timeout in runCode() is responsible for final cleanup.
    });

    worker.addEventListener("error", event => {
      this.isExecuting = false;
      this.output = [`Error: ${event.message}`];
      worker.terminate();
      if (this.activeWorkerUrl) {
        URL.revokeObjectURL(this.activeWorkerUrl);
        this.activeWorkerUrl = undefined;
      }
      this.activeWorker = undefined;
      this.requestUpdate();
    });

    worker.postMessage({ code });
  }

  private runCode() {
    if (!this.editor || this.isExecuting) return;
    if (!this.webWorker && !this.sandboxFrame) return;

    const code = this.editor.state.doc.toString();
    this.isExecuting = true;
    this.consoleCollapsed = false;
    this.output = ["Executing..."];
    this.requestUpdate();

    if (this.webWorker) {
      this.runInWorker(code);
    } else {
      // Send code to sandbox for execution
      this.sandboxFrame!.contentWindow?.postMessage({ code }, "*");
    }
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

  private toggleConsole() {
    this.consoleCollapsed = !this.consoleCollapsed;
  }

  render() {
    return html`
      <div class="container ${this.consoleCollapsed ? "console-collapsed" : ""}">
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
            <button
              class="console-toggle ${this.consoleCollapsed ? "" : "active"}"
              @click=${this.toggleConsole}
            >
              Console
            </button>
            <span class="keyboard-hint">${this.getKeyboardHint()}</span>
          </div>
        </div>

        <div class="output-pane">
          <div class="output-header">
            <span>Console Output</span>
            <div class="output-header-actions">
              <button class="clear-button" @click=${this.clearOutput}>
                Clear
              </button>
              <button
                class="collapse-button"
                @click=${this.toggleConsole}
                title="Collapse console"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
          <div class="terminal-output">${this.outputTemplate}</div>
        </div>

        ${!this.webWorker ? html`<iframe class="execution-sandbox"></iframe>` : ""}
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
