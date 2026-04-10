import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { processContactInquirySubmission } from "@/lib/backend/contact-inquiry-workflow";
import { readContactInquiryRequestBody, readContactInquiryRequestMeta } from "@/lib/backend/contact-inquiry-request";

export const runtime = "nodejs";

function buildErrorResponse(error: string) {
  return NextResponse.json(
    {
      emailSent: false,
      errors: [error],
      leadId: null,
      leadSaved: false,
      processingComplete: false,
      sheetSynced: false,
      success: false,
      trackingReady: false,
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
        errors: ["Invalid request origin."],
        leadId: null,
        leadSaved: false,
        processingComplete: false,
        sheetSynced: false,
        success: false,
        trackingReady: false,
        warnings: [],
        whatsappRedirectReady: false,
        error: "Invalid request origin.",
      },
      { status: 403 },
    );
  }

  let body;

  try {
    body = await readContactInquiryRequestBody(request);
  } catch {
    return buildErrorResponse("Invalid contact form submission.");
  }

  const result = await processContactInquirySubmission(body, readContactInquiryRequestMeta(request));

  if (!result.success) {
    return buildErrorResponse(result.errors[0] ?? "We could not save your inquiry right now. Please try again.");
  }

  if (!result.emailSent) {
    return NextResponse.json(
      {
        ...result,
        success: false,
        error:
          "We saved your inquiry, but the email notification did not send. Please try again or contact us on WhatsApp.",
      },
      { status: 502 },
    );
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
