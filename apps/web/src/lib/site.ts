const fallbackSiteUrl = "http://localhost:3000";

export function getSiteUrl(): URL {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;

  try {
    return new URL(configuredUrl ?? fallbackSiteUrl);
  } catch {
    return new URL(fallbackSiteUrl);
  }
}
