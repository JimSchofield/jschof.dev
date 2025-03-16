import { WebContainer, FileSystemTree } from "@webcontainer/api";
import { Component, html } from "minne";
import { styles } from "./styles";

const assert = <T>(el: T | null) => {
  if (!el) throw new Error("HTML Element missing");
  return el;
};

const projectFiles = {
  "index.js": {
    file: {
      contents: `
import express from "express";

const app = express();
const port = 3111;

app.get("/", (req, res) => {
  res.send("Welcome to a WebContainers app! 🥳");
});

app.listen(port, () => {
  console.log(\`App is live at http://localhost:\${port}\`);
});
`,
    },
  },
  "package.json": {
    file: {
      contents: `
{
  "name": "example-app",
  "type": "module",
  "dependencies": {
    "express": "latest",
    "nodemon": "latest"
  },
  "scripts": {
    "start": "nodemon --watch './' index.js"
  }
}
`,
    },
  },
};

class TerminalPlayground extends Component {
  static css = styles;

  webContainer!: WebContainer;
  container!: HTMLDivElement;
  editor!: HTMLDivElement;
  terminal!: HTMLDivElement;
  textArea!: HTMLTextAreaElement;

  getRefs = (el: HTMLDivElement) => {
    this.container = assert(el);
    this.editor = assert(
      this.container.querySelector<HTMLDivElement>("#editor"),
    );
    this.textArea = assert<HTMLTextAreaElement>(
      this.editor.querySelector("textarea"),
    );
    this.terminal = assert(
      this.container.querySelector<HTMLDivElement>("#preview"),
    );
  };

  connectedCallback() {
    super.connectedCallback();

    this.textArea.value = projectFiles["index.js"].file.contents;

    this.boot();
  }

  async boot() {
    this.webContainer = await WebContainer.boot();

    await this.webContainer.mount(projectFiles);

    const packageJSON = await this.webContainer.fs.readFile(
      "package.json",
      "utf-8",
    );
  }

  render() {
    return html`
      <div class="container" ref=${this.getRefs}>
        <div id="editor">
          <textarea>Loading...</textarea>
        </div>
        <div id="preview">
          <iframe />
        </div>
      </div>
    `;
  }
}

TerminalPlayground.define("terminal-playground");
