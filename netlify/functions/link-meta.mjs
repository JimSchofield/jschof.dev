const ALLOWED_ORIGINS = [
  "https://jschof.dev",
  "https://www.jschof.dev",
  "http://localhost:8080",
  "http://localhost:8888",
];

function isPrivateIP(hostname) {
  // Block private/reserved IPs to prevent SSRF
  const patterns = [
    /^localhost$/i,
    /^127\./,
    /^10\./,
    /^172\.(1[6-9]|2\d|3[01])\./,
    /^192\.168\./,
    /^0\./,
    /^169\.254\./,
    /^\[?::1\]?$/,
    /^\[?fe80:/i,
    /^\[?fc00:/i,
    /^\[?fd/i,
  ];
  return patterns.some((p) => p.test(hostname));
}

export const handler = async (event) => {
  const origin = event.headers?.origin || event.headers?.Origin || "";
  const referer = event.headers?.referer || event.headers?.Referer || "";

  const isAllowed =
    ALLOWED_ORIGINS.some((o) => origin === o) ||
    ALLOWED_ORIGINS.some((o) => referer.startsWith(o));

  const headers = {
    "Access-Control-Allow-Origin": isAllowed ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (!isAllowed) {
    return {
      statusCode: 403,
      headers,
      body: JSON.stringify({ error: "Forbidden" }),
    };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const url = event.queryStringParameters?.url;

  if (!url) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Missing url parameter" }),
    };
  }

  // Basic URL validation
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Invalid URL" }),
    };
  }

  // Only allow http/https
  if (!["http:", "https:"].includes(parsed.protocol)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Only http/https URLs are supported" }),
    };
  }

  // Block requests to private/internal IPs (SSRF protection)
  if (isPrivateIP(parsed.hostname)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Private/internal URLs are not allowed" }),
    };
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LinkPreviewBot/1.0)",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: `Upstream returned ${response.status}` }),
      };
    }

    const html = await response.text();

    // Extract Open Graph and meta tags
    const title =
      extractMeta(html, 'property="og:title"') ||
      extractMeta(html, 'name="twitter:title"') ||
      extractTitle(html) ||
      "";

    const description =
      extractMeta(html, 'property="og:description"') ||
      extractMeta(html, 'name="twitter:description"') ||
      extractMeta(html, 'name="description"') ||
      "";

    const image =
      extractMeta(html, 'property="og:image"') ||
      extractMeta(html, 'name="twitter:image"') ||
      "";

    return {
      statusCode: 200,
      headers: {
        ...headers,
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
      body: JSON.stringify({ title, description, image }),
    };
  } catch (error) {
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({
        error: "Failed to fetch URL",
        message: error.message,
      }),
    };
  }
};

function extractMeta(html, attr) {
  // Match meta tags with the given attribute and extract the content value
  const regex = new RegExp(
    `<meta\\s+[^>]*${escapeRegex(attr)}[^>]*content="([^"]*)"`,
    "i"
  );
  const altRegex = new RegExp(
    `<meta\\s+[^>]*content="([^"]*)"[^>]*${escapeRegex(attr)}`,
    "i"
  );

  const match = html.match(regex) || html.match(altRegex);
  return match ? decodeHtmlEntities(match[1]) : null;
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return match ? decodeHtmlEntities(match[1].trim()) : null;
}

function decodeHtmlEntities(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
