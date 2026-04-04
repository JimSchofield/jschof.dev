import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import type { ExplainSection } from "./explain-section.js";

// code-highlight is loaded separately — we just need its API
interface CodeHighlightElement extends HTMLElement {
  setActiveLines(lineSpec: string): void;
  clearActiveLines(): void;
  getFirstActiveLine(): HTMLElement | null;
  getScrollContainer(): HTMLElement | null;
  updateComplete: Promise<boolean>;
}

@customElement("scroll-explain")
export class ScrollExplain extends LitElement {
  private _lastActiveLines = "";
  private _codeBlock: CodeHighlightElement | null = null;
  private _sections: ExplainSection[] = [];
  private _sectionObserver: IntersectionObserver | null = null;
  private _activeSections = new Set<ExplainSection>();

  private _onResize = () => {
    this._setupObserver();
  };

  firstUpdated() {
    this._codeBlock = this.querySelector(
      "code-highlight",
    ) as CodeHighlightElement | null;
    this._sections = Array.from(this.querySelectorAll("explain-section"));

    if (!this._codeBlock || this._sections.length === 0) return;

    this._setupObserver();
    window.addEventListener("resize", this._onResize, { passive: true });
  }

  private _setupObserver() {
    // Tear down existing observer
    this._sectionObserver?.disconnect();
    this._activeSections.clear();

    // On mobile, the top ~35vh is the sticky code block, so shift
    // the trigger zone down into the center of the prose area.
    const isMobile = window.matchMedia("(max-width: 900px)").matches;
    const rootMargin = isMobile
      ? "-65% 0px -10% 0px"
      : "-40% 0px -35% 0px";

    this._sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const section = entry.target as ExplainSection;
          if (entry.isIntersecting) {
            this._activeSections.add(section);
          } else {
            this._activeSections.delete(section);
          }
        }

        // Pick the topmost visible section (DOM order)
        for (const section of this._sections) {
          if (this._activeSections.has(section)) {
            this._setActive(section);
            return;
          }
        }

        // No sections in the trigger zone — clear highlighting
        if (this._activeSections.size === 0) {
          this._lastActiveLines = "";
          this._codeBlock!.clearActiveLines();
          if (this._activeSection) {
            this._activeSection.removeAttribute("active");
            this._activeSection = null;
          }
        }
      },
      {
        rootMargin,
        threshold: 0,
      },
    );

    for (const section of this._sections) {
      this._sectionObserver.observe(section);
    }
  }

  private _activeSection: ExplainSection | null = null;

  private _setActive(section: ExplainSection) {
    const lines = section.lines;
    if (!lines || lines === this._lastActiveLines) return;
    this._lastActiveLines = lines;

    if (this._activeSection && this._activeSection !== section) {
      this._activeSection.removeAttribute("active");
    }
    section.setAttribute("active", "");
    this._activeSection = section;

    this._codeBlock!.setActiveLines(lines);
    this._scrollToActiveLine();
  }

  private async _scrollToActiveLine() {
    const codeBlock = this._codeBlock!;
    await codeBlock.updateComplete;

    const activeLine = codeBlock.getFirstActiveLine();
    if (!activeLine) return;

    const scrollContainer = codeBlock.getScrollContainer();
    if (!scrollContainer) return;

    const containerRect = scrollContainer.getBoundingClientRect();
    const lineRect = activeLine.getBoundingClientRect();

    // Scroll to center the active line in the pre container
    const target = Math.max(
      0,
      lineRect.top -
        containerRect.top +
        scrollContainer.scrollTop -
        scrollContainer.clientHeight / 2 +
        lineRect.height / 2,
    );
    this._smoothScroll(scrollContainer, target, 1000);
  }

  private _scrollAnimation: number | null = null;

  private _smoothScroll(el: Element, to: number, duration: number) {
    if (this._scrollAnimation) cancelAnimationFrame(this._scrollAnimation);

    const start = el.scrollTop;
    const distance = to - start;
    if (Math.abs(distance) < 1) return;

    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - t, 3);
      el.scrollTop = start + distance * ease;
      if (t < 1) {
        this._scrollAnimation = requestAnimationFrame(step);
      } else {
        this._scrollAnimation = null;
      }
    };

    this._scrollAnimation = requestAnimationFrame(step);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._sectionObserver?.disconnect();
    window.removeEventListener("resize", this._onResize);
  }

  render() {
    return html`
      <div class="container">
        <div class="prose">
          <slot name="prose"></slot>
        </div>
        <div class="code">
          <slot name="code"></slot>
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    .container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      align-items: start;
    }

    .prose {
      grid-column: 1;
      /* Scroll padding so code sticks before first section activates,
         and last section stays active before code unsticks */
      padding-block: 20vh 40vh;
    }

    .code {
      grid-column: 2;
      position: sticky;
      top: 10vh;
    }

    ::slotted([slot="code"]) {
      --code-max-height: 80vh;
      --code-padding-bottom: 50vh;
    }

    @media (max-width: 900px) {
      .container {
        display: flex;
        flex-direction: column-reverse;
        gap: 0;
      }

      .prose {
        padding-block: 10vh 20vh;
        padding-inline: 1rem;
      }

      ::slotted([slot="code"]) {
        --code-max-height: 35vh;
        --code-padding-bottom: 30vh;
        --code-border-radius: 0;
      }

      .code {
        position: sticky;
        top: 0;
        z-index: 1;
        width: 100%;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "scroll-explain": ScrollExplain;
  }
}
