/**
 * <reactivity-depth-axis>
 *
 * Axis: mutation tracking depth
 *   shallow = you must explicitly signal a change (signal.set(), setState(), assignment)
 *   deep    = system auto-detects mutations at any nesting level (typically via Proxy)
 *
 * Usage:
 *   <script src="reactivity-depth-axis.js"></script>
 *   <reactivity-depth-axis></reactivity-depth-axis>
 *
 * Theming:
 *   Dark by default. Add class "light" to switch:
 *   <reactivity-depth-axis class="light"></reactivity-depth-axis>
 *
 * Layout:
 *   Horizontal axis on viewports wider than 640px.
 *   Vertical axis on viewports 640px and below.
 */

(() => {
  // ── data ─────────────────────────────────────────────────────────────────────

  const FRAMEWORKS = [
    {
      name: "React useState",
      pos: 8,
      row: 0,
      cat: "pull",
      note: "setState replacement\nno mutation tracking",
      unit: "surface — you provide the new value entirely",
      mechanism: "setState(newValue) — React never inspects inside the object",
      analysis:
        "React's model is built around immutability. setState() replaces the reference; React schedules a re-render. Mutating state directly (obj.x = 1 without setState) does nothing. There is no wrapping, no proxy, no scanning. The system tracks the reference, full stop.",
      placement:
        "At the shallow end: zero visibility into the contents of state. Depth is the distance you can mutate without calling anything — here it is zero.",
    },
    {
      name: "Lit",
      pos: 15,
      row: 1,
      cat: "pull",
      note: "property assignment\nsurface level only",
      unit: "component property — assignment triggers requestUpdate()",
      mechanism: "Property accessors call requestUpdate() on assignment only",
      analysis:
        "LitElement wraps @property/@state fields with accessors that call requestUpdate() on assignment. Mutating an object already stored in a property (this.data.name = 'x' without reassignment) fires nothing. You must replace the reference to trigger reactivity.",
      placement:
        "Shallow: only top-level property assignment is tracked. No visibility into nested object contents.",
    },
    {
      name: "Vue shallowRef()",
      pos: 23,
      row: 0,
      cat: "hybrid",
      note: "shallowRef.value = new\nwrapper-level only",
      unit: "the shallowRef wrapper — .value replacement",
      mechanism: "shallowRef() tracks assignment to .value, never reaches into contents",
      analysis:
        "shallowRef() is Vue's truly-shallow wrapper. Only .value = newVal triggers reactivity, and the inner value is left untouched - no reactive() conversion happens, so nested mutations on a stored object are invisible. This is the primitive to reach for when you want the .value contract without deep tracking. ref() looks similar but is different: when you store an object in ref(), Vue silently swaps it for a reactive() proxy, so observed behavior is deep. shallowRef() does not do that swap.",
      placement:
        "Shallow end: the wrapper is shallow and nothing inside is converted. Contrast with Vue ref(), which has the same shallow wrapper but applies reactive() to objects you store in it, and with reactive() itself at the deep end.",
    },
    {
      name: "Solid signal",
      pos: 30,
      row: 1,
      cat: "push",
      note: "signal.set()\nwrapper replacement",
      unit: "the signal itself — you call set(newValue)",
      mechanism:
        "Synchronous push when signal.set() or signal.update() is called",
      analysis:
        "A Solid signal holds one value — primitive or reference. Calling set(newValue) synchronously notifies all subscribers. Mutating a property of a held object (obj.x = 1 without calling set()) triggers nothing. For deep object reactivity, Solid provides createStore() as a completely separate primitive. The same framework appears at both ends of this axis.",
      placement:
        "Shallow: the signal is a container for one value. Reactivity is triggered by replacement, not by mutation of contents. Contrast with Solid store, which is deep and sits far right on this axis.",
    },
    {
      name: "Angular Signals",
      pos: 35,
      row: 0,
      cat: "hybrid",
      note: "signal.set()\nwrapper replacement",
      unit: "the signal wrapper — explicit set() or update()",
      mechanism:
        "signal.set(newValue) — same shallow-wrapper model as Solid signal",
      analysis:
        "Angular Signals follow the same shallow model as Solid signals and Preact Signals. signal() holds a value; set(newValue) or update(fn) triggers reactivity. Mutating a nested property of a held object does nothing. Angular's adoption of signals changed granularity (how many things subscribe), not tracking depth.",
      placement:
        "Shallow: the signal knows nothing about its contents. Same model as Solid signal and Preact Signals.",
    },
    {
      name: "Svelte 4",
      pos: 42,
      row: 1,
      tier: 1,
      cat: "hybrid",
      note: "var assignment\n$$invalidate on write",
      unit: "declared variable — assignment triggers invalidation",
      mechanism: "Compiler rewrites assignments to $$invalidate() calls",
      analysis:
        "Svelte 4's compiler rewrites variable assignments: x = newValue becomes $$invalidate('x', newValue). Reactivity fires on assignment, not mutation. arr.push() does nothing; arr = arr is required. Object property writes (obj.name = 'x') fire nothing without a reassignment. The reactive boundary is the variable itself.",
      placement:
        "Shallow-adjacent: more ergonomic than pure signal systems (the compiler handles assignment automatically) but still assignment-based, not mutation-tracking.",
    },
    {
      name: "Ember Octane",
      pos: 48,
      row: 0,
      cat: "hybrid",
      note: "@tracked property\ndeclared, not nested",
      unit: "@tracked class property — declared at definition time",
      mechanism: "Revision tags on @tracked properties, polled by Glimmer VM",
      analysis:
        "@tracked marks specific class properties as reactive. Assigning to that property bumps its revision tag. The system only tracks what you explicitly declare. If you have @tracked user = { name: 'Jim' }, mutating user.name does not trigger reactivity — only reassigning user does, unless name is on a @tracked class. Every reactive path must be declared.",
      placement:
        "Middle: distributed across class properties rather than a single wrapper, but every reactive point must still be explicitly declared. Shallower than Proxy systems.",
    },
    {
      name: "nanostores",
      pos: 54,
      row: 1,
      tier: 1,
      cat: "obs",
      note: "atom: replace value\ndeepMap: path write",
      unit: "atom: the whole value · map: key · deepMap: key path",
      mechanism:
        "Explicit API: atom.set(), map.setKey(), deepMap.setKey('a.b', v)",
      analysis:
        "nanostores has a built-in spectrum. atom is fully shallow: set(newValue) replaces the whole value. map tracks individual keys via setKey(). deepMap extends this to dot-notation paths: setKey('user.address.city', 'London') notifies listeners for that specific path. Depth is available but always explicit — nothing is auto-detected from plain mutations.",
      placement:
        "Mid-range as a span: atom is shallow, deepMap reaches toward the middle. All modes require explicit API calls. Nothing is inferred from mutations.",
    },
    {
      name: "AngularJS",
      pos: 62,
      row: 0,
      cat: "pull",
      note: "digest cycle scans\nall $watch expressions",
      unit: "any watched expression — re-evaluated every digest cycle",
      mechanism: "$watch(expr, fn) + dirty-check loop re-reads all expressions",
      analysis:
        "AngularJS discovers changes by re-evaluating all $watch expressions each digest cycle and comparing to the previous value. $watch('user.address.city', fn) detects a deep mutation — not by tracking it, but by re-reading the path on each cycle. You can watch arbitrarily deep expressions, but the mechanism is wholesale re-evaluation, not targeted interception.",
      placement:
        "Mid-to-deep: can discover mutations at any depth through repeated scanning. Surveillance rather than tracking — more expensive and less targeted than proxy systems.",
    },
    {
      name: "Angular Zone.js",
      pos: 68,
      row: 1,
      tier: 1,
      cat: "hybrid",
      note: "Zone intercepts async\nfull tree re-check",
      unit: "anything that mutated during an async operation",
      mechanism:
        "Zone.js patches async APIs → triggers full change detection from root",
      analysis:
        "Zone.js intercepts all async operations (setTimeout, Promise, XHR, DOM events). When async completes, Angular runs change detection from root downward, re-evaluating all bindings. This discovers any mutation — at any depth — that happened during the async operation. The mechanism is wholesale re-evaluation after async, not targeted mutation tracking.",
      placement:
        "Similar to AngularJS: discovers deep mutations through scanning rather than targeted tracking. Responds to all state changes that occur during async operations.",
    },
    {
      name: "React + Immer",
      pos: 75,
      row: 0,
      tier: 1,
      cat: "pull",
      note: "Immer proxy draft\nnested mutations tracked",
      unit: "any nested mutation inside a produce() callback",
      mechanism:
        "Immer Proxy draft intercepts all writes, produces structural patch",
      analysis:
        "Immer wraps state in a Proxy 'draft' inside produce(). Writing draft.user.address.city = 'London' is automatically intercepted. When produce() exits, Immer generates a new immutable state tree reflecting exactly what changed. React sees a new reference and re-renders. Mutation tracking depth is unlimited — the Proxy intercepts writes at any level.",
      placement:
        "Deep: Immer auto-detects mutations at any nesting depth without explicit set() calls. Output is immutable (React model) but the tracking is deep and automatic within produce().",
    },
    {
      name: "Svelte 5",
      pos: 78,
      row: 1,
      cat: "hybrid",
      note: "$state proxy\nnested writes detected",
      unit: "any nested property write on a $state object",
      mechanism:
        "$state() applies a deep Proxy, intercepts writes at any depth",
      analysis:
        "Svelte 5's $state() wraps objects in a deep Proxy. Writing state.user.address.city = 'London' is automatically intercepted and triggers reactive updates — no reassignment needed. This is the fundamental change from Svelte 4: moving from assignment-based (shallow) to proxy-based (deep) reactivity. The same mutation that silently fails in Svelte 4 works transparently in Svelte 5.",
      placement:
        "Deep: one of the clearest illustrations of the shallow-to-deep transition. Svelte 4 and Svelte 5 straddle the inflection point on this axis.",
    },
    {
      name: "MobX",
      pos: 83,
      row: 0,
      cat: "obs",
      note: "observable tree\nall nesting auto-tracked",
      unit: "any property write anywhere in the observable tree",
      mechanism:
        "observable() recursively instruments all nested objects and arrays",
      analysis:
        "MobX's observable() recursively makes all nested objects, arrays, and maps reactive. Writing state.users[0].profile.bio = 'x' is automatically intercepted and notifies all reactions that accessed that path. No boundaries to declare, no explicit set() calls, no depth limits. MobX instruments the entire object tree.",
      placement:
        "Deep: the reference implementation of automatic deep mutation tracking. Arbitrarily nested writes are transparently reactive.",
    },
    {
      name: "Solid store",
      pos: 88,
      row: 1,
      tier: 1,
      cat: "push",
      note: "createStore proxy\nnested writes detected",
      unit: "any nested property write on the store object",
      mechanism:
        "createStore() backs each nested property with a fine-grained signal",
      analysis:
        "Solid's createStore() is a fundamentally different primitive from signal(). It creates a deep reactive object where every nested property is backed by its own signal. Writing store.user.address.city = 'London' auto-detects the mutation and only notifies the signals that specifically read that path. Combines deep mutation tracking with fine-grained per-property granularity.",
      placement:
        "Deep: directly contrasts with Solid signal, which is shallow and sits far left on this axis. Same framework, two primitives for opposite ends of this axis.",
    },
    {
      name: "Valtio",
      pos: 92,
      row: 0,
      tier: 1,
      cat: "hybrid",
      note: "Proxy snapshot\npath-level auto-tracking",
      unit: "any nested property write on the proxy state",
      mechanism:
        "Proxy intercepts all writes, produces immutable snapshots per path",
      analysis:
        "Valtio wraps the entire state object in a Proxy. Any write at any depth is intercepted, recorded, and a new immutable snapshot is produced. useSnapshot() subscribes React components to exactly the paths they accessed during the last render. Combines deep proxy-based mutation tracking with React's immutable rendering model.",
      placement:
        "Deep: transparent mutation syntax with full-depth tracking. Like React+Immer but with fine-grained path-level subscriptions rather than whole-component re-renders.",
    },
    {
      name: "Vue reactive() and ref(object)",
      pos: 97,
      row: 1,
      cat: "hybrid",
      note: "reactive() Proxy\nall nesting auto-tracked",
      unit: "any nested property write on the reactive object",
      mechanism: "reactive() wraps objects in deep ES Proxy with track/trigger",
      analysis:
        "Vue 3's reactive() wraps the entire object tree in ES Proxy. Any property read is tracked (building a WeakMap dep graph), and any property write triggers all dependents. Nested objects are lazily converted to Proxies on first access. No declarations needed, no explicit set() calls, no depth limits. ref() lands here too whenever you store an object in it: at construction, Vue substitutes the object with a reactive() proxy via toReactive(), so nested mutations on the stored object are tracked. The ref wrapper itself stays shallow, but its contents are deep when they're objects.",
      placement:
        "Deep end: reactive() is Vue's canonical deep-tracking primitive. ref() inherits this depth for any object value via the same toReactive() call. The strictly-shallow Vue primitive is shallowRef(), which sits far left on this axis.",
    },
  ];

  const CAT_COLOR = {
    pull: "#5b8ed8",
    hybrid: "#8b7fd4",
    obs: "#b86070",
    push: "#d8643a",
  };
  const CAT_LABEL = {
    pull: "pull",
    hybrid: "push-pull",
    obs: "push (observable)",
    push: "push",
  };

  // ── horizontal layout constants ───────────────────────────────────────────────
  const H_TIER_OFF = [110, 182];
  const H_TRACK_Y = 255;
  const H_LABEL_H = 60;
  const H_SVG_W = 960;
  const H_SVG_H = 530;
  const H_MX = 60;
  const H_TRACK_W = H_SVG_W - H_MX * 2;
  const hPx = (p) => (H_MX + (p / 100) * H_TRACK_W).toFixed(1);

  // ── vertical layout constants ─────────────────────────────────────────────────
  const V_TIER_STEM = [16, 105];
  const V_SVG_W = 500;
  const V_SVG_H = 900;
  const V_AXIS_X = 240;
  const V_MY = 52;
  const V_TRACK_H = 776;
  const vPy = (p) => (V_MY + (p / 100) * V_TRACK_H).toFixed(1);

  // ── custom element ────────────────────────────────────────────────────────────

  class ReactivityDepthAxis extends HTMLElement {
    constructor() {
      super();
      this._root = this.attachShadow({ mode: "open" });
      this._uid = Math.random().toString(36).slice(2, 6);
      this._active = null;
    }

    connectedCallback() {
      this._root.innerHTML = this._template();
      this._wire();
    }

    _fwGroups_horiz() {
      return FRAMEWORKS.map((fw) => {
        const x = hPx(fw.pos);
        const isAbove = fw.row === 0;
        const color = CAT_COLOR[fw.cat];
        const rowOff = H_TIER_OFF[fw.tier ?? 0];
        const labelY = isAbove ? H_TRACK_Y - rowOff : H_TRACK_Y + rowOff;
        const stemY1 = isAbove ? H_TRACK_Y - 10 : H_TRACK_Y + 10;
        const stemY2 = labelY + (isAbove ? H_LABEL_H - 4 : -H_LABEL_H + 4);
        const nameY = isAbove ? labelY - 4 : labelY + 15;
        const note1Y = isAbove ? labelY + 13 : labelY + 30;
        const note2Y = isAbove ? labelY + 26 : labelY + 43;
        const notes = fw.note.split("\n");
        return `
          <g class="fw-g" data-fw="${fw.name}" tabindex="0" role="button"
             aria-haspopup="true" aria-expanded="false" aria-label="${fw.name} — click for details">
            <circle class="fw-ring" cx="${x}" cy="${H_TRACK_Y}" r="11" fill="none" stroke="${color}" stroke-width="1.5"/>
            <line class="fw-stem" x1="${x}" y1="${stemY1}" x2="${x}" y2="${stemY2}"
                  stroke="${color}" stroke-width="1" stroke-opacity="0.18" stroke-dasharray="3 3"/>
            <circle class="fw-dot" cx="${x}" cy="${H_TRACK_Y}" r="6" fill="${color}" fill-opacity="0.88"/>
            <g class="fw-lbl">
              <text class="fw-name" x="${x}" y="${nameY}" text-anchor="middle">${fw.name}</text>
              <text class="fw-note" x="${x}" y="${note1Y}" text-anchor="middle">${notes[0]}</text>
              ${notes[1] ? `<text class="fw-note" x="${x}" y="${note2Y}" text-anchor="middle">${notes[1]}</text>` : ""}
            </g>
          </g>`;
      }).join("");
    }

    _fwGroups_vert() {
      return FRAMEWORKS.map((fw) => {
        const y = vPy(fw.pos);
        const isLeft = fw.row === 0;
        const color = CAT_COLOR[fw.cat];
        const stem = V_TIER_STEM[fw.tier ?? 0];
        const stemX = isLeft ? V_AXIS_X - stem : V_AXIS_X + stem;
        const textX = isLeft ? stemX - 6 : stemX + 6;
        const anchor = isLeft ? "end" : "start";
        const notes = fw.note.split("\n");
        const nameY = (parseFloat(y) - 7).toFixed(1);
        const note1Y = (parseFloat(y) + 8).toFixed(1);
        const note2Y = (parseFloat(y) + 20).toFixed(1);
        return `
          <g class="fw-g" data-fw="${fw.name}" tabindex="0" role="button"
             aria-haspopup="true" aria-expanded="false" aria-label="${fw.name} — click for details">
            <circle class="fw-ring" cx="${V_AXIS_X}" cy="${y}" r="11" fill="none" stroke="${color}" stroke-width="1.5"/>
            <line class="fw-stem" x1="${V_AXIS_X}" y1="${y}" x2="${stemX}" y2="${y}"
                  stroke="${color}" stroke-width="1" stroke-opacity="0.18" stroke-dasharray="3 3"/>
            <circle class="fw-dot" cx="${V_AXIS_X}" cy="${y}" r="6" fill="${color}" fill-opacity="0.88"/>
            <g class="fw-lbl">
              <text class="fw-name" x="${textX}" y="${nameY}" text-anchor="${anchor}">${fw.name}</text>
              <text class="fw-note" x="${textX}" y="${note1Y}" text-anchor="${anchor}">${notes[0]}</text>
              ${notes[1] ? `<text class="fw-note" x="${textX}" y="${note2Y}" text-anchor="${anchor}">${notes[1]}</text>` : ""}
            </g>
          </g>`;
      }).join("");
    }

    _template() {
      const uid = this._uid;

      const defs = `
        <svg width="0" height="0" style="position:absolute;overflow:hidden" aria-hidden="true">
          <defs>
            <marker id="arr-r-${uid}" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto">
              <path class="arrow-path" d="M0,0 L8,4 L0,8"/>
            </marker>
            <marker id="arr-l-${uid}" viewBox="0 0 8 8" refX="1" refY="4" markerWidth="5" markerHeight="5" orient="auto">
              <path class="arrow-path" d="M8,0 L0,4 L8,8"/>
            </marker>
          </defs>
        </svg>`;

      const hTicks = [25, 50, 75]
        .map(
          (p) =>
            `<line x1="${hPx(p)}" y1="${H_TRACK_Y - 5}" x2="${hPx(p)}" y2="${H_TRACK_Y + 5}" class="axis-tick" stroke-width="1"/>`,
        )
        .join("");

      const hLegend = [
        { cat: "pull", label: "pull" },
        { cat: "hybrid", label: "push-pull" },
        { cat: "push", label: "push" },
      ]
        .map((lc, i) => {
          const lx = H_MX + (i / 2) * (H_TRACK_W * 0.38) + H_TRACK_W * 0.31;
          const ly = H_SVG_H - 28;
          return `
          <circle cx="${lx}" cy="${ly}" r="5.5" fill="${CAT_COLOR[lc.cat]}" fill-opacity="0.88"/>
          <text class="legend-label" x="${lx + 14}" y="${ly + 4.5}" text-anchor="start">${lc.label}</text>`;
        })
        .join("");

      const vTicks = [25, 50, 75]
        .map(
          (p) =>
            `<line x1="${V_AXIS_X - 5}" y1="${vPy(p)}" x2="${V_AXIS_X + 5}" y2="${vPy(p)}" class="axis-tick" stroke-width="1"/>`,
        )
        .join("");

      const vLegend = [
        { cat: "pull", label: "pull" },
        { cat: "hybrid", label: "push-pull" },
        { cat: "push", label: "push" },
      ]
        .map((lc, i) => {
          const lx = 28 + i * 140;
          const ly = V_SVG_H - 30;
          return `
          <circle cx="${lx}" cy="${ly}" r="5" fill="${CAT_COLOR[lc.cat]}" fill-opacity="0.88"/>
          <text class="legend-label" x="${lx + 13}" y="${ly + 4.5}" text-anchor="start">${lc.label}</text>`;
        })
        .join("");

      return `
        <style>
          :host {
            --bg:           #12152a;
            --pop-bg:       #1a1d30;
            --pop-border:   rgba(200,210,230,0.14);
            --pop-shadow:   0 8px 32px rgba(0,0,0,0.45);
            --pop-hr:       rgba(200,210,230,0.10);
            --text-primary: rgba(215,220,235,0.92);
            --text-note:    rgba(215,220,235,0.40);
            --text-muted:   rgba(200,210,230,0.32);
            --axis-color:   rgba(200,210,230,0.28);
            --tick-color:   rgba(200,210,230,0.18);
            display: block;
          }
          :host(.light) {
            --bg:           #f0ede8;
            --pop-bg:       #ffffff;
            --pop-border:   rgba(20,25,55,0.13);
            --pop-shadow:   0 8px 28px rgba(0,0,0,0.10);
            --pop-hr:       rgba(20,25,55,0.09);
            --text-primary: rgba(20,25,55,0.88);
            --text-note:    rgba(20,25,55,0.42);
            --text-muted:   rgba(20,25,55,0.35);
            --axis-color:   rgba(20,25,55,0.28);
            --tick-color:   rgba(20,25,55,0.18);
          }

          .wrap { background: var(--bg); position: relative; transition: background 0.2s; }

          .chart-h { display: block; }
          .chart-v { display: none; }
          @media (max-width: 640px) {
            .chart-h { display: none; }
            .chart-v { display: block; }
          }

          svg { display: block; width: 100%; overflow: visible; cursor: default; }

          .fw-name     { font: 400 12.5px system-ui,sans-serif; fill: var(--text-primary); }
          .fw-note     { font: 400 10px   system-ui,sans-serif; fill: var(--text-note); }
          .axis-label  { font: 400 11px   system-ui,sans-serif; fill: var(--text-muted); letter-spacing: 0.04em; }
          .legend-label{ font: 400 11px   system-ui,sans-serif; fill: var(--text-note); }
          .axis-tick   { stroke: var(--tick-color); }
          .axis-line   { stroke: var(--axis-color); }
          .arrow-path  { stroke: var(--axis-color); fill: none; stroke-width: 1.5;
                         stroke-linecap: round; stroke-linejoin: round; }

          .fw-g { cursor: pointer; }
          .fw-g:focus-visible { outline: none; }

          .fw-ring { opacity: 0; transition: opacity 0.15s; }
          .fw-g:hover .fw-ring,
          .fw-g:focus-visible .fw-ring,
          .fw-g[data-open] .fw-ring { opacity: 1; }

          .fw-dot { transition: fill-opacity 0.15s; }
          .fw-g:hover .fw-dot,
          .fw-g:focus-visible .fw-dot,
          .fw-g[data-open] .fw-dot { fill-opacity: 1; }

          .fw-stem { transition: stroke-opacity 0.15s; }
          .fw-g:hover .fw-stem,
          .fw-g:focus-visible .fw-stem,
          .fw-g[data-open] .fw-stem { stroke-opacity: 0.45 !important; stroke-dasharray: none !important; }

          .fw-lbl { opacity: 0.72; transition: opacity 0.15s; }
          .fw-g:hover .fw-lbl,
          .fw-g:focus-visible .fw-lbl,
          .fw-g[data-open] .fw-lbl { opacity: 1; }

          .pop {
            position: absolute; width: 292px;
            background: var(--pop-bg); border: 1px solid var(--pop-border);
            border-radius: 7px; padding: 0;
            font-family: system-ui,sans-serif;
            z-index: 10; box-shadow: var(--pop-shadow);
          }
          .pop[hidden] { display: none; }
          @media (max-width: 640px) { .pop { width: min(268px, calc(100% - 16px)); } }

          .pop-header {
            display: flex; align-items: center; justify-content: space-between;
            padding: 12px 14px 11px; border-bottom: 1px solid var(--pop-hr);
          }
          .pop-name   { display: flex; align-items: center; gap: 8px;
                        font-size: 13px; font-weight: 600; color: var(--text-primary); }
          .pop-swatch { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
          .pop-close  {
            background: none; border: none; cursor: pointer;
            color: var(--text-muted); font-size: 18px; line-height: 1;
            padding: 0 2px; border-radius: 3px;
            transition: color 0.12s, background 0.12s; font-family: inherit;
          }
          .pop-close:hover { color: var(--text-primary); background: var(--pop-hr); }
          .pop-body     { padding: 11px 14px 13px; }
          .pop-row      { display: grid; grid-template-columns: 66px 1fr; gap: 4px 8px; margin-bottom: 4px; }
          .pop-key      { font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase;
                          color: var(--text-muted); padding-top: 2px; }
          .pop-val      { font-size: 11px; color: var(--text-note); line-height: 1.4; }
          .pop-divider  { height: 1px; background: var(--pop-hr); margin: 9px 0; }
          .pop-analysis { font-size: 11px; color: var(--text-note); line-height: 1.65; margin-bottom: 8px; }
          .pop-placement{ font-size: 10.5px; color: var(--text-muted); line-height: 1.55; }
        </style>

        <div class="wrap">
          ${defs}

          <svg class="chart-h" viewBox="0 0 ${H_SVG_W} ${H_SVG_H}" aria-label="Mutation tracking depth axis, shallow to deep">
            <line class="axis-line" x1="${H_MX - 2}" y1="${H_TRACK_Y}" x2="${H_MX + H_TRACK_W + 2}" y2="${H_TRACK_Y}"
                  stroke-width="1.5" marker-start="url(#arr-l-${uid})" marker-end="url(#arr-r-${uid})"/>
            ${hTicks}
            <text class="axis-label" x="${H_MX}" y="${H_TRACK_Y + 26}" text-anchor="middle">shallow</text>
            <text class="axis-label" x="${H_MX + H_TRACK_W}" y="${H_TRACK_Y + 26}" text-anchor="middle">deep</text>
            <text class="axis-label" x="${H_MX + H_TRACK_W / 2}" y="${H_TRACK_Y + 26}" text-anchor="middle">mutation tracking depth →</text>
            ${this._fwGroups_horiz()}
            ${hLegend}
          </svg>

          <svg class="chart-v" viewBox="0 0 ${V_SVG_W} ${V_SVG_H}" aria-label="Mutation tracking depth axis, shallow to deep">
            <line class="axis-line" x1="${V_AXIS_X}" y1="${V_MY - 2}" x2="${V_AXIS_X}" y2="${V_MY + V_TRACK_H + 2}"
                  stroke-width="1.5" marker-start="url(#arr-l-${uid})" marker-end="url(#arr-r-${uid})"/>
            ${vTicks}
            <text class="axis-label" x="${V_AXIS_X}" y="${V_MY - 16}" text-anchor="middle">shallow</text>
            <text class="axis-label" x="${V_AXIS_X}" y="${V_MY + V_TRACK_H + 24}" text-anchor="middle">deep</text>
            ${this._fwGroups_vert()}
            ${vLegend}
          </svg>

          <div class="pop" id="pop" hidden></div>
        </div>
      `;
    }

    _wire() {
      const pop = this._root.getElementById("pop");
      const wrap = this._root.querySelector(".wrap");

      const open = (fw, group) => {
        if (this._active) {
          this._active.removeAttribute("data-open");
          this._active.setAttribute("aria-expanded", "false");
        }
        this._active = group;
        group.setAttribute("data-open", "");
        group.setAttribute("aria-expanded", "true");

        const svgEl = group.closest("svg");
        const dot = group.querySelector(".fw-dot");
        const svgR = svgEl.getBoundingClientRect();
        const wR = wrap.getBoundingClientRect();
        const vb = svgEl.viewBox.baseVal;
        const dotX =
          svgR.left -
          wR.left +
          parseFloat(dot.getAttribute("cx")) * (svgR.width / vb.width);
        const dotY =
          svgR.top -
          wR.top +
          parseFloat(dot.getAttribute("cy")) * (svgR.height / vb.height);

        const popW = pop.offsetWidth || 292;
        let left = dotX + 18;
        if (left + popW > wrap.offsetWidth - 8) left = dotX - popW - 18;
        left = Math.max(8, left);
        let top = dotY - 24;
        if (top < 8) top = dotY + 18;

        const color = CAT_COLOR[fw.cat];
        pop.style.left = `${left}px`;
        pop.style.top = `${top}px`;
        pop.innerHTML = `
          <div class="pop-header">
            <div class="pop-name"><span class="pop-swatch" style="background:${color}"></span>${fw.name}</div>
            <button class="pop-close" aria-label="Close">×</button>
          </div>
          <div class="pop-body">
            <div class="pop-row"><span class="pop-key">unit</span><span class="pop-val">${fw.unit}</span></div>
            <div class="pop-row"><span class="pop-key">mechanism</span><span class="pop-val">${fw.mechanism}</span></div>
            <div class="pop-row"><span class="pop-key">type</span>
              <span class="pop-val" style="color:${color};opacity:0.9">${CAT_LABEL[fw.cat]}</span></div>
            <div class="pop-divider"></div>
            <div class="pop-analysis">${fw.analysis}</div>
            <div class="pop-placement">↳ ${fw.placement}</div>
          </div>`;
        pop.removeAttribute("hidden");
        pop.querySelector(".pop-close").addEventListener("click", close);
        pop.querySelector(".pop-close").focus();
      };

      const close = () => {
        if (!this._active) return;
        const prev = this._active;
        this._active.removeAttribute("data-open");
        this._active.setAttribute("aria-expanded", "false");
        this._active = null;
        pop.setAttribute("hidden", "");
        prev.focus();
      };

      wrap.addEventListener("click", (e) => {
        const g = e.target.closest(".fw-g");
        if (!g) return;
        const fw = FRAMEWORKS.find((f) => f.name === g.dataset.fw);
        if (!fw) return;
        if (this._active === g) {
          close();
          return;
        }
        open(fw, g);
      });

      this._root.querySelectorAll(".fw-g").forEach((g) => {
        g.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            const fw = FRAMEWORKS.find((f) => f.name === g.dataset.fw);
            if (!fw) return;
            if (this._active === g) {
              close();
              return;
            }
            open(fw, g);
          }
        });
      });

      this._root.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
      });
      wrap.addEventListener("pointerdown", (e) => {
        if (pop.hidden || e.composedPath().includes(pop)) return;
        close();
      });
    }
  }

  if (!customElements.get("reactivity-depth-axis")) {
    customElements.define("reactivity-depth-axis", ReactivityDepthAxis);
  }
})();
