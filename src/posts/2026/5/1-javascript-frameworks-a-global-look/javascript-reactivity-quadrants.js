/**
 * javascript-reactivity-quadrants.js
 *
 * Usage:
 *   <script src="javascript-reactivity-quadrants.js"></script>
 *   <javascript-reactivity-quadrants></javascript-reactivity-quadrants>
 *
 * Or as a module:
 *   <script type="module" src="javascript-reactivity-quadrants.js"></script>
 *   <javascript-reactivity-quadrants></javascript-reactivity-quadrants>
 *
 * The element is fully self-contained via shadow DOM.
 * Override CSS custom properties on the host to retheme:
 *   javascript-reactivity-quadrants {
 *     --text-primary: #000;
 *     --popover-bg: #fff;
 *   }
 */

(function () {
  "use strict";

  /* ── Font injection ─────────────────────────────────────────
     Loads DM Sans + DM Mono once per page. Safe to call
     multiple times — guarded by the data attribute check.
  ──────────────────────────────────────────────────────────── */
  if (!document.querySelector("link[data-jrq-fonts]")) {
    const preconnect = document.createElement("link");
    preconnect.rel = "preconnect";
    preconnect.href = "https://fonts.googleapis.com";
    preconnect.setAttribute("data-jrq-fonts", "");
    document.head.appendChild(preconnect);

    const fonts = document.createElement("link");
    fonts.rel = "stylesheet";
    fonts.href =
      "https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;1,400&family=DM+Mono:wght@400;500&display=swap";
    document.head.appendChild(fonts);
  }

  /* ═══════════════════════════════════════════════════════════
     FRAMEWORK DATA
     Each entry defines chart position, classification, and the
     rationale for its placement on the two axes.
  ═══════════════════════════════════════════════════════════ */
  const FRAMEWORKS = [
    {
      id: "react",
      name: "React (useState)",
      cx: 130,
      cy: 456,
      color: "#378ADD",
      granularity: "coarse",
      depth: "shallow",
      pushPull: "pull",
      desc: "Component-level re-renders triggered by setState. React schedules a render and re-reads state top-down — a pull model. Reference equality means nested objects must be fully replaced to signal a change; there is no tracking into object contents.",
    },
    {
      id: "redux",
      name: "Redux / Zustand",
      cx: 200,
      cy: 413,
      color: "#378ADD",
      granularity: "coarse",
      depth: "shallow",
      pushPull: "pull",
      desc: "Store subscriptions trigger component re-renders via selector equality checks. Selectors are pulled during each render cycle. Shallow comparison means object references — not contents — determine whether a component re-renders.",
    },
    {
      id: "lit",
      name: "Lit",
      cx: 152,
      cy: 480,
      color: "#378ADD",
      granularity: "coarse",
      depth: "shallow",
      pushPull: "pull",
      desc: "@property() and @state() decorators schedule a microtask-batched re-render when a property changes via ===. No cross-component awareness — each element manages its own update cycle. lit-html's part-based diffing is efficient within a render, but the trigger is always coarse.",
    },
    {
      id: "preact",
      name: "Preact",
      cx: 240,
      cy: 465,
      color: "#378ADD",
      granularity: "coarse",
      depth: "shallow",
      pushPull: "pull",
      desc: "Near-identical to React's useState model: virtual DOM diffing, component-level re-renders on state change. Slightly more aggressive about bailing out of unchanged subtrees, but the same fundamental pull-on-render model. Without signals, it occupies the same quadrant as React.",
    },
    {
      id: "angular-zone",
      name: "Angular (Zone.js)",
      cx: 115,
      cy: 196,
      color: "#AF6485",
      granularity: "coarse",
      depth: "deep",
      pushPull: "push-leaning",
      desc: "Zone.js monkey-patches every async browser API to push a change detection tick when any callback fires. Angular then deep-scans the entire component tree. Uniquely, it cannot distinguish meaningful state changes from irrelevant async noise — a heartbeat or a resolved Promise triggers the same full tree walk.",
    },
    {
      id: "react-immer",
      name: "React + Immer",
      cx: 172,
      cy: 166,
      color: "#378ADD",
      granularity: "coarse",
      depth: "deep",
      pushPull: "pull",
      desc: "Immer's produce() uses a Proxy draft to track all mutations deeply during construction, then yields a structurally-shared immutable result. The result is still delivered to React as a reference swap — deep in construction, shallow in delivery. The render remains a coarse pull.",
    },
    {
      id: "svelte4",
      name: "Svelte 4",
      cx: 412,
      cy: 447,
      color: "#D85A30",
      granularity: "fine",
      depth: "shallow",
      pushPull: "push",
      desc: "The Svelte compiler transforms reactive variable assignments into direct DOM update calls at build time — the only framework here that is genuinely pure push. No runtime reactive system. Mutating an object property without reassigning the variable does not trigger an update, making it shallow despite its apparent simplicity.",
    },
    {
      id: "vue-ref",
      name: "Vue ref()",
      cx: 466,
      cy: 432,
      color: "#7F77DD",
      granularity: "fine",
      depth: "shallow",
      pushPull: "push-pull",
      desc: "A single reactive container that pushes a dirty signal when .value changes, then lazily re-evaluates dependents when read in a reactive context. Fine-grained and precise, but tracks only the top-level scalar value. For deep object tracking, Vue provides reactive() instead.",
    },
    {
      id: "solid-signal",
      name: "Solid (signal)",
      cx: 578,
      cy: 456,
      color: "#7F77DD",
      granularity: "fine",
      depth: "shallow",
      pushPull: "push-pull",
      desc: "createSignal is among the most fine-grained primitives on this chart — a getter/setter pair with individual subscriber tracking at the JSX node level. Push the dirty notification, pull the value on read. Zero overhead for unchanged signals. The foundation everything else in Solid builds on.",
    },
    {
      id: "preact-signals",
      name: "Preact + signals",
      cx: 612,
      cy: 432,
      color: "#7F77DD",
      granularity: "fine",
      depth: "shallow",
      pushPull: "push-pull",
      desc: "@preact/signals can update DOM text nodes and attributes directly, bypassing the component render cycle entirely. A signal read inside JSX wires a subscription straight to that DOM node — potentially the most granular delivery mechanism on this chart. Still shallow: signals hold scalar values.",
    },
    {
      id: "ember-octane",
      name: "Ember (Octane)",
      cx: 443,
      cy: 462,
      color: "#7F77DD",
      granularity: "fine",
      depth: "shallow",
      pushPull: "push-pull",
      desc: "Glimmer's @tracked decorator uses getter interception to auto-build a reactive dependency graph. The Octane rewrite moved Ember from the center of the chart to the fine+shallow signals cluster — same push-pull hybrid as Vue ref() and Solid signals. The migration arrow on the chart shows this trajectory from classic KVO.",
    },
    {
      id: "svelte5",
      name: "Svelte 5 ($state)",
      cx: 412,
      cy: 192,
      color: "#7F77DD",
      granularity: "fine",
      depth: "deep",
      pushPull: "push-pull",
      desc: "Svelte 5's $state rune uses a Proxy to enable deep reactivity — a vertical jump from Svelte 4 on this chart without changing horizontal position. Property access inside reactive contexts builds a precise dependency graph. The change from 4 to 5 is purely a depth upgrade: assignment-only tracking becomes full proxy traversal.",
    },
    {
      id: "vue-reactive",
      name: "Vue reactive()",
      cx: 488,
      cy: 148,
      color: "#7F77DD",
      granularity: "fine",
      depth: "deep",
      pushPull: "push-pull",
      desc: "A recursive Proxy that intercepts property access at every nesting level, building a fine-grained dependency graph on the fly. Only the exact paths you read get tracked. Push dirty on mutation, pull lazily on read — but tracking extends as deep as the object graph goes.",
    },
    {
      id: "mobx",
      name: "MobX",
      cx: 510,
      cy: 88,
      color: "#AF6485",
      granularity: "fine",
      depth: "deep",
      pushPull: "push-leaning",
      desc: "MobX makes objects observable via Proxy and runs reactions eagerly when dependencies change. autorun callbacks fire synchronously on mutation — closer to push than any other deep tracker here. The observable graph is comprehensive: nested objects, arrays, and maps are all tracked automatically. computed values are lazy (pull), but the dominant delivery model is push, distinguishing MobX from the balanced push-pull cluster.",
    },
    {
      id: "valtio",
      name: "Valtio",
      cx: 548,
      cy: 118,
      color: "#7F77DD",
      granularity: "fine",
      depth: "deep",
      pushPull: "push-pull",
      desc: "Valtio wraps objects in a Proxy to track mutations, then delivers changes to React via snapshot comparison. The tracking side is push — mutations are intercepted immediately. But the delivery side is pull — Valtio notifies React that something changed, and React schedules a re-render that pulls a new snapshot via useSnapshot(). This push-track / pull-deliver split makes it genuinely push-pull, and slightly less aggressive than MobX's fully synchronous reaction model.",
    },
    {
      id: "solid-store",
      name: "Solid (store)",
      cx: 560,
      cy: 148,
      color: "#7F77DD",
      granularity: "fine",
      depth: "deep",
      pushPull: "push-pull",
      desc: "createStore wraps objects in a Proxy and lazily creates signal nodes on first property access. Only paths you actually read get wired up — the signal tree is built from runtime access patterns, not object structure. setStore notifies exactly the affected signal node, making this the most precise deep tracker on the chart.",
    },
    {
      id: "nanostores",
      name: "nanostores",
      cx: 370,
      cy: 377,
      color: "#AF6485",
      granularity: "fine",
      depth: "shallow",
      pushPull: "push-leaning",
      desc: 'atom() is a push-subscribe primitive: set() notifies all subscribers immediately. map() adds key-level subscriptions. deepMap() enables dot-path subscriptions like "user.address.city". Unlike proxy-based systems, you declare paths explicitly rather than tracking access automatically. Shown as a range marker because depth depends on which primitive you use.',
    },
    {
      id: "wc-services",
      name: "wc-services",
      cx: 210,
      cy: 238,
      color: "#AF6485",
      granularity: "coarse",
      depth: "medium",
      pushPull: "push-leaning",
      desc: "Service-oriented state management for web components. Notifications fire at the service level — subscribers know the service changed but not which specific property, making it coarse-grained. Depth is manual: no Proxy-based auto-tracking, but since you control when to notify, you can fire after deep mutations. This puts it between shallow (reference equality) and deep (automatic traversal) — closer to Ember classic's declared-deps model than to signal primitives.",
    },
    {
      id: "ember-classic",
      name: "Ember (classic)",
      cx: 290,
      cy: 248,
      color: "#5B7ADD",
      granularity: "medium",
      depth: "medium",
      pushPull: "pull-leaning",
      desc: 'Ember\'s KVO (Key-Value Observing) system requires explicit computed property declarations with dependency paths: computed("user.address.city", function(){...}). Invalidation is push but re-evaluation waits for a render. You get precision only where you explicitly declare it — neither fully coarse nor fine, neither fully shallow nor deep. Uniquely occupies the center of the chart.',
    },
    {
      id: "event-bus",
      name: "Event bus",
      cx: 548,
      cy: 480,
      color: "#D85A30",
      shape: "diamond",
      granularity: "fine",
      depth: "shallow",
      pushPull: "push",
      desc: 'A publish-subscribe primitive: named events fire and subscribers are called synchronously. No state is held, no tracking occurs — the event bus is the raw material many frameworks on this chart are built on. Granularity is entirely developer-defined (a coarse "state-changed" or a fine "user.address.city.changed"). The only entry here that holds no state at all, which is why it gets a different shape.',
    },
    {
      id: "rxjs",
      name: "RxJS",
      cx: 508,
      cy: 494,
      color: "#AF6485",
      granularity: "fine",
      depth: "shallow",
      pushPull: "push-leaning",
      desc: "Observable streams push values to subscribers when they emit. Fine-grained subscriptions (each Observable is its own channel) but shallow by default — operators like pluck() or map() let you project into nested structure, but the library does not auto-track property access. Cold Observables have a lazy initialization phase that resembles pull, but once subscribed all emission is push. BehaviorSubject and Subject patterns tip it firmly toward push-leaning.",
    },
    {
      id: "cyclejs",
      name: "Cycle.js",
      cx: 598,
      cy: 492,
      color: "#D85A30",
      granularity: "fine",
      depth: "shallow",
      pushPull: "push",
      desc: "A functional reactive framework where the entire application is a cycle of Observable streams: intent (user input) → model (state) → view (DOM). Built on RxJS or xstream, it is fundamentally push — streams propagate values downstream immediately with no lazy pull phase. Like RxJS it is shallow: objects flow through streams as-is with no automatic nested property tracking. Sits near Svelte 4 on the push axis but with stream-composition rather than compiled assignments.",
    },
    {
      id: "xstate",
      name: "XState",
      cx: 300,
      cy: 460,
      color: "#AF6485",
      granularity: "medium",
      depth: "shallow",
      pushPull: "push-leaning",
      desc: "Models application behavior as explicit state machines and statecharts. The subscription unit is the actor (machine) — subscribers receive the full state snapshot on every transition, making it coarser than signal primitives but more precise than component-level re-renders. You always know exactly which state transition occurred. Context (extended state) uses explicit assign() calls with no Proxy-based auto-tracking, keeping it shallow. The machine pushes new snapshots to subscribers synchronously on each transition.",
    },
  ];

  /* ── Badge class maps ───────────────────────────────────── */
  const GRAN_CLASS = {
    coarse: "b-coarse",
    medium: "b-medium-g",
    fine: "b-fine",
  };
  const DEPTH_CLASS = {
    shallow: "b-shallow",
    medium: "b-medium-d",
    deep: "b-deep",
  };
  const PP_CLASS = {
    pull: "b-pull",
    "pull-leaning": "b-pull-lean",
    "push-pull": "b-pushpull",
    "push-leaning": "b-push-lean",
    push: "b-push",
  };

  /* ═══════════════════════════════════════════════════════════
     SHADOW DOM STYLES
  ═══════════════════════════════════════════════════════════ */
  const STYLES = `
    :host {
      display: block;
      font-family: 'DM Sans', system-ui, sans-serif;
      --font-mono: 'DM Mono', ui-monospace, monospace;
      --text-primary:     #1a1918;
      --text-secondary:   #6b6a65;
      --border-primary:   #b8b7af;
      --border-secondary: #d0cfc7;
      --border-tertiary:  #e6e5dc;
      --shadow:           rgba(0,0,0,0.08);
      --popover-bg:       #ffffff;
    }
    @media (prefers-color-scheme: dark) {
      :host {
        --text-primary:     #f2f1eb;
        --text-secondary:   #cccbbf;
        --border-primary:   #585550;
        --border-secondary: #423f3c;
        --border-tertiary:  #343230;
        --shadow:           rgba(0,0,0,0.45);
        --popover-bg:       #2a2927;
      }
    }
    /* Mirror dark-mode tokens when the site's manual theme toggle is set */
    :host-context([data-theme="dark"]) {
      --text-primary:     #f2f1eb;
      --text-secondary:   #cccbbf;
      --border-primary:   #585550;
      --border-secondary: #423f3c;
      --border-tertiary:  #343230;
      --shadow:           rgba(0,0,0,0.45);
      --popover-bg:       #2a2927;
    }

    .wrap { position: relative; }
    svg { display: block; width: 100%; overflow: visible; }

    svg text { font-family: 'DM Sans', system-ui, sans-serif; }
    svg text.ts { font-size: 12px; fill: var(--text-secondary); }

    /* In dark mode, framework labels read better at full primary brightness */
    @media (prefers-color-scheme: dark) {
      svg text.fw-label { fill: var(--text-primary); }
    }
    :host-context([data-theme="dark"]) svg text.fw-label {
      fill: var(--text-primary);
    }

    /* Label highlights when its dot is hovered or focused */
    text.fw-label { transition: fill 0.1s; }
    text.fw-label.label-active {
      font-weight: 600;
      fill: var(--text-primary);
    }

    /* Boost faint opacity labels in dark mode — CSS overrides SVG presentation attrs */
    @media (prefers-color-scheme: dark) {
      text.ts[opacity="0.4"] { opacity: 0.95; }
      text.ts[opacity="0.5"] { opacity: 0.95; }
    }
    :host-context([data-theme="dark"]) text.ts[opacity="0.4"] { opacity: 0.95; }
    :host-context([data-theme="dark"]) text.ts[opacity="0.5"] { opacity: 0.95; }

    /* ── Dots ───────────────────────────── */
    .dot-group { cursor: pointer; outline: none; }
    .dot-ring  { opacity: 0; transition: opacity 0.12s ease; }
    .dot-circle {
      transform-box: fill-box;
      transform-origin: center;
      transition: transform 0.12s ease;
    }
    .dot-group:hover .dot-ring,
    .dot-group:focus-visible .dot-ring  { opacity: 1; }
    .dot-group:hover .dot-circle,
    .dot-group:focus-visible .dot-circle { transform: scale(1.5); }
    .dot-group:focus-visible .dot-ring  { stroke-dasharray: 3 2; }

    /* ── Popover ────────────────────────── */
    .popover {
      position: absolute;
      width: 264px;
      background: var(--popover-bg);
      border: 1px solid var(--border-primary);
      border-radius: 8px;
      box-shadow: 0 4px 16px var(--shadow), 0 1px 3px var(--shadow);
      padding: 14px 16px 16px;
      z-index: 10;
      animation: pop-in 0.14s ease;
    }
    .popover[hidden] { display: none; }
    @keyframes pop-in {
      from { opacity: 0; transform: scale(0.95) translateY(-4px); }
      to   { opacity: 1; transform: scale(1)    translateY(0); }
    }

    .popover-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
    }
    .popover-dot {
      order: 1;
      flex-shrink: 0;
      border-radius: 50%;
      width: 8px;
      height: 8px;
    }
    .popover-title {
      order: 2;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-primary);
      flex: 1;
      font-family: var(--font-mono);
      letter-spacing: -0.01em;
    }
    .popover-close {
      order: 3;
      margin-left: auto;
      flex-shrink: 0;
      background: none;
      border: 1px solid var(--border-primary);
      border-radius: 4px;
      color: var(--text-secondary);
      cursor: pointer;
      font-size: 14px;
      line-height: 1;
      padding: 2px 5px;
      transition: background 0.1s, color 0.1s;
    }
    .popover-close:hover {
      background: var(--border-tertiary);
      color: var(--text-primary);
    }
    .popover-close:focus-visible {
      outline: 2px solid var(--border-primary);
      outline-offset: 1px;
    }

    .popover-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-bottom: 10px;
    }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      color: var(--text-primary);
      font-family: var(--font-mono);
    }
    .b-coarse    { background: rgba(216, 90, 48, 0.13); }
    .b-medium-g  { background: rgba(136,135,128, 0.15); }
    .b-fine      { background: rgba( 55,138,221, 0.13); }
    .b-shallow   { background: rgba(136,135,128, 0.09); }
    .b-medium-d  { background: rgba(136,135,128, 0.16); }
    .b-deep      { background: rgba( 80, 79, 76, 0.14); }
    .b-pull      { background: rgba( 55,138,221, 0.16); }
    .b-pull-lean { background: rgba( 91,122,221, 0.16); }
    .b-pushpull  { background: rgba(127,119,221, 0.16); }
    .b-push-lean { background: rgba(175,100,133, 0.16); }
    .b-push      { background: rgba(216, 90, 48, 0.16); }

    /* More opaque badges in dark mode for legibility */
    @media (prefers-color-scheme: dark) {
      .b-coarse    { background: rgba(216, 90, 48, 0.28); }
      .b-medium-g  { background: rgba(180,178,168, 0.20); }
      .b-fine      { background: rgba( 55,138,221, 0.28); }
      .b-shallow   { background: rgba(180,178,168, 0.14); }
      .b-medium-d  { background: rgba(180,178,168, 0.22); }
      .b-deep      { background: rgba(160,158,154, 0.22); }
      .b-pull      { background: rgba( 55,138,221, 0.30); }
      .b-pull-lean { background: rgba( 91,122,221, 0.30); }
      .b-pushpull  { background: rgba(127,119,221, 0.30); }
      .b-push-lean { background: rgba(175,100,133, 0.30); }
      .b-push      { background: rgba(216, 90, 48, 0.30); }
    }

    /* Quadrant tints — doubles opacity in dark mode to define zones */
    .qt-bl { fill: rgba(216, 90, 48, 0.06); }
    .qt-tl { fill: rgba(186,117, 23, 0.06); }
    .qt-br { fill: rgba( 55,138,221, 0.06); }
    .qt-tr { fill: rgba( 29,158,117, 0.06); }
    @media (prefers-color-scheme: dark) {
      .qt-bl { fill: rgba(216, 90, 48, 0.13); }
      .qt-tl { fill: rgba(186,117, 23, 0.13); }
      .qt-br { fill: rgba( 55,138,221, 0.13); }
      .qt-tr { fill: rgba( 29,158,117, 0.13); }
    }

    .popover-desc {
      font-size: 12px;
      line-height: 1.6;
      color: var(--text-secondary);
    }

    /* ── Mobile ─────────────────────────────────────────────
       Below 540px the SVG is small enough that labels crowd
       and dots become tiny. We hide labels (the popover still
       shows the name), scale dots up for fat-finger tapping,
       and snap the popover to the bottom of the component so
       it always has room to breathe.
    ──────────────────────────────────────────────────────── */
    @media (max-width: 540px) {
      /* Larger dots — easier to see and tap */
      circle.dot-circle { r: 8px; }
      circle.dot-ring   { r: 14px; }
      circle.dot-hit    { r: 22px; }
      path.dot-circle   { transform: scale(1.5); }
      path.dot-ring     { transform: scale(1.4); }
      .dot-group:hover .dot-circle,
      .dot-group:focus-visible .dot-circle { transform: scale(1.4); }

      /* Snap popover to bottom of component */
      .popover.is-mobile {
        left: 8px;
        right: 8px;
        bottom: 4px;
        top: auto;
        width: auto;
        max-height: 44vh;
        overflow-y: auto;
      }
    }
  `;

  /* ═══════════════════════════════════════════════════════════
     CUSTOM ELEMENT
  ═══════════════════════════════════════════════════════════ */
  class JavascriptReactivityQuadrants extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._activeDot = null;
      this._escHandler = null;
      this._activePopoverId = null;
    }

    connectedCallback() {
      this.shadowRoot.innerHTML = `
        <style>${STYLES}</style>
        <div class="wrap">
          ${this._buildSVG()}
          <div class="popover" hidden
               role="dialog" aria-modal="true"
               aria-label="Framework details"></div>
        </div>
      `;
      this._bindEvents();
    }

    /* ── SVG ──────────────────────────────────────────────── */
    _buildSVG() {
      const dotGroups = FRAMEWORKS.map((fw) => {
        const isDiamond = fw.shape === "diamond";
        // Diamond path: rotated square centered at (cx,cy) with half-size s
        const ds = 7,
          dr = 11; // visual half-size, ring half-size
        const diamond = (s) =>
          `M ${fw.cx} ${fw.cy - s} L ${fw.cx + s} ${fw.cy} L ${fw.cx} ${fw.cy + s} L ${fw.cx - s} ${fw.cy} Z`;

        const visual = isDiamond
          ? `
          <path class="dot-ring"   d="${diamond(dr)}" fill="none" stroke="${fw.color}" stroke-width="1.5"/>
          <path class="dot-circle" d="${diamond(ds)}" fill="${fw.color}"/>
        `
          : `
          <circle class="dot-ring"   cx="${fw.cx}" cy="${fw.cy}" r="9"
                  fill="none" stroke="${fw.color}" stroke-width="1.5"/>
          <circle class="dot-circle" cx="${fw.cx}" cy="${fw.cy}" r="5" fill="${fw.color}"/>
        `;

        return `
        <g class="dot-group"
           data-id="${fw.id}"
           tabindex="0"
           role="button"
           aria-label="${fw.name}: ${fw.granularity} granularity, ${fw.depth} depth, ${fw.pushPull}. Press Enter for details.">
          <circle class="dot-hit" cx="${fw.cx}" cy="${fw.cy}" r="14" fill="transparent"/>
          ${visual}
        </g>`;
      }).join("");

      return `
      <svg viewBox="0 0 680 610" role="img"
           aria-label="JS framework state tracking chart. Click or press Enter on any dot for details.">

        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5"
                  markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke"
                  stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </marker>
        </defs>

        <!-- Quadrant tints -->
        <rect class="qt-bl" x="80"  y="280" width="270" height="220"/>
        <rect class="qt-tl" x="80"  y="60"  width="270" height="220"/>
        <rect class="qt-br" x="350" y="280" width="270" height="220"/>
        <rect class="qt-tr" x="350" y="60"  width="270" height="220"/>

        <!-- Grid -->
        <line x1="188" y1="60"  x2="188" y2="500" stroke="var(--border-tertiary)" stroke-width="0.5"/>
        <line x1="296" y1="60"  x2="296" y2="500" stroke="var(--border-tertiary)" stroke-width="0.5"/>
        <line x1="404" y1="60"  x2="404" y2="500" stroke="var(--border-tertiary)" stroke-width="0.5"/>
        <line x1="512" y1="60"  x2="512" y2="500" stroke="var(--border-tertiary)" stroke-width="0.5"/>
        <line x1="80"  y1="170" x2="620" y2="170" stroke="var(--border-tertiary)" stroke-width="0.5"/>
        <line x1="80"  y1="390" x2="620" y2="390" stroke="var(--border-tertiary)" stroke-width="0.5"/>

        <!-- Center dividers -->
        <line x1="350" y1="55"  x2="350" y2="505"
              stroke="var(--border-secondary)" stroke-width="1" stroke-dasharray="4 3"/>
        <line x1="75"  y1="280" x2="625" y2="280"
              stroke="var(--border-secondary)" stroke-width="1" stroke-dasharray="4 3"/>

        <!-- Frame -->
        <rect x="80" y="60" width="540" height="440"
              fill="none" stroke="var(--border-primary)" stroke-width="0.5"/>

        <!-- Quadrant labels -->
        <text class="ts" x="92"  y="76"  opacity="0.4">wholesale discovery</text>
        <text class="ts" x="92"  y="296" opacity="0.4">diffing</text>
        <text class="ts" x="358" y="76"  opacity="0.4">reactive graphs</text>
        <text class="ts" x="358" y="296" opacity="0.4">atomic primitives</text>

        <!-- Framework labels (hidden on mobile via .fw-label) -->
        <text class="ts fw-label" data-fw="react"          x="140" y="452">React (useState)</text>
        <text class="ts fw-label" data-fw="redux"          x="210" y="409">Redux / Zustand</text>
        <text class="ts fw-label" data-fw="lit"            x="162" y="476">Lit</text>
        <text class="ts fw-label" data-fw="preact"         x="250" y="461">Preact</text>
        <text class="ts fw-label" data-fw="angular-zone"   x="125" y="192">Angular (Zone.js)</text>
        <text class="ts fw-label" data-fw="react-immer"    x="182" y="162">React + Immer</text>
        <text class="ts fw-label" data-fw="svelte4"        x="412" y="469" text-anchor="middle">Svelte 4</text>
        <text class="ts fw-label" data-fw="vue-ref"        x="466" y="418" text-anchor="middle">Vue ref()</text>
        <text class="ts fw-label" data-fw="solid-signal"   x="578" y="472" text-anchor="middle">Solid (signal)</text>
        <text class="ts fw-label" data-fw="preact-signals" x="602" y="418" text-anchor="end">Preact + signals</text>
        <text class="ts fw-label" data-fw="ember-octane"   x="453" y="458">Ember (Octane)</text>
        <text class="ts fw-label" data-fw="svelte5"        x="422" y="188">Svelte 5 ($state)</text>
        <text class="ts fw-label" data-fw="vue-reactive"   x="488" y="164" text-anchor="middle">Vue reactive()</text>
        <text class="ts fw-label" data-fw="mobx"           x="500" y="84"  text-anchor="end">MobX</text>
        <text class="ts fw-label" data-fw="valtio"         x="558" y="98"  text-anchor="middle">Valtio</text>
        <text class="ts fw-label" data-fw="solid-store"    x="560" y="134" text-anchor="middle">Solid (store)</text>
        <text class="ts fw-label" data-fw="nanostores"     x="382" y="371" text-anchor="start">nanostores</text>
        <text class="ts fw-label" data-fw="nanostores"     x="382" y="383" text-anchor="start" opacity="0.5">(atom → deepMap)</text>
        <text class="ts fw-label" data-fw="wc-services"    x="220" y="234">wc-services</text>
        <text class="ts fw-label" data-fw="ember-classic"  x="300" y="244">Ember (classic)</text>
        <text class="ts fw-label" data-fw="ember-classic"  x="300" y="257" opacity="0.5">declared deps</text>
        <text class="ts fw-label" data-fw="event-bus"      x="548" y="497" text-anchor="middle">Event bus</text>
        <text class="ts fw-label" data-fw="rxjs"           x="498" y="490" text-anchor="end">RxJS</text>
        <text class="ts fw-label" data-fw="cyclejs"        x="608" y="488" text-anchor="start">Cycle.js</text>
        <text class="ts fw-label" data-fw="xstate"         x="310" y="456" text-anchor="start">XState</text>

        <!-- Nanostores range marker -->
        <line x1="370" y1="310" x2="370" y2="445"
              stroke="#AF6485" stroke-width="2" stroke-dasharray="3 2" opacity="0.6"
              pointer-events="none"/>
        <circle cx="370" cy="445" r="4" fill="none" stroke="#AF6485"
                stroke-width="1.5" opacity="0.7" pointer-events="none"/>
        <circle cx="370" cy="310" r="4" fill="none" stroke="#AF6485"
                stroke-width="1.5" opacity="0.7" pointer-events="none"/>

        <!-- Ember migration arrow -->
        <path d="M 303 251 Q 390 340 438 457"
              fill="none" stroke="var(--border-secondary)"
              stroke-width="1" stroke-dasharray="4 3" opacity="0.5"
              marker-end="url(#arr)" pointer-events="none"/>

        <!-- Interactive dot groups -->
        ${dotGroups}

        <!-- Axes -->
        <line x1="100" y1="525" x2="595" y2="525"
              stroke="var(--text-secondary)" stroke-width="1"
              marker-start="url(#arr)" marker-end="url(#arr)"/>
        <line x1="44"  y1="495" x2="44"  y2="85"
              stroke="var(--text-secondary)" stroke-width="1"
              marker-start="url(#arr)" marker-end="url(#arr)"/>
        <text class="ts" x="82"  y="542">coarse-grained</text>
        <text class="ts" x="618" y="542" text-anchor="end">fine-grained</text>
        <text class="ts" x="40"  y="514" text-anchor="middle">shallow</text>
        <text class="ts" x="40"  y="72"  text-anchor="middle">deep</text>

        <!-- Push/pull legend -->
        <line x1="155" y1="592" x2="525" y2="592"
              stroke="var(--border-tertiary)" stroke-width="0.5"/>
        <circle cx="155" cy="592" r="5" fill="#378ADD"/>
        <text class="ts" x="155" y="582" text-anchor="middle">pull</text>
        <circle cx="247" cy="592" r="4" fill="#5B7ADD"/>
        <circle cx="340" cy="592" r="5" fill="#7F77DD"/>
        <text class="ts" x="340" y="582" text-anchor="middle">push-pull</text>
        <circle cx="433" cy="592" r="4" fill="#AF6485"/>
        <circle cx="525" cy="592" r="5" fill="#D85A30"/>
        <text class="ts" x="525" y="582" text-anchor="middle">push</text>

      </svg>`;
    }

    /* ── Events ───────────────────────────────────────────── */
    _bindEvents() {
      const shadow = this.shadowRoot;

      shadow.querySelectorAll(".dot-group").forEach((group) => {
        const fw = FRAMEWORKS.find((f) => f.id === group.dataset.id);
        if (!fw) return;
        group.addEventListener("click", () => this._showPopover(fw, group));
        group.addEventListener("mouseenter", () =>
          this._setLabelActive(fw.id, true),
        );
        group.addEventListener("mouseleave", () =>
          this._setLabelActive(fw.id, false),
        );
        group.addEventListener("focus", () =>
          this._setLabelActive(fw.id, true),
        );
        group.addEventListener("blur", () =>
          this._setLabelActive(fw.id, false),
        );
        group.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            this._showPopover(fw, group);
          }
        });
      });

      // Click outside popover to close
      shadow.querySelector(".wrap").addEventListener("pointerdown", (e) => {
        const popover = shadow.querySelector(".popover");
        if (popover.hidden) return;
        if (!e.composedPath().includes(popover)) this._hidePopover();
      });
    }

    /* ── Label highlight ──────────────────────────────────── */
    _setLabelActive(id, on) {
      this.shadowRoot
        .querySelectorAll(`text.fw-label[data-fw="${id}"]`)
        .forEach((t) => t.classList.toggle("label-active", on));
    }

    /* ── Popover: show ────────────────────────────────────── */
    _showPopover(fw, dotGroup) {
      const shadow = this.shadowRoot;
      const popover = shadow.querySelector(".popover");
      const svg = shadow.querySelector("svg");
      const wrap = shadow.querySelector(".wrap");

      const isMobile = wrap.offsetWidth <= 540;

      popover.hidden = false;
      popover.innerHTML = this._popoverHTML(fw);
      this._activeDot = dotGroup;
      this._activePopoverId = fw.id;
      this._setLabelActive(fw.id, true);
      if (isMobile) {
        // Snap to bottom of component — reliable on any phone width
        popover.classList.add("is-mobile");
        popover.style.left = "";
        popover.style.top = "";
        popover.style.right = "";
        popover.style.bottom = "";
      } else {
        popover.classList.remove("is-mobile");

        // Convert SVG user-space coords → px coords relative to .wrap
        const svgRect = svg.getBoundingClientRect();
        const wrapRect = wrap.getBoundingClientRect();
        const vb = svg.viewBox.baseVal;
        const scaleX = svgRect.width / vb.width;
        const scaleY = svgRect.height / vb.height;

        const px = svgRect.left - wrapRect.left + fw.cx * scaleX;
        const py = svgRect.top - wrapRect.top + fw.cy * scaleY;
        const popW = 264;
        const wrapW = wrap.offsetWidth;
        const offset = 18;

        let left = px + offset;
        if (left + popW > wrapW - 8) left = px - popW - offset;
        if (left < 8) left = 8;

        let top = py - 24;
        if (top < 8) top = py + offset;

        popover.style.left = `${left}px`;
        popover.style.top = `${top}px`;
        popover.style.right = "";
        popover.style.bottom = "";
      }

      popover
        .querySelector(".popover-close")
        .addEventListener("click", () => this._hidePopover());
      popover.querySelector(".popover-close").focus();

      this._escHandler = (e) => {
        if (e.key === "Escape") this._hidePopover();
      };
      document.addEventListener("keydown", this._escHandler);
    }

    /* ── Popover: hide ────────────────────────────────────── */
    _hidePopover() {
      const popover = this.shadowRoot.querySelector(".popover");
      popover.hidden = true;
      if (this._activePopoverId) {
        this._setLabelActive(this._activePopoverId, false);
        this._activePopoverId = null;
      }
      if (this._escHandler) {
        document.removeEventListener("keydown", this._escHandler);
        this._escHandler = null;
      }
      this._activeDot?.focus();
      this._activeDot = null;
    }

    /* ── Popover: content ─────────────────────────────────── */
    _popoverHTML(fw) {
      const gc = GRAN_CLASS[fw.granularity] || "b-medium-g";
      const dc = DEPTH_CLASS[fw.depth] || "b-medium-d";
      const pc = PP_CLASS[fw.pushPull] || "b-pushpull";
      return `
        <div class="popover-header">
          <button class="popover-close" aria-label="Close popover">×</button>
          <div class="popover-dot" style="background:${fw.color}" aria-hidden="true"></div>
          <span class="popover-title">${fw.name}</span>
        </div>
        <div class="popover-badges">
          <span class="badge ${gc}">${fw.granularity}</span>
          <span class="badge ${dc}">${fw.depth}</span>
          <span class="badge ${pc}">${fw.pushPull}</span>
        </div>
        <p class="popover-desc">${fw.desc}</p>
      `;
    }
  }

  // Guard against double-registration (e.g. if script is loaded twice)
  if (!customElements.get("javascript-reactivity-quadrants")) {
    customElements.define(
      "javascript-reactivity-quadrants",
      JavascriptReactivityQuadrants,
    );
  }
})();
