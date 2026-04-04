const STORAGE_KEY = "theme-preference";
const STATES = ["light", "dark", "system"];

const ICONS = {
  light: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
  dark: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
  system: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
};

const LABELS = {
  light: "Light mode",
  dark: "Dark mode",
  system: "System preference",
};

class ThemeToggle extends HTMLElement {
  connectedCallback() {
    this.setAttribute("role", "button");
    this.setAttribute("tabindex", "0");

    this.addEventListener("click", () => this.#cycle());
    this.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.#cycle();
      }
    });

    this.#render();
  }

  get #preference() {
    return localStorage.getItem(STORAGE_KEY) || "system";
  }

  #cycle() {
    const current = this.#preference;
    const next = STATES[(STATES.indexOf(current) + 1) % STATES.length];
    localStorage.setItem(STORAGE_KEY, next);
    ThemeToggle.applyPreference();
    this.#render();
  }

  #render() {
    const pref = this.#preference;
    this.innerHTML = ICONS[pref];
    this.setAttribute("aria-label", LABELS[pref]);
    this.title = LABELS[pref];
  }

  static applyPreference() {
    const pref = localStorage.getItem(STORAGE_KEY) || "system";
    const root = document.documentElement;

    if (pref === "system") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", pref);
    }
  }
}

customElements.define("theme-toggle", ThemeToggle);

export default ThemeToggle;
