import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { processLeadSubmission } from "@/lib/backend/lead-workflow";
import { readLeadRequestBody, readLeadRequestMeta } from "@/lib/backend/lead-request";

export const runtime = "nodejs";

function buildErrorResponse(error: string) {
  return NextResponse.json(
    {
      emailSent: false,
      emailConfigured: false,
      emailStatus: {
        attempted: false,
        configured: false,
        sent: false,
        warnings: [],
      },
      errors: [error],
      leadId: null,
      leadSaved: false,
      processingComplete: false,
      sheetSynced: false,
      sheetSyncStatus: {
        attempted: false,
        headersCreated: false,
        rowMode: "skipped",
        rowNumber: null,
        synced: false,
        tabCreated: false,
        warnings: [],
      },
      success: false,
      trackingReady: false,
      whatsappMessage: null,
      whatsappUrl: null,
      warnings: [],
      whatsappRedirectReady: false,
      error,
    },
    { status: 400 },
  );
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");

  if (origin && origin !== request.nextUrl.origin) {
    return NextResponse.json(
      {
        emailSent: false,
        emailConfigured: false,
        emailStatus: {
          attempted: false,
          configured: false,
          sent: false,
          warnings: [],
        },
        errors: ["Invalid request origin."],
        leadId: null,
        leadSaved: false,
        processingComplete: false,
        sheetSynced: false,
        sheetSyncStatus: {
          attempted: false,
          headersCreated: false,
          rowMode: "skipped",
          rowNumber: null,
          synced: false,
          tabCreated: false,
          warnings: [],
        },
        success: false,
        trackingReady: false,
        whatsappMessage: null,
        whatsappUrl: null,
        warnings: [],
        whatsappRedirectReady: false,
        error: "Invalid request origin.",
      },
      { status: 403 },
    );
  }

  let body;

  try {
    body = await readLeadRequestBody(request);
  } catch {
    return buildErrorResponse("Invalid lead submission.");
  }

  const result = await processLeadSubmission(body, readLeadRequestMeta(request));

  if (!result.success || !result.leadSaved) {
    const firstError = result.errors[0] ?? "We could not save your lead right now. Please try again.";
    return buildErrorResponse(firstError);
  }

  const acceptsJson = (request.headers.get("accept") ?? "").includes("application/json");

  if (acceptsJson) {
    return NextResponse.json(result);
  }

  if (result.whatsappRedirectReady && result.whatsappUrl) {
    return NextResponse.redirect(result.whatsappUrl, 303);
  }

  return NextResponse.json(result);
}
