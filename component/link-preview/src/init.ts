import "./link-preview.js";
import type { LinkPreview } from "./link-preview.js";

type SearchDataEntry = {
  title: string;
  excerpt?: string;
  categories: string[];
  type?: string;
  url: string;
  image?: string;
};

type LinkMeta = {
  title: string;
  description: string;
  image: string;
};

let searchDataCache: Map<string, SearchDataEntry> | null = null;
const externalMetaCache = new Map<string, LinkMeta>();

async function getSearchData(): Promise<Map<string, SearchDataEntry>> {
  if (searchDataCache) return searchDataCache;

  try {
    const res = await fetch("/search-data.json");
    const data: SearchDataEntry[] = await res.json();
    searchDataCache = new Map(data.map((entry) => [entry.url, entry]));
  } catch {
    searchDataCache = new Map();
  }

  return searchDataCache;
}

async function fetchExternalMeta(url: string): Promise<LinkMeta | null> {
  if (externalMetaCache.has(url)) return externalMetaCache.get(url)!;

  try {
    const res = await fetch(
      `/.netlify/functions/link-meta?url=${encodeURIComponent(url)}`
    );
    if (!res.ok) return null;

    const meta: LinkMeta = await res.json();
    externalMetaCache.set(url, meta);
    return meta;
  } catch {
    return null;
  }
}

function isInternalLink(anchor: HTMLAnchorElement): boolean {
  return anchor.origin === window.location.origin;
}

export function initLinkPreviews(scope: string | Element) {
  const container =
    typeof scope === "string" ? document.querySelector(scope) : scope;
  if (!container) return;

  const anchors = container.querySelectorAll<HTMLAnchorElement>(
    'a[href]:not([data-no-preview])'
  );

  let counter = 0;

  anchors.forEach((anchor) => {
    // Skip anchors that are just fragment links or javascript:
    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("javascript:")) return;

    const anchorName = `--link-preview-${counter++}`;
    const linkText = anchor.textContent?.trim() || href;

    // Create the inspection button
    const inspectBtn = document.createElement("button");
    inspectBtn.className = "link-preview-inspect";
    inspectBtn.setAttribute("aria-label", `Link preview for: ${linkText}`);
    inspectBtn.textContent = "🔍";
    inspectBtn.style.anchorName = anchorName;

    // Insert after the anchor
    anchor.after(inspectBtn);

    // Create popover container
    const popover = document.createElement("div");
    popover.setAttribute("popover", "manual");
    popover.classList.add("link-preview-popover");
    popover.style.positionAnchor = anchorName;

    // Create the link-preview component
    const preview = document.createElement("link-preview") as LinkPreview;
    preview.url = anchor.href;

    popover.appendChild(preview);
    document.body.appendChild(popover);

    let isOpen = false;

    const showPopover = () => {
      try {
        popover.showPopover();
        isOpen = true;
      } catch {
        // Already showing
      }
    };

    const hidePopover = () => {
      try {
        popover.hidePopover();
        isOpen = false;
      } catch {
        // Already hidden
      }
    };

    const closeAndReturn = () => {
      hidePopover();
      inspectBtn.focus();
    };

    const populateAndShow = async () => {
      if (!preview.title) {
        if (isInternalLink(anchor)) {
          const searchData = await getSearchData();
          const pathname = new URL(anchor.href).pathname;
          const entry = searchData.get(pathname);
          if (entry) {
            preview.title = entry.title;
            preview.description = entry.excerpt || "";
            if (entry.image) {
              preview.image = entry.url + entry.image;
            }
          }
        } else {
          preview.loading = true;
          showPopover();
          const meta = await fetchExternalMeta(anchor.href);
          preview.loading = false;
          if (meta) {
            preview.title = meta.title;
            preview.description = meta.description;
            preview.image = meta.image;
          } else {
            hidePopover();
            return;
          }
        }
      }
      showPopover();
      // Wait for Lit to render, then delegatesFocus sends focus to the close button
      await preview.updateComplete;
      preview.focus();
    };

    // --- Click / activate the inspect button ---
    inspectBtn.addEventListener("click", () => {
      if (isOpen) {
        closeAndReturn();
      } else {
        populateAndShow();
      }
    });

    // --- Close event from the preview's close button ---
    preview.addEventListener("close", () => {
      closeAndReturn();
    });

    // --- Keyboard on the popover ---
    popover.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeAndReturn();
        return;
      }

      if (e.key === "Tab") {
        const actions = Array.from(
          preview.shadowRoot?.querySelectorAll<HTMLElement>(
            "button, a[href]"
          ) || []
        );
        if (actions.length === 0) return;

        const active = preview.shadowRoot?.activeElement as HTMLElement | null;

        if (e.shiftKey && active === actions[0]) {
          // Shift+Tab on first focusable: close and return
          e.preventDefault();
          closeAndReturn();
        } else if (!e.shiftKey && active === actions[actions.length - 1]) {
          // Tab past last focusable: close and return
          e.preventDefault();
          closeAndReturn();
        }
      }
    });

    // If focus leaves the popover entirely (click elsewhere), close it
    popover.addEventListener("focusout", (e: FocusEvent) => {
      requestAnimationFrame(() => {
        const related = e.relatedTarget as Node | null;
        if (
          !related ||
          (!popover.contains(related) &&
            !preview.shadowRoot?.contains(related) &&
            related !== inspectBtn)
        ) {
          hidePopover();
        }
      });
    });
  });
}
