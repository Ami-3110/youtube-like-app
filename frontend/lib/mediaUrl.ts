// frontend/lib/mediaUrl.ts

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export function mediaUrl(path: string | null | undefined) {
  if (!path) return "";

  if (path.startsWith("http")) {
    return path;
  }

  if (path.startsWith("/storage")) {
    return `${BACKEND_URL}${path}`;
  }

  if (path.startsWith("/avatars")) {
    return `${BACKEND_URL}${path}`;
  }

  return path;
}