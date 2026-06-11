/* ============================================================================
   <reactivity-granularity-radar>
   ----------------------------------------------------------------------------
   A self-contained custom element rendering the "granularity as a propagating
   wave" radar chart. Each framework dot is keyboard-focusable; Enter/Space (or
   click/tap) opens a popover with the scope determination, push–pull reading,
   and an analysis of why it sits where it does.

   USAGE (e.g. in an 11ty template/layout):
     <script type="module" src="/js/reactivity-granularity-radar.js"></script>
     <reactivity-granularity-radar></reactivity-granularity-radar>

   THEMING - same convention as the quadrant / table components: override the
   custom properties on the element selector in your own stylesheet, e.g.
     reactivity-granularity-radar {
       --text-primary: #111;
       --popover-bg:   #fff;
       --band-1:       #f6f6f6;
     }
   A prefers-color-scheme: dark block below supplies dark defaults; override
   those the same way if your blog uses a manual theme toggle.
   ========================================================================== */
(function () {
  "use strict";

  /* ── geometry ─────────────────────────────────────────────────────────── */
  // Semicircle (default / wide-screen) layout
  const OX = 470,
    OY = 460,
    ROUT = 410;
  const VBW = 940,
    VBH = 545;

  // ring outer radii, outer → inner
  const RINGS = [
    ["window", "WINDOW", 410],
    ["application", "APPLICATION", 370],
    ["service", "SERVICE", 315],
    ["component", "COMPONENT", 248],
    ["template", "TEMPLATE", 158],
    ["node", "DOM NODE", 92],
  ];
  // mid radius used to place dots within a band
  const MID = {
    window: 390,
    application: 342,
    service: 282,
    component: 203,
    template: 125,
  };

  const pol = (r, deg) => {
    const a = (deg * Math.PI) / 180;
    return [OX + r * Math.cos(a), OY - r * Math.sin(a)];
  };
  const anchorFor = (deg) => {
    const c = Math.cos((deg * Math.PI) / 180);
    return c > 0.3 ? "start" : c < -0.3 ? "end" : "middle";
  };

  /* ── push–pull palette ────────────────────────────────────────────────── */
  const COLOR = {
    pull: "#378ADD",
    "pull-lean": "#5A7FDB",
    pushpull: "#7F77DD",
    "push-lean": "#AF6485",
    push: "#D85A30",
  };
  const PP_LABEL = {
    pull: "pull",
    "pull-lean": "pull-leaning",
    pushpull: "push\u2013pull",
    "push-lean": "push-leaning",
    push: "push",
  };
  const PP_BADGE = {
    pull: "b-pull",
    "pull-lean": "b-pull-lean",
    pushpull: "b-pushpull",
    "push-lean": "b-push-lean",
    push: "b-push",
  };
  const SCOPE_LABEL = {
    window: "Window",
    application: "Application",
    service: "Service",
    component: "Component",
    template: "Template",
    node: "DOM node",
  };

  /* ── frameworks ───────────────────────────────────────────────────────────
     kind: 'arc'   → placed on a band at a given angle
           'list'  → stacked in the DOM-node cluster at the origin (listIndex)
           'range' → nanostores' service↔component span marker
     scope is the *delivery* granularity (the smallest unit re-evaluated),
     which is what the rings encode - not how finely the system tracks.
  ─────────────────────────────────────────────────────────────────────────── */
  const FRAMEWORKS = [
    {
      id: "angular-zone",
      name: "Angular (Zone.js)",
      kind: "arc",
      ring: "window",
      angle: 62,
      pp: "push-lean",
      desc: "Zone.js monkey-patches every global async API to fire a tick whenever anything happens - a Promise resolves, a setTimeout fires, an event listener returns. The tick carries no information about what changed, so Angular compensates by walking the entire component tree and dirty-checking every binding. The notification can\u2019t narrow the search, so detection has to start at the root. Push-leaning: the tick is pushed eagerly, bindings read on the following pass.",
    },

    {
      id: "wc-services",
      name: "wc-services",
      kind: "arc",
      ring: "service",
      angle: 132,
      pp: "push-lean",
      desc: "A service\u2019s notify() pushes to every subscribed consumer, but the notification doesn\u2019t carry which property changed. Each consumer has to investigate and figure out what shifted. Same shape as Redux, one ring in, because a service owns a narrower slice than a global store. Push-leaning: set() notifies subscribers immediately.",
    },

    {
      id: "nanostores",
      name: "nanostores",
      kind: "range",
      angle: 38,
      pp: "push-lean",
      desc: "The primitive sets the detection level. atom() pushes to every subscriber with no key information; map() narrows to per-key subscriptions; deepMap() narrows further to dot-path subscriptions like \"user.address.city\". Unlike proxy-based systems, you declare subscription paths explicitly rather than tracking access automatically. Shown as a range because the primitive choice determines how far the notification travels. Push-leaning: set() pushes to subscribers synchronously.",
    },

    {
      id: "mobx",
      name: "MobX / Valtio",
      kind: "arc",
      ring: "component",
      angle: 25,
      pp: "push-lean",
      desc: "Per-property Proxy tracking knows exactly which observer-component depends on the changed value - no search, no broadcast. But the woken observer is a React component, and React still diffs that component\u2019s output to find the DOM change. Contrast Solid, which eliminates the diff entirely and lands at the node - that\u2019s the line between the two. Push-leaning: reactions run eagerly on mutation.",
    },

    {
      id: "react-immer",
      name: "React + Immer",
      kind: "arc",
      ring: "application",
      angle: 50,
      pp: "pull",
      desc: "Immer deep-tracks mutations inside produce() and hands React a single new reference. React has no per-property tracking and no signal graph - setState just marks a component dirty, and the reconciler re-runs the subtree and diffs the virtual DOM to find the actual change. Deep in construction, broad-reaching at runtime because the cascade plus Context means the system has to look across the subscriber graph. Pull: read on React\u2019s schedule.",
    },

    {
      id: "preact",
      name: "Preact",
      kind: "arc",
      ring: "application",
      angle: 74,
      pp: "pull",
      desc: "Same model as React without signals: a state change re-runs the component and every descendant, and the reconciler diffs the virtual DOM subtree to find what actually shifted. Preact bails out of unchanged subtrees a little more aggressively, but the reach is the subscriber graph, not a single component. Pull: state read during the scheduled render.",
    },

    {
      id: "lit",
      name: "Lit",
      kind: "arc",
      ring: "component",
      angle: 112,
      pp: "pull",
      desc: "A changed @property/@state schedules a batched re-render of that element only; lit-html then diffs its parts to localize the DOM update. There is no cross-component cascade and no global subscription mechanism - each element manages its own update cycle. That genuine element-boundedness is what distinguishes Lit from React on this ring. Pull: values read when the render runs.",
    },

    {
      id: "react",
      name: "React (useState)",
      kind: "arc",
      ring: "application",
      angle: 150,
      pp: "pull",
      desc: "setState marks one component dirty, but React has no per-property tracking to narrow what changed. It re-runs that component and every descendant (unless individually memoized) and diffs the resulting virtual DOM. useContext widens the reach further - a Context change forces every consumer anywhere in the tree to re-check. The smallest unit the system can structurally look at is the subtree, and in practice with Context it\u2019s the whole app. Pull: state read when React schedules the render.",
    },

    {
      id: "redux",
      name: "Redux / Zustand",
      kind: "arc",
      ring: "application",
      angle: 118,
      pp: "pull",
      desc: "A dispatch notifies the store globally and says nothing about which slice changed. Every connected component runs its selector and equality-checks the result to decide whether to re-render. The notification reaches the entire subscriber set - selectors narrow the eventual re-render but every selector still has to run. Pull: selectors pulled each cycle.",
    },

    {
      id: "ember-octane",
      name: "Ember (Octane)",
      kind: "arc",
      ring: "template",
      angle: 50,
      pp: "pushpull",
      desc: "Glimmer\u2019s @tracked auto-tracking knows which template regions read the changed state and re-validates only those, re-rendering the affected bits rather than the whole component. Tag-based validation means consumers pull and check \"has this tag been invalidated since I last read?\" - a lazy variant of dependency tracking. Push-pull: dirty pushed, values pulled lazily on re-render.",
    },

    {
      id: "vue-reactive",
      name: "Vue reactive()",
      kind: "arc",
      ring: "template",
      angle: 120,
      pp: "pushpull",
      desc: "reactive() builds a deep Proxy graph that knows precisely which property changed and which effects depend on it. Vue wakes only the relevant render effect, but the render still re-runs and the template gets diffed against the virtual DOM to apply the change. That diff is what sits Vue one ring out from the signal frameworks that skip it. Push-pull: push dirty, pull on the re-run.",
    },

    {
      id: "vue-ref",
      name: "Vue ref()",
      kind: "arc",
      ring: "template",
      angle: 152,
      pp: "pushpull",
      desc: "A ref wraps a scalar and pushes a precise dirty signal when .value is reassigned (or, for object refs, when a nested property changes via the underlying reactive() proxy). The component render re-runs and the template is diffed to apply the change - same template-bounded behavior as reactive(). Push-pull: push, then lazy pull on read.",
    },

    {
      id: "solid-signal",
      name: "Solid (signal)",
      kind: "list",
      listIndex: 0,
      pp: "pushpull",
      desc: "A signal read inside JSX wires that exact DOM text node or attribute as a subscriber. On write, Solid pushes directly to those bindings and overwrites them. No component re-render, no virtual DOM, no diff - the notification itself carries enough information to eliminate the search. Push-pull: push the dirty flag, pull the value on read.",
    },

    {
      id: "solid-store",
      name: "Solid (store)",
      kind: "list",
      listIndex: 1,
      pp: "pushpull",
      desc: "createStore lazily creates signal nodes on first property access and updates exactly the bindings that read a changed path. Deep tracking via Proxy, zero diffing. Same shape as createSignal - the wiring between state and DOM is precise enough that no scan is needed. Push-pull: push to the affected node, pull on read.",
    },

    {
      id: "preact-signals",
      name: "Preact + signals",
      kind: "list",
      listIndex: 2,
      pp: "pushpull",
      desc: "A signal bound directly in JSX wires straight to a text node or attribute, bypassing the component render and virtual DOM diff entirely. The same primitive opts in to per-binding precision when used directly; it falls back to component-level re-renders if you read .value inside a component body. Push-pull: push the change, pull the value at the binding.",
    },

    {
      id: "svelte5",
      name: "Svelte 5 ($state)",
      kind: "list",
      listIndex: 3,
      pp: "pushpull",
      desc: "The compiler analyzes which template bindings depend on each $state rune and emits direct DOM update statements for exactly those bindings - no runtime diff, no virtual DOM. The rune itself is a Proxy, so deep mutations are tracked, but the resolution from state to DOM happens at compile time. Push-pull: compiled writes are push, but the rune\u2019s lazy read phase nudges it off pure push.",
    },

    {
      id: "svelte4",
      name: "Svelte 4",
      kind: "list",
      listIndex: 4,
      pp: "push",
      desc: "The compiler rewrites reactive assignments into direct DOM update statements at build time. There is no reactive graph, no Proxy, no scan, no diff - just inlined writes. Pure push: no lazy pull phase, the only push-only entry on the chart.",
    },
  ];

  // resolve geometry for each framework (semicircle layout only \u2014 the mobile
  // layout uses HTML-layered rectangles and ignores these coordinates).
  FRAMEWORKS.forEach((fw) => {
    if (fw.kind === "arc") {
      [fw.cx, fw.cy] = pol(MID[fw.ring], fw.angle);
      const [lx, ly] = pol(MID[fw.ring] + 15, fw.angle);
      fw.lx = lx;
      fw.ly = ly + 3.4;
      fw.anchor = anchorFor(fw.angle);
      fw.scope = fw.ring;
    } else if (fw.kind === "list") {
      const yy = OY - 20 - fw.listIndex * 13;
      fw.cx = OX - 52;
      fw.cy = yy - 3;
      fw.lx = OX - 42;
      fw.ly = yy;
      fw.anchor = "start";
      fw.scope = "node";
      fw.small = true;
    } else if (fw.kind === "range") {
      const [dx, dy] = pol(278, fw.angle);
      fw.cx = dx;
      fw.cy = dy;
      const [lx, ly] = pol(320, fw.angle);
      fw.lx = lx;
      fw.ly = ly;
      fw.anchor = "start";
      fw.scope = "service";
      fw.scopeLabel = "Service \u2192 Component";
      [fw.x1, fw.y1] = pol(312, fw.angle);
      [fw.x2, fw.y2] = pol(244, fw.angle);
    }
  });

  /* ── styles ───────────────────────────────────────────────────────────── */
  const STYLES = `
    :host {
      /* shared theming tokens (override on the element selector) */
      --text-primary:    #1f2937;
      --text-secondary:  #6b7280;
      --text-tertiary:   #9aa1ac;
      --font-sans: "DM Sans", ui-sans-serif, -apple-system, "Segoe UI", Roboto, sans-serif;
      --font-mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
      /* chart surfaces */
      --band-1:      #f3f4f6;
      --band-2:      #e9ebef;
      --band-inner:  #e2e6eb;
      --band-stroke: #d6dae0;
      --baseline:    #c2c7cd;
      --pill-bg:     #ffffff;
      --dot-stroke:  #ffffff;
      --origin:      #374151;
      /* popover */
      --popover-bg:     #ffffff;
      --popover-border: #e2e6eb;
      --popover-shadow: 0 6px 24px rgba(17,24,39,0.16);

      display: block;
      width: 100%;
      font-family: var(--font-sans);
      color: var(--text-primary);
      container-type: inline-size;
    }

    /* Dark mode applies when:
       - User explicitly chose dark via the site toggle (data-theme="dark"), OR
       - OS prefers dark AND user hasn't explicitly chosen light.
       Mirrors the gating used in the site's main.css. */
    @media (prefers-color-scheme: dark) {
      :host-context(:root:not([data-theme="light"])) {
        --text-primary:    #f2f1eb;
        --text-secondary:  #cccbbf;
        --text-tertiary:   #9c9b91;
        --band-1:      #2a2927;
        --band-2:      #343230;
        --band-inner:  #423f3c;
        --band-stroke: #585550;
        --baseline:    #585550;
        --pill-bg:     #1f1e1c;
        --dot-stroke:  #1f1e1c;
        --origin:      #cccbbf;
        --popover-bg:     #2a2927;
        --popover-border: #585550;
        --popover-shadow: 0 6px 24px rgba(0,0,0,0.55);
      }
    }
    :host-context([data-theme="dark"]) {
      --text-primary:    #f2f1eb;
      --text-secondary:  #cccbbf;
      --text-tertiary:   #9c9b91;
      --band-1:      #2a2927;
      --band-2:      #343230;
      --band-inner:  #423f3c;
      --band-stroke: #585550;
      --baseline:    #585550;
      --pill-bg:     #1f1e1c;
      --dot-stroke:  #1f1e1c;
      --origin:      #cccbbf;
      --popover-bg:     #2a2927;
      --popover-border: #585550;
      --popover-shadow: 0 6px 24px rgba(0,0,0,0.55);
    }

    .wrap { position: relative; width: 100%; }
    svg { width: 100%; height: auto; display: block; }

    .title    { font-size: 20px; font-weight: 700; fill: var(--text-primary); }
    .subtitle { font-size: 12px; fill: var(--text-secondary); }
    .ring-label {
      font-size: 10.5px; letter-spacing: 1.2px; font-weight: 700;
      fill: var(--text-tertiary); text-transform: uppercase;
    }
    .legend-head { font-size: 11px; font-weight: 700; fill: var(--text-secondary); }
    .legend-tick { font-size: 9.3px; fill: var(--text-secondary); }
    .origin-label{ font-size: 9.5px; fill: var(--text-secondary); }
    .fw-label    { font-size: 10.5px; font-weight: 600; fill: var(--text-primary); }
    .fw-sub      { font-size: 9px;    fill: var(--text-secondary); }

    .dot-group { cursor: pointer; outline: none; }
    .dot-hit   { fill: transparent; }
    .dot-circle, .dot-ring { transition: transform .12s ease; transform-box: fill-box; transform-origin: center; }
    .dot-group:hover  .fw-label,
    .dot-group:focus-visible .fw-label { font-weight: 700; }
    .dot-group:hover  .dot-circle,
    .dot-group:focus-visible .dot-circle { transform: scale(1.35); }
    .dot-group:focus-visible .dot-ring   { opacity: 1; }
    .dot-ring { opacity: 0; transition: opacity .12s ease; }

    /* popover */
    .popover {
      position: absolute; z-index: 5; width: 280px; max-width: calc(100% - 16px);
      background: var(--popover-bg);
      border: 1px solid var(--popover-border);
      border-radius: 10px;
      box-shadow: var(--popover-shadow);
      padding: 12px 14px 14px;
    }
    .popover[hidden] { display: none; }
    .popover-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
    .popover-close {
      order: 3; margin-left: auto;
      border: none; background: transparent; cursor: pointer;
      font-size: 18px; line-height: 1; color: var(--text-secondary);
      width: 24px; height: 24px; border-radius: 6px;
    }
    .popover-close:hover { background: rgba(127,127,127,0.14); color: var(--text-primary); }
    .popover-close:focus-visible { outline: 2px solid var(--text-secondary); outline-offset: 1px; }
    .popover-dot   { order: 1; width: 11px; height: 11px; border-radius: 50%; flex: 0 0 auto; }
    .popover-title { order: 2; font-size: 14px; font-weight: 700; color: var(--text-primary); }
    .popover-badges { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 9px; }
    .badge {
      display: inline-block; padding: 2px 8px; border-radius: 4px;
      font-size: 11px; color: var(--text-primary); font-family: var(--font-mono);
    }
    .b-scope     { background: rgba(136,135,128,0.16); }
    .b-pull      { background: rgba( 55,138,221,0.16); }
    .b-pull-lean { background: rgba( 91,122,221,0.16); }
    .b-pushpull  { background: rgba(127,119,221,0.16); }
    .b-push-lean { background: rgba(175,100,133,0.16); }
    .b-push      { background: rgba(216, 90, 48,0.16); }
    .popover-desc { font-size: 12px; line-height: 1.6; color: var(--text-secondary); margin: 0; }

    /* More opaque badges in dark mode for legibility */
    @media (prefers-color-scheme: dark) {
      :host-context(:root:not([data-theme="light"])) .b-scope     { background: rgba(180,178,168,0.22); }
      :host-context(:root:not([data-theme="light"])) .b-pull      { background: rgba( 55,138,221,0.30); }
      :host-context(:root:not([data-theme="light"])) .b-pull-lean { background: rgba( 91,122,221,0.30); }
      :host-context(:root:not([data-theme="light"])) .b-pushpull  { background: rgba(127,119,221,0.30); }
      :host-context(:root:not([data-theme="light"])) .b-push-lean { background: rgba(175,100,133,0.30); }
      :host-context(:root:not([data-theme="light"])) .b-push      { background: rgba(216, 90, 48,0.30); }
    }
    :host-context([data-theme="dark"]) .b-scope     { background: rgba(180,178,168,0.22); }
    :host-context([data-theme="dark"]) .b-pull      { background: rgba( 55,138,221,0.30); }
    :host-context([data-theme="dark"]) .b-pull-lean { background: rgba( 91,122,221,0.30); }
    :host-context([data-theme="dark"]) .b-pushpull  { background: rgba(127,119,221,0.30); }
    :host-context([data-theme="dark"]) .b-push-lean { background: rgba(175,100,133,0.30); }
    :host-context([data-theme="dark"]) .b-push      { background: rgba(216, 90, 48,0.30); }

    /* Two layouts: only one is shown at a time, switched by container query. */
    .layout-semi    { display: block; }
    .layout-layered { display: none; }

    /* Narrow chart: switch to layered HTML layout, dock popover */
    @container (max-width: 540px) {
      .layout-semi    { display: none; }
      .layout-layered { display: block; }
      .popover.is-docked {
        left: 8px !important; right: 8px; top: auto !important; bottom: 8px;
        width: auto; max-width: none; max-height: 52%; overflow: auto;
      }
    }

    /* ── Layered (mobile) layout ─────────────────────────────────────── */
    .ly-root {
      padding: 4px 0 4px;
    }
    .ly-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 4px 4px;
    }
    .ly-subtitle {
      font-size: 12px;
      color: var(--text-secondary);
      margin: 0 4px 12px;
      line-height: 1.45;
    }
    .ly-legend {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 4px 14px;
      font-size: 11px;
      color: var(--text-secondary);
    }
    .ly-legend-head {
      font-weight: 700;
      letter-spacing: 0.4px;
      flex: 0 0 auto;
    }
    .ly-legend-bar {
      flex: 1 1 auto;
      height: 10px;
      border-radius: 4px;
    }
    .ly-legend-ticks {
      flex: 0 0 auto;
      display: inline-flex;
      gap: 6px;
    }
    .ly-legend-ticks > span:first-child::before { content: ""; }
    .ly-legend-ticks > span { font-size: 10px; }

    /* Nested rings — each ring is a rectangle that visually contains the
       next. Inner padding gets smaller for visual rhythm. */
    .ly-ring {
      border: 1px solid var(--band-stroke);
      border-radius: 10px;
      padding: 8px 8px 4px;
      margin-top: 6px;
      background: var(--band-1);
    }
    .ly-ring-application,
    .ly-ring-component,
    .ly-ring-template { background: var(--band-2); }
    .ly-ring-window,
    .ly-ring-service  { background: var(--band-1); }
    .ly-ring-node     { background: var(--band-inner); }
    .ly-ring-head {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1.2px;
      color: var(--text-tertiary);
      text-transform: uppercase;
      padding: 2px 6px 6px;
    }
    .ly-rows {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    /* Framework row = full-width button, generous tap target. */
    .ly-row {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      min-height: 44px;
      padding: 8px 10px;
      border: 1px solid transparent;
      border-radius: 8px;
      background: transparent;
      color: var(--text-primary);
      font-family: var(--font-sans);
      font-size: 14px;
      text-align: left;
      cursor: pointer;
      transition: background 0.12s ease, border-color 0.12s ease;
    }
    .ly-row:hover,
    .ly-row:focus-visible {
      background: var(--pill-bg);
      border-color: var(--band-stroke);
      outline: none;
    }
    .ly-row-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      flex: 0 0 auto;
      border: 1.5px solid var(--dot-stroke);
    }
    .ly-row-name {
      flex: 1 1 auto;
      font-weight: 600;
      line-height: 1.25;
    }
    .ly-row-note {
      flex: 0 0 auto;
      font-size: 11px;
      color: var(--text-secondary);
      font-style: italic;
    }

    /* Nanostores spans Service → Component. Show a connector line on the
       left edge of its row that drops down into the Component ring. */
    .ly-row-span {
      position: relative;
    }
    .ly-row-span::before {
      content: "";
      position: absolute;
      left: -1px;
      top: 50%;
      bottom: -28px;
      width: 3px;
      border-radius: 2px;
      background: linear-gradient(to bottom, ${COLOR["push-lean"]}, transparent);
      opacity: 0.5;
    }
  `;

  /* ── element ──────────────────────────────────────────────────────────── */
  class ReactivityGranularityRadar extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._active = null;
      this._esc = null;
      this._outside = null;
    }

    connectedCallback() {
      this.shadowRoot.innerHTML =
        `<style>${STYLES}</style><div class="wrap">` +
        `<div class="layout layout-semi">${this._svgSemi()}</div>` +
        `<div class="layout layout-layered">${this._layeredHTML()}</div>` +
        `<div class="popover" hidden role="dialog" aria-modal="false" aria-label="Framework details"></div></div>`;
      this._bind();
    }

    disconnectedCallback() {
      this._teardownGlobal();
    }

    /* Shared band-fill mapping, used by both layouts. */
    _bandFill() {
      return {
        window: "var(--band-1)",
        application: "var(--band-2)",
        service: "var(--band-1)",
        component: "var(--band-2)",
        template: "var(--band-1)",
        node: "var(--band-inner)",
      };
    }

    /* Build one SVG dot group for the semicircle layout. */
    _dotGroup(fw) {
      const c = COLOR[fw.pp];
      const rDot = fw.small ? 5 : 7;
      const { cx, cy, lx, ly, anchor } = fw;

      let range = "";
      let sub = "";
      if (fw.kind === "range") {
        range = `<line x1="${fw.x1.toFixed(1)}" y1="${fw.y1.toFixed(1)}" x2="${fw.x2.toFixed(1)}" y2="${fw.y2.toFixed(1)}" stroke="${c}" stroke-width="7" stroke-linecap="round" opacity="0.45" pointer-events="none"/>`;
        sub = `<text class="fw-sub" x="${lx.toFixed(1)}" y="${(ly + 12).toFixed(1)}" text-anchor="start" pointer-events="none">atom → deepMap</text>`;
      }

      const scopeName = fw.scopeLabel || SCOPE_LABEL[fw.scope];
      const aria = `${fw.name}: change detection at the ${scopeName} level, ${PP_LABEL[fw.pp]}. Press Enter for the analysis.`;
      return (
        `<g class="dot-group" data-id="${fw.id}" data-cx="${cx.toFixed(1)}" data-cy="${cy.toFixed(1)}" ` +
        `tabindex="0" role="button" aria-label="${aria}">` +
        range +
        `<circle class="dot-hit" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="14"/>` +
        `<circle class="dot-ring" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${rDot + 4}" fill="none" stroke="${c}" stroke-width="1.5"/>` +
        `<circle class="dot-circle" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${rDot}" fill="${c}" stroke="var(--dot-stroke)" stroke-width="1.6"/>` +
        `<text class="fw-label" x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${anchor}">${fw.name}</text>` +
        sub +
        `</g>`
      );
    }

    _svgSemi() {
      const bandFill = this._bandFill();

      // clipped semicircle bands
      let bands = "";
      RINGS.forEach(([key, , r]) => {
        bands += `<circle cx="${OX}" cy="${OY}" r="${r}" fill="${bandFill[key]}" stroke="var(--band-stroke)" stroke-width="1"/>`;
      });

      // ring labels (centered pill on the vertical spoke)
      let labels = "";
      RINGS.forEach(([key, txt, r], i) => {
        const ly = key === "node" ? OY - 90 : OY - (r - 12);
        labels +=
          `<rect x="${OX - 48}" y="${ly - 11}" width="96" height="15" rx="7" fill="var(--pill-bg)" opacity="0.82"/>` +
          `<text class="ring-label" x="${OX}" y="${ly}" text-anchor="middle">${txt}</text>`;
      });

      const dots = FRAMEWORKS.map((fw) => this._dotGroup(fw)).join("");

      // push–pull legend
      const lx0 = 792;
      let legend =
        `<text class="legend-head" x="${lx0}" y="80">PUSH \u2013 PULL</text>` +
        `<defs><linearGradient id="rgr-pp" x1="0" y1="0" x2="0" y2="1">` +
        `<stop offset="0" stop-color="${COLOR.pull}"/><stop offset="0.30" stop-color="${COLOR["pull-lean"]}"/>` +
        `<stop offset="0.5" stop-color="${COLOR.pushpull}"/><stop offset="0.72" stop-color="${COLOR["push-lean"]}"/>` +
        `<stop offset="1" stop-color="${COLOR.push}"/></linearGradient>` +
        `<clipPath id="rgr-top"><rect x="0" y="0" width="${VBW}" height="${OY}"/></clipPath></defs>` +
        `<rect x="${lx0}" y="90" width="13" height="132" rx="4" fill="url(#rgr-pp)"/>`;
      [
        [0, "pull"],
        [0.3, "pull-lean"],
        [0.5, "push-pull"],
        [0.72, "push-lean"],
        [1, "push"],
      ].forEach(([o, t]) => {
        legend += `<text class="legend-tick" x="${lx0 + 20}" y="${Math.round(90 + o * 132 + 3.5)}">${t}</text>`;
      });

      return (
        `<svg viewBox="0 0 ${VBW} ${VBH}" role="img" ` +
        `aria-label="Granularity radar. Each framework dot is focusable; activate it for an analysis of its placement.">` +
        `<text class="title" x="34" y="34">Change detection scope map</text>` +
        `<text class="subtitle" x="34" y="55">Each ring is the level at which change detection is forced.</text>` +
        `<g clip-path="url(#rgr-top)">${bands}</g>` +
        `<line x1="${OX - ROUT}" y1="${OY}" x2="${OX + ROUT}" y2="${OY}" stroke="var(--baseline)" stroke-width="1"/>` +
        labels +
        legend +
        dots +
        `<circle cx="${OX}" cy="${OY}" r="4" fill="var(--origin)"/>` +
        `</svg>`
      );
    }

    /* Render the mobile layout: nested rectangles stacked outermost-to-innermost
       (Window at top, DOM node at bottom). Each ring contains a row per
       framework dot whose scope matches that ring. Nanostores spans Service
       and Component visually via a marker line on its row plus a "spans
       Service → Component" note. */
    _layeredHTML() {
      // Group frameworks by ring (using `ring` for arcs, `scope` for list, and
      // a custom rule for range markers — we render nanostores in Service and
      // add a span marker rendered as a vertical line on the left of its row).
      const byRing = {};
      RINGS.forEach(([key]) => {
        byRing[key] = [];
      });
      FRAMEWORKS.forEach((fw) => {
        if (fw.kind === "arc") byRing[fw.ring].push(fw);
        else if (fw.kind === "list") byRing.node.push(fw);
        else if (fw.kind === "range") byRing[fw.scope].push(fw); // service
      });

      const renderRow = (fw) => {
        const c = COLOR[fw.pp];
        const spanNote =
          fw.kind === "range"
            ? `<span class="ly-row-note">spans Service → Component</span>`
            : "";
        const scopeName = fw.scopeLabel || SCOPE_LABEL[fw.scope];
        const aria = `${fw.name}: change detection at the ${scopeName} level, ${PP_LABEL[fw.pp]}.`;
        const spanClass = fw.kind === "range" ? " ly-row-span" : "";
        return (
          `<button type="button" class="ly-row dot-group${spanClass}" ` +
          `data-id="${fw.id}" role="button" aria-label="${aria}">` +
          `<span class="ly-row-dot" style="background:${c}" aria-hidden="true"></span>` +
          `<span class="ly-row-name">${fw.name}</span>` +
          spanNote +
          `</button>`
        );
      };

      // Build nested structure: each ring wraps the next. Innermost (node)
      // has no children.
      const buildLayer = (idx) => {
        if (idx >= RINGS.length) return "";
        const [key, label] = RINGS[idx];
        const rows = byRing[key].map(renderRow).join("");
        const inner = buildLayer(idx + 1);
        return (
          `<section class="ly-ring ly-ring-${key}" aria-label="${label}">` +
          `<header class="ly-ring-head">${label}</header>` +
          `<div class="ly-rows">${rows}</div>` +
          inner +
          `</section>`
        );
      };

      // Horizontal push-pull legend above the layered stack
      const legend =
        `<div class="ly-legend" aria-hidden="true">` +
        `<span class="ly-legend-head">PUSH – PULL</span>` +
        `<span class="ly-legend-bar" style="background:linear-gradient(to right, ${COLOR.pull}, ${COLOR["pull-lean"]} 30%, ${COLOR.pushpull} 50%, ${COLOR["push-lean"]} 72%, ${COLOR.push})"></span>` +
        `<span class="ly-legend-ticks"><span>pull</span><span>push</span></span>` +
        `</div>`;

      return (
        `<div class="ly-root" role="region" aria-label="Granularity, mobile view">` +
        `<h2 class="ly-title">Change detection scope map</h2>` +
        `<p class="ly-subtitle">Each layer is the level at which change detection is forced. Outermost layer is the broadest scope.</p>` +
        legend +
        buildLayer(0) +
        `</div>`
      );
    }

    _bind() {
      const groups = this.shadowRoot.querySelectorAll(".dot-group");
      groups.forEach((g) => {
        g.addEventListener("click", () => this._open(g));
        g.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            this._open(g);
          }
        });
      });
    }

    _data(id) {
      return FRAMEWORKS.find((f) => f.id === id);
    }

    _popHTML(fw) {
      const scopeName = fw.scopeLabel || SCOPE_LABEL[fw.scope];
      return (
        `<div class="popover-header">` +
        `<button class="popover-close" aria-label="Close">\u00d7</button>` +
        `<span class="popover-dot" style="background:${COLOR[fw.pp]}" aria-hidden="true"></span>` +
        `<span class="popover-title">${fw.name}</span>` +
        `</div>` +
        `<div class="popover-badges">` +
        `<span class="badge b-scope">detection: ${scopeName}</span>` +
        `<span class="badge ${PP_BADGE[fw.pp]}">${PP_LABEL[fw.pp]}</span>` +
        `</div>` +
        `<p class="popover-desc">${fw.desc}</p>`
      );
    }

    _open(group) {
      const fw = this._data(group.dataset.id);
      if (!fw) return;
      const wrap = this.shadowRoot.querySelector(".wrap");
      const pop = this.shadowRoot.querySelector(".popover");
      pop.innerHTML = this._popHTML(fw);

      // The active dot lives in one of two layouts. The SVG semi layout uses
      // viewBox coordinates and we anchor the popover near the dot; the HTML
      // layered layout has no SVG and we always dock the popover to the bottom.
      const svg = group.closest("svg");
      const docked = !svg || wrap.clientWidth <= 540;
      pop.classList.toggle("is-docked", docked);
      pop.hidden = false;

      if (!docked) {
        // map SVG user coords → wrap pixels
        const sr = svg.getBoundingClientRect();
        const wr = wrap.getBoundingClientRect();
        const sx = sr.width / VBW,
          sy = sr.height / VBH;
        const px = sr.left - wr.left + parseFloat(group.dataset.cx) * sx;
        const py = sr.top - wr.top + parseFloat(group.dataset.cy) * sy;
        const pw = pop.offsetWidth,
          ph = pop.offsetHeight,
          off = 16;

        let left = px + off;
        if (left + pw > wrap.clientWidth - 8) left = px - pw - off;
        if (left < 8) left = 8;
        let top = py - ph - off;
        if (top < 8) top = py + off;
        if (top + ph > wrap.clientHeight - 8)
          top = Math.max(8, wrap.clientHeight - ph - 8);
        pop.style.left = left + "px";
        pop.style.top = top + "px";
      } else {
        pop.style.left = "";
        pop.style.top = "";
      }

      this._active = group;
      const close = pop.querySelector(".popover-close");
      close.addEventListener("click", () => this._close());
      close.focus();

      this._teardownGlobal();
      this._esc = (e) => {
        if (e.key === "Escape") this._close();
      };
      this._outside = (e) => {
        const path = e.composedPath();
        if (!path.includes(pop) && !path.includes(this._active)) this._close();
      };
      document.addEventListener("keydown", this._esc);
      document.addEventListener("pointerdown", this._outside, true);
    }

    _close() {
      const pop = this.shadowRoot.querySelector(".popover");
      pop.hidden = true;
      this._teardownGlobal();
      if (this._active) {
        this._active.focus();
        this._active = null;
      }
    }

    _teardownGlobal() {
      if (this._esc) {
        document.removeEventListener("keydown", this._esc);
        this._esc = null;
      }
      if (this._outside) {
        document.removeEventListener("pointerdown", this._outside, true);
        this._outside = null;
      }
    }
  }

  /* ── font injection (deduped) ─────────────────────────────────────────── */
  if (!document.querySelector("link[data-rgr-fonts]")) {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href =
      "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap";
    l.setAttribute("data-rgr-fonts", "");
    document.head.appendChild(l);
  }

  /* ── register (deduped) ───────────────────────────────────────────────── */
  if (!customElements.get("reactivity-granularity-radar")) {
    customElements.define(
      "reactivity-granularity-radar",
      ReactivityGranularityRadar,
    );
  }
})();
