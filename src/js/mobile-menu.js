export default class MobileMenu {
  constructor(selector) {
    this.el = document.querySelector(selector);
    this.popoverEl = this.el.querySelector("#mobile-menu-popover");
    this.popoverButtonEl = this.el.querySelector("#mobile-menu .button");

    if (!this.el) {
      throw new Error(
        `Can't start mobile menu! Element with selector ${selector} not found! `,
      );
    }

    this.isOpen = false;

    this.el.addEventListener("click", this.toggle);
  }

  attachEscapeListener = () => {
    const func = (e) => {
      if (e.key === "Escape") {
        this.close();
      }
    };
    document.addEventListener("keydown", func);

    this.tearDownEscape = () => document.removeEventListener("keydown", func);
  };

  attachFocusoutListener = () => {
    const func = (e) => {
      if (!this.popoverEl.contains(e.relatedTarget)) {
        this.close();
      }
    };
    this.popoverEl.addEventListener("focusout", func);

    this.tearDownFocusout = () => this.popoverEl.removeEventListener("focusout", func);
  };

  close = () => {
    this.tearDownEscape();
    this.tearDownFocusout();
    this.popoverEl.classList.remove("open")
    this.isOpen = false
    this.popoverButtonEl.focus();
  };
  open = () => {
    this.attachEscapeListener();
    this.attachFocusoutListener();
    this.popoverEl.classList.add("open");
    this.isOpen = true;

    this.popoverEl.addEventListener(
      "transitionend",
      () => {
        // If you quickly open and close with escape, focus is lost in a hidden menu
        if (this.isOpen) {
          this.popoverEl.firstElementChild.focus();
        }
      },
      { once: true },
    );
  };

  toggle = () => (this.isOpen ? this.close() : this.open());
}
