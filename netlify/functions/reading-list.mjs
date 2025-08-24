import { JWT } from "google-auth-library";
import { Gaxios } from "gaxios";

// Function to convert stars to grade
const convertStarsToGrade = (stars) => {
  if (!stars) return "";
  const numStars = parseInt(stars);
  if (isNaN(numStars)) return stars; // Return original if not a number

  switch (numStars) {
    case 5:
      return "A";
    case 4:
      return "B";
    case 3:
      return "C";
    case 2:
      return "D";
    case 1:
      return "F";
    default:
      return stars; // Return original for other values
  }
};

// Function to process a single sheet and extract book data
const processSheet = async (sheet, spreadsheetId, accessToken) => {
  const sheetName = sheet.properties.title;

  // Extract year from sheet name (only process sheets that contain a 4-digit year)
  const yearMatch = sheetName.match(/(\d{4})/);
  const year = yearMatch ? parseInt(yearMatch[1]) : null;

  // Skip sheets that don't contain a year
  if (!year) {
    return [];
  }

  const sheetRange = `${sheetName}!A:G`;

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetRange}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const values = data.values || [];

    // Check if we have a header row to determine column structure
    let gradeColumnIndex = 6; // Default to column G (index 6)
    let isStarsColumn = false;

    if (values.length > 0) {
      const headerRow = values[0];
      // Look for Grade or Stars column (case insensitive)
      const gradeIndex = headerRow.findIndex(
        (header) => header && header.toLowerCase().includes("grade"),
      );
      const starsIndex = headerRow.findIndex(
        (header) => header && header.toLowerCase().includes("star"),
      );

      if (gradeIndex !== -1) {
        gradeColumnIndex = gradeIndex;
        isStarsColumn = false;
      } else if (starsIndex !== -1) {
        gradeColumnIndex = starsIndex;
        isStarsColumn = true;
      }
    }

    // Transform the data to match our expected format
    const sheetBooks = values
      .slice(1) // Skip header row
      .filter((row) => row[0] && row[1]) // Require at least name and author
      .map((row) => {
        const rawGrade = row[gradeColumnIndex] || "";
        const grade = isStarsColumn
          ? convertStarsToGrade(rawGrade)
          : rawGrade;

        return {
          name: row[0] || "",
          author: row[1] || "",
          series: row[2] || "",
          status: row[3] || "not-started",
          finished: row[4] || "",
          notes: (row[5] || "").replace(/^[\s\n\r]+/, "").replace(/[\s\n\r]+$/, ""),
          grade: grade,
          year: year, // Add year information from sheet name
          sheetName: sheetName, // Keep track of which sheet this came from
        };
      });

    return sheetBooks;
  } catch (sheetError) {
    // Skip sheets that fail to process
    return [];
  }
};

// Function to fetch and process all sheets from the spreadsheet
const fetchAllBooks = async (spreadsheetId, accessToken) => {
  // Get sheet metadata to see all available sheets
  const metaUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`;
  const metaResponse = await fetch(metaUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!metaResponse.ok) {
    throw new Error("Failed to get spreadsheet metadata");
  }

  const metaData = await metaResponse.json();
  const sheets = metaData.sheets || [];

  // Process all sheets and collect books
  let allBooks = [];
  
  for (const sheet of sheets) {
    const sheetBooks = await processSheet(sheet, spreadsheetId, accessToken);
    allBooks = allBooks.concat(sheetBooks);
  }

  return allBooks;
};

export const handler = async (event, _context) => {
  // Set CORS headers for browser requests
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
  };

  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    // Use environment variables for all environments
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;

    // Handle different private key formats
    if (privateKey) {
      // Remove quotes if present
      privateKey = privateKey.replace(/^"(.*)"$/, "$1");
      // Replace escaped newlines with actual newlines
      privateKey = privateKey.replace(/\\n/g, "\n");
    }

    const serviceAccount = {
      type: "service_account",
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: privateKey,
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.GOOGLE_CLIENT_EMAIL)}`,
      universe_domain: "googleapis.com",
    };

    const spreadsheetId = process.env.GOOGLE_SHEETS_READING_ID;

    if (
      !serviceAccount.private_key ||
      !serviceAccount.client_email ||
      !spreadsheetId
    ) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "Missing required environment variables",
        }),
      };
    }

    // Create JWT client with explicit request client
    const jwtClient = new JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    // Set the request client explicitly
    jwtClient.gaxios = new Gaxios();

    // Get access token
    const tokens = await jwtClient.authorize();
    const accessToken = tokens.access_token;

    // Fetch and process all books from the spreadsheet
    const allBooks = await fetchAllBooks(spreadsheetId, accessToken);

    return {
      statusCode: 200,
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ books: allBooks }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Internal server error",
        message: error.message,
      }),
    };
  }
};
