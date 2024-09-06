import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getAccessToken = () =>
  sessionStorage.getItem("SESSIONSTORAGE_KEYS.jwtAccessToken");
export const setAccessToken = (value: string) =>
  sessionStorage.setItem("SESSIONSTORAGE_KEYS.jwtAccessToken", value);
export const removeAccessToken = () =>
  sessionStorage.removeItem("SESSIONSTORAGE_KEYS.jwtAccessToken");

export function isoStringToNdaysAgoOrHoursAgoOrMinutesAgo(
  timestamp: string | undefined
) {
  if (!timestamp) {
    return "";
  }

  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 0) {
    return `${days} days ago`;
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours > 0) {
    return `${hours} hours ago`;
  }

  const minutes = Math.floor(diff / (1000 * 60));
  return `${minutes} minutes ago`;
}
