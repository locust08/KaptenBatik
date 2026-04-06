import { google } from "googleapis";

import {
  getServerTrackingEnv,
  resolveGoogleSheetsId,
} from "@/lib/tracking/server-env";
import type { ContactInquiryRecord } from "@/types/contact-automation";

const GOOGLE_SHEETS_TAB_NAME = "Leads";

function createGoogleAuthClient() {
  const config = getServerTrackingEnv();

  if (
    !config.googleServiceAccountPrivateKey ||
    !config.googleServiceAccountEmail ||
    !resolveGoogleSheetsId()
  ) {
    return null;
  }

  return new google.auth.JWT({
    email: config.googleServiceAccountEmail,
    key: config.googleServiceAccountPrivateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

export async function appendContactInquiryToGoogleSheet(inquiry: ContactInquiryRecord) {
  const config = getServerTrackingEnv();
  const auth = createGoogleAuthClient();

  const spreadsheetId = resolveGoogleSheetsId();

  if (!auth || !spreadsheetId) {
    return { skipped: true as const };
  }

  const sheets = google.sheets({ auth, version: "v4" });

  await sheets.spreadsheets.values.append({
    insertDataOption: "INSERT_ROWS",
    range: `${GOOGLE_SHEETS_TAB_NAME}!A:Z`,
    requestBody: {
      values: [
        [
          inquiry.submittedAt,
          inquiry.id,
          inquiry.fullName,
          inquiry.email,
          inquiry.phone || "",
          inquiry.type,
          inquiry.message,
          inquiry.landingPage,
          inquiry.referrer,
          inquiry.sessionId,
          inquiry.utmSource,
          inquiry.utmMedium,
          inquiry.utmCampaign,
          inquiry.utmContent,
          inquiry.utmTerm,
          inquiry.gclid,
          inquiry.fbclid,
          inquiry.userAgent,
          inquiry.ipAddress,
          inquiry.whatsappHref,
        ],
      ],
    },
    spreadsheetId,
    valueInputOption: "USER_ENTERED",
  });

  return { skipped: false as const };
}
