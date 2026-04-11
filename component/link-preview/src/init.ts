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
  if (!window.matchMedia("(hover: hover)").matches) return;

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

    // Set anchor name on the link
    anchor.style.anchorName = anchorName;

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

    // Hover/focus delay management
    let showTimeout: ReturnType<typeof setTimeout> | null = null;
    let hideTimeout: ReturnType<typeof setTimeout> | null = null;

    const show = () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
      }
      showTimeout = setTimeout(async () => {
        // Populate metadata if not already loaded
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
            popover.showPopover();
            const meta = await fetchExternalMeta(anchor.href);
            preview.loading = false;
            if (meta) {
              preview.title = meta.title;
              preview.description = meta.description;
              preview.image = meta.image;
            } else {
              // No metadata available, hide and bail
              popover.hidePopover();
              return;
            }
          }
        }

        try {
          popover.showPopover();
        } catch {
          // Popover might already be showing
        }
      }, 300);
    };

    const hide = () => {
      if (showTimeout) {
        clearTimeout(showTimeout);
        showTimeout = null;
      }
      hideTimeout = setTimeout(() => {
        try {
          popover.hidePopover();
        } catch {
          // Popover might already be hidden
        }
      }, 200);
    };

    // Anchor hover/focus
    anchor.addEventListener("pointerenter", show);
    anchor.addEventListener("focusin", show);
    anchor.addEventListener("pointerleave", hide);
    anchor.addEventListener("focusout", hide);

    // Popover hover (so user can interact with the actions)
    popover.addEventListener("pointerenter", () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
      }
    });
    popover.addEventListener("pointerleave", hide);
  });
}
