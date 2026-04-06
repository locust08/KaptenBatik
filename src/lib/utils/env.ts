export function readFirstEnvValue(keys: string[]) {
  for (const key of keys) {
    const value = process.env[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return "";
}

export function readOptionalEnvValue(keys: string[]) {
  const value = readFirstEnvValue(keys);
  return value.length > 0 ? value : null;
}

export function readRequiredEnvValue(keys: string[], label: string) {
  const value = readFirstEnvValue(keys);
  if (!value) {
    throw new Error(`Missing required environment variable: ${label}`);
  }

  return value;
}

