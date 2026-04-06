function encodeUserInfo(userInfo: string) {
  const [username = "", password = ""] = userInfo.split(":", 2);

  if (!password) {
    return encodeURIComponent(username);
  }

  return `${encodeURIComponent(username)}:${encodeURIComponent(password)}`;
}

export function normalizePostgresConnectionString(connectionString: string) {
  try {
    const url = new URL(connectionString);

    if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") {
      return connectionString;
    }

    const rawUserInfo = url.username || url.password ? `${url.username}:${url.password}` : "";
    if (rawUserInfo) {
      url.username = "";
      url.password = "";
      const encodedUserInfo = encodeUserInfo(rawUserInfo);
      const [encodedUsername, encodedPassword] = encodedUserInfo.split(":", 2);
      url.username = decodeURIComponent(encodedUsername ?? "");
      if (encodedPassword !== undefined) {
        url.password = decodeURIComponent(encodedPassword);
      }
    }

    return url.toString();
  } catch {
    const match = connectionString.match(/^(postgres(?:ql)?:\/\/)([^@/]+)@(.+)$/i);

    if (!match) {
      return connectionString;
    }

    const [, prefix, userInfo, rest] = match;
    return `${prefix}${encodeUserInfo(userInfo)}@${rest}`;
  }
}
