import { z } from "zod";

export const contactInquiryTrackingSchema = z.object({
  capturedAt: z.string().min(1),
  clickId: z.string().trim().optional().default(""),
  fbclid: z.string().trim().optional().default(""),
  gclid: z.string().trim().optional().default(""),
  landingPage: z.string().trim().min(1),
  landingPagePath: z.string().trim().optional().default(""),
  msclkid: z.string().trim().optional().default(""),
  pageHistory: z.string().trim().optional().default("[]"),
  pagePath: z.string().trim().optional().default(""),
  pageUrl: z.string().trim().optional().default(""),
  referrer: z.string().trim().optional().default(""),
  sessionId: z.string().trim().min(6),
  trackingSessionId: z.string().trim().min(6),
  ttclid: z.string().trim().optional().default(""),
  utmCampaign: z.string().trim().optional().default(""),
  utmContent: z.string().trim().optional().default(""),
  utmMedium: z.string().trim().optional().default(""),
  utmSource: z.string().trim().optional().default(""),
  utmTerm: z.string().trim().optional().default(""),
});

export type ContactInquiryTrackingBody = z.infer<typeof contactInquiryTrackingSchema>;
