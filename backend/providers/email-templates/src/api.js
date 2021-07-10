export function getURL(url) {
  if (url == null) {
    return null;
  }

  if (url.startsWith("http") || url.startsWith("//")) {
    return url;
  }

  return `https://${process.env.BACKEND_DOMAIN}${url}`;
}
