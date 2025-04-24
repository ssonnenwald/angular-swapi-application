const regexIdUrl = new RegExp('[^/]+(?=/$|$)');

export function getIdFromUrl(url: string): string {
  let id = regexIdUrl.exec(url)![0];
  return id;
}

export function getResourceFromUrl(url: string): string {
  const parts = url.split('/').filter(Boolean);
  return parts[parts.length - 2];
}
