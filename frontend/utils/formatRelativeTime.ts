// frontend/utils/formatRelativeTime.ts

export function formatRelativeTime(createdAt: string) {
  const published = new Date(createdAt);
  const now = new Date();

  const diffMs = now.getTime() - published.getTime();

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  if (diffMinutes < 60) {
    return `${diffMinutes}分前`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}時間前`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) {
    return `${diffDays}日前`;
  }

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return `${diffMonths}ヶ月前`;
  }

  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears}年前`;
}