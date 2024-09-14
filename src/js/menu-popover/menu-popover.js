// Deprecated.... just using css to handle


export default class MenuPopover extends HTMLElement {
  connectedCallback() {
    this.handleWindowResize();

    this.windowObserver = new ResizeObserver(this.handleWindowResize);
    this.windowObserver.observe(document.body);
  }

  init = () => {
    this.setupPopoverEl();
    this.appendChild(this.popoverEl);
    this.setupMenuButton();
    this.prepend(this.menuButton);
    this.initialized = true;
  };

  handleWindowResize = () => {
    if (window.innerWidth > 500) {
      // Don't need to do this for smaller screen sizes!

      if (this.initialized) {
        this.tearDown();
      }

      // To stop FOUC from happening while booting
      this.classList.remove('hide-while-booting');
      return;
    }

    if (!this.initialized) {
      this.init();
    }
  };

  // Sets up popover and stores old children
  setupPopoverEl = () => {
    this.popoverEl = document.createElement("div");

    this.popoverEl.id = "mobile-menu";

    for (let child of this.children) {
      this.popoverEl.appendChild(child.cloneNode(true));
    }

    this.storedChildren = Array.from(this.children).map((el) =>
      el.cloneNode(true),
    );
    Array.from(this.children).forEach((el) => el.remove());

    this.classList.remove("hide-while-booting");
  };

  get popoverIsOpen() {
    return this.popoverEl.classList.contains("open");
  }

  toggleMenu = (menuButton) => () => {
    const elToFocusAfterTransition = this.popoverIsOpen
      ? menuButton
      : this.popoverEl.children[0];

    this.popoverEl.addEventListener(
      "transitionend",
      () => {
        elToFocusAfterTransition.focus();
      },
      { once: true },
    );

    this.popoverEl.classList.toggle("open");
  };

  handleClickout = (event) => {
    if (!this.popoverIsOpen || this.contains(event.target)) {
      return;
    }

    this.toggleMenu(this.menuButton)();
  };

  handleFocusChange = (event) => {
    if (this.contains(event.target)) {
      return;
    }

    if (this.popoverIsOpen) {
      this.toggleMenu(this.menuButton)();
    }
  };

  handleEscape = (event) => {
    if (
      this.contains(event.target) &&
      event.key === "Escape" &&
      this.popoverIsOpen
    ) {
      this.toggleMenu(this.menuButton)();
    }
  };

  setupMenuButton = () => {
    this.menuButton = document.createElement("button");
    this.menuButton.innerHTML = getHamburgerSvg();
    this.menuButton.classList.add("button", "hamburger-button");
    this.menuButton.ariaLabel = "Toggle navigation menu";
    this.menuButton.addEventListener("click", this.toggleMenu(this.menuButton));
    document.body.addEventListener("click", this.handleClickout);
    document.body.addEventListener("focusin", this.handleFocusChange);
    document.body.addEventListener("keyup", this.handleEscape);
  };

  tearDown = () => {
    this.popoverEl?.remove();
    this.menuButton?.remove();
    document.body.removeEventListener("click", this.handleClickout);
    document.body.removeEventListener("focusin", this.handleFocusChange);
    document.body.removeEventListener("keyup", this.handleEscape);

    // Restore regular children
    this.append(...this.storedChildren);

    this.initialized = false;
  };

  disconnectedCallback() {
    this.windowObserver.disconnect();
  }
  static {
    if (!customElements.get("menu-popover")) {
      customElements.define("menu-popover", this);
    }
  }
}

function getHamburgerSvg() {
  return `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g clip-path="url(#a)"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 6h18M3 12h18M3 18h18"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h24v24H0z"/></clipPath></defs><script/></svg>`;
}
