import { Component, css, html } from "minne";

import { assert, debounce } from "./utils";

import { WebContainer } from "@webcontainer/api";

import { Terminal } from "@xterm/xterm";
import terminalStyles from "@xterm/xterm/css/xterm.css?inline";
import { FitAddon } from "@xterm/addon-fit";

import {
  EditorView,
  keymap,
  gutters,
  lineNumbers,
  ViewUpdate,
} from "@codemirror/view";
import { basicSetup } from "codemirror";
import { defaultKeymap } from "@codemirror/commands";
import { indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";

import * as Prettier from "prettier/standalone";
import typescriptPlugin from "prettier/plugins/typescript";
import prettierPluginBabel from "prettier/plugins/babel";
import prettierPluginEstree from "prettier/plugins/estree";

const plugins = [typescriptPlugin, prettierPluginBabel, prettierPluginEstree];

const projectFiles = {
  "index.ts": {
    file: {
      contents: ``,
    },
  },
  "package.json": {
    file: {
      contents: `
{
  "name": "example-app",
  "type": "module",
  "devDependencies": {
    "tsx": "latest"
  },
  "scripts": {
    "start": "tsx index.ts"
  }
}
`,
    },
  },
};

class TerminalPlayground extends Component {
  static css = css`
    * {
      box-sizing: border-box;
    }

    .container {
      display: flex;

      & > * {
        width: 50%;
      }
    }

    #editor {
      font-size: 14px;
      border: 1px solid black;
      position: relative;
    }

    #terminal {
      min-width: 730px;
      padding: 0.5rem;
      background: #001122;
      overflow: auto;

      & .xterm-viewport {
        scrollbar-width: none;
      }
    }

    .query-container {
      container-type: inline-size;
    }

    .format-button {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 100;
    }

    @container (max-width: 900px) {
      .container {
        flex-direction: column;

        & > * {
          width: initial;
        }
      }
    }
  `;

  webContainer!: WebContainer;
  container!: HTMLDivElement;
  editor!: HTMLDivElement;
  terminal!: HTMLDivElement;
  xTerminal!: Terminal;
  editorTabPane1!: HTMLDivElement;
  editorView!: EditorView;

  docContent = '';

  getRefs = (el: HTMLDivElement) => {
    this.container = assert(el);
    this.editor = assert(
      this.container.querySelector<HTMLDivElement>("#editor"),
    );
    this.terminal = assert(
      this.container.querySelector<HTMLDivElement>("#terminal"),
    );
    this.editorTabPane1 = assert(
      this.container.querySelector<HTMLDivElement>("#editor-tab-pane-1"),
    );
  };

  get exampleFileContent() {
    const template = assert(this.querySelector("template")).content;
    const contents = assert(
      template.querySelector("script"),
    ).textContent?.trim();

    return contents;
  }

  format(str: string) {
    return Prettier.format(str, { parser: "typescript", plugins });
  }

  async connectedCallback() {
    super.connectedCallback();

    projectFiles["index.ts"].file.contents = await this.format(
      this.exampleFileContent || "",
    );

    this.editorView = this.spawnEditorView(
      projectFiles["index.ts"].file.contents,
      this.editorTabPane1,
    );

    const fitAddon = new FitAddon();
    this.xTerminal = new Terminal({
      convertEol: true,
      theme: {
        background: "#001122",
      },
    });

    this.xTerminal.loadAddon(fitAddon);

    this.xTerminal.open(this.terminal);

    this.boot();
  }

  async boot() {
    this.webContainer = await WebContainer.boot({ workdirName: "home" });

    await this.webContainer.mount(projectFiles);

    this.xTerminal.writeln(`\x1b[1;33mInstalling files...

`);
    const setupProcess = await this.webContainer.spawn("pnpm", ["install"]);

    setupProcess.output.pipeTo(
      new WritableStream({
        write: (data) => {
          this.xTerminal.write(data);
        },
      }),
    );

    await setupProcess.exit;

    this.xTerminal.writeln(`

\x1b[1;33mTo run the file in the editor on the left, execute:

\x1b[1;36mpnpm tsx index.ts

`);

    await this.startShell();
  }

  async startShell() {
    const shellProcess = await this.webContainer.spawn("jsh");

    shellProcess.output.pipeTo(
      new WritableStream({
        write: (data) => {
          this.xTerminal.write(data);
        },
      }),
    );

    const input = shellProcess.input.getWriter();

    this.xTerminal.onData((data) => {
      input.write(data);
    });

    return shellProcess;
  }

  handleTextChange = (view: ViewUpdate) => {
    const newDoc = view.state.doc.toString().trim();

    this.docContent = newDoc;

    if (this.webContainer) {
      this.webContainer.fs.writeFile("/index.ts", newDoc);
    }
  };

  debouncedHandleTextChange = debounce(this.handleTextChange, 500);

  doFormat= async () => {
    const formatted = await this.format(this.docContent);

    const { state } = this.editorView;
    const transaction = state.update({
      changes: { from: 0, to: state.doc.length, insert: formatted },
    });
    this.editorView.update([transaction]);
  }

  spawnEditorView(doc: string, el: Element) {
    return new EditorView({
      doc,
      extensions: [
        basicSetup,
        javascript({
          typescript: true,
          jsx: true,
        }),
        keymap.of([...defaultKeymap, indentWithTab]),
        lineNumbers(),
        gutters(),
        EditorView.updateListener.of(this.debouncedHandleTextChange),
      ],
      parent: el,
    });
  }

  render() {
    return html`
      <style>
        ${terminalStyles}
      </style>
      <div part="container" class="query-container" ref=${this.getRefs}>
        <div class="container">
          <div id="editor">
            <button
              part="editor-format-button"
              class="button format-button"
              type="button"
              onclick=${this.doFormat}
            >
              Format
            </button>
            <div id="editor-tab-pane-1"></div>
          </div>
          <div id="terminal"></div>
        </div>
      </div>
    `;
  }
}

TerminalPlayground.define("terminal-playground");
