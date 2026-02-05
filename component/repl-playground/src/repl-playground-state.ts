/**
 * Global state manager for repl-playground components
 * Handles persistent storage and synchronization across all component instances
 */

interface ReplPlaygroundStateData {
  vimMode: "enabled" | "disabled";
}

type StateChangeCallback = (newState: ReplPlaygroundStateData) => void;

export class ReplPlaygroundState {
  private static readonly STORAGE_KEY = "repl-playground-state";
  private static readonly STATE_CHANGE_EVENT = "repl-playground-state-change";
  private static subscribers = new Set<StateChangeCallback>();

  /**
   * Get the current state from localStorage
   */
  static getState(): ReplPlaygroundStateData {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn(
        "Failed to parse repl-playground state from localStorage:",
        error
      );
    }

    // Return default state
    return { vimMode: "disabled" };
  }

  /**
   * Get the current vim mode setting
   */
  static getVimMode(): boolean {
    return this.getState().vimMode === "enabled";
  }

  /**
   * Set vim mode and notify all subscribers
   */
  static setVimMode(enabled: boolean): void {
    const currentState = this.getState();
    const newState: ReplPlaygroundStateData = {
      ...currentState,
      vimMode: enabled ? "enabled" : "disabled",
    };

    // Save to localStorage
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newState));
    } catch (error) {
      console.warn(
        "Failed to save repl-playground state to localStorage:",
        error
      );
    }

    // Notify subscribers on same page
    this.notifySubscribers(newState);

    // Dispatch custom event for cross-tab communication
    window.dispatchEvent(
      new CustomEvent(this.STATE_CHANGE_EVENT, {
        detail: newState,
      })
    );
  }

  /**
   * Subscribe to state changes
   */
  static subscribe(callback: StateChangeCallback): void {
    this.subscribers.add(callback);
  }

  /**
   * Unsubscribe from state changes
   */
  static unsubscribe(callback: StateChangeCallback): void {
    this.subscribers.delete(callback);
  }

  /**
   * Notify all subscribers of state change
   */
  private static notifySubscribers(newState: ReplPlaygroundStateData): void {
    this.subscribers.forEach(callback => {
      try {
        callback(newState);
      } catch (error) {
        console.warn("Error in state change callback:", error);
      }
    });
  }

  /**
   * Initialize storage event listener for cross-tab synchronization
   * Should be called once when the first component loads
   */
  static initializeStorageListener(): void {
    // Listen for storage changes from other tabs
    window.addEventListener("storage", event => {
      if (event.key === this.STORAGE_KEY && event.newValue) {
        try {
          const newState: ReplPlaygroundStateData = JSON.parse(event.newValue);
          this.notifySubscribers(newState);
        } catch (error) {
          console.warn(
            "Failed to parse state change from storage event:",
            error
          );
        }
      }
    });

    // Listen for custom events from same page
    window.addEventListener(this.STATE_CHANGE_EVENT, (() => {
      // Don't notify for events we dispatched ourselves
      // The notifySubscribers call in setVimMode already handles same-page updates
    }) as EventListener);
  }
}
