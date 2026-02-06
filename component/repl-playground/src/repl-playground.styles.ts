import { css } from "lit";

export const styles = css`
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
    transition: grid-template-columns 0.2s ease;
  }

  .container.console-collapsed {
    grid-template-columns: 1fr 0fr;
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

  .console-toggle {
    background: #666;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: background 0.2s;
    margin-left: auto;
  }

  .console-toggle:hover {
    background: #777;
  }

  .console-toggle.active {
    background: #007acc;
  }

  .console-toggle.active:hover {
    background: #005a9e;
  }

  .keyboard-hint {
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
    white-space: nowrap;
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
    transition: opacity 0.2s ease;
  }

  .console-collapsed .output-pane {
    opacity: 0;
    pointer-events: none;
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

  .output-header-actions {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .collapse-button {
    background: none;
    border: none;
    color: #ccc;
    cursor: pointer;
    padding: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: background 0.2s;
  }

  .collapse-button:hover {
    background: #444;
  }

  .collapse-button svg {
    width: 16px;
    height: 16px;
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

    .container.console-collapsed {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 0fr;
    }

    .editor-pane {
      border-right: none;
      border-bottom: 1px solid #333;
    }
  }
`;
