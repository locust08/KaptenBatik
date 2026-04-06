export type PublicTrackingEnv = {
  gtmId: string | null;
  ga4MeasurementId: string | null;
  siteUrl: string | null;
  supabasePublishableKey: string | null;
  supabaseUrl: string | null;
  whatsappPhoneNumber: string | null;
};

export type ServerTrackingEnv = {
  gtmId: string | null;
  ga4MeasurementId: string | null;
  googleOAuthAccessToken: string | null;
  googleOAuthClientId: string | null;
  googleOAuthClientSecret: string | null;
  googleServiceAccountEmail: string | null;
  googleServiceAccountPrivateKey: string | null;
  googleWorkspaceOAuthRefreshToken: string | null;
  googleSheetsId: string | null;
  resendApiKey: string | null;
  resendFromEmailDev: string | null;
  resendFromEmailProd: string | null;
  resendToEmailDev: string | null;
  resendToEmailProd: string | null;
  siteUrl: string | null;
  supabaseServiceRoleKey: string;
  supabaseUrl: string;
  whatsappPhoneNumber: string | null;
};
