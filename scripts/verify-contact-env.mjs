const requiredPublic = ["NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER"];
const requiredServer = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_DB_URL"];
const optionalPublic = [
  "NEXT_PUBLIC_GA4_MEASUREMENT_ID",
  "NEXT_PUBLIC_GTM_ID",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "PUBLIC_GA4_MEASUREMENT_ID",
  "PUBLIC_GTM_CONTAINER_ID",
];
const optionalServer = [
  "GA4_PROPERTY_ID",
  "GA4_STREAM_ID",
  "SITE_URL",
  "GTM_CONTAINER_ID",
  "GOOGLE_SHEETS_ID",
  "GOOGLE_OAUTH_CLIENT_ID",
  "GOOGLE_OAUTH_CLIENT_SECRET",
  "GOOGLE_SERVICE_ACCOUNT_EMAIL",
  "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY",
  "GOOGLE_WORKSPACE_OAUTH_REFRESH_TOKEN",
  "GOOGLE_WORKSPACE_OAUTH_ACCESS_TOKEN",
  "SUPABASE_DB_URL",
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL_DEV",
  "RESEND_FROM_EMAIL_PROD",
  "RESEND_TO_EMAIL_DEV",
  "RESEND_TO_EMAIL_PROD",
];

function hasValue(name) {
  return typeof process.env[name] === "string" && process.env[name].trim().length > 0;
}

function printGroup(title, names) {
  console.log(`\n${title}`);
  for (const name of names) {
    const status = hasValue(name) ? "ok" : "missing";
    console.log(`- ${name}: ${status}`);
  }
}

const missingRequired = [...requiredPublic, ...requiredServer].filter((name) => !hasValue(name));

console.log("Kapten Batik contact env check");
console.log("Use with Doppler: doppler run -- npm run check:contact-env");

printGroup("Required public env", requiredPublic);
printGroup("Required server env", requiredServer);
printGroup("Optional public env", optionalPublic);
printGroup("Optional server env", optionalServer);

if (missingRequired.length > 0) {
  console.error("\nMissing required env vars:");
  for (const name of missingRequired) {
    console.error(`- ${name}`);
  }
  process.exitCode = 1;
} else {
  console.log("\nAll required env vars are present.");
}
